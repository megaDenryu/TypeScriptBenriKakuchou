/**
 * 複数条件のif-elseチェーンを式として表現
 * 最初にtrueになった条件の値を返す
 * 
 * 高速化のポイント:
 * - 遅延評価: 条件を関数として受け取り、必要な時だけ評価
 * - 早期リターン: マッチした瞬間に処理を終了
 */
export function ifElseExpression<R>(
    conditions: Array<{ condition: () => boolean; value: () => R }>,
    defaultCase?: () => R
): R {
    // 最適化: 通常のforループの方がfor...ofより高速
    const length = conditions.length;
    for (let i = 0; i < length; i++) {
        const { condition, value } = conditions[i];
        if (condition()) { // 遅延評価: 必要な時だけ条件をチェック
            return value();
        }
    }
    
    if (defaultCase) {
        return defaultCase();
    }
    
    throw new Error('No condition was true and no default case provided');
}

/**
 * 従来版（後方互換性のため）
 * 条件を事前評価する版
 */
export function ifElseExpressionEager<R>(
    conditions: Array<{ condition: boolean; value: () => R }>,
    defaultCase?: () => R
): R {
    const length = conditions.length;
    for (let i = 0; i < length; i++) {
        const { condition, value } = conditions[i];
        if (condition) {
            return value();
        }
    }
    
    if (defaultCase) {
        return defaultCase();
    }
    
    throw new Error('No condition was true and no default case provided');
}

// テスト関数
function test_example_ifElseExpression() {
    console.log('=== ifElseExpression Tests (高速化版) ===');
    
    // 基本的な成績評価（遅延評価版）
    const score = 85;
    const grade = ifElseExpression([
        { condition: () => score >= 90, value: () => 'A' },
        { condition: () => score >= 80, value: () => 'B' }, // この時点でtrueになるので、以下は評価されない
        { condition: () => score >= 70, value: () => 'C' },
        { condition: () => score >= 60, value: () => 'D' }
    ], () => 'F');
    console.log(`Score ${score} grade: ${grade}`); // B
    
    // 従来版との比較
    console.log('\n=== 従来版との比較 ===');
    const gradeEager = ifElseExpressionEager([
        { condition: score >= 90, value: () => 'A' },
        { condition: score >= 80, value: () => 'B' },
        { condition: score >= 70, value: () => 'C' },
        { condition: score >= 60, value: () => 'D' }
    ], () => 'F');
    console.log(`Score ${score} grade (eager): ${gradeEager}`); // B
    
    // 料金計算（遅延評価版）
    const distance = 25;
    const fare = ifElseExpression([
        { condition: () => distance <= 5, value: () => 300 },
        { condition: () => distance <= 10, value: () => 500 },
        { condition: () => distance <= 20, value: () => 800 },
        { condition: () => distance <= 30, value: () => 1200 } // ここでtrueになる
    ], () => 1500);
    console.log(`Distance ${distance}km fare: ¥${fare}`); // ¥1200
    
    // 気温による服装推奨（遅延評価版）
    const temperature = 18;
    const clothing = ifElseExpression([
        { condition: () => temperature >= 30, value: () => 'Tシャツ' },
        { condition: () => temperature >= 25, value: () => '半袖' },
        { condition: () => temperature >= 20, value: () => '長袖' },
        { condition: () => temperature >= 15, value: () => '薄手のジャケット' }, // ここでtrueになる
        { condition: () => temperature >= 10, value: () => 'ジャケット' }
    ], () => '厚手のコート');
    console.log(`Temperature ${temperature}°C: ${clothing}`);
    
    // 複雑な計算での遅延評価のメリット実演
    console.log('\n=== 遅延評価のメリット実演 ===');
    const expensiveCalculation = () => {
        console.log('重い計算を実行中...');
        return Math.random() > 0.5;
    };
    
    const result = ifElseExpression([
        { condition: () => true, value: () => '最初の条件でマッチ' },
        { condition: expensiveCalculation, value: () => '重い計算' }, // 実行されない！
        { condition: () => false, value: () => '最後' }
    ]);
    console.log(`結果: ${result}`);
    
    // ユーザー権限判定（遅延評価版）
    const userRole = getUserRole(); 
    const permissions = ifElseExpression([
        { condition: () => userRole === 'admin', value: () => ['read', 'write', 'delete', 'manage'] }, 
        { condition: () => userRole === 'editor', value: () => ['read', 'write'] }, // ここでマッチ
        { condition: () => userRole === 'viewer', value: () => ['read'] }
    ], () => []);
    console.log(`Role ${userRole} permissions:`, permissions);

    function getUserRole():'admin' | 'editor' | 'viewer' | 'guest' {
        return 'editor';
    }
}