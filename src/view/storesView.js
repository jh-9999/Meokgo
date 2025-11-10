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
