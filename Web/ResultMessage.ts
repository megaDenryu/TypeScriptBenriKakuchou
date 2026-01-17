import z from "zod";

export const ResultMessageSchema = z.object({
    message: z.string(),
    success: z.enum(["SUCCESS", "FAILED"]),
});

export type IResultMessage = z.infer<typeof ResultMessageSchema>;

export class ResultMessage implements IResultMessage {
    public readonly message: string;
    public readonly success: "SUCCESS" | "FAILED";

    constructor(data: IResultMessage) {
        this.message = data.message;
        this.success = data.success;
    }
}

/**
 * データありのレスポンス型のZodスキーマを生成する関数
 * 
 * @param dataSchema データ部分のZodスキーマ
 * @returns ResultMessageWithDataのZodスキーマ
 * 
 * 使用例:
 * const UserSchema = z.object({ name: z.string(), age: z.number() });
 * const ResponseSchema = createResultMessageWithDataSchema(UserSchema);
 */
export function createResultMessageWithDataSchema<T extends z.ZodTypeAny>(dataSchema: T) {
    return z.object({
        message: z.string(),
        success: z.enum(["SUCCESS", "FAILED"]),
        data: dataSchema.nullable().optional(),
    });
}

export type IResultMessageWithData<T> = {
    message: string;
    success: "SUCCESS" | "FAILED";
    data?: T | null;
};

/**
 * データありのレスポンス型。ResultMessageを拡張し、dataフィールドを追加。
 * 
 * 使用例:
 * interface User { name: string; age: number; }
 * const response = new ResultMessageWithData<User>({
 *     message: "ユーザー取得成功",
 *     success: "SUCCESS",
 *     data: { name: "太郎", age: 25 }
 * });
 */
export class ResultMessageWithData<T> implements IResultMessageWithData<T> {
    public readonly message: string;
    public readonly success: "SUCCESS" | "FAILED";
    public readonly data?: T | null;

    constructor(data: IResultMessageWithData<T>) {
        this.message = data.message;
        this.success = data.success;
        this.data = data.data;
    }

    /**
     * dataが存在するかチェックする型ガード
     */
    public hasData(): this is ResultMessageWithData<T> & { data: T } {
        return this.data != null;
    }

    /**
     * 成功かどうかをチェック
     */
    public isSuccess(): boolean {
        return this.success === "SUCCESS";
    }

    /**
     * 失敗かどうかをチェック
     */
    public isFailed(): boolean {
        return this.success === "FAILED";
    }
}
