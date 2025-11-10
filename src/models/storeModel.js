import { STORES } from "../models/storesDataSource.js";

export function getStores() {
    return STORES;
}

export function findStoreByName(selectedStoreName) {
    for(let store of STORES) {
        if (store.name === selectedStoreName) {return store}
    }
}

export function findMenuByName(store,selectedMenuName) {
    const selectedMenu = [];
    for(let menu of store.menu) {
        if(selectedMenuName.includes(menu.name)) {
            console.log(menu.name);
            selectedMenu.push(menu);
        }
    }
    return selectedMenu;
}