import { calculateTotalPrice } from "../models/orderModel.js";
import { findMenuByName } from "../models/storeModel.js";
import { validateOrderMenu } from "../models/storeRules.js";
import { validateNotEmpty, validateKoreanWithComma } from "../validation/input.js";
import { storeAddMenuView, promptAddMenu } from "../view/storesView.js";
import { parseCommaSeparated } from "../utils/parser.js";

export async function ensureMinOrderAmount(selectedMenu, store) {
    let currentSelection = [...selectedMenu];

    while (calculateTotalPrice(currentSelection) < store.minOrderAmount) {
        const availableMenu = storeAddMenuView(currentSelection, store);

        function validateAddMenu(input) {
            validateNotEmpty(input);
            validateKoreanWithComma(input);
            validateOrderMenu(availableMenu, input);
        }

        const input = await promptAddMenu(validateAddMenu);
        const addMenuNames = parseCommaSeparated(input);
        const addedMenus = findMenuByName(store, addMenuNames);
        currentSelection = currentSelection.concat(addedMenus);
    }

    return {
        selectedMenu: currentSelection,
        totalPrice: calculateTotalPrice(currentSelection),
    };
}


