

// // function 使用例() {

// import { any } from "zod";

//     const mode = Mode.哺乳類.犬

//     if (mode == Mode.哺乳類) {
//         if (mode == mode.哺乳類.犬) {
//             console.log("犬です");
//         }
//         if (mode == mode.哺乳類.猫) {
//             console.log("猫です");
//         }
//     }
//     else if (mode == Mode.爬虫類) {
//         if (mode == mode.爬虫類.トカゲ) {
//             console.log("トカゲです");
//         }
//         if (mode == mode.爬虫類.ヘビ) {
//             console.log("ヘビです");
//         }

//     }

// }

// class En<T extends Record<string, En>|null = any> {
//     public readonly 値: string;
//     private _上: En | null = null;
//     private _下: T;
//     constructor(値:string, 下: T) {
//         this.値 = 値;
//         this._下 = 下;
//         for (const key in 下) {
//             下[key].set上(this);
//         }
//     }

//     set上(上: En): this {
//         this._上 = 上;
//         return this;
//     }

//     is(item: En): boolean {
//         if (this.値 === item.値) {
//             return true;
//         }
//         if (this._上 !== null) {
//             return this._上.is(item);
//         }
//         return false;
//     }
// }

// function en<T extends Record<string, En>|null = any>(値:string, 下: T): En<T> {
//     return new En(値, 下);
// }


// const 哺乳類 = new En<{犬: En, 猫: En}>("哺乳類",{
//         犬: new En("犬",null), 
//         猫: new En("猫",null)
// });
// const 動物 = en<{
//         哺乳類: En<{
//             犬: En, 
//             猫: En
//         }>,
//         爬虫類: En<{
//             トカゲ: En, 
//             ヘビ: En
//         }>
//     }>("動物", {
//         哺乳類: 哺乳類,
//         爬虫類: en<{トカゲ: En, ヘビ: En}>("爬虫類", {
//             トカゲ: en("トカゲ", null),
//             ヘビ: en("ヘビ", null)
//         })
//     });

// export enum E動物{
//     哺乳類,
//     爬虫類
// }
// export namespace N動物 {
//     export enum E哺乳類 {
//         犬 = "犬",
//         猫 = "猫"
//     }
//     export enum E爬虫類 {
//         トカゲ = "トカゲ",
//         ヘビ = "ヘビ"
//     }
// }

// const 何か = N動物.E哺乳類.犬;
// const ty = typeof 何か;
// // 何かが爬虫類か判定
// if (typeof 何か == N動物.E爬虫類) {
//     console.log("何かは爬虫類です");
// }