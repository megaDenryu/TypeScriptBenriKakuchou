export class DateExtend {
    _date: Date;
    constructor() {
        this._date = new Date();
    }

    /** 日本語形式で時刻を「〇時〇分〇秒」として返す */
    public formatTimeJapanese(): string {
        const hours = this._date.getHours();
        const minutes = this._date.getMinutes();
        const seconds = this._date.getSeconds();
        return `${hours}時${minutes}分${seconds}秒`;
    }

}