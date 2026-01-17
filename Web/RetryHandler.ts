import { ErrorHandler } from "./ErrorHandler";

// リトライ機能を提供するクラス
export class RetryHandler {
    static async withRetry<T>(
        operation: () => Promise<T>,
        maxRetries: number = 3,
        baseDelay: number = 1000
    ): Promise<T> {
        let lastError: Error = new Error('No attempts made');
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error: unknown) {
                lastError = ErrorHandler.parseError(error);
                
                if (!ErrorHandler.shouldRetry(lastError, attempt, maxRetries)) {
                    console.error(`Request failed (attempt ${attempt}/${maxRetries}):`, lastError);
                    throw lastError;
                }
                
                console.warn(`Request failed (attempt ${attempt}/${maxRetries}), retrying...`, lastError);
                await new Promise(resolve => setTimeout(resolve, baseDelay * attempt));
            }
        }
        
        throw lastError;
    }
}