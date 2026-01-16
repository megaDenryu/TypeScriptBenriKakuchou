/**
 * C#にはswitch式があるが、TypeScriptにはない。
 * switch式と同じように文を、値を返す関数としてラップする。
 * 
 * if文やswitch文などが対象。forに対してはmapがあるので不要と思われる。
 */

// 各関数をインポート
export { switchExpression } from './switchExpression';
export { ifExpression } from './ifExpression';
export { ifElseExpression } from './ifElseExpression';
export { match } from './match';

// 使用例と統合テスト
import { switchExpression } from './switchExpression';
import { ifExpression } from './ifExpression';
import { ifElseExpression } from './ifElseExpression';
import { match } from './match';

function test_example_integrated() {
    console.log('=== 統合使用例: UIComponent Style決定 ===');
    
    // UIコンポーネントでの実用例
    type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
    
    function getButtonStyle(variant: ButtonVariant, isDisabled: boolean) {
        return switchExpression(
            variant,
            {
                'primary': () => ifExpression(
                    () => isDisabled,
                    () => ({ background: '#cccccc', color: '#666666' }),
                    () => ({ background: '#007bff', color: 'white' })
                ),
                'secondary': () => ifExpression(
                    () => isDisabled,
                    () => ({ background: '#e9ecef', color: '#6c757d' }),
                    () => ({ background: '#6c757d', color: 'white' })
                ),
                'danger': () => ifExpression(
                    () => isDisabled,
                    () => ({ background: '#f8d7da', color: '#721c24' }),
                    () => ({ background: '#dc3545', color: 'white' })
                ),
                'success': () => ifExpression(
                    () => isDisabled,
                    () => ({ background: '#d4edda', color: '#155724' }),
                    () => ({ background: '#28a745', color: 'white' })
                )
            }
        );
    }
    
    const primaryStyle = getButtonStyle('primary', false);
    const disabledDangerStyle = getButtonStyle('danger', true);
    
    console.log('Primary button style:', primaryStyle);
    console.log('Disabled danger button style:', disabledDangerStyle);
    
    // 複数関数を組み合わせた例
    const userAge = 25;
    const userRole: 'admin' | 'user' | 'guest' = 'user';
    
    const accessLevel = match(userRole, [
        { 
            pattern: 'admin', 
            value: () => ifExpression(
                () => userAge >= 21,
                () => 'full_access',
                () => 'limited_admin'
            )
        },
        { 
            pattern: 'user', 
            value: () => ifElseExpression([
                { condition: () => userAge >= 18, value: () => 'standard_access' },
                { condition: () => userAge >= 13, value: () => 'teen_access' }
            ], () => 'child_access')
        }
    ], () => 'guest_access');
    
    console.log(`User (age: ${userAge}, role: ${userRole}) access level: ${accessLevel}`);
}