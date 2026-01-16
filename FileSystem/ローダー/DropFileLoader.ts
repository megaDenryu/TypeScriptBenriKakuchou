import { ファイル識別ローダー } from "../ファイル/ファイル識別ローダー";
import { FileOperationResult, JSONファイル } from "../ファイル/拡張子付きファイル/JSONファイル";


export class DropFileLoader {

    constructor() {}

    /**
     * ドラッグ&ドロップからの読み込み
     * UI層とのインターフェース
     */
    public async ドロップイベントからJsonファイル読み込み(event: DragEvent):Promise<FileOperationResult<JSONファイル>> {
        const files = this._extractFiles(event);
        if (files.length === 0) {
            return { success: false, error: "ドロップされたファイルが見つかりません" };
        }

        return this._validateAsJSONFile(files[0]);
    }


    private _extractFiles(event: DragEvent): readonly File[] {
        const files: File[] = [];
        
        if (event.dataTransfer?.files) {
            for (let i = 0; i < event.dataTransfer.files.length; i++) {
                const file = event.dataTransfer.files[i];
                if (file) files.push(file);
            }
        }
        
        return Object.freeze(files);
    }
    /**
     * FileSystemモジュールによるJSONファイル検証
     * 型安全な検証を実現
     */
    private _validateAsJSONFile(
        file: File
    ): FileOperationResult<JSONファイル> {
        try {
            const fileProxy = ファイル識別ローダー.ロード(file);
            
            if (!fileProxy) {
                return { success: false, error: "サポートされていないファイル形式です" };
            }

            if (!(fileProxy instanceof JSONファイル)) {
                return { 
                    success: false, 
                    error: `JSONファイルが必要です。検出された形式: ${fileProxy.file拡張子}` 
                };
            }

            return { success: true, data: fileProxy };

        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error 
                    ? `ファイル検証エラー: ${error.message}`
                    : "ファイル検証中にエラーが発生しました"
            };
        }
    }
}