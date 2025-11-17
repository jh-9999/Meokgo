import { getStores, findStoreByName, findMenuByName } from "../models/storeModel.js";
import { createOrderSummary } from "../models/orderModel.js";
import { validateStore, validateYesOrNo, validateOrderMenu, validateConfirmOrder } from "../models/storeRules.js";
import { isOrderSummaryComplete } from "../models/orderRules.js";
import { validateNotEmpty, validateKoreanOnly, validateKoreanWithComma } from "../validation/input.js";
import { ensureMinOrderAmount } from "../services/orderService.js";
import { COMMAND } from "../constants/commands.js";
import { parseCommaSeparated } from "../utils/parser.js";
import { PaymentFactory } from "../domain/payment/PaymentFactory.js";
import CouponDraw from "../domain/coupon/CouponDraw.js";
import { MESSAGE } from "../constants/messages.js";
import { 
    storesView, 
    storeDetailView,
    storeMenuView,
    storeCartView,
    storeOrderSummaryView,

    printOrderSummaryIncompleteMessage,
    printErrorMessage,
    printThankYou,
    printCreateCouponMessage,
    printAlreadyIssuedCouponMessage,

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

        handleOrderDecline(answer);

        const result = await ensureMinOrderAmount(selectedMenu, store);
        selectedMenu = result.selectedMenu;
        orderSummary.totalPrice = result.totalPrice;

        while(true){
            storeOrderSummaryView(orderSummary);
            const orderAction = await promptOrderSummary();

            if(orderAction !== COMMAND.ANSWER_PAYMENT){
                await handleOrderAction(orderAction, orderSummary);
                continue;
            }

            if(!isOrderSummaryComplete(orderSummary)){
                printOrderSummaryIncompleteMessage();
                continue;
            }

            await showDeliveryResultAnimation();
            break;
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

async function selectStoreFlow(stores) {
    let store, answer;
    do {
        store = await selectStore(stores);
        answer = await confirmStoreSelection(store);
    } while (answer !== COMMAND.ANSWER_YES);
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

function handleOrderDecline(answer) {
    if(answer === COMMAND.ANSWER_ORDER) {
        return
    } else {
        throw new Error(printThankYou())
    }
}

function payIt(payment, totalPrice) {
    return payment.process(totalPrice);
}

async function handleOrderAction(orderAction, orderSummary) {
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
            if(orderSummary.discountCoupon === "") {
                const coupon = await DrawCoupon();
                orderSummary.discountCoupon = coupon.name || "";
                orderSummary.totalPrice = discountCoupon(coupon, orderSummary.totalPrice)
            } else {
                printAlreadyIssuedCouponMessage();
            }
            break;

        default: printErrorMessage();
        break;
    }
}

async function DrawCoupon() {

    function validateDrawCouponInput(input) {
        validateNotEmpty(input);
        validateKoreanOnly(input)
        validateYesOrNo(input)
    }
    const answer = await promptDiscountCoupon(validateDrawCouponInput);

    if(answer === COMMAND.ANSWER_YES) {
        const draw = new CouponDraw();
        const coupon = draw.createCoupon();
        printCreateCouponMessage(coupon);
        return coupon;
    }
    return "";
}

function discountCoupon(coupon, totalPrice) {
    if(coupon) {
        return coupon.apply(totalPrice)
    }
    return totalPrice;
}

async function showDeliveryResultAnimation() {
    await showDeliveryAnimation();
    await showDoorbell();
    await showFoodBoxAnimation();
}

