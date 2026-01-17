import { ErrorHandler } from "./ErrorHandler";

// HTTP通信を担当するクラス
export class HttpClient {
    private static async createFetchOptions(
        data?: object | FormData, 
        timeout: number = 30000
    ): Promise<{ options: RequestInit; controller: AbortController; timeoutId: NodeJS.Timeout }> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const options: RequestInit = {
            method: 'POST',
            signal: controller.signal
        };

        if (data instanceof FormData) {
            options.body = data;
        } else if (data) {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(data);
        }

        return { options, controller, timeoutId };
    }

    public static async makeRequest(
        url: string, 
        data?: object | FormData, 
        timeout: number = 30000
    ): Promise<Response> {
        const { options, controller, timeoutId } = await this.createFetchOptions(data, timeout);
        
        try {
            const response = await fetch(url, options);
            clearTimeout(timeoutId);
            return response;
        } catch (error: unknown) {
            clearTimeout(timeoutId);
            const parsedError = ErrorHandler.parseError(error);
            
            if (parsedError.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeout}ms`);
            }
            throw parsedError;
        }
    }

    public static async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            throw await ErrorHandler.parseResponseError(response);
        }

        try {
            const result: T = await response.json();
            return result;
        } catch (error: unknown) {
            const parsedError = ErrorHandler.parseError(error);
            throw new Error(`Failed to parse response as JSON: ${parsedError.message}`);
        }
    }
}