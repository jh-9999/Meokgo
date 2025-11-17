import Coupon from "./Coupon.js";
import { MESSAGE } from "../../constants/messages.js";

export class FortyPercentCoupon extends Coupon{
  constructor() {
    super(MESSAGE.FORTY_PERCENT_DISCOUNT_COUPON)
  }
  apply(totalPrice) {
    return totalPrice * 0.6;
  }
}