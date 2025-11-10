import { Console } from "@woowacourse/mission-utils";

const MESSAGE = {

    WELCOME_LOGO: [
        "┌───────────────┐",
        "│     Meokgo    │",
        "└───────────────┘",
      ].join("\n"),

    STORE_LIST_TITLE: "가게 목록\n",
    RATING_TITLE: "평점: ",
    MIN_ORDER_AMOUNT_TITLE: "최소주문금액: ",

    PROMPT_STORE_NAME: "\n원하는 가게 이름을 입력해주세요: ",
    PROMPT_STORE_SELECTION: "\n계속 주문하시겠습니까? (네/아니오): ",

    STATUS_OPEN: "영업중",
    STATUS_CLOSED: "영업종료",
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
    print("\n메뉴 목록");
    for (let menu of store.menu) {
        print(`${menu.name} : ${menu.price}원  ${menu.detail}`)
    }
    print("");
}

export async function promptStoreName(validator) {
    return await retryUserInput(MESSAGE.PROMPT_STORE_NAME, validator);
}

export async function promptContinueOrder(validator) {
    return await retryUserInput(MESSAGE.PROMPT_STORE_SELECTION, validator);
}

export async function promptOrderMenu(validator) {
    return await retryUserInput("원하는 메뉴를 입력해주세요. (예: 후라이드 치킨,양념 치킨): ", validator);
}

