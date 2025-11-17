export default class Coupon {
    #name;

    constructor(name) { this.#name = name; }

    get name() { return this.#name; }

    apply(_) { throw new Error("서브클래스에서 구현하세요."); }

    getIssuedMessage() { return `${this.name}이 발급되었습니다.`}
}