import { getStores, findStoreByName } from "../models/storeModel.js";
import { validateStore, validateYesOrNo } from "../models/storeRules.js";
import { validateNotEmpty, validateKoreanOnly } from "../validation/input.js";
import { 
    storesView, 
    storeDetailView, 
    promptStoreName, 
    promptContinueOrder 
} from "../view/storesView.js";

export default class AppController {
    async run() {
        const stores = getStores();
        const store = await selectStoreFlow(stores);
        console.log(store);
        
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

async function selectStoreFlow(stores) {
    let store, answer;
    do {
        store = await selectStore(stores);
        answer = await confirmStoreSelection(store);
    } while (answer !== "네");
    return store;
}