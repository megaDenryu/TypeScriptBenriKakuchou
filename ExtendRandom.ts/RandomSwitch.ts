export function RandomSwitch<T>(items: T[], probability: number): T | undefined {
    if (items.length === 0) {
        return undefined; // 空の配列の場合はundefinedを返す
    }
    const randomValue = Math.random();
    if (randomValue < probability) {
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex]; // 確率に基づいてランダムな要素を返す
    }
    return undefined; // 確率に合致しない場合はundefinedを返す
}

export function ランダムな整数を範囲から生成(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min; // 指定された範囲内のランダムな整数を生成
}