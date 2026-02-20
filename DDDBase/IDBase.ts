import { ExtendFunction } from "../extend";

export abstract class IDBase自動採番<Brand extends string, Self extends IDBase自動採番<Brand, Self>> {
    public readonly id: string;
    protected readonly _brand!: Brand; // 型のマーカー
    constructor(id?:string) {
        this.id = id ?? ExtendFunction.uuid();
    }

    equal(other: Self):boolean { return this.id == other.id }
}
export abstract class IDBase手動設定 {
    public readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}

export class IDMap< ID extends IDBase自動採番<string, any>, T> {
    private map: Map<string, T> = new Map();
    
    public get(id: ID): T | undefined {
        return this.map.get(id.id);
    }

    public set(id: ID, value: T): this {
        this.map.set(id.id, value);
        return this;
    }

    public delete(id: ID): boolean {
        return this.map.delete(id.id);
    }

    public has(id: ID): boolean {
        return this.map.has(id.id);
    }

    public hasString(id: string): boolean {
        return this.map.has(id);
    }

    public clear(): void {
        this.map.clear();
    }

    public get size(): number {
        return this.map.size;
    }

    public values(): IterableIterator<T> {
        return this.map.values();
    }

    /**
     * IDの文字列表現のイテレータを取得
     * 注意: 元のIDオブジェクトではなく、文字列のIDが返される
     */
    public idStrings(): IterableIterator<string> {
        return this.map.keys();
    }

    /** 生のid文字列で存在確認する。instanceof分岐なしに異種IDMapを横断検索するためのエスケープハッチ */
    public hasString(id: string): boolean {
        return this.map.has(id);
    }
}