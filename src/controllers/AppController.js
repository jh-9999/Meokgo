import { getStores, findStoreByName, findMenuByName } from "../models/storeModel.js";
import { validateStore, validateYesOrNo, validateOrderMenu } from "../models/storeRules.js";
import { validateNotEmpty, validateKoreanOnly, validateKoreanWithComma } from "../validation/input.js";
import { 
    storesView, 
    storeDetailView,
    storeMenuView,
    promptStoreName, 
    promptContinueOrder,
    promptOrderMenu
} from "../view/storesView.js";

const MESSAGE = {
    ANSWER_YES: "네",
}

export default class AppController {
    async run() {
        const stores = getStores();
        const store = await selectStoreFlow(stores);
        const selectedMenu = await selectMenu(store);
        console.log(selectedMenu);
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

async function selectStoreFlow(stores) {
    let store, answer;
    do {
        store = await selectStore(stores);
        answer = await confirmStoreSelection(store);
    } while (answer !== MESSAGE.ANSWER_YES);
    return store;
}