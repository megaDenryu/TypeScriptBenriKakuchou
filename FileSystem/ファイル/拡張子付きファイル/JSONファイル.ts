import { 拡張子付きファイルBase } from "../拡張子付きファイルBase";
import { 拡張子種類 } from "../拡張子種類";

/**
 * Result Pattern型定義 - ファイル操作の結果を型安全に表現
 */
export type FileOperationResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export class JSONファイル extends 拡張子付きファイルBase {

    public constructor(file: File) {
        super(file);
    }

    protected 拡張子チェック(拡張子: string): { 成否: boolean, 拡張子: 拡張子種類 } {
        if (拡張子 === 拡張子種類.json) {
            return { 成否: true, 拡張子: 拡張子種類.json };
        } else {
            return { 成否: false, 拡張子: 拡張子種類.json };
        }
    }

    /**
     * ファイル内容をテキストとして読み込み
     * FileReader APIの責務をFileSystemレイヤーに集約
     */
    public async readAsText(): Promise<FileOperationResult<string>> {
        return new Promise<FileOperationResult<string>>((resolve) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === "string") {
                    resolve({ success: true, data: result });
                } else {
                    resolve({ 
                        success: false, 
                        error: "ファイル読み込み処理が正常に完了しませんでした" 
                    });
                }
            };
            
            reader.onerror = () => {
                resolve({ 
                    success: false, 
                    error: "ファイル読み込み中にIO例外が発生しました" 
                });
            };
            
            reader.readAsText(this.file, 'utf-8');
        });
    }

    /**
     * ファイルサイズ制限チェック
     * デフォルト10MB、カスタマイズ可能
     */
    public checkSizeLimit(maxSizeMB: number = 10): FileOperationResult<void> {
        const maxSize = maxSizeMB * 1024 * 1024;
        if (this.file.size > maxSize) {
            return { 
                success: false, 
                error: `ファイルサイズが制限を超えています（最大${maxSizeMB}MB）` 
            };
        }
        return { success: true, data: undefined };
    }

    /**
     * 型安全なJSON解析 - 型ガードによるバリデーション付き
     * FileSystemレイヤーで汎用的なパース機能を提供
     * 
     * @param validator - 型ガード関数でオブジェクトの型を検証
     * @returns 型安全にパースされたオブジェクト
     */
    public async parseToObject<T>(
        validator: (obj: unknown) => obj is T
    ): Promise<FileOperationResult<T>> {
        try {
            // Phase 1: サイズチェック
            const sizeCheck = this.checkSizeLimit();
            if (!sizeCheck.success) {
                return sizeCheck as FileOperationResult<T>;
            }

            // Phase 2: ファイル読み込み
            const contentResult = await this.readAsText();
            if (!contentResult.success) {
                return contentResult as FileOperationResult<T>;
            }

            // Phase 3: JSON構文解析
            let parsed: unknown;
            try {
                parsed = JSON.parse(contentResult.data);
            } catch (error) {
                return { 
                    success: false, 
                    error: error instanceof SyntaxError 
                        ? "JSONの構文が正しくありません" 
                        : "JSON解析中にエラーが発生しました"
                };
            }

            // Phase 4: 型バリデーション
            if (!validator(parsed)) {
                return { 
                    success: false, 
                    error: "JSONの構造が期待される型と一致しません" 
                };
            }

            return { success: true, data: parsed };

        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error 
                    ? `予期しないエラー: ${error.message}` 
                    : "システムエラーが発生しました" 
            };
        }
    }

    /**
     * ファイル読み込み+解析のワンストップメソッド
     * 利便性重視のFacade Pattern
     */
    public async loadAndParse<T>(
        validator: (obj: unknown) => obj is T,
        maxSizeMB?: number
    ): Promise<FileOperationResult<T>> {
        // カスタムサイズ制限が指定された場合は事前チェック
        if (maxSizeMB !== undefined) {
            const sizeCheck = this.checkSizeLimit(maxSizeMB);
            if (!sizeCheck.success) {
                return sizeCheck as FileOperationResult<T>;
            }
        }

        return await this.parseToObject(validator);
    }
}