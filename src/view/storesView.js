import { Console } from "@woowacourse/mission-utils";
import { MESSAGE } from "../constants/messages.js";

function print(string) {
    Console.print(string);
}

async function userInput(placeholder) {
    return await Console.readLineAsync(placeholder);
}

export async function retryUserInput(placeholder, validator) {
    while (true) {
        try {
            const input = await userInput(placeholder);
            validator(input);
            return input;
        } catch (error) {
            print(error.message);
        }
    }
}

export function storesView(stores) {
    print(MESSAGE.WELCOME_LOGO);
    print(MESSAGE.STORE_LIST_TITLE);
    for (let store of stores) {
        let status
        if (store.open) {status = MESSAGE.STATUS_OPEN} else {status = MESSAGE.STATUS_CLOSED}
        print(`${store.name} (${store.category}) / ${status}`);
    }
}
export function storeDetailView(store) {
    print(`\n${store.name}`);
    print(`${MESSAGE.RATING_TITLE}${store.rating}`);
    print(`${MESSAGE.MIN_ORDER_AMOUNT_TITLE}${store.minOrderAmount}`);
}

export function storeMenuView(store) {
    print(MESSAGE.STORE_MENU_TITLE);
    for (let menu of store.menu) {
        print(`${menu.name} : ${menu.price}${MESSAGE.PRICE_UNIT}  ${menu.detail}`)
    }
    print("");
}

export function storeCartView(selectedMenu, store) {
    let drink = ""
    let recommendMenu = ""
    if (selectedMenu.length > 1) {
        drink = MESSAGE.STATUS_DRINK_PROVIDED
    } else {
        drink = MESSAGE.STATUS_DRINK_NOT_PROVIDED
    }
    if (selectedMenu.length !== store.menu.length) {
        let storeMenu = store.menu.map(menu => menu.name);
        let selectedMenuName = selectedMenu.map(menu => menu.name);
        let recommendMenus = storeMenu.filter(menu => !selectedMenuName.includes(menu));
        if (recommendMenus.length > 1){
            const i = Math.floor(Math.random() * recommendMenus.length);
            recommendMenu = recommendMenus[i];
        } else {
            recommendMenu = recommendMenus[0];
        }
    }
    print(MESSAGE.CART_TITLE);
    print(`${store.name}`)
    for (let menu of selectedMenu) {
        print(`${menu.name} : ${menu.price}${MESSAGE.PRICE_UNIT} ${menu.detail}`)
    }
    print(`${MESSAGE.DRINK_STATUS_TITLE}${drink}`);
    if (recommendMenu !== "") {
        print(`${MESSAGE.RECOMMEND_MENU_TITLE}${recommendMenu}`);
    }
}

export function storeAddMenuView(selectedMenu, store){
    print(MESSAGE.MIN_ORDER_AMOUNT_MESSAGE(store.minOrderAmount));
    let selectedMenuName = selectedMenu.map(menu => menu.name);
    let availableMenu = store.menu.filter(menu => !selectedMenuName.includes(menu.name));
    print(MESSAGE.ADD_MENU_TITLE);
    for (let menu of availableMenu) {
        print(`${menu.name} : ${menu.price}${MESSAGE.PRICE_UNIT} ${menu.detail}`);
    }
    return availableMenu;
}

export function storeOrderSummaryView(orderSummary){
    print(MESSAGE.ORDER_SUMMARY_TITLE);
    print(`${MESSAGE.ORDER_SUMMARY_ADDRESS}${orderSummary.address}`)
    print(`${MESSAGE.ORDER_SUMMARY_RIDER_REQUEST}${orderSummary.riderRequest}`)
    print(`${MESSAGE.ORDER_SUMMARY_PHONE_NUMBER}${orderSummary.phoneNumber}`)
    print(`${MESSAGE.ORDER_SUMMARY_STORE_REQUEST}${orderSummary.storeRequest}`)
    print(`${MESSAGE.ORDER_SUMMARY_PAYMENT_TYPE}${orderSummary.paymentType}`)
    print(`${MESSAGE.ORDER_SUMMARY_DISCOUNT_COUPON}${orderSummary.discountCoupon}`)
    print(`${MESSAGE.ORDER_SUMMARY_TOTAL_PRICE}${orderSummary.totalPrice}${MESSAGE.PRICE_UNIT}\n`)
}

export function printNoCouponMessage() {
    print(MESSAGE.ORDER_SUMMARY_NO_COUPON_MESSAGE);
}

export function printOrderSummaryIncompleteMessage() {
    print(MESSAGE.ORDER_SUMMARY_INCOMPLETE_MESSAGE);
}

export function printErrorMessage() {
    print(MESSAGE.ERROR_MESSAGE);
}

export async function promptStoreName(validator) {
    return await retryUserInput(MESSAGE.PROMPT_STORE_NAME, validator);
}

export async function promptContinueOrder(validator) {
    return await retryUserInput(MESSAGE.PROMPT_STORE_SELECTION, validator);
}

export async function promptOrderMenu(validator) {
    return await retryUserInput(MESSAGE.PROMPT_ORDER_MENU, validator);
}

export async function promptConfirmOrder(validator) {
    return await retryUserInput(MESSAGE.PROMPT_CONFIRM_ORDER, validator);
}

export async function promptAddMenu(validator) {
    return await retryUserInput(MESSAGE.PROMPT_ADD_MENU, validator);
}

export async function promptOrderSummary() {
    return await userInput(MESSAGE.PROMPT_ORDER_SUMMARY);
}

export async function promptAddress() {
    return await userInput(MESSAGE.PROMPT_ADDRES);
}

export async function promptRiderRequest() {
    return await userInput(MESSAGE.PROMPT_RIDER_REQUEST);
}

export async function promptPhoneNumber() {
    return await userInput(MESSAGE.PROMPT_PHONE_NUMBER);
}

export async function promptStoreRequest() {
    return await userInput(MESSAGE.PROMPT_STORE_REQUEST);
}

export async function promptPaymentType() {
    return await userInput(MESSAGE.PROMPT_PAYMENT_TYPE);
}

export async function promptDiscountCoupon() {
    return await userInput(MESSAGE.PROMPT_DISCOUNT_COUPON);
}

function clearScreen() {
    Console.print("\x1B[2J\x1B[0;0H");
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function showDeliveryAnimation() {
    const steps = 28;
    for (let i = 0; i <= steps; i++) {
        clearScreen();
        print("\n배달 중 ...");
        const pad = " ".repeat(i);
        print("");
        print(pad + "   __o");
        print(pad + " _ \\<_");
        print(pad + "(_)/(_)");
        print("");
        print("-".repeat(steps + 12));
        await sleep(80);
    }
}

export async function showDoorbell() {
    clearScreen();
    print("\n띵동! 배달왔습니다");
    await sleep(900);
}

export async function showFoodBoxAnimation() {
    const boxLines = [
        "      ________  ",
        "     /_______/  ",
        "    +--------+  ",
        "    | MEOKGO |  ",
        "    |  FOOD  |  ",
        "    +--------+  ",
    ];

    const steps = 14;
    for (let i = steps; i >= 0; i--) {
        clearScreen();
        print("\n박스 도착 ...");
        print("");
        const pad = " ".repeat(i);
        for (const line of boxLines) print(pad + line);
        await sleep(70);
    }
    print("\n배달이 완료되었습니다. 맛있게 드세요!");
}