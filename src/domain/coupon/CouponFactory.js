import { MESSAGE } from "../../constants/messages.js";
import { TwentyPercentCoupon } from "./TwentyPercentCoupon.js";
import { FortyPercentCoupon } from "./FortyPercentCoupon.js";
import { SixtyPercentCoupon } from "./SixtyPercentCoupon.js";

const TYPES = new Map([
  [MESSAGE.TWENTY_PERCENT_DISCOUNT_COUPON, () => new TwentyPercentCoupon()],
  [MESSAGE.FORTY_PERCENT_DISCOUNT_COUPON, () => new FortyPercentCoupon()],
  [MESSAGE.SIXTY_PERCENT_DISCOUNT_COUPON, () => new SixtyPercentCoupon()]
])

export class CouponFactory {
  static create(input) {
    const creator = TYPES.get(input);

    if(!creator) {
      throw new Error(`[ERROR] 알 수 없는 쿠폰 타입입니다 ${input}`)
    }

    return creator();
  }
}