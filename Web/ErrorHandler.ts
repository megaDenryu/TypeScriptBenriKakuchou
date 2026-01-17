// エラーハンドリング用のユーティリティクラス
export class ErrorHandler {
    static parseError(error: unknown): Error {
        if (error instanceof Error) {
            return error;
        }
        
        if (typeof error === 'string') {
            return new Error(error);
        }
        
        return new Error('Unknown error occurred');
    }

    static async parseResponseError(response: Response): Promise<Error> {
        let errorMessage: string;
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || `HTTP ${response.status}`;
        } catch {
            try {
                errorMessage = await response.text() || `HTTP ${response.status}`;
            } catch {
                errorMessage = `HTTP ${response.status}`;
            }
        }
        
        const error = new Error(errorMessage);
        error.name = `HTTPError${response.status}`;
        return error;
    }

    static shouldRetry(error: Error, attempt: number, maxRetries: number): boolean {
        // 4xxエラーやネットワークエラーはリトライしない
        if (error.name?.startsWith('HTTPError4') || 
            error.name === 'TypeError' || 
            attempt >= maxRetries) {
            return false;
        }
        return true;
    }
}