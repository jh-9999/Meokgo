import { CashPayment } from "./CashPayment.js";
import { CardPayment } from "./CardPayment.js";
import { PointPayment } from "./PointPayment.js";

const TYPES = new Map([
    ["현금", () => new CashPayment()],
    ["카드", () => new CardPayment()],
    ["포인트", () => new PointPayment()],
]);

export class PaymentFactory {
    static isSupported(input) {
        const key = input?.trim?.();
        return !!(key && TYPES.has(key));
    }

    static assertSupported(input) {
        if (!this.isSupported(input)) {
            throw new Error("[ERROR] 지원하지 않는 결제 수단입니다. (현금/카드/포인트)");
        }
    }

    static create(input) {
        if (!this.isSupported(input)) {
            throw new Error("[ERROR] 지원하지 않는 결제 수단입니다. (현금/카드/포인트)");
        }
        return TYPES.get(input.trim())();
    }

}