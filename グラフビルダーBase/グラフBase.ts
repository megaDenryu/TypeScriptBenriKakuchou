
export interface I接続可能 {
    onConnect(接続した物: any): void;
}

export declare const PointBrand: unique symbol;

export interface I点 extends I接続可能 {
    readonly [PointBrand]: void;

}

export interface 点と見なせる<Self extends 点と見なせる<Self>> {
    get 点(): 点<Self>;
    接続した時の処理(接続した物: 線と見なせる<any>): void;
}

export class 点<この点を所有するクラス extends 点と見なせる<この点を所有するクラス>> implements 点と見なせる<この点を所有するクラス> { 
    public readonly data: この点を所有するクラス
    constructor(data: この点を所有するクラス) {
        this.data = data;
    }
    public get 点(): 点<この点を所有するクラス> { return this; }
    public 接続した時の処理(接続した物: 線と見なせる<any>): void {
        this.data.接続した時の処理(接続した物);
    }
    exec(func: (self: 点<この点を所有するクラス>) => void):  点<この点を所有するクラス> {
        func(this);
        return this;
    }
}

export interface 線と見なせる<Self extends 線と見なせる<Self>> {
    get 線(): 線<点と見なせる<any>, Self, 点と見なせる<any>>;
    接続した時の処理(接続した物: 点と見なせる<any>): void;
}

export class 線<始点のクラス extends 点と見なせる<any>, この線を所有するクラス extends 線と見なせる<この線を所有するクラス>, 終点のクラス extends 点と見なせる<any>> implements 線と見なせる<この線を所有するクラス> {
    点1: 始点のクラス;
    点2: 終点のクラス;
    public readonly data: この線を所有するクラス;
    constructor(data: この線を所有するクラス) {
        this.data = data;
    }
    public get 線(): 線<始点のクラス, この線を所有するクラス, 終点のクラス> { return this; }
    public 接続した時の処理(接続した物: 点と見なせる<any>): void {
        this.data.接続した時の処理(接続した物);
    }
    exec(func: (self: 線<始点のクラス, この線を所有するクラス, 終点のクラス>) => void):  線<始点のクラス, この線を所有するクラス, 終点のクラス>{
        func(this);
        return this;
    }
    
}

export interface 点と接続可能<Self extends 点と接続可能<Self>> {
    点<P extends 点と見なせる<P>>(点: P): 線と接続可能<any>;
}

export interface 線と接続可能<Self extends 線と接続可能<Self>> {
    線<L extends 線と見なせる<L>>(線: L): 点と接続可能<any>;
    分岐(コールバックリスト: ((self:線と接続可能<Self>)=>void)[]): void;
}



export class 最も単純なグラフの例 {
    private 点のリスト: 点と見なせる<any>[] = [];
    private get 最新の点() {
        return this.点のリスト[this.点のリスト.length - 1];
    }
    private 線のリスト: 線と見なせる<any>[] = [];
    private get 最新の線() {
        return this.線のリスト[this.線のリスト.length - 1];
    }

    点<P extends 点と見なせる<P>>(点と見なせる: P): 線と接続可能<any> {
        this.点のリスト.push(点と見なせる.点);
        点と見なせる.接続した時の処理(this.最新の線);
        return this;
    }

    線<L extends 線と見なせる<L>>(線と見なせる: L): 点と接続可能<any> {
        this.線のリスト.push(線と見なせる.線);
        線と見なせる.接続した時の処理(this.最新の点);
        return this;
    }

    分岐(コールバックリスト: ((self:線と接続可能<any>)=>void)[]):void{
        for (const コールバック of コールバックリスト) {
            const a = コールバック(this);
        }
    }
}



function test() {
    class 付箋 implements 点と見なせる<付箋> {
        点: 点<付箋>
        内容: string = "";
        constructor(内容: string = "") {
            this.点 = new 点<付箋>(this);
            this.内容 = 内容;
        }
        接続した時の処理(接続した物: 線と見なせる<any>): void {
            console.log("付箋が接続されました", 接続した物);
        }
    }

    class 折れ線矢印 implements 線と見なせる<折れ線矢印> {
        線: 線<付箋, 折れ線矢印, 付箋>
        線の意味: string = "";
        constructor(線の意味: string = "") {
            this.線 = new 線<付箋, 折れ線矢印, 付箋>(this);
            this.線の意味 = 線の意味;
        }
        接続した時の処理(接続した物: 点と見なせる<any>): void {
            console.log("折れ線矢印が接続されました", 接続した物);
        }
    }

    // 🌱 農業の成長サイクルグラフ
    
    // 状態を表す付箋を作成
    const 種まき = new 付箋("🌱 種まき");
    const 発芽 = new 付箋("🌿 発芽");
    const 成長 = new 付箋("🌾 成長");
    const 開花 = new 付箋("🌸 開花");
    const 実つけ = new 付箋("🍎 実つけ");
    const 収穫 = new 付箋("📦 収穫");
    const 土作り = new 付箋("🚜 土作り");
    const 肥料やり = new 付箋("💧 肥料やり");
    const 害虫駆除 = new 付箋("🐛 害虫駆除");
    const 剪定 = new 付箋("✂️ 剪定");
    
    // プロセスを表す矢印を作成
    const 水やり = new 折れ線矢印("💧 水やり");
    const 日光浴び = new 折れ線矢印("☀️ 日光を浴びる");
    const 栄養吸収 = new 折れ線矢印("🌿 栄養を吸収");
    const 花咲く = new 折れ線矢印("🌸 花が咲く");
    const 実がなる = new 折れ線矢印("🍎 実がなる");
    const 収穫する = new 折れ線矢印("📦 収穫する");
    const 再播種 = new 折れ線矢印("🔄 新しい種をまく");
    const 土壌改良 = new 折れ線矢印("🚜 土壌を改良");
    const 施肥 = new 折れ線矢印("💧 肥料を与える");
    const 防虫 = new 折れ線矢印("🐛 害虫を防ぐ");

    const 農業グラフ = new 最も単純なグラフの例();
    
    // 🌱 農業サイクルの複雑なグラフを構築
    農業グラフ.点(種まき).分岐([
        // メインの成長サイクル
        (種まき) => {
            種まき.線(水やり).点(発芽).分岐([
                // 順調な成長パス
                (発芽) => {
                    発芽.線(日光浴び).点(成長).分岐([
                        // 開花への道
                        (成長) => {
                            成長.線(栄養吸収).点(開花).分岐([
                                (開花) => {開花.線(花咲く).点(実つけ).線(実がなる).点(収穫)},
                                (開花) => {開花.線(new 折れ線矢印("🌸 花が散る")).点(new 付箋("🍂 落花"))}
                            ])
                        },
                        // 直接収穫パス（葉物野菜など）
                        (成長) => {
                            成長.線(new 折れ線矢印("🥬 葉物収穫")).点(new 付箋("🥗 葉物野菜"))
                        }
                    ])
                },
                // メンテナンスが必要な場合
                (発芽) => {
                    発芽.線(new 折れ線矢印("⚠️ 問題発生")).点(new 付箋("🔧 メンテナンス")).分岐([
                        (メンテナンス) => {メンテナンス.線(施肥).点(肥料やり).線(new 折れ線矢印("💪 回復")).点(成長)},
                        (メンテナンス) => {メンテナンス.線(防虫).点(害虫駆除).線(new 折れ線矢印("🛡️ 保護")).点(成長)},
                        (メンテナンス) => {メンテナンス.線(new 折れ線矢印("✂️ 手入れ")).点(剪定).線(new 折れ線矢印("🌿 新芽")).点(成長)}
                    ])
                }
            ])
        },
        
        // 土壌準備パス
        (種まき) => {
            種まき.線(土壌改良).点(土作り).分岐([
                (土作り) => {土作り.線(new 折れ線矢印("🌱 再播種")).点(new 付箋("🌱 新しい種"))},
                (土作り) => {土作り.線(new 折れ線矢印("🌿 植え替え")).点(new 付箋("🪴 苗移植"))}
            ])
        },
        
        // 次のシーズン準備
        (種まき) => {
            種まき.線(new 折れ線矢印("📅 季節の準備")).点(new 付箋("🗓️ 次シーズン")).分岐([
                (次シーズン) => {次シーズン.線(new 折れ線矢印("❄️ 越冬準備")).点(new 付箋("🧥 防寒対策"))},
                (次シーズン) => {次シーズン.線(new 折れ線矢印("🌞 春の準備")).点(new 付箋("🌱 春まき準備"))},
                (次シーズン) => {次シーズン.線(new 折れ線矢印("🍂 秋の準備")).点(new 付箋("🌾 秋まき準備"))}
            ])
        }
    ]);

    const 圏 =new 最も単純なグラフの例().点(new 付箋("対象1")).分岐(
        [
            (対象1) => {対象1.線(new 折れ線矢印("射1")).点(new 付箋("対象3"))},
            (対象1) => {対象1.線(new 折れ線矢印("射2")).点(new 付箋("対象2"))},
            (対象1) => {対象1.線(new 折れ線矢印("射3")).点(new 付箋("対象4"))}
        ]
    )
    
    console.log("🌱 農業サイクルグラフが完成しました！");
    console.log("📊 このグラフは以下の要素を含んでいます：");
    console.log(`   🌱 植物の状態: ${種まき.内容}, ${発芽.内容}, ${成長.内容}, ${開花.内容}, ${実つけ.内容}, ${収穫.内容}`);
    console.log(`   💧 作業プロセス: ${水やり.線の意味}, ${日光浴び.線の意味}, ${栄養吸収.線の意味}`);
    console.log(`   🔧 メンテナンス: ${肥料やり.内容}, ${害虫駆除.内容}, ${剪定.内容}`);
    console.log("✨ 複雑な分岐により、様々な成長パスと問題対応が表現されています！");
}
