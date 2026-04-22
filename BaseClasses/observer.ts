/**
 * 購読を解除するためのハンドル。
 * [[IReadableReactive.subscribe]] の戻り値として返される。
 */
export interface I購読 {
    解除(): void;
}

/**
 * 読み取り専用リアクティブプロパティ。
 *
 * [[ReactiveProperty]] と [[DerivedReactiveProperty]] の両方が実装する共通インターフェース。
 * View層がソースの具体型（書き込み可能か派生か）を意識せず、値の取得と購読だけを扱えるようにする。
 */
export interface IReadableReactive<T> {
    get(): T;
    /**
     * 値変更時に呼ばれる関数を登録する。
     * @returns 購読解除用のハンドル。View破棄時に 解除() を呼ぶこと。
     */
    subscribe(fn: (value: T, previousValue: T) => void): I購読;
}

/**
 * 派生セルのソースとして使える「1段目のセル」であることを示すブランド付きインターフェース。
 *
 * [[ReactiveProperty]] のみが実装する。
 * [[DerivedReactiveProperty.constructor]] の `sources` 引数は本インターフェースを要求することで、
 * 派生セルから派生セルを作る多段チェーンを型レベルで禁止する。
 *
 * T の共変性を保つため property シグネチャは method 記法で揃え、
 * `IRxPrimitive<string>` を `IRxPrimitive<unknown>` へ代入可能にする。
 */
export interface IRxPrimitive<T> extends IReadableReactive<T> {
    readonly __rxPrimitive: true;
}

/**
 * 書き込み可能なリアクティブプロパティ。
 *
 * 単一の値を保持し、set() で値が変わったとき購読者に通知する。
 * UniRx の BehaviorSubject 相当だが、map/filter/merge 等のオペレータは意図的に持たない。
 *
 * ## 正しい使い方
 *
 * ```typescript
 * const count = new ReactiveProperty<number>(0);
 * const subscription = count.subscribe((v, prev) => console.log(`${prev} -> ${v}`));
 * count.set(1);  // "0 -> 1" が出力される
 * subscription.解除();  // View破棄時など
 * ```
 *
 * ## 避けるべき使い方
 *
 * - 購読者の中で他の ReactiveProperty.set を呼ぶ（再入・循環更新の温床）
 * - set の前後にバリデーションや API 呼び出しを挟む（set は純粋に値の差し替えに留める）
 * - 派生値を作るときに addMethod で手動連鎖させる（代わりに [[DerivedReactiveProperty]] を使う）
 */
export class ReactiveProperty<T> implements IRxPrimitive<T> {
    /** [[IRxPrimitive]] のブランド。[[DerivedReactiveProperty]] の sources に渡せるのは本クラスだけ。 */
    public readonly __rxPrimitive = true as const;

    private _value: T;
    private readonly _subscribers = new Map<symbol, (value: T, previousValue: T) => void>();

    constructor(initialValue: T) {
        this._value = initialValue;
    }

    public get(): T {
        return this._value;
    }

    public set(value: T): this {
        const previousValue = this._value;
        this._value = value;
        for (const fn of this._subscribers.values()) {
            fn(value, previousValue);
        }
        return this;
    }

    /**
     * 購読者に通知せずに値だけ更新する。初期化時やバッチ更新の途中などで使う。
     */
    public setWithoutEvent(value: T): this {
        this._value = value;
        return this;
    }

    /**
     * 値変更時のハンドラを登録する。戻り値の 解除() で個別に購読解除できる。
     */
    public subscribe(fn: (value: T, previousValue: T) => void): I購読 {
        const token = Symbol();
        this._subscribers.set(token, fn);
        return {
            解除: () => {
                this._subscribers.delete(token);
            },
        };
    }

    /**
     * @deprecated 個別解除ができないため非推奨。`subscribe(fn)` を使い、戻り値の 解除() で個別解除すること。
     * 互換のため残しているが新規コードでは使わない。
     */
    public addMethod(event: (value: T) => void): this {
        this.subscribe((v, _prev) => event(v));
        return this;
    }

    /**
     * @deprecated 全購読者を一括削除する。通常は subscribe の戻り値で個別解除すること。
     * 互換のため残しているが新規コードでは使わない。
     */
    public clearMethods(): this {
        this._subscribers.clear();
        return this;
    }
}

/**
 * 派生リアクティブプロパティ。N個のソースから純粋関数で1個の値を導出する。
 *
 * ## 守るべき4つの制約
 *
 * 1. **compute は純粋関数であること。** 副作用（DOM操作・API呼び出し・タイマー等）禁止。
 * 2. **1段のみ。** `sources` には [[ReactiveProperty]] しか渡せない（型で強制）。
 *    DerivedReactiveProperty 自身をソースに指定するとコンパイルエラー。
 *    これにより「派生から派生を作る多段チェーン」が構造的に書けない設計。
 * 3. **同期のみ。** compute は同期で値を返すこと。async 関数を渡すと型エラーになる。
 * 4. **View破棄時は dispose() を呼ぶこと。** ソースへの購読がリークする。
 *
 * ## 典型的な使い方
 *
 * ```typescript
 * const selected = new ReactiveProperty<string | null>(null);
 * const amount = new ReactiveProperty<number>(0);
 *
 * const canSave = new DerivedReactiveProperty(
 *     () => selected.get() !== null && amount.get() > 0,
 *     [selected, amount],
 * );
 *
 * const subscription = canSave.subscribe(v => saveButton.disabled = !v);
 *
 * // View破棄時
 * subscription.解除();
 * canSave.dispose();
 * ```
 *
 * ## 避けるべき使い方（Rx系で頻出するアンチパターン）
 *
 * - 派生から派生を作る（型で弾かれる）
 * - compute 内で fetch や DOM 操作をする
 * - throttle / debounce / delay 等のタイミング操作を挟む（このクラスは提供しない）
 * - 非同期で値を計算する
 */
export class DerivedReactiveProperty<T> implements IReadableReactive<T> {
    private readonly _computed: ReactiveProperty<T>;
    private readonly _subscriptions: I購読[] = [];

    /**
     * @param compute 純粋関数。副作用・非同期・タイマー禁止
     * @param sources ソースセル群。[[IRxPrimitive]] を実装する [[ReactiveProperty]] のみ受け付ける。
     *                [[DerivedReactiveProperty]] 自身は [[IRxPrimitive]] を実装しないので
     *                派生セルから派生セルを作る多段チェーンが型レベルで禁止される。
     */
    constructor(
        compute: () => T,
        sources: readonly IRxPrimitive<unknown>[],
    ) {
        this._computed = new ReactiveProperty(compute());
        for (const src of sources) {
            this._subscriptions.push(
                src.subscribe(() => {
                    this._computed.set(compute());
                }),
            );
        }
    }

    public get(): T {
        return this._computed.get();
    }

    public subscribe(fn: (value: T, previousValue: T) => void): I購読 {
        return this._computed.subscribe(fn);
    }

    /**
     * ソースへの購読を全て解除する。View破棄時に必ず呼ぶこと（呼ばないとソースが本派生を保持し続けてメモリリーク）。
     */
    public dispose(): void {
        for (const sub of this._subscriptions) {
            sub.解除();
        }
        this._subscriptions.length = 0;
    }
}
