export const MESSAGE = {
    WELCOME_LOGO: [
        "┌───────────────┐",
        "│     Meokgo    │",
        "└───────────────┘",
    ].join("\n"),

    STORE_LIST_TITLE: "가게 목록\n",
    STORE_MENU_TITLE: "\n메뉴 목록",
    CART_TITLE: "\n장바구니",
    RATING_TITLE: "평점: ",
    MIN_ORDER_AMOUNT_TITLE: "최소주문금액: ",
    MIN_ORDER_AMOUNT_MESSAGE: (minOrderAmount) =>
        `\n최소주문금액이 부족합니다. 최소주문금액은 ${minOrderAmount}원 입니다.`,
    RECOMMEND_MENU_TITLE: "추천 메뉴: ",
    DRINK_STATUS_TITLE: "음료 제공 여부: ",
    ADD_MENU_TITLE: "\n추가 가능한 메뉴 목록",

    PROMPT_STORE_NAME: "\n원하는 가게 이름을 입력해주세요: ",
    PROMPT_STORE_SELECTION: "\n계속 주문하시겠습니까? (네/아니오): ",
    PROMPT_ORDER_MENU:
        "원하는 메뉴를 입력해주세요. (예: 후라이드 치킨,양념 치킨): ",
    PROMPT_ADD_MENU:
        "추가할 메뉴를 입력해주세요. (예: 후라이드 치킨,양념 치킨): ",
    PROMPT_CONFIRM_ORDER: "주문하시겠습니까? (주문/취소): ",

    STATUS_OPEN: "영업중",
    STATUS_CLOSED: "영업종료",
    STATUS_DRINK_PROVIDED: "제공",
    STATUS_DRINK_NOT_PROVIDED: "제공안함",

    PRICE_UNIT: "원",

    ORDER_SUMMARY_TITLE: "\n주문서",
    ORDER_SUMMARY_ADDRESS: "주소(필수): ",
    ORDER_SUMMARY_RIDER_REQUEST: "라이더 요청사항: ",
    ORDER_SUMMARY_PHONE_NUMBER: "연락처(필수): ",
    ORDER_SUMMARY_STORE_REQUEST: "가게 요청사항: ",
    ORDER_SUMMARY_PAYMENT_TYPE: "결제 수단(필수): ",
    ORDER_SUMMARY_DISCOUNT_COUPON: "할인 쿠폰: ",
    ORDER_SUMMARY_TOTAL_PRICE: "총 결제 금액: ",

    ORDER_SUMMARY_COMPLETE_MESSAGE: "\n※※주문서를 다시 확인해주세요.※※",
    ORDER_SUMMARY_NOT_COMPLETE_MESSAGE: "현재 가지고 계신 할인 쿠폰이 없습니다.",

    PROMPT_ORDER_SUMMARY:
        "각 키워드를 입력하면, 해당 항목을 수정할 수 있습니다. (예: 주소,연락처)\n입력이 끝나면 '결제'를 입력해주세요.",
    PROMPT_ADDRES: "\n주소를 입력해주세요: ",
    PROMPT_RIDER_REQUEST: "\n라이더 요청사항을 입력해주세요: ",
    PROMPT_PHONE_NUMBER: "\n연락처를 입력해주세요: ",
    PROMPT_STORE_REQUEST: "\n가게 요청사항을 입력해주세요: ",
    PROMPT_PAYMENT_TYPE: "\n결제 수단을 입력해주세요: ",
    PROMPT_DISCOUNT_COUPON: "\n할인 쿠폰을 입력해주세요: ",

    ERROR_MESSAGE: "잘못된 입력입니다.",
};


