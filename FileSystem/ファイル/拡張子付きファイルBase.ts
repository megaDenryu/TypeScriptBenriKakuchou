import { 拡張子種類 } from "./拡張子種類";

export abstract class 拡張子付きファイルBase {
    public readonly file拡張子: string;
    public readonly file名: string;
    public readonly file: File;

    public constructor(file:File) {
        const 拡張子 = this.拡張子抽出検証(file);
        this.file名 = file.name;
        this.file拡張子 = 拡張子;
        this.file = file;
    }

    public static 拡張子抽出(file: File): string|undefined {
        return file.name.split('.').pop(); // 最後の部分が拡張子
    }

    /**
     * 例: "archive.tar.gz" の場合 "tar" を返す
     * 単一の拡張子（例: "file.txt"）の場合はundefinedを返す
     * @param file 
     * @returns 
     */
    public static 第二拡張子抽出(file: File): string|undefined {
        return this.ファイル名から第二拡張子抽出(file.name);
    }

    /**
     * ファイル名から拡張子を抽出する（文字列版）
     * @param filename ファイル名またはパス
     * @returns 拡張子（見つからない場合はundefined）
     */
    public static ファイル名から拡張子抽出(filename: string): string|undefined {
        return filename.split('.').pop();
    }

    public static ファイル名から第二拡張子抽出(filename: string): string|undefined {
        const parts = filename.split('.');
        if (parts.length < 3) {
            return undefined;
        }
        // 最後から2番目の要素を取得
        return parts[parts.length - 2];
    }

    /**
     * フルパスからファイル名のみを抽出
     * @param fullPath フルパス（例: "folder/subfolder/file.psd"）
     * @returns ファイル名のみ（例: "file.psd"）
     */
    public static ファイル名抽出(fullPath: string): string {
        // パス区切り文字（/ または \）で分割して最後の要素を取得
        const parts = fullPath.split(/[\/\\]/);
        return parts[parts.length - 1];
    }

    /**
     * ファイル名が指定された拡張子を持つかチェック
     * @param filename ファイル名またはパス
     * @param 拡張子 検索する拡張子
     * @returns 該当する場合true
     */
    public static 拡張子チェック(filename: string, 拡張子: 拡張子種類): boolean {
        const fileExtension = this.ファイル名から拡張子抽出(filename);
        return fileExtension?.toLowerCase() === 拡張子.toLowerCase();
    }

    protected abstract 拡張子チェック(拡張子:string): {成否:boolean, 拡張子:拡張子種類};

    private 拡張子抽出検証(file:File): 拡張子種類 {
        const 拡張子 = 拡張子付きファイルBase.拡張子抽出(file);
        if (拡張子 === undefined) {
            throw new Error("ファイル名に拡張子が含まれていません: " + file.name);
        }
        const 拡張子チェック結果 = this.拡張子チェック(拡張子)
        if (拡張子チェック結果.成否 === false) {
            throw new Error("不正な拡張子: " + file.name);
        }
        return 拡張子チェック結果.拡張子;
    }
}
