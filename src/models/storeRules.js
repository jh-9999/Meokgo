import { parseCommaSeparated } from "../utils/parser.js";

export function validateStore(stores, userInput) {
    for (let store of stores) {
        if (store.name === userInput){
            validateStoreIsOpen(store);
            return
        }
    }
    throw new Error("[ERROR] 존재하지 않는 가게입니다.");
}

function validateStoreIsOpen(store) {
    if (!store.open) throw new Error("[ERROR] 영업중인 가게가 아닙니다. 다른 가게를 선택해주세요.");
}

export function validateYesOrNo(string) {
    if (string === "네" || string === "아니오") {
        return;
    }
    throw new Error("[ERROR] 올바르지 않은 입력입니다. 네 또는 아니오를 입력해주세요.");
}

export function validateOrderMenu(menus, userInput) {
    const userMenuList = parseCommaSeparated(userInput);
    const menuNames = menus.map(menu => menu.name);

    for (let userMenu of userMenuList) {
        if(!menuNames.includes(userMenu)) {
            throw new Error("[ERROR] 존재하지 않는 메뉴입니다.");
        }
    }
}

export function validateConfirmOrder(input) {
    if (input === "주문" || input === "취소") {
        return;
    }
    throw new Error("[ERROR] 올바르지 않은 입력입니다. 주문 또는 취소를 입력해주세요.");
}
