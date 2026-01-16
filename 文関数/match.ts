/**
 * Rust/関数型言語ライクなパターンマッチング（高速化版）
 * 値または関数パターンにマッチする最初のケースを実行
 * 
 * 高速化のポイント:
 * - 通常のforループ使用
 * - 関数型判定の最適化
 * - 早期リターン
 */
export function match<T, R>(
    value: T,
    patterns: Array<{ pattern: T | ((v: T) => boolean); value: () => R }>,
    defaultCase?: () => R
): R {
    // 最適化: 通常のforループの方が高速
    const length = patterns.length;
    for (let i = 0; i < length; i++) {
        const { pattern, value: caseValue } = patterns[i];
        
        // 最適化: typeof チェックを最小化
        if (typeof pattern === 'function') {
            if ((pattern as (v: T) => boolean)(value)) {
                return caseValue();
            }
        } else if (pattern === value) {
            return caseValue();
        }
    }
    
    if (defaultCase) {
        return defaultCase();
    }
    
    throw new Error(`No pattern matched for value: ${value}`);
}

/**
 * 高速版: 値マッチ専用（関数パターンなし）
 */
export function matchValue<T, R>(
    value: T,
    patterns: Array<{ pattern: T; value: () => R }>,
    defaultCase?: () => R
): R {
    const length = patterns.length;
    for (let i = 0; i < length; i++) {
        const { pattern, value: caseValue } = patterns[i];
        if (pattern === value) {
            return caseValue();
        }
    }
    
    if (defaultCase) {
        return defaultCase();
    }
    
    throw new Error(`No pattern matched for value: ${value}`);
}

/**
 * 超高速版: プリミティブ値専用（===比較最適化）
 */
export function matchPrimitive<T extends string | number | boolean, R>(
    value: T,
    patterns: Array<{ pattern: T; value: () => R }>,
    defaultCase?: () => R
): R {
    const length = patterns.length;
    for (let i = 0; i < length; i++) {
        const { pattern, value: caseValue } = patterns[i];
        if (pattern === value) {
            return caseValue();
        }
    }
    
    if (defaultCase) {
        return defaultCase();
    }
    
    throw new Error(`No pattern matched for value: ${value}`);
}

// テスト関数
function test_example_match() {
    console.log('=== match Tests ===');
    
    // 数値パターンマッチング
    const input = 42;
    const result = match(input, [
        { pattern: (x: number) => x < 0, value: () => 'Negative' },
        { pattern: 0, value: () => 'Zero' },
        { pattern: (x: number) => x > 0 && x < 50, value: () => 'Small Positive' },
        { pattern: (x: number) => x >= 50, value: () => 'Large Positive' }
    ]);
    console.log(`Input ${input} is: ${result}`); // Small Positive
    
    // 文字列パターン
    const animal = 'cat';
    const sound = match(animal, [
        { pattern: 'dog', value: () => 'Woof!' },
        { pattern: 'cat', value: () => 'Meow!' },
        { pattern: 'cow', value: () => 'Moo!' },
        { pattern: (a: string) => a.startsWith('bird'), value: () => 'Tweet!' }
    ], () => 'Unknown sound');
    console.log(`${animal} says: ${sound}`); // Meow!
    
    // オブジェクトパターン
    type Status = { type: 'loading' } | { type: 'success'; data: string } | { type: 'error'; message: string };
    
    const status: Status = { type: 'success', data: 'Hello World' };
    const statusMessage = match(status, [
        { pattern: (s: Status) => s.type === 'loading', value: () => 'Loading...' },
        { pattern: (s: Status) => s.type === 'success', value: () => `Success: ${(status as any).data}` },
        { pattern: (s: Status) => s.type === 'error', value: () => `Error: ${(status as any).message}` }
    ]);
    console.log('Status:', statusMessage); // Success: Hello World
    
    // 配列長によるパターン
    const items = [1, 2, 3, 4, 5];
    const description = match(items, [
        { pattern: (arr: number[]) => arr.length === 0, value: () => 'Empty array' },
        { pattern: (arr: number[]) => arr.length === 1, value: () => 'Single item' },
        { pattern: (arr: number[]) => arr.length < 5, value: () => 'Few items' },
        { pattern: (arr: number[]) => arr.length >= 5, value: () => 'Many items' }
    ]);
    console.log(`Array with ${items.length} items: ${description}`); // Many items
}