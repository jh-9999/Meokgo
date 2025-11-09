import { Console } from "@woowacourse/mission-utils";

const MESSAGE = {

    WELCOME_MESSAGE: [
        "┌───────────────┐",
        "│     Meokgo    │",
        "└───────────────┘",
      ].join("\n"),

    STORE_LIST_TITLE: "가게 목록\n",
    
    PROMPT_STORE_NAME: "\n원하는 가게 이름을 입력해주세요: ",

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
    print(MESSAGE.WELCOME_MESSAGE);
    print(MESSAGE.STORE_LIST_TITLE);
    for (let store of stores) {
        let status
        if (store.open) {status = MESSAGE.STATUS_OPEN} else {status = MESSAGE.STATUS_CLOSED}
        print(`${store.name} (${store.category}) / ${status}`);
    }
}
export async function promptStoreName(validator) {
    return await retryUserInput(MESSAGE.PROMPT_STORE_NAME, validator);
}

