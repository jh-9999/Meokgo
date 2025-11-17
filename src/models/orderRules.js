export function isOrderSummaryComplete(orderSummary) {
    return (
        orderSummary.address !== "" &&
        orderSummary.phoneNumber !== "" &&
        orderSummary.payment
    );
}
