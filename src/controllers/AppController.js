import { getStores, findStoreByName, findMenuByName } from "../models/storeModel.js";
import { calculateTotalPrice, createOrderSummary } from "../models/orderModel.js";
import { validateStore, validateYesOrNo, validateOrderMenu, validateConfirmOrder } from "../models/storeRules.js";
import { isOrderSummaryComplete } from "../models/orderRules.js";
import { validateNotEmpty, validateKoreanOnly, validateKoreanWithComma } from "../validation/input.js";
import { 
    storesView, 
    storeDetailView,
    storeMenuView,
    storeCartView,
    storeAddMenuView,
    storeOrderSummaryView,

    printNoCouponMessage,
    printOrderSummaryCompleteMessage,
    printErrorMessage,

    promptStoreName, 
    promptContinueOrder,
    promptOrderMenu,
    promptConfirmOrder,
    promptAddMenu,
    promptOrderSummary,
    promptAddres,
    promptRiderRequest,
    promptPhoneNumber,
    promptStoreRequest,
    promptPaymentType,
    promptDiscountCoupon,
} from "../view/storesView.js";

const MESSAGE = {
    ANSWER_YES: "네",
    ANSWER_ORDER: "주문",
    ANSWER_PAYMENT: "결제",
    ANSWER_ADDRESS: "주소",
    ANSWER_RIDER_REQUEST: "라이더 요청사항",
    ANSWER_PHONE_NUMBER: "연락처",
    ANSWER_STORE_REQUEST: "가게 요청사항",
    ANSWER_PAYMENT_TYPE: "결제 수단",
    ANSWER_DISCOUNT_COUPON: "할인 쿠폰",
}

export default class AppController {
    async run() {
        const stores = getStores();
        const store = await selectStoreFlow(stores);
        const selectedMenu = await selectMenu(store);
        const answer = await confirmOrder(selectedMenu, store);
        const orderSummary = createOrderSummary();

        if(answer === MESSAGE.ANSWER_ORDER) {
            let totalPrice = calculateTotalPrice(selectedMenu);
            if (totalPrice < store.minOrderAmount) {
                const addedMenu = await addMenu(selectedMenu, store);
                const addedMenuObject= store.menu.filter(menu => menu.name === addedMenu);
                totalPrice += calculateTotalPrice(addedMenuObject);
            }

            orderSummary.totalPrice = totalPrice;

            while(true){
                storeOrderSummaryView(orderSummary);
                let answer = await promptOrderSummary();
                if(answer === MESSAGE.ANSWER_PAYMENT){
                    let a = isOrderSummaryComplete(orderSummary);
                    if(a){
                        break;
                    } else {
                        printOrderSummaryCompleteMessage();
                        continue;
                    }
                }
                switch(answer){
                    case MESSAGE.ANSWER_ADDRESS: 
                        orderSummary.address = await promptAddres();
                    break;

                    case MESSAGE.ANSWER_RIDER_REQUEST: orderSummary.riderRequest = await promptRiderRequest();
                    break;

                    case MESSAGE.ANSWER_PHONE_NUMBER: orderSummary.phoneNumber = await promptPhoneNumber();
                    break;

                    case MESSAGE.ANSWER_STORE_REQUEST: orderSummary.storeRequest = await promptStoreRequest();
                    break;

                    case MESSAGE.ANSWER_PAYMENT_TYPE: orderSummary.paymentType = await promptPaymentType();
                    break;

                    case MESSAGE.ANSWER_DISCOUNT_COUPON: 
                        printNoCouponMessage();
                        orderSummary.discountCoupon = await promptDiscountCoupon();

                        break;

                    default: printErrorMessage();
                    break;
                }
            }
        }else{
            console.log("이용해주셔서 감사합니다.");
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
