import { validateStores } from "../src/models/storesDataSource.js";

const validStore = {
    name: "가게",
    category: "치킨",
    open: true,
    rating: 4.5,
    minOrderAmount: 10000,
    menu: [{ name: "메뉴", price: 1000, detail: "설명" }],
  };

function withOverride(override) {
    return [{ ...validStore, ...override }];
}

describe("validateStores - 단위 테스트", () => {
    test("정상 데이터는 예외가 발생하지 않는다",() => {
        expect(() => validateStores([validStore])).not.toThrow();
    });

    test("루트가 배열이 아니면 예외가 발생한다", () => {
        expect(() => validateStores({})).toThrow("[ERROR] stores.json 파일 형식이 배열이 아닙니다.");
    });

    test.each([
        [{ name: 123}, "[ERROR] 가게 이름이 올바르지 않습니다."],
        [{ name: ""}, "[ERROR] 가게 이름이 올바르지 않습니다."],
        [{ category: 1}, "[ERROR] 가게 카테고리가 올바르지 않습니다."],
        [{ category: ""}, "[ERROR] 가게 카테고리가 올바르지 않습니다."],
        [{ open: "true"}, "[ERROR] 가게 영업 상태가 올바르지 않습니다."],
        [{ rating: "4.5"}, "[ERROR] 가게 평점이 올바르지 않습니다."],
        [{ minOrderAmount: "10000"}, "[ERROR] 최소 주문 금액이 올바르지 않습니다."],
        [{ menu: {} }, "[ERROR] 가게 메뉴가 올바르지 않습니다."],
    ])("가게 데이터가 올바르지 않으면 예외가 발생한다.", (overrides, message) => {
        expect(() => validateStores(withOverride(overrides))).toThrow(message);
    });

    test.each([
        [[{ name: 1, price: 1000, detail: "설명" }], "[ERROR] 메뉴 이름이 올바르지 않습니다."],
        [[{ name: "메뉴", price: "1000", detail: "설명" }], "[ERROR] 메뉴 가격이 올바르지 않습니다."],
        [[{ name: "메뉴", price: 1000, detail: 1 }], "[ERROR] 메뉴 설명이 올바르지 않습니다."],
    ])("메뉴 데이터가 올바르지 않으면 예외가 발생한다.", (overrides, message) => {
        expect(() => validateStores(withOverride({ menu: overrides }))).toThrow(message);
    });
})