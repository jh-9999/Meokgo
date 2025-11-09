import fs from "node:fs";
import path from "node:path";

const rawStoresPath = path.resolve(process.cwd(), "src", "data", "stores.json");
const rawStores = JSON.parse(fs.readFileSync(rawStoresPath, "utf8"));

function validateStores(array) {
    if (validateType(array, "array")) throw new Error("[ERROR] stores.json 파일 형식이 배열이 아닙니다.");
    for (let store of array) validateStore(store);
}

function validateType(value, type) {
    switch (type) {
        case "array":
            return !Array.isArray(value);
        case "string":
            return typeof value !== "string" || value.trim() === "";
        case "number":
            return typeof value !== "number" || isNaN(value);
        case "boolean":
            return typeof value !== "boolean";
        default:
            return true;
    }
}

function validateMenu(menu) {
    if (validateType(menu.name, "string")) throw new Error("[ERROR] 메뉴 이름이 올바르지 않습니다.");
    if (validateType(menu.price, "number")) throw new Error("[ERROR] 메뉴 가격이 올바르지 않습니다.");
    if (validateType(menu.detail, "string")) throw new Error("[ERROR] 메뉴 설명이 올바르지 않습니다.");
}

function validateStore(store) {
    if (validateType(store.name, "string")) throw new Error("[ERROR] 가게 이름이 올바르지 않습니다.");
    if (validateType(store.category, "string")) throw new Error("[ERROR] 가게 카테고리가 올바르지 않습니다.");
    if (validateType(store.open, "boolean")) throw new Error("[ERROR] 가게 영업 상태가 올바르지 않습니다.");
    if (validateType(store.rating, "number")) throw new Error("[ERROR] 가게 평점이 올바르지 않습니다.");
    if (validateType(store.minOrderAmount, "number")) throw new Error("[ERROR] 최소 주문 금액이 올바르지 않습니다.");
    if (validateType(store.menu, "array")) throw new Error("[ERROR] 가게 메뉴가 올바르지 않습니다.");
    for (let menu of store.menu) validateMenu(menu);
}

validateStores(rawStores);

const STORES = rawStores

export { STORES, validateStores };