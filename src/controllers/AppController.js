import { getStores, findStoreByName, findMenuByName } from "../models/storeModel.js";
import { validateStore, validateYesOrNo, validateOrderMenu, validateConfirmOrder } from "../models/storeRules.js";
import { validateNotEmpty, validateKoreanOnly, validateKoreanWithComma } from "../validation/input.js";
import { 
    storesView, 
    storeDetailView,
    storeMenuView,
    storeCartView,
    storeAddMenuView,
    promptStoreName, 
    promptContinueOrder,
    promptOrderMenu,
    promptConfirmOrder,
    promptAddMenu,
} from "../view/storesView.js";

const MESSAGE = {
    ANSWER_YES: "네",
    ANSWER_ORDER: "주문",
}

export default class AppController {
    async run() {
        const stores = getStores();
        const store = await selectStoreFlow(stores);
        const selectedMenu = await selectMenu(store);
        const answer = await confirmOrder(selectedMenu, store);
        if (answer === MESSAGE.ANSWER_ORDER) {
            const totalPrice = calculateTotalPrice(selectedMenu);
            if (totalPrice < store.minOrderAmount) {
                const addedMenu = await addMenu(selectedMenu, store);
            }
        }
    }
}


async function selectStore(stores) {
    storesView(stores);
        
    function validateStoreInput(input) {
        validateNotEmpty(input);
        validateKoreanOnly(input);
        validateStore(stores, input);
    }
        
    const storeName = await promptStoreName(validateStoreInput);
    const store = findStoreByName(storeName);
    return store;
}

async function confirmStoreSelection(store) {
    storeDetailView(store);

    function validateContinueOrder(input) {
        validateNotEmpty(input);
        validateKoreanOnly(input);
        validateYesOrNo(input);
    }

    const continueOrder = await promptContinueOrder(validateContinueOrder);
    return continueOrder;
}

async function selectMenu(store) {
    storeMenuView(store);
    function validateOrderMenuInput(input) {
        validateNotEmpty(input);
        validateKoreanWithComma(input);
        validateOrderMenu(store.menu, input);
    }
    const orderMenu = await promptOrderMenu(validateOrderMenuInput);
    const selectedMenuName = orderMenu.split(",").map(menu => menu.trim());
    const selectedMenu = findMenuByName(store, selectedMenuName);
    return selectedMenu;
}

async function confirmOrder(selectedMenu,store) {
    storeCartView(selectedMenu, store);
    function validateConfirmOrderInput(input) {
        validateNotEmpty(input);
        validateKoreanOnly(input);
        validateConfirmOrder(input)
    }
    const confirmOrder = await promptConfirmOrder(validateConfirmOrderInput);
    return confirmOrder;
}

async function selectStoreFlow(stores) {
    let store, answer;
    do {
        store = await selectStore(stores);
        answer = await confirmStoreSelection(store);
    } while (answer !== MESSAGE.ANSWER_YES);
    return store;
}


function calculateTotalPrice(selectedMenu){
    let totalPrice = 0;
    for (let menu of selectedMenu) {
        totalPrice += menu.price;
    }
    return totalPrice;
}

async function addMenu(selectedMenu, store){
    const availableMenu = storeAddMenuView(selectedMenu, store);
    function validateAddMenu(input) {
        validateNotEmpty(input);
        validateKoreanWithComma(input);
        validateOrderMenu(availableMenu, input);
    }
    const addMenu = await promptAddMenu(validateAddMenu);
    return addMenu;
}