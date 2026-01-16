import { 拡張子付きファイルBase } from "../拡張子付きファイルBase";
import { 拡張子種類 } from "../拡張子種類";

export class PSDファイル extends 拡張子付きファイルBase {

    public constructor(file: File) {
        super(file);
    }

    protected 拡張子チェック(拡張子: string): { 成否: boolean, 拡張子: 拡張子種類 } {
        if (拡張子 === 拡張子種類.psd) {
            return { 成否: true, 拡張子: 拡張子種類.psd };
        } else {
            return { 成否: false, 拡張子: 拡張子種類.psd };
        }
    }


}