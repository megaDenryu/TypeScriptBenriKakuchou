import { z } from "zod";

export class ExtendedWebSocket extends WebSocket {
    sendJson(obj:any) {
        this.send(JSON.stringify(obj));
    }

    /**
     * WebSocketから受け取ったメッセージをzodスキーマを使って検証し、型付きオブジェクトに変換する
     * @param event WebSocketのMessageEvent
     * @param schema 検証に使用するzodスキーマ
     * @returns 検証済みの型付きオブジェクト
     * @throws 検証に失敗した場合、zodのエラーがスローされる
     */
    recieveJsonAsZod<T>(event: MessageEvent, schema: z.ZodType<T>): T {
        try {
            // JSON文字列をオブジェクトに変換
            const data = JSON.parse(event.data as string);
            // zodスキーマでバリデーション
            return schema.parse(data);
        } catch (error) {
            if (error instanceof SyntaxError) {
                // JSON解析エラー
                console.error('受信データのJSON解析に失敗しました:', error);
                throw new Error('受信データの形式が不正です: ' + error.message);
            }
            // zodのバリデーションエラーなどそのまま再スロー
            console.error('データ検証に失敗しました:', error);
            throw error;
        }
    }
}

export class ExtendFunction {
    static uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}

Element.prototype.getFirstHTMLElementByClassName = function (className: string): HTMLElement {
    const element = this.getElementsByClassName(className)[0];
    if (!element) {
        throw new Error(`Element with class name ${className} not found`);
    }
    if (!(element instanceof HTMLElement)) {
        throw new Error(`Element with class name ${className} is not an HTMLElement`);
    }
    return element;
};

Element.prototype.getFirstTextAreaElementByClassName = function (className: string): HTMLTextAreaElement {
    const element = this.getElementsByClassName(className)[0];
    if (!element) {
        throw new Error(`Element with class name ${className} not found`);
    }
    if (!(element instanceof HTMLTextAreaElement)) {
        throw new Error(`Element with class name ${className} is not an HTMLTextAreaElement`);
    }
    return element;
};

