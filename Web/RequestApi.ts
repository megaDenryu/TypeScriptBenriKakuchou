import { HttpClient } from "./HttpClient";
import { RetryHandler } from "./RetryHandler";

export type ClientId = string//&{ readonly brand: unique symbol };

export type URLBaseInfo = {
    localhost: string;
    port: string;
    client_id: string;
}

export class RequestAPI {
    private static _port: string | null = "8010";
    private static _localhost: string | null = "localhost";
    private static _client_id: ClientId | null = null;

    static get port(): string {
        if (this._port === null) { throw new Error("port is not set"); }
        return this._port;
    }

    static get localhost(): string {
        if (this._localhost === null) { throw new Error("localhost is not set"); }
        return this._localhost;
    }

    static get client_id(): ClientId {
        if (this._client_id === null) { throw new Error("client_id is not set"); }
        return this._client_id;
    }

    static get rootURL(): string {
        return `http://localhost:${this.port}/`;
    }

    static get origin(): string {
        return `http://localhost:${this.port}`;
    }

    public static init(urlBaseInfo: URLBaseInfo): void {
        this._port = urlBaseInfo.port;
        this._localhost = urlBaseInfo.localhost;
        this._client_id = urlBaseInfo.client_id;
    }

    // メインのリクエストメソッド
    public static async postRequest2<T extends Record<string, any>>(
        endPoint: string,
        data: object,
        retries: number = 3,
        timeout: number = 30000
    ): Promise<T> {
        return RetryHandler.withRetry(async () => {
            const response = await HttpClient.makeRequest(
                this.rootURL + endPoint,
                data,
                timeout
            );
            return HttpClient.handleResponse<T>(response);
        }, retries);
    }

    // FormData用のメソッド
    public static async postFormData<T>(
        endPoint: string,
        data: FormData,
        timeout: number = 60000
    ): Promise<T> {
        const response = await HttpClient.makeRequest(
            this.rootURL + endPoint,
            data,
            timeout
        );
        return HttpClient.handleResponse<T>(response);
    }

    static get urlBaseInfo(): URLBaseInfo {
        return {
            localhost: this.localhost,
            port: this.port,
            client_id: this.client_id
        };
    }
}