const ERROR_MESSAGE = {
    NOT_EMPTY: "[ERROR] 입력값을 입력해주세요.",
    KOREAN_ONLY: "[ERROR] 한글만 입력할 수 있습니다.",
}

const PATTERN = {
    KOREAN_ONLY: /^[가-힣\s]+$/,
}


export function validateNotEmpty(input) {
    if (input.trim() === "") throw new Error(ERROR_MESSAGE.NOT_EMPTY);
}

export function validateKoreanOnly(input) {
    if (!PATTERN.KOREAN_ONLY.test(input)) throw new Error(ERROR_MESSAGE.KOREAN_ONLY);
}