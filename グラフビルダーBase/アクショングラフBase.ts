
//イベントとはプログラムにはobjectおとして現れないのではないか？
//アクションはコールバックと写像が作れる。つまり、「アクションを実行する」と「コールバックを実行する」は変換可能。
//イベントと状態とアクションのうち明確に定義できるものだけを使ったほうが良い。
// まず、以下のような状態と状態が矢印でつながっているモデルを考えると
// 点(state_止まる, アクション_待機モーション).矢印(イベント_上ボタン押す, アクション_).点(state‗歩く, アクション_歩きモーション)
// 点(state_止まる, アクション_待機モーション).矢印(イベント_上ボタン押す, アクション_エンジン).点(state‗歩く, アクション_歩きモーション)

import { 点, 点と見なせる, 線, 線と見なせる} from "./グラフBase";


interface アクション<T> {
    readonly type: string;
    on(value: T):void;
}

interface 状態 {
    readonly type: string;
    readonly prevToThisアクション: アクション<any>;
    readonly thisToNextアクション: アクション<any>
} 

interface イベント {
    readonly type: string;
}

class StateマシーンNode<T> implements 点と見なせる<StateマシーンNode<T>> {
    public readonly 状態: 状態;
    public readonly アクション: アクション<T>;
    public readonly 点:点<StateマシーンNode<T>>
    constructor(状態: 状態,アクション: アクション<T>){
        this.状態 = 状態;
        this.アクション = アクション;
        this.点 = new 点<StateマシーンNode<T>>(this)
    }
    public 接続した時の処理():void{

    }


}

class StateマシーンArrow<T> implements 線と見なせる<StateマシーンArrow<T>> {
    public readonly 状態: 状態;
    public readonly アクション: アクション<T>;
    public readonly 線:線<StateマシーンNode<any>, StateマシーンArrow<T>, StateマシーンNode<any>>
    constructor(状態: 状態,アクション: アクション<T>){
        this.状態 = 状態;
        this.アクション = アクション;
        this.線 = new 線<StateマシーンNode<any>, StateマシーンArrow<T>, StateマシーンNode<any>>(this)
    }
    public 接続した時の処理():void{

    }


}

class Stateマシーングラフ {
    private nodes: StateマシーンNode<any>[] = [];
    private arrows: StateマシーンArrow<any>[] = [];
    private currentState: StateマシーンNode<any> | null = null;
    
    private get 最新のNode() {
        return this.nodes[this.nodes.length - 1];
    }
    
    private get 最新のArrow() {
        return this.arrows[this.arrows.length - 1];
    }

    /**
     * ステートマシンにノード（状態）を追加
     */
    public node<T>(node: StateマシーンNode<T>): StateマシーンArrowBuilder<T> {
        this.nodes.push(node);
        
        // 初回追加時は現在の状態として設定
        if (this.currentState === null) {
            this.currentState = node;
            // 初期状態のアクションを実行
            node.アクション.on(null as any);
        }
        
        return new StateマシーンArrowBuilder(this, node);
    }

    /**
     * 矢印（状態遷移）を追加
     */
    public arrow<T>(arrow: StateマシーンArrow<T>): StateマシーンNodeBuilder<T> {
        this.arrows.push(arrow);
        return new StateマシーンNodeBuilder(this, arrow);
    }

    /**
     * イベントをトリガーして状態遷移を実行
     */
    public trigger(eventType: string): boolean {
        if (!this.currentState) {
            console.warn("現在の状態が設定されていません");
            return false;
        }

        // 現在の状態から出ている矢印を検索
        const transition = this.arrows.find(arrow => 
            arrow.状態.type === eventType && 
            this.getSourceNode(arrow) === this.currentState
        );

        if (transition) {
            const targetNode = this.getTargetNode(transition);
            if (targetNode) {
                // 状態遷移を実行
                console.log(`状態遷移: ${this.currentState.状態.type} -> ${targetNode.状態.type}`);
                
                // 現在の状態のthisToNextアクションを実行
                this.currentState.状態.thisToNextアクション.on(transition);
                
                // 遷移先の状態を現在の状態として設定
                this.currentState = targetNode;
                
                // 新しい状態のprevToThisアクションを実行
                targetNode.状態.prevToThisアクション.on(transition);
                targetNode.アクション.on(null as any);
                
                return true;
            }
        }

        console.warn(`イベント '${eventType}' に対応する状態遷移が見つかりません`);
        return false;
    }

    /**
     * 現在の状態を取得
     */
    public getCurrentState(): StateマシーンNode<any> | null {
        return this.currentState;
    }

    /**
     * すべてのノードを取得
     */
    public getNodes(): readonly StateマシーンNode<any>[] {
        return [...this.nodes];
    }

    /**
     * すべての矢印を取得
     */
    public getArrows(): readonly StateマシーンArrow<any>[] {
        return [...this.arrows];
    }

    /**
     * 矢印の接続元ノードを取得（簡易実装）
     */
    private getSourceNode(arrow: StateマシーンArrow<any>): StateマシーンNode<any> | null {
        // 実際の実装では、矢印とノードの接続関係を管理する仕組みが必要
        // ここでは簡易的に矢印の直前のノードを返す
        const arrowIndex = this.arrows.indexOf(arrow);
        return arrowIndex > 0 ? this.nodes[arrowIndex - 1] : null;
    }

    /**
     * 矢印の接続先ノードを取得（簡易実装）
     */
    private getTargetNode(arrow: StateマシーンArrow<any>): StateマシーンNode<any> | null {
        // 実際の実装では、矢印とノードの接続関係を管理する仕組みが必要
        // ここでは簡易的に矢印の直後のノードを返す
        const arrowIndex = this.arrows.indexOf(arrow);
        return arrowIndex < this.nodes.length - 1 ? this.nodes[arrowIndex + 1] : null;
    }
}

/**
 * ステートマシンのビルダーパターン実装（矢印追加用）
 */
class StateマシーンArrowBuilder<T> {
    constructor(
        private graph: Stateマシーングラフ,
        private currentNode: StateマシーンNode<T>
    ) {}

    public arrow<U>(arrow: StateマシーンArrow<U>): StateマシーンNodeBuilder<U> {
        return this.graph.arrow(arrow);
    }
}

/**
 * ステートマシンのビルダーパターン実装（ノード追加用）
 */
class StateマシーンNodeBuilder<T> {
    constructor(
        private graph: Stateマシーングラフ,
        private currentArrow: StateマシーンArrow<T>
    ) {}

    public node<U>(node: StateマシーンNode<U>): StateマシーンArrowBuilder<U> {
        return this.graph.node(node);
    }
}

// ========== 使用例とテスト ==========

function testStateマシーン() {
    // アクションの実装例
    class 待機モーション implements アクション<null> {
        readonly type = "待機モーション";
        on(value: null): void {
            console.log("🧍 待機モーション実行中...");
        }
    }

    class 歩きモーション implements アクション<null> {
        readonly type = "歩きモーション";
        on(value: null): void {
            console.log("🚶 歩きモーション実行中...");
        }
    }

    class 走りモーション implements アクション<null> {
        readonly type = "走りモーション";
        on(value: null): void {
            console.log("🏃 走りモーション実行中...");
        }
    }

    // 状態の実装例
    const 止まる状態: 状態 = {
        type: "止まる",
        prevToThisアクション: new 待機モーション(),
        thisToNextアクション: new 待機モーション()
    };

    const 歩く状態: 状態 = {
        type: "歩く",
        prevToThisアクション: new 歩きモーション(),
        thisToNextアクション: new 歩きモーション()
    };

    const 走る状態: 状態 = {
        type: "走る",
        prevToThisアクション: new 走りモーション(),
        thisToNextアクション: new 走りモーション()
    };

    // ノードとアローの作成
    const 止まるNode = new StateマシーンNode(止まる状態, new 待機モーション());
    const 歩くNode = new StateマシーンNode(歩く状態, new 歩きモーション());
    const 走るNode = new StateマシーンNode(走る状態, new 走りモーション());

    const 上ボタン押す遷移 = new StateマシーンArrow(
        { type: "上ボタン押す", prevToThisアクション: new 歩きモーション(), thisToNextアクション: new 歩きモーション() },
        new 歩きモーション()
    );

    const シフト押す遷移 = new StateマシーンArrow(
        { type: "シフト押す", prevToThisアクション: new 走りモーション(), thisToNextアクション: new 走りモーション() },
        new 走りモーション()
    );

    const 停止遷移 = new StateマシーンArrow(
        { type: "停止", prevToThisアクション: new 待機モーション(), thisToNextアクション: new 待機モーション() },
        new 待機モーション()
    );

    // ステートマシングラフの構築
    console.log("=== ステートマシン構築 ===");
    const stateMachine = new Stateマシーングラフ();
    
    stateMachine
        .node(止まるNode)
        .arrow(上ボタン押す遷移)
        .node(歩くNode)
        .arrow(シフト押す遷移)
        .node(走るNode)
        .arrow(停止遷移)
        .node(止まるNode);

    console.log(`現在の状態: ${stateMachine.getCurrentState()?.状態.type}`);

    // イベントのトリガーテスト
    console.log("\n=== 状態遷移テスト ===");
    
    console.log("1. 上ボタン押すイベント発生");
    stateMachine.trigger("上ボタン押す");
    console.log(`現在の状態: ${stateMachine.getCurrentState()?.状態.type}`);

    console.log("\n2. シフト押すイベント発生");
    stateMachine.trigger("シフト押す");
    console.log(`現在の状態: ${stateMachine.getCurrentState()?.状態.type}`);

    console.log("\n3. 停止イベント発生");
    stateMachine.trigger("停止");
    console.log(`現在の状態: ${stateMachine.getCurrentState()?.状態.type}`);

    console.log("\n4. 存在しないイベント発生");
    stateMachine.trigger("ジャンプ");
    console.log(`現在の状態: ${stateMachine.getCurrentState()?.状態.type}`);

    // グラフの情報表示
    console.log("\n=== ステートマシン情報 ===");
    console.log(`ノード数: ${stateMachine.getNodes().length}`);
    console.log(`矢印数: ${stateMachine.getArrows().length}`);
    console.log("ノード一覧:", stateMachine.getNodes().map(n => n.状態.type));
    console.log("矢印一覧:", stateMachine.getArrows().map(a => a.状態.type));
}