import { 拡張子付きファイルBase } from "../拡張子付きファイルBase";
import { 拡張子種類 } from "../拡張子種類";
import { ファイル識別ローダー } from "../ファイル識別ローダー";
import { PSDファイル } from "./PSDファイル";
import { CSVファイル } from "./CSVファイル";
import { JSONファイル } from "./JSONファイル";
import JSZip from 'jszip';

/**
 * Zipファイルを扱うクラス
 * ZIP内のファイル抽出や特定のファイル検索機能を提供
 */
export class Zipファイル extends 拡張子付きファイルBase {

    public constructor(file: File) {
        super(file);
    }

    protected 拡張子チェック(拡張子: string): { 成否: boolean, 拡張子: 拡張子種類 } {
        if (拡張子.toLowerCase() === 拡張子種類.zip) {
            return { 成否: true, 拡張子: 拡張子種類.zip };
        } else {
            return { 成否: false, 拡張子: 拡張子種類.zip };
        }
    }

    /**
     * ZIP内の指定された拡張子のファイルを検索して抽出する（ジェネリック版）
     * 入れ子のフォルダ構造も再帰的に走査します
     * @param 拡張子 検索する拡張子（拡張子種類enumから）
     * @returns 指定された拡張子のファイルオブジェクトの配列
     */
    public async 拡張子付きファイル抽出<T extends 拡張子付きファイルBase>(拡張子: 拡張子種類): Promise<T[]> {
        try {
            const zip = await JSZip.loadAsync(this.file);
            const files: T[] = [];

            // すべてのファイルエントリを走査（フォルダの入れ子も含む）
            for (const [filename, zipEntry] of Object.entries(zip.files)) {
                // ディレクトリは除外し、指定された拡張子のファイルのみ処理
                if (!zipEntry.dir && 拡張子付きファイルBase.拡張子チェック(filename, 拡張子)) {
                    const content = await zipEntry.async('blob');
                    // ファイル名をクリーンアップ
                    const cleanFileName = this.cleanFileName(拡張子付きファイルBase.ファイル名抽出(filename));
                    console.log(`ZIP内ファイル名: ${filename} -> クリーン済み: ${cleanFileName}`);
                    
                    try {
                        const fileObject = new File([content], cleanFileName, { type: 'application/octet-stream' });
                        const loadedFile = ファイル識別ローダー.ロード(fileObject);
                        if (loadedFile) {
                            files.push(loadedFile as unknown as T);
                        }
                    } catch (error) {
                        console.warn(`ファイル ${filename} の識別に失敗:`, error);
                    }
                }
            }

            return files;
        } catch (error) {
            console.error('ZIP解凍中にエラーが発生:', error);
            return [];
        }
    }

    /**
     * ファイル名をクリーンアップして文字化けを修正
     * @param fileName 元のファイル名
     * @returns クリーンアップされたファイル名
     */
    private cleanFileName(fileName: string): string {
        console.log(`クリーニング前のファイル名: "${fileName}"`);
        
        // 元のファイル名をバックアップ
        let cleaned = fileName;
        
        // 制御文字を除去
        cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        
        // 文字化けパターンを検出して修正を試行
        if (cleaned.includes('?') || cleaned.match(/[^\x20-\x7E\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/)) {
            console.warn(`文字化けを検出: "${cleaned}"`);
            
            // 連続する?マークを除去
            cleaned = cleaned.replace(/\?+/g, '');
            
            // 拡張子を保持
            const extension = fileName.split('.').pop()?.toLowerCase();
            if (extension && ['psd', 'png', 'jpg', 'jpeg', 'gif', 'csv', 'txt', 'json', 'xml'].includes(extension)) {
                // 元のファイル名から推測可能な部分を抽出
                const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
                
                // 英数字のみの部分を抽出
                const englishPart = nameWithoutExt.replace(/[^\x20-\x7E]/g, '');
                
                if (englishPart && englishPart.length > 0) {
                    cleaned = `${englishPart}.${extension}`;
                } else {
                    // 英数字部分がない場合はデフォルト名を使用
                    cleaned = `unknown_file.${extension}`;
                }
            } else {
                cleaned = 'unknown_file.psd';
            }
        }
        
        // 先頭末尾の空白を除去
        cleaned = cleaned.trim();
        
        // 空の場合や拡張子のみの場合はデフォルト名を使用
        if (!cleaned || cleaned.startsWith('.') || cleaned.length === 0) {
            const extension = fileName.split('.').pop()?.toLowerCase() || 'psd';
            cleaned = `unknown_file.${extension}`;
        }
        
        console.log(`クリーニング後のファイル名: "${cleaned}"`);
        return cleaned;
    }

    /**
     * ZIP内のPSDファイルを検索して抽出する
     * @returns PSDファイルオブジェクトの配列（見つからない場合は空配列）
     */
    public async PSDファイル抽出(): Promise<PSDファイル[]> {
        return this.拡張子付きファイル抽出<PSDファイル>(拡張子種類.psd);
    }

    /**
     * ZIP内のCSVファイルを検索して抽出する
     * @returns CSVファイルオブジェクトの配列（見つからない場合は空配列）
     */
    public async CSVファイル抽出(): Promise<CSVファイル[]> {
        return this.拡張子付きファイル抽出<CSVファイル>(拡張子種類.csv);
    }

    /**
     * ZIP内のJSONファイルを検索して抽出する
     * @returns JSONファイルオブジェクトの配列（見つからない場合は空配列）
     */
    public async JSONファイル抽出(): Promise<JSONファイル[]> {
        return this.拡張子付きファイル抽出<JSONファイル>(拡張子種類.json);
    }

    /**
     * ZIP内のすべてのファイルを取得する
     * 入れ子のフォルダ構造も再帰的に走査します
     * @returns ファイル一覧
     */
    public async 全ファイル抽出(): Promise<File[]> {
        try {
            const zip = await JSZip.loadAsync(this.file);
            const allFiles: File[] = [];

            // すべてのファイルエントリを走査（フォルダの入れ子も含む）
            for (const [filename, zipEntry] of Object.entries(zip.files)) {
                if (!zipEntry.dir) {
                    const content = await zipEntry.async('blob');
                    // ファイル名をクリーンアップ
                    const cleanFileName = this.cleanFileName(拡張子付きファイルBase.ファイル名抽出(filename));
                    const file = new File([content], cleanFileName, { type: 'application/octet-stream' });
                    allFiles.push(file);
                }
            }

            return allFiles;
        } catch (error) {
            console.error('ZIP解凍中にエラーが発生:', error);
            return [];
        }
    }

    /**
     * ZIP内に指定された拡張子のファイルが存在するかチェック
     * 入れ子のフォルダ構造も再帰的に走査します
     * @param 拡張子 検索する拡張子（拡張子種類enumから）
     * @returns 存在する場合true
     */
    public async ファイル存在チェック(拡張子: 拡張子種類): Promise<boolean> {
        try {
            const zip = await JSZip.loadAsync(this.file);
            
            // すべてのファイルエントリを走査（フォルダの入れ子も含む）
            for (const [filename, zipEntry] of Object.entries(zip.files)) {
                if (!zipEntry.dir && 拡張子付きファイルBase.拡張子チェック(filename, 拡張子)) {
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.error('ZIP内容確認中にエラーが発生:', error);
            return false;
        }
    }

    /**
     * ZIP内のファイル一覧を取得する（ファイル名のみ）
     * 入れ子のフォルダ構造も再帰的に走査します
     * @returns ファイル名の配列（パス情報も含む）
     */
    public async ファイル一覧取得(): Promise<string[]> {
        try {
            const zip = await JSZip.loadAsync(this.file);
            const filenames: string[] = [];

            // すべてのファイルエントリを走査（フォルダの入れ子も含む）
            for (const [filename, zipEntry] of Object.entries(zip.files)) {
                if (!zipEntry.dir) {
                    filenames.push(filename); // フルパスを保持
                }
            }

            return filenames;
        } catch (error) {
            console.error('ZIP内容確認中にエラーが発生:', error);
            return [];
        }
    }

    /**
     * ZIP内のファイル一覧を取得する（ファイル名のみ、パス除去）
     * 入れ子のフォルダ構造も再帰的に走査しますが、パス情報は除去します
     * @returns ファイル名の配列（パス情報なし）
     */
    public async ファイル名一覧取得(): Promise<string[]> {
        try {
            const zip = await JSZip.loadAsync(this.file);
            const filenames: string[] = [];

            // すべてのファイルエントリを走査（フォルダの入れ子も含む）
            for (const [filename, zipEntry] of Object.entries(zip.files)) {
                if (!zipEntry.dir) {
                    const baseName = 拡張子付きファイルBase.ファイル名抽出(filename);
                    filenames.push(baseName);
                }
            }

            return filenames;
        } catch (error) {
            console.error('ZIP内容確認中にエラーが発生:', error);
            return [];
        }
    }
}
