import { CSVファイル } from "./拡張子付きファイル/CSVファイル";
import { JSONファイル } from "./拡張子付きファイル/JSONファイル";
import { PSDファイル } from "./拡張子付きファイル/PSDファイル";
import { Zipファイル } from "./拡張子付きファイル/Zipファイル";
import { 拡張子付きファイルBase } from "./拡張子付きファイルBase";
import { 拡張子種類 } from "./拡張子種類";

export class ファイル識別ローダー {
    public static ロード(file: File) {
        const 拡張子 = 拡張子付きファイルBase.拡張子抽出(file);
        if (拡張子 === undefined) {
            throw new Error("ファイル名に拡張子が含まれていません: " + file.name);
        }
        switch (拡張子) {
            case 拡張子種類.psd: return new PSDファイル(file);
            case 拡張子種類.json: return new JSONファイル(file);
            case 拡張子種類.csv: return new CSVファイル(file);
            case 拡張子種類.zip: return new Zipファイル(file);
        }
    }
}