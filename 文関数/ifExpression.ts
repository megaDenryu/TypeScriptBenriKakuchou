/**
 * if式ライクな関数版三項演算子（高速化版）
 * 条件に基づいてtrue/falseケースのいずれかを実行
 * 
 * 高速化のポイント:
 * - 遅延評価: 条件を関数として受け取り、必要な時だけ評価
 * - インライン最適化: シンプルな三項演算子でJSエンジンが最適化しやすい
 */
export function ifExpression<R>(
    condition: () => boolean,
    trueCase: () => R,
    falseCase: () => R
): R {
    return condition() ? trueCase() : falseCase();
}

/**
 * 従来版（後方互換性のため）
 * 条件を事前評価する版
 */
export function ifExpressionEager<R>(
    condition: boolean,
    trueCase: () => R,
    falseCase: () => R
): R {
    return condition ? trueCase() : falseCase();
}

// テスト関数
function test_example_ifExpression() {
    console.log('=== ifExpression Tests（高速化版）===');
    
    // 基本的な使用（遅延評価版）
    const age = 25;
    const category = ifExpression(
        () => age >= 18,
        () => 'Adult',
        () => 'Minor'
    );
    console.log(`Age ${age} category: ${category}`); // Adult
    
    // 数値計算（遅延評価版）
    const temperature = 30;
    const comfort = ifExpression(
        () => temperature > 25,
        () => 'Hot',
        () => 'Cool'
    );
    console.log(`Temperature ${temperature}°C is: ${comfort}`); // Hot
    
    // 遅延評価のメリット実演
    console.log('\n=== 遅延評価のメリット ===');
    const expensiveCalculation = () => {
        console.log('重い処理を実行中...');
        return Math.random() > 0.5;
    };
    
    const quickResult = ifExpression(
        () => true, // 常にtrue
        () => '最初の条件で決定',
        () => '重い処理の結果' // 実行されない！
    );
    console.log(`結果: ${quickResult}`);
    
    // オブジェクト返却（遅延評価版）
    const isLoggedIn = true;
    const userState = ifExpression(
        () => isLoggedIn,
        () => ({ status: 'authenticated', permissions: ['read', 'write'] }),
        () => ({ status: 'guest', permissions: ['read'] })
    );
    console.log('User state:', userState);
    
    // 従来版との比較
    console.log('\n=== 従来版との比較 ===');
    const categoryEager = ifExpressionEager(
        age >= 18,
        () => 'Adult (eager)',
        () => 'Minor (eager)'
    );
    console.log(`Age ${age} category (eager): ${categoryEager}`);
    
    // 複雑な条件（遅延評価版）
    const score = 85;
    const hasBonus = true;
    const finalGrade = ifExpression(
        () => score >= 80 && hasBonus,
        () => 'A+',
        () => ifExpression(
            () => score >= 80,
            () => 'A',
            () => 'B'
        )
    );
    console.log(`Score ${score} with bonus: ${finalGrade}`); // A+
}