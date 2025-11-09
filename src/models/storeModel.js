import { STORES } from "../models/storesDataSource.js";

export function getStores() {
    return STORES;
}

export function findStoreByName(selectedStoreName) {
    for(let store of STORES) {
        if (store.name === selectedStoreName) {return store}
    }
}