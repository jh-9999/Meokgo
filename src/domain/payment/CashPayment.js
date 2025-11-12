import { Payment } from "./Payment.js";

export class CashPayment extends Payment {
    constructor() { super("현금"); }
    process(totalPrice) {
        return `현금 결제 금액: ${totalPrice}원`;
    }
}