import { Payment } from "./Payment.js";

export class CardPayment extends Payment {
    constructor() { super("카드"); }
    process(totalPrice) {
        return `카드 결제 금액: ${totalPrice}원`;
    }
}