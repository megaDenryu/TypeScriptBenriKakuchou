
export type Action<Input = void> = (input:Input) => void;
export type AsyncAction<Input = void> = (input:Input) => Promise<void>;
export type Func<Input,Output> = (input: Input) => Output;
export type AsyncFunc<Input,Output> = (input: Input) => Promise<Output>;

export interface 実行可能<T>{
    exec(value: T):void;
}
export interface メソッド登録可能<T>{
    addMethod(func: Action<T>):void;
}
export class Delegator<T> implements 実行可能<T>,メソッド登録可能<T>{
    private _methods:Action<T>[];
    constructor() {
        this._methods = []
    }
    public exec(value: T):void {for(const method of this._methods){method(value);}}
    public addMethod(func: Action<T>){this._methods.push(func);}
}


export enum CallBack目的enum {
    onChangeCallBack = "onChangeCallBack",
    onSetValueCallBack = "onSetValueCallBack"
}

export interface 目的別CallBack<InputModel>{
    onChangeCallBack?:Action<InputModel>;
    onSetValueCallBack?:Action<InputModel>;
}

export interface 目的別メソッド登録可能<InputModel>{
    addMethod(funcpair: 目的別CallBack<InputModel>):void;
}

export class 目的別Delegator<InputModel> implements 目的別メソッド登録可能<InputModel> {
    private _callBacks: 目的別CallBack<InputModel>[];
    constructor() {
        this._callBacks = []
    }
    public exec(value: InputModel, 目的:CallBack目的enum):void {
        for(const method of this._callBacks){
            method[目的]?.(value);
        }
    }
    public addMethod(funcpair: 目的別CallBack<InputModel>){this._callBacks.push(funcpair);}
}

export interface ReadOnlyViewModel{
    // Viewに表示するデータの構造。readonlyであることが望ましい
}

export interface View<VM extends ReadOnlyViewModel> extends 目的別メソッド登録可能<VM>{
    getVM(): VM ;
    setVM(value: VM) : void ;
}

export interface BackendBehavior<VM extends ReadOnlyViewModel>{
    // Viewの後ろで動く振る舞い。例えばwebAPIの呼び出しや、DBアクセスなど
    ViewModelを受け取る(value: VM): void;
}

/**
 * # メッセージングの流れ
 *  V --> VM --> BackendBehavior
 * 
 * # 依存の流れ
 * V --> VM 
 * backendBehavior --> VM
 */

export function linkVBB<VM extends ReadOnlyViewModel>(view: View<VM>, backendBehavior: BackendBehavior<VM>) {
    view.addMethod(
        {
            onChangeCallBack:(value) => { backendBehavior.ViewModelを受け取る(value);}
        }
    );
}