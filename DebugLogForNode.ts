
export class NodeLog {
    // file path と　line number を含むカスタムログを出力するユーティリティクラス
    
    // スタックトレースのデバッグ表示フラグ
    private static showStackTrace = false;
    
    // ANSIカラーコード
    private static readonly COLORS = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        cyan: '\x1b[36m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        gray: '\x1b[90m',
    };

    /**
     * スタックトレースのデバッグ表示を有効/無効にする
     */
    public static setShowStackTrace(show: boolean): void {
        this.showStackTrace = show;
    }

    /**
     * スタックトレースから元のTSファイルのパスと行番号を抽出
     */
    private static extractSourceLocation(stack: string | undefined, showDebug: boolean = false): string {
        if (!stack) return 'unknown location';
        
        const lines = stack.split('\n');
        
        // デバッグ用：スタックトレース全体を表示
        if (showDebug || this.showStackTrace) {
            console.log('=== Full Stack Trace ===');
            lines.forEach((line, i) => console.log(`[${i}] ${line}`));
            console.log('========================');
        }
        
        // 2番目のスタック(呼び出し元)を取得
        const callerLine = lines[2] || '';
        
        // ファイルパス、行番号、列番号を抽出（.tsまたは.js）
        const fileMatch = callerLine.match(/\((.+\.[jt]s):(\d+):(\d+)\)/) || 
                         callerLine.match(/at\s+(.+\.[jt]s):(\d+):(\d+)/);
        
        if (fileMatch) {
            let filePath = fileMatch[1];
            const lineNumber = fileMatch[2];
            const columnNumber = fileMatch[3];
            
            // file:/// プロトコルを削除
            filePath = filePath.replace(/^file:\/\/\//, '');
            
            // srcフォルダ以降のパスのみを表示（短く見やすく）
            const srcIndex = filePath.indexOf('src');
            if (srcIndex !== -1) {
                filePath = filePath.substring(srcIndex);
            } else {
                // electron-dist以降のパスを表示
                const distIndex = filePath.indexOf('electron-dist');
                if (distIndex !== -1) {
                    filePath = filePath.substring(distIndex);
                }
            }
            
            // 関数名を抽出
            const functionMatch = callerLine.match(/at\s+(?:async\s+)?([^\s(]+)/);
            const functionName = functionMatch ? functionMatch[1] : 'anonymous';
            
            return `${functionName} (${filePath}:${lineNumber}:${columnNumber})`;
        }
        
        return callerLine.trim();
    }

    static print(message: string | any, ...additionalArgs: any[]): void;
    static print(message: string | any, options: { showStackTrace?: boolean }, ...additionalArgs: any[]): void;
    static print(message: string | any, optionsOrArg?: any, ...additionalArgs: any[]): void {
        // オプション引数の処理
        let showDebug = false;
        let actualArgs = additionalArgs;
        
        if (optionsOrArg && typeof optionsOrArg === 'object' && 'showStackTrace' in optionsOrArg) {
            showDebug = optionsOrArg.showStackTrace || false;
        } else if (optionsOrArg !== undefined) {
            // 通常の引数として扱う
            actualArgs = [optionsOrArg, ...additionalArgs];
        }
        
        const err = new Error();
        const caller = this.extractSourceLocation(err.stack, showDebug);
        
        // messageが文字列でない場合はJSON.stringifyで変換
        const formattedMessage = typeof message === 'string' 
            ? message 
            : JSON.stringify(message, null, 2);
        
        // 枠線の長さを計算（最大80文字）
        const maxLength = 80;
        const topBorder = '═'.repeat(maxLength);
        const bottomBorder = '═'.repeat(maxLength);
        
        // ログ出力
        console.log(`${this.COLORS.cyan}${this.COLORS.bright}╔${topBorder}╗${this.COLORS.reset}`);
        console.log(`${this.COLORS.cyan}║${this.COLORS.reset} ${this.COLORS.green}[DEBUG]${this.COLORS.reset} ${this.COLORS.bright}${formattedMessage}${this.COLORS.reset}`);
        console.log(`${this.COLORS.cyan}║${this.COLORS.reset} ${this.COLORS.gray}${caller}${this.COLORS.reset}`);
        
        // 追加の引数があれば表示
        if (actualArgs.length > 0) {
            console.log(`${this.COLORS.cyan}╟${'─'.repeat(maxLength)}╢${this.COLORS.reset}`);
            actualArgs.forEach((arg, index) => {
                const formattedArg = typeof arg === 'string' 
                    ? arg 
                    : JSON.stringify(arg, null, 2);
                
                // 複数行の場合は各行にプレフィックスを付ける
                const lines = formattedArg.split('\n');
                lines.forEach((line, lineIndex) => {
                    if (lineIndex === 0) {
                        console.log(`${this.COLORS.cyan}║${this.COLORS.reset} ${this.COLORS.yellow}[arg${index}]${this.COLORS.reset} ${line}`);
                    } else {
                        console.log(`${this.COLORS.cyan}║${this.COLORS.reset}        ${line}`);
                    }
                });
            });
        }
        
        console.log(`${this.COLORS.cyan}${this.COLORS.bright}╚${bottomBorder}╝${this.COLORS.reset}`);
    }
}