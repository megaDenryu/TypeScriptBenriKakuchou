import { 点, 点と接続可能, 点と見なせる, 線, 線と接続可能, 線と見なせる } from "./グラフBase";

export class 対象 implements 点と見なせる<対象> {
    public readonly 点: 点<対象>;
    public readonly 恒等射: 射;

    constructor(){
        this.点 = new 点<対象>(this)
        this.恒等射 = new 射(); // この対象に固有の恒等射
    }
    接続した時の処理(接続した物: 線と見なせる<any>):void {

    }
}

export class 射 implements 線と見なせる<射> {
    public readonly 線: 線<対象,射,対象>;
    constructor(){
        this.線 = new 線<対象,射,対象>(this);
    }
    接続した時の処理(接続した物: 点と見なせる<any>):void {

    }
}



// export class 圏 implements 線と接続可能<圏>,点と接続可能<圏>{
//     private 点のリスト: 対象[] = [];
//     private get 最新の点() {
//         return this.点のリスト[this.点のリスト.length - 1];
//     }
//     private 線のリスト: 射[] = [];
//     private get 最新の線() {
//         return this.線のリスト[this.線のリスト.length - 1];
//     }

//     点(点と見なせる: 対象): 線と接続可能<圏> {
//         this.点のリスト.push(点と見なせる);
//         点と見なせる.接続した時の処理(this.最新の線);
//         return this;
//     }

//     線(線と見なせる: 射): 点と接続可能<圏> {
//         this.線のリスト.push(線と見なせる.線);
//         線と見なせる.接続した時の処理(this.最新の点);
//         return this;
//     }

//     分岐(コールバックリスト: ((self:線と接続可能)=>void)[]):void{
//         for (const コールバック of コールバックリスト) {
//             const a = コールバック(this);
//         }
//     }
// }



