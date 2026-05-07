import { RequestAPI } from "./RequestApi";

export type クライアントログレベル = "debug" | "info" | "warn" | "error";

export interface クライアントログオプション {
    detail?: string;
    extra?: Record<string, string | number | boolean>;
    captureStack?: boolean;
}

/**
 * クライアントからサーバーにログを送り、テキストファイル (`logs/client_log.txt`) に
 * 残してもらうためのヘルパー。
 *
 * Why: ブラウザはローカルファイルに直接書き込めないので、サーバーを経由して
 * 後から読み返せる形のテキストに残す。デバッグ・調査・実験的なメトリクス収集
 * などに使う。送信失敗はサイレントに飲み込む (ロガー自身がアプリの妨げになるのを避けるため)。
 */
export class ClientLog {
    private static readonly endpoint = "client_log";
    private static enabled = true;

    public static disable(): void { this.enabled = false; }
    public static enable(): void { this.enabled = true; }

    public static debug(tag: string, options: クライアントログオプション = {}): void {
        this.send("debug", tag, options);
    }
    public static info(tag: string, options: クライアントログオプション = {}): void {
        this.send("info", tag, options);
    }
    public static warn(tag: string, options: クライアントログオプション = {}): void {
        this.send("warn", tag, options);
    }
    public static error(tag: string, options: クライアントログオプション = {}): void {
        this.send("error", tag, options);
    }

    /**
     * スタックトレース付きで debug レベルのログを送る。
     * 「誰がここを呼んだか」を後から追いたいときに使う。
     */
    public static trace(tag: string, options: クライアントログオプション = {}): void {
        this.send("debug", tag, { ...options, captureStack: true });
    }

    private static send(
        level: クライアントログレベル,
        tag: string,
        options: クライアントログオプション,
    ): void {
        if (!this.enabled) return;
        const stack = options.captureStack ? (new Error().stack ?? "") : "";
        void RequestAPI.postRequest2(this.endpoint, {
            level,
            tag,
            detail: options.detail ?? "",
            stack,
            extra: options.extra ?? {},
        }).catch(() => { /* ロガー自身の不調はアプリ側に伝えない */ });
    }
}
