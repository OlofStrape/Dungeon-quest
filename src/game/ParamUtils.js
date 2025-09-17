export function parseJsonSafe(s) {
    if (!s)
        return null;
    try {
        return JSON.parse(s);
    }
    catch {
        return null;
    }
}
export function rollInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
