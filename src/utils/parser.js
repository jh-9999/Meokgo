export function parseCommaSeparated(input) {
    return input
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}


