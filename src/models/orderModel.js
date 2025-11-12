export function createOrderSummary() {
    return {
        address: "",
        riderRequest: "",
        phoneNumber: "",
        storeRequest: "",
        payment: null,
        discountCoupon: "",
        totalPrice: 0,
    };
}

export function calculateTotalPrice(selectedMenu){
    let totalPrice = 0;
    for (let menu of selectedMenu) {
        totalPrice += menu.price;
    }
    return totalPrice;
}