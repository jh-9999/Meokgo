import { Console } from "@woowacourse/mission-utils";

const MESSAGE = {

    WELCOME_LOGO: [
        "┌───────────────┐",
        "│     Meokgo    │",
        "└───────────────┘",
      ].join("\n"),

    STORE_LIST_TITLE: "가게 목록\n",
    STORE_MENU_TITLE: "\n메뉴 목록",
    CART_TITLE: "\n장바구니",
    RATING_TITLE: "평점: ",
    MIN_ORDER_AMOUNT_TITLE: "최소주문금액: ",
    MIN_ORDER_AMOUNT_MESSAGE:(minOrderAmount) => `\n최소주문금액이 부족합니다. 최소주문금액은 ${minOrderAmount}원 입니다.`,
    RECOMMEND_MENU_TITLE: "추천 메뉴: ",
    DRINK_STATUS_TITLE: "음료 제공 여부: ",
    ADD_MENU_TITLE: "\n추가 가능한 메뉴 목록",
    

    PROMPT_STORE_NAME: "\n원하는 가게 이름을 입력해주세요: ",
    PROMPT_STORE_SELECTION: "\n계속 주문하시겠습니까? (네/아니오): ",
    PROMPT_ORDER_MENU: "원하는 메뉴를 입력해주세요. (예: 후라이드 치킨,양념 치킨): ",
    PROMPT_ADD_MENU: "추가할 메뉴를 입력해주세요. (예: 후라이드 치킨,양념 치킨): ",
    PROMPT_CONFIRM_ORDER: "주문하시겠습니까? (주문/취소): ",

    STATUS_OPEN: "영업중",
    STATUS_CLOSED: "영업종료",
    STATUS_DRINK_PROVIDED: "제공",
    STATUS_DRINK_NOT_PROVIDED: "제공안함",

    PRICE_UNIT: "원",

    ORDER_SUMMARY_TITLE: "\n주문서",
    ORDER_SUMMARY_ADDRESS: "주소(필수): ",
    ORDER_SUMMARY_RIDER_REQUEST: "라이더 요청사항: ",
    ORDER_SUMMARY_PHONE_NUMBER: "연락처(필수): ",
    ORDER_SUMMARY_STORE_REQUEST: "가게 요청사항: ",
    ORDER_SUMMARY_PAYMENT_TYPE: "결제 수단(필수): ",
    ORDER_SUMMARY_DISCOUNT_COUPON: "할인 쿠폰: ",
    ORDER_SUMMARY_TOTAL_PRICE: "총 결제 금액: ",

    ORDER_SUMMARY_COMPLETE_MESSAGE: "\n※※주문서를 다시 확인해주세요.※※",
    ORDER_SUMMARY_NOT_COMPLETE_MESSAGE: "현재 가지고 계신 할인 쿠폰이 없습니다.",

    PROMPT_ORDER_SUMMARY: "각 키워드를 입력하면, 해당 항목을 수정할 수 있습니다. (예: 주소,연락처)\n입렁이 끝나면 '결제'를 입력해주세요.",
    PROMPT_ADDRES: "\n주소를 입력해주세요: ",
    PROMPT_RIDER_REQUEST: "\n라이더 요청사항을 입력해주세요: ",
    PROMPT_PHONE_NUMBER: "\n연락처를 입력해주세요: ",
    PROMPT_STORE_REQUEST: "\n가게 요청사항을 입력해주세요: ",
    PROMPT_PAYMENT_TYPE: "\n결제 수단을 입력해주세요: ",
    PROMPT_DISCOUNT_COUPON: "\n할인 쿠폰을 입력해주세요: ",

    ERROR_MESSAGE: "잘못된 입력입니다."
}

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
    print(MESSAGE.ORDER_SUMMARY_NOT_COMPLETE_MESSAGE);
}

export function printOrderSummaryCompleteMessage() {
    print(MESSAGE.ORDER_SUMMARY_COMPLETE_MESSAGE);
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

export async function promptAddres() {
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