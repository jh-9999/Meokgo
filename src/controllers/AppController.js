import { getStores, findStoreByName, findMenuByName } from "../models/storeModel.js";
import { createOrderSummary } from "../models/orderModel.js";
import { validateStore, validateYesOrNo, validateOrderMenu, validateConfirmOrder } from "../models/storeRules.js";
import { isOrderSummaryComplete } from "../models/orderRules.js";
import { validateNotEmpty, validateKoreanOnly, validateKoreanWithComma } from "../validation/input.js";
import { ensureMinOrderAmount } from "../services/orderService.js";
import { COMMAND } from "../constants/commands.js";
import { parseCommaSeparated } from "../utils/parser.js";
import { PaymentFactory } from "../domain/payment/PaymentFactory.js";
import { 
    storesView, 
    storeDetailView,
    storeMenuView,
    storeCartView,
    storeOrderSummaryView,

    printNoCouponMessage,
    printOrderSummaryIncompleteMessage,
    printErrorMessage,

    promptStoreName, 
    promptContinueOrder,
    promptOrderMenu,
    promptConfirmOrder,
    promptOrderSummary,
    promptAddress,
    promptRiderRequest,
    promptPhoneNumber,
    promptStoreRequest,
    promptPaymentType,
    promptDiscountCoupon,

    showDeliveryAnimation,
    showFoodBoxAnimation,
    showDoorbell,
} from "../view/storesView.js";

export default class AppController {
    async run() {
        const stores = getStores();
        const store = await selectStoreFlow(stores);
        let selectedMenu = await selectMenu(store);
        const answer = await confirmOrder(selectedMenu, store);
        const orderSummary = createOrderSummary();

        if(answer === COMMAND.ANSWER_ORDER) {
            const result = await ensureMinOrderAmount(selectedMenu, store);
            selectedMenu = result.selectedMenu;
            orderSummary.totalPrice = result.totalPrice;

            while(true){
                storeOrderSummaryView(orderSummary);
                const orderAction = await promptOrderSummary();
                if(orderAction === COMMAND.ANSWER_PAYMENT){
                    const isComplete = isOrderSummaryComplete(orderSummary);
                    if(isComplete){
                        await showDeliveryAnimation();
                        await showDoorbell();
                        await showFoodBoxAnimation();
                        break;
                    } else {
                        printOrderSummaryIncompleteMessage();
                        continue;
                    }
                }
                switch(orderAction){
                    case COMMAND.ANSWER_ADDRESS: 
                        orderSummary.address = await promptAddress();
                    break;

                    case COMMAND.ANSWER_RIDER_REQUEST: orderSummary.riderRequest = await promptRiderRequest();
                    break;

                    case COMMAND.ANSWER_PHONE_NUMBER: orderSummary.phoneNumber = await promptPhoneNumber();
                    break;

                    case COMMAND.ANSWER_STORE_REQUEST: orderSummary.storeRequest = await promptStoreRequest();
                    break;

                    case COMMAND.ANSWER_PAYMENT_TYPE: {
                        function validatePaymentTypeInput(input) {
                            validateNotEmpty(input);
                            PaymentFactory.assertSupported(input);
                        }
                        const paymentInput = await promptPaymentType(validatePaymentTypeInput);

                        orderSummary.payment = PaymentFactory.create(paymentInput);
                        // 이 부분이 동적 바인딩 혹은 늦은 바인딩.
                        console.log(payIt(orderSummary.payment, orderSummary.totalPrice));
                    }
                    break;

                    case COMMAND.ANSWER_DISCOUNT_COUPON: 
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
    const selectedMenuName = parseCommaSeparated(orderMenu);
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
    } while (answer !== COMMAND.ANSWER_YES);
    return store;
}

function payIt(payment, totalPrice) {
    return payment.process(totalPrice);
}