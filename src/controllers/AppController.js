import { getStores } from "../models/storeModel.js";
import { validateStore } from "../models/storeRules.js";
import { validateNotEmpty, validateKoreanOnly } from "../validation/input.js";
import { storesView, promptStoreName, retryUserInput } from "../view/storesView.js";

export default class AppController {
    async run() {
        const stores = getStores();
        storesView(stores);
        
        function validateStoreInput(input) {
            validateNotEmpty(input);
            validateKoreanOnly(input);
            validateStore(stores, input);
        }
        
        const storeName = await promptStoreName(validateStoreInput);
        console.log(storeName);
    }
}
