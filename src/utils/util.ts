export function randomDigitsString(length: number): string {
    const max = Math.pow(10, length);
    return Math.floor(Math.random() * max)
        .toString()
        .padStart(length, "0");
}