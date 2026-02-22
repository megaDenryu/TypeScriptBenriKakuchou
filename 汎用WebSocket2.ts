/**
 * 汎用WebSocket2.ts
 * 
 * 汎用WebSocketの共通基盤クラス
 * AppVoiroStudioとLauncherの両方で使用可能な型安全な設計
 * 
 * 責務:
 * - WebSocket接続の管理（受信専用）
 * - Zodによる実行時型検証
 * - データタイプによる処理振り分けの委譲
 * 
 * 設計思想:
 * - 受信とパース処理は共通化
 * - typeSwitch処理は外部から注入（戦略パターン）
 * - Zodスキーマも外部から注入（型パラメータで保証）
 */

import { z } from "zod";
import { ExtendedWebSocket } from "./extend";

/**
 * 汎用WebSocketの設定インターフェース
 * @template TMessage パース後のメッセージ型（Zodスキーマから推論）
 */
export interface 汎用WebSocket2Config<TMessage> {
    /** WebSocket接続URL */
    url: string;

    /** Zodスキーマ（実行時型検証用） */
    schema: z.ZodType<TMessage>;

    /** メッセージ振り分けハンドラー（戦略パターン） */
    messageHandler: (message: TMessage) => void;

    /** 接続成功時のコールバック（オプション） */
    onOpen?: () => void;

    /** 接続切断時のコールバック（オプション） */
    onClose?: () => void;

    /** エラー発生時のコールバック（オプション） */
    onError?: (error: Event) => void;

    /** 自動再接続を有効にするか（デフォルト: true） */
    reconnect?: boolean;

    /** 再接続の初期間隔（ミリ秒、デフォルト: 1000） */
    reconnectIntervalMs?: number;

    /** 再接続の最大間隔（ミリ秒、デフォルト: 30000） */
    maxReconnectIntervalMs?: number;
}

/**
 * 汎用WebSocket2 - 型安全な汎用WebSocket基盤クラス
 * 
 * @template TMessage パース後のメッセージ型
 * 
 * 使用例:
 * ```typescript
 * const ws = new 汎用WebSocket2({
 *     url: `ws://localhost:8000/generalPurPoseWs/${clientId}`,
 *     schema: MyMessageSchema,
 *     messageHandler: (message) => {
 *         // messageの型はTMessageとして推論される
 *         switch (message.type) {
 *             case "TypeA": handleTypeA(message.data); break;
 *             case "TypeB": handleTypeB(message.data); break;
 *         }
 *     }
 * });
 * ```
 */
export class 汎用WebSocket2<TMessage> {
    private _socket: ExtendedWebSocket;
    private _config: 汎用WebSocket2Config<TMessage>;
    /** 手動 close() が呼ばれた場合は再接続しない */
    private _intentionalClose: boolean = false;
    /** 現在の再接続待機間隔（指数バックオフ用） */
    private _currentReconnectInterval: number;
    /** 再接続タイマーID */
    private _reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(config: 汎用WebSocket2Config<TMessage>) {
        this._config = config;
        this._currentReconnectInterval = config.reconnectIntervalMs ?? 1000;
        this._socket = new ExtendedWebSocket(config.url);
        this.setupHandlers();
    }

    /**
     * WebSocketのイベントハンドラーを設定
     */
    private setupHandlers(): void {
        this._socket.onopen = () => {
            console.log('汎用WebSocket2: 接続成功', this._config.url);
            // 接続成功したら再接続間隔をリセット
            this._currentReconnectInterval = this._config.reconnectIntervalMs ?? 1000;
            if (this._config.onOpen) {
                this._config.onOpen();
            }
        };

        this._socket.onmessage = (event) => {
            try {
                // Zodスキーマによる実行時型検証
                const message = this._socket.recieveJsonAsZod<TMessage>(event, this._config.schema);

                // 外部から注入されたハンドラーに処理を委譲
                this._config.messageHandler(message);

            } catch (error) {
                console.error('汎用WebSocket2: メッセージ解析・検証エラー', error);
                if (error instanceof Error) {
                    console.error('エラー詳細:', error.message);
                }
            }
        };

        this._socket.onclose = () => {
            console.log('汎用WebSocket2: 接続が閉じられました');
            if (this._config.onClose) {
                this._config.onClose();
            }
            this.scheduleReconnect();
        };

        this._socket.onerror = (error) => {
            console.error('汎用WebSocket2: エラー', error);
            if (this._config.onError) {
                this._config.onError(error);
            }
        };
    }

    /**
     * 自動再接続をスケジュールする（指数バックオフ）
     */
    private scheduleReconnect(): void {
        // 手動で close() が呼ばれた場合、または reconnect が無効の場合は再接続しない
        if (this._intentionalClose) {
            return;
        }
        const shouldReconnect = this._config.reconnect ?? true;
        if (!shouldReconnect) {
            return;
        }

        const maxInterval = this._config.maxReconnectIntervalMs ?? 30000;
        const interval = Math.min(this._currentReconnectInterval, maxInterval);

        console.log(`汎用WebSocket2: ${interval}ms 後に再接続を試みます...`);
        this._reconnectTimer = setTimeout(() => {
            console.log('汎用WebSocket2: 再接続中...', this._config.url);
            // 指数バックオフ: 次回は間隔を倍にする
            this._currentReconnectInterval = Math.min(this._currentReconnectInterval * 2, maxInterval);
            // 新しいWebSocketインスタンスを生成してハンドラーを再設定
            this._socket = new ExtendedWebSocket(this._config.url);
            this.setupHandlers();
        }, interval);
    }

    /**
     * WebSocket接続を閉じる（手動呼び出し時は再接続しない）
     */
    public close(): void {
        this._intentionalClose = true;
        if (this._reconnectTimer !== null) {
            clearTimeout(this._reconnectTimer);
            this._reconnectTimer = null;
        }
        if (this._socket) {
            this._socket.close();
        }
    }

    /**
     * データをJSONとして送信
     */
    public send(data: unknown): void {
        if (this._socket.readyState === WebSocket.OPEN) {
            this._socket.sendJson(data);
        } else {
            console.warn('汎用WebSocket2: 接続が開いていないため送信できません', data);
        }
    }

    /**
     * 接続状態を取得
     */
    public get readyState(): number {
        return this._socket.readyState;
    }
}
