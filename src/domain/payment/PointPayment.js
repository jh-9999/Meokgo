import { Payment } from "./Payment.js";

export class PointPayment extends Payment {
    constructor() { super("포인트"); }
    process(totalPrice) {
        return `포인트 결제 금액: ${totalPrice}원`;
    }
}