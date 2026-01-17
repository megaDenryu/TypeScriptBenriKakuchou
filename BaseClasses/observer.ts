export class ReactiveProperty<T> {
    private _property: T;

    constructor(value: T) {
        this._property = value;
    }

    private get property(): T {
        return this._property;
    }

    private set property(value: T) {
        this._property = value;
    }

    private methods: Array<(value: T) => void> = [];

    private executeMethods(value: T): this {
        for (let i = 0; i < this.methods.length; i++) {
            this.methods[i](value);
        }
        return this;
    }

    public get(): T {
        return this._property;
    }

    public set(value: T): this {
        this.property = value;
        this.executeMethods(value);
        return this;
    }

    public setWithoutEvent(value: T): this {
        this._property = value;
        return this;
    }

    public addMethod(event: (value :T) => void): this {
        this.methods.push(event);
        return this;
    }

    public clearMethods(): this {
        this.methods = [];
        return this;
    }
}