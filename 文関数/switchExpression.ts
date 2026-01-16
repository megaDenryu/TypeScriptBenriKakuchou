/**
 * C# switch式ライクなTypeScript関数（高速化版）
 * 値に基づいて対応するケースを実行し、結果を返す
 * 
 * 高速化のポイント:
 * - Map優先: Mapの方がオブジェクトより高速
 * - 文字列変換の最小化
 * - 型チェックの最適化
 */
export function switchExpression<T, R>(
    value: T,
    cases: { [key: string]: () => R } | Map<T, () => R>,
    defaultCase?: () => R
): R {
    // 最適化: Map版を優先（ハッシュテーブルアクセスが高速）
    if (cases instanceof Map) {
        const caseFunction = cases.get(value);
        if (caseFunction !== undefined) { // undefined チェックの方が null チェックより高速
            return caseFunction();
        }
    } else {
        // 最適化: hasOwnProperty を使わず、直接アクセス + undefined チェック
        const key = String(value);
        const caseFunction = cases[key];
        if (caseFunction !== undefined) {
            return caseFunction();
        }
    }
    
    if (defaultCase) {
        return defaultCase();
    }
    
    throw new Error(`No case found for value: ${value}`);
}

/**
 * 高速版: 数値専用switchExpression（型変換なし）
 */
export function switchExpressionNumber<R>(
    value: number,
    cases: { [key: number]: () => R },
    defaultCase?: () => R
): R {
    const caseFunction = cases[value];
    if (caseFunction !== undefined) {
        return caseFunction();
    }
    
    if (defaultCase) {
        return defaultCase();
    }
    
    throw new Error(`No case found for value: ${value}`);
}

/**
 * 超高速版: Map専用（型チェックなし）
 */
export function switchExpressionMap<T, R>(
    value: T,
    cases: Map<T, () => R>,
    defaultCase?: () => R
): R {
    const caseFunction = cases.get(value);
    if (caseFunction !== undefined) {
        return caseFunction();
    }
    
    if (defaultCase) {
        return defaultCase();
    }
    
    throw new Error(`No case found for value: ${value}`);
}

// テスト関数
function test_example_switchExpression() {
    console.log('=== switchExpression Tests ===');
    
    // 基本的なオブジェクト版
    const dayType = switchExpression(
        3,
        {
            '1': () => 'Monday',
            '2': () => 'Tuesday', 
            '3': () => 'Wednesday',
            '4': () => 'Thursday',
            '5': () => 'Friday'
        },
        () => 'Weekend'
    );
    console.log(`Day 3 is: ${dayType}`); // Wednesday
    
    // Map版
    const statusMap = new Map([
        [200, () => 'OK'],
        [404, () => 'Not Found'],
        [500, () => 'Server Error']
    ]);
    
    const statusMessage = switchExpression(
        404,
        statusMap,
        () => 'Unknown Status'
    );
    console.log(`Status 404: ${statusMessage}`); // Not Found
    
    // デフォルトケース使用
    const unknownDay = switchExpression(
        8,
        {
            '1': () => 'Monday',
            '2': () => 'Tuesday'
        },
        () => 'Invalid Day'
    );
    console.log(`Day 8 is: ${unknownDay}`); // Invalid Day
    
    // 文字列キー
    const colorHex = switchExpression(
        'red',
        {
            'red': () => '#FF0000',
            'green': () => '#00FF00',
            'blue': () => '#0000FF'
        },
        () => '#000000'
    );
    console.log(`Red color: ${colorHex}`); // #FF0000
}