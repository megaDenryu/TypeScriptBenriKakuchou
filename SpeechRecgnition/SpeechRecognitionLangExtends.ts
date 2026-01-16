// サポートされている言語コード（リテラル型）
export type SpeechRecognitionLanguageCode = 
    | "de-DE"  // ドイツ語、ドイツ
    | "en-US"  // 英語、米国
    | "es-ES"  // スペイン語、スペイン
    | "fr-FR"  // フランス語、フランス
    | "hi-IN"  // ヒンディー語、インド
    | "id-ID"  // インドネシア語、インドネシア
    | "it-IT"  // イタリア語、イタリア
    | "ja-JP"  // 日本語、日本
    | "ko-KR"  // 韓国語、韓国
    | "pl-PL"  // ポーランド語、ポーランド
    | "pt-BR"  // ポルトガル語、ブラジル
    | "ru-RU"  // ロシア語、ロシア
    | "th-TH"  // タイ語、タイ
    | "tr-TR"  // トルコ語、トルコ
    | "vi-VN"  // ベトナム語、ベトナム
    | "zh-CN"  // 中国語、北京語、簡体字
    | "zh-TW"; // 中国語、北京語、繁体字

export const SupportedSpeechRecognitionLanguageCodes: SpeechRecognitionLanguageCode[] = ["de-DE","en-US","es-ES","fr-FR","hi-IN","id-ID","it-IT","ja-JP","ko-KR","pl-PL","pt-BR","ru-RU","th-TH","tr-TR","vi-VN","zh-CN","zh-TW"];

// 各言語での言語名表示enum
export enum SpeechRecognitionLanguageName {
    GERMAN_GERMANY = "Deutsch",
    ENGLISH_US = "English",
    SPANISH_SPAIN = "Español",
    FRENCH_FRANCE = "Français",
    HINDI_INDIA = "हिन्दी",
    INDONESIAN_INDONESIA = "Bahasa Indonesia",
    ITALIAN_ITALY = "Italiano",
    JAPANESE_JAPAN = "日本語",
    KOREAN_KOREA = "한국어",
    POLISH_POLAND = "Polski",
    PORTUGUESE_BRAZIL = "Português",
    RUSSIAN_RUSSIA = "Русский",
    THAI_THAILAND = "ไทย",
    TURKISH_TURKEY = "Türkçe",
    VIETNAMESE_VIETNAM = "Tiếng Việt",
    CHINESE_SIMPLIFIED = "中文（简体）",
    CHINESE_TRADITIONAL = "中文（繁體）"
}

// 言語コードと日本語名のマッピング
const LANGUAGE_CODE_TO_NAME_MAP: Record<SpeechRecognitionLanguageCode, SpeechRecognitionLanguageName> = {
    "de-DE": SpeechRecognitionLanguageName.GERMAN_GERMANY,
    "en-US": SpeechRecognitionLanguageName.ENGLISH_US,
    "es-ES": SpeechRecognitionLanguageName.SPANISH_SPAIN,
    "fr-FR": SpeechRecognitionLanguageName.FRENCH_FRANCE,
    "hi-IN": SpeechRecognitionLanguageName.HINDI_INDIA,
    "id-ID": SpeechRecognitionLanguageName.INDONESIAN_INDONESIA,
    "it-IT": SpeechRecognitionLanguageName.ITALIAN_ITALY,
    "ja-JP": SpeechRecognitionLanguageName.JAPANESE_JAPAN,
    "ko-KR": SpeechRecognitionLanguageName.KOREAN_KOREA,
    "pl-PL": SpeechRecognitionLanguageName.POLISH_POLAND,
    "pt-BR": SpeechRecognitionLanguageName.PORTUGUESE_BRAZIL,
    "ru-RU": SpeechRecognitionLanguageName.RUSSIAN_RUSSIA,
    "th-TH": SpeechRecognitionLanguageName.THAI_THAILAND,
    "tr-TR": SpeechRecognitionLanguageName.TURKISH_TURKEY,
    "vi-VN": SpeechRecognitionLanguageName.VIETNAMESE_VIETNAM,
    "zh-CN": SpeechRecognitionLanguageName.CHINESE_SIMPLIFIED,
    "zh-TW": SpeechRecognitionLanguageName.CHINESE_TRADITIONAL
};

// 日本語名から言語コードのマッピング
const LANGUAGE_NAME_TO_CODE_MAP: Record<SpeechRecognitionLanguageName, SpeechRecognitionLanguageCode> = {
    [SpeechRecognitionLanguageName.GERMAN_GERMANY]: "de-DE",
    [SpeechRecognitionLanguageName.ENGLISH_US]: "en-US",
    [SpeechRecognitionLanguageName.SPANISH_SPAIN]: "es-ES",
    [SpeechRecognitionLanguageName.FRENCH_FRANCE]: "fr-FR",
    [SpeechRecognitionLanguageName.HINDI_INDIA]: "hi-IN",
    [SpeechRecognitionLanguageName.INDONESIAN_INDONESIA]: "id-ID",
    [SpeechRecognitionLanguageName.ITALIAN_ITALY]: "it-IT",
    [SpeechRecognitionLanguageName.JAPANESE_JAPAN]: "ja-JP",
    [SpeechRecognitionLanguageName.KOREAN_KOREA]: "ko-KR",
    [SpeechRecognitionLanguageName.POLISH_POLAND]: "pl-PL",
    [SpeechRecognitionLanguageName.PORTUGUESE_BRAZIL]: "pt-BR",
    [SpeechRecognitionLanguageName.RUSSIAN_RUSSIA]: "ru-RU",
    [SpeechRecognitionLanguageName.THAI_THAILAND]: "th-TH",
    [SpeechRecognitionLanguageName.TURKISH_TURKEY]: "tr-TR",
    [SpeechRecognitionLanguageName.VIETNAMESE_VIETNAM]: "vi-VN",
    [SpeechRecognitionLanguageName.CHINESE_SIMPLIFIED]: "zh-CN",
    [SpeechRecognitionLanguageName.CHINESE_TRADITIONAL]: "zh-TW"
};

// 変換関数
export function getLanguageName(code: SpeechRecognitionLanguageCode): SpeechRecognitionLanguageName {
    return LANGUAGE_CODE_TO_NAME_MAP[code];
}

export function getLanguageCode(name: SpeechRecognitionLanguageName): SpeechRecognitionLanguageCode {
    return LANGUAGE_NAME_TO_CODE_MAP[name];
}

export function getAllLanguageNames(): SpeechRecognitionLanguageName[] {
    return Object.values(SpeechRecognitionLanguageName);
}

export function getAllLanguageCodes(): SpeechRecognitionLanguageCode[] {
    return SupportedSpeechRecognitionLanguageCodes;
}

// 言語選択用のペア配列
export interface LanguageOption {
    code: SpeechRecognitionLanguageCode;
    name: SpeechRecognitionLanguageName;
    displayText: string; // UI表示用
}

export function getLanguageOptions(): LanguageOption[] {
    return SupportedSpeechRecognitionLanguageCodes.map(code => ({
        code,
        name: getLanguageName(code),
        displayText: `${getLanguageName(code)} (${code})`
    }));
}