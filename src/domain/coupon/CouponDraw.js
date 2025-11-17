import { MESSAGE } from "../../constants/messages.js";
import { CouponFactory } from "./CouponFactory.js";

export default class CouponDraw {  
  getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  handleRandomNumber(randomNumber) {
    if(randomNumber > 8) {
      return MESSAGE.SIXTY_PERCENT_DISCOUNT_COUPON;
    }
    if(randomNumber > 5) {
      return MESSAGE.FORTY_PERCENT_DISCOUNT_COUPON;
    }
    return MESSAGE.TWENTY_PERCENT_DISCOUNT_COUPON;
  }

  createCoupon() {
    const randomNumber = this.getRandomNumber(10);
    const couponName = this.handleRandomNumber(randomNumber);
    return CouponFactory.create(couponName);
  }
}
