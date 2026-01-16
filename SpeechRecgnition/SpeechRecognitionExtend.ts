import { SpeechRecognitionLanguageCode } from "./SpeechRecognitionLangExtends";

// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#events
export interface SpeechRecognitionEventMap {
    audioend: Event;
    audiostart: Event;
    end: Event;
    error: SpeechRecognitionErrorEvent;
    nomatch: SpeechRecognitionEvent;
    result: SpeechRecognitionEvent;
    soundend: Event;
    soundstart: Event;
    speechend: Event;
    speechstart: Event;
    start: Event;
}

// https://wicg.github.io/speech-api/#speechreco-section
export interface ISpeechRecognition extends EventTarget {
    continuous: boolean;
    grammars: SpeechGrammarList;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    phrases: ISpeechRecognitionPhrase[];
    options: SpeechRecognitionOptions; //おそらく新しく追加されると思われる。３か月後くらいに再確認。
    onaudioend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onaudiostart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onsoundstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    abort(): void;
    start(audioTrack?: MediaStreamTrack): void;
    stop(): void;
    addEventListener<K extends keyof SpeechRecognitionEventMap>(
        type: K,
        listener: (this: ISpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof SpeechRecognitionEventMap>(
        type: K,
        listener: (this: ISpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any,
        options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ): void;
}

export declare var SpeechRecognition: { 
    prototype: ISpeechRecognition; 
    new(): ISpeechRecognition;
    // staticメソッド
    available(options: SpeechRecognitionOptions): Promise<AvailabilityStatus>;
    install(options: SpeechRecognitionOptions): Promise<boolean>;
};


// https://wicg.github.io/speech-api/#speechrecognitionevent
export interface SpeechRecognitionEventInit extends EventInit {
    resultIndex?: number;
    results: SpeechRecognitionResultList;
}

// https://wicg.github.io/speech-api/#dictdef-speechrecognitioneventinit
export interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

export declare var SpeechRecognitionEvent: {
    prototype: SpeechRecognitionEvent;
    new(type: string, eventInitDict: SpeechRecognitionEventInit): SpeechRecognitionEvent;
};

// https://wicg.github.io/speech-api/#enumdef-speechrecognitionerrorcode
export type SpeechRecognitionErrorCode =
    | "aborted"                 //音声入力は、ユーザーが音声入力をキャンセルできる UI など、ユーザーエージェント固有の動作によって何らかの理由で中止されました。
    | "audio-capture"           //オーディオのキャプチャに失敗しました。
    | "bad-grammar"
    | "language-not-supported"  //言語はサポートされていません。
    | "network"                 //認識を完了するために必要なネットワーク通信が失敗しました。
    | "no-speech"               //音声は検出されませんでした。
    | "not-allowed"             //ユーザーエージェントは、セキュリティ、プライバシー、またはユーザー設定の理由により、音声入力を許可していません。
    | "service-not-allowed"     //ユーザーエージェントは、Webアプリケーションが要求した音声サービスを許可していませんが、選択された音声サービスをユーザーエージェントがサポートしていないか、セキュリティ、プライバシー、またはユーザー設定の理由により、一部の音声サービスの使用を許可しています。
    | "phrases-not-supported";  //おそらく新しく追加されると思われる。３か月後くらいに再確認。

// https://wicg.github.io/speech-api/#dictdef-speechrecognitionerroreventinit
export interface SpeechRecognitionErrorEventInit extends EventInit {
    error: SpeechRecognitionErrorCode;
    message?: string;
}

// https://wicg.github.io/speech-api/#speechrecognitionerrorevent
export interface SpeechRecognitionErrorEvent extends Event {
    readonly error: SpeechRecognitionErrorCode;
    readonly message: string;
}

export declare var SpeechRecognitionErrorEvent: {
    prototype: SpeechRecognitionErrorEvent;
    new(type: string, eventInitDict: SpeechRecognitionErrorEventInit): SpeechRecognitionErrorEvent;
};

// https://wicg.github.io/speech-api/#speechgrammar
export interface SpeechGrammar {
    src: string;
    weight: number;
}

export declare var SpeechGrammar: {
    prototype: SpeechGrammar;
    new(): SpeechGrammar;
};

// SpeechRecognitionPhrase interface
export interface ISpeechRecognitionPhrase {
    readonly phrase: string;
    readonly boost: number;
}

export declare var SpeechRecognitionPhrase: {
    prototype: ISpeechRecognitionPhrase;
    new(phrase: string, boost?: number): ISpeechRecognitionPhrase;
};

// https://wicg.github.io/speech-api/#speechgrammarlist
export interface SpeechGrammarList {
    readonly length: number;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
    item(index: number): SpeechGrammar;
    [index: number]: SpeechGrammar;
}


// staticメソッド用の型定義
export interface SpeechRecognitionOptions {
    langs: SpeechRecognitionLanguageCode[]; // サポートされている言語コードのみ許可
    processLocally?: boolean; 
}

export enum AvailabilityStatus {
    unavailable = "unavailable",
    downloadable = "downloadable",
    downloading = "downloading",
    available = "available"
}

export declare var SpeechGrammarList: { prototype: SpeechGrammarList; new(): SpeechGrammarList };

// prefixed global variables in Chrome; should match the equivalents above
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#chrome_support
export declare var webkitSpeechRecognition: { prototype: ISpeechRecognition; new(): ISpeechRecognition };
export declare var webkitSpeechGrammarList: { prototype: SpeechGrammarList; new(): SpeechGrammarList };
export declare var webkitSpeechRecognitionEvent: {
    prototype: SpeechRecognitionEvent;
    new(type: string, eventInitDict: SpeechRecognitionEventInit): SpeechRecognitionEvent;
};


export function NewSpeechRecognition(): ISpeechRecognition {
    if (!SpeechRecognition) {
        throw new Error('Speech Recognition API is not supported in this browser');
    }
    return new SpeechRecognition();
}



/// =============================== 
/// ローカルでの仕様例
/// ===============================

export function 音声認識が使用可能か確認する() {
    const options:SpeechRecognitionOptions = { langs: ['ja-JP'], processLocally: true };

    SpeechRecognition.available(options).then((status) => {
    console.log(`${options.langs.join(', ')} の音声認識ステータス (デバイス上): ${status}`)
    if (status === AvailabilityStatus.available) {
        console.log("デバイス上で音声認識を使用する準備ができました");
    } else if (status === AvailabilityStatus.downloadable) {
        console.log('リソースはダウンロード可能です。必要に応じて install() を呼び出してください。');
    } else if (status === AvailabilityStatus.downloading) {
        console.log('リソースは現在ダウンロード中です。');
    } else {
        console.log('デバイス上での音声認識は利用できません。');
    }
    });
}

//このメソッドはユーザーの操作（クリック、タップなど）内で呼び出してください。
// 例: button.addEventListener("click", () => { 音声認識に必要なリソースをインストールする(); });
export function 音声認識に必要なリソースをインストールする() {
    
    const options:SpeechRecognitionOptions = { langs: ['ja-JP'], processLocally: true };
    return SpeechRecognition.install(options).then((success) => {
        if (success) {
            console.log(`${options.langs.join(', ')} のデバイス内音声認識リソースが正常にインストールされました`)
        } else {
            console.error(`${options.langs.join(', ')} のデバイス内音声認識リソースをインストールできません。サポートされていない言語またはダウンロードの問題が原因である可能性があります。`);
        }
        return success;
    }).catch((error) => {
        console.error('インストールに失敗しました:', error);
        if (error.name === 'NotAllowedError') {
            console.error('ユーザーの操作が必要です。ボタンクリックなどのイベント内で実行してください。');
        }
        throw error;
    });
}

//参考: https://github.com/WebAudio/web-speech-api/blob/main/explainers/contextual-biasing.md
export function 音声認識を使用する() {
  // コンテキストバイアスのデータを作成 (特定のワードを登録/認識精度を上げるための仕組み)
  const phraseObjects = [
    { phrase: 'ゆかりネット', boost: 3.0 },
    // { phrase: '', boost: 2.0 },  // 現時点で、空文字を登録すると音声認識が壊れる
  ].map(p => new SpeechRecognitionPhrase(p.phrase, p.boost));

  // 音声認識オブジェクトを作成
  const recognition = new SpeechRecognition();
  recognition.options = {
    langs: ['ja-JP'],
    processLocally: true,
  };

  recognition.continuous = true;        // default: false  継続的に認識を行う (これがないと `isFinal:true` になると認識が終了する)
  recognition.interimResults = true;    // default: false  中間結果を返すかどうか. なぜか現時点では常に true の動作を行う. 不具合?

  recognition.phrases = phraseObjects;  // 作成したフレーズを登録
  recognition.phrases.push(new SpeechRecognitionPhrase('むじゅりん', 2.5)); // フレーズを動的に追加/削除することもできます

  recognition.onresult = (event) => {
    const res = event.results[event.results.length - 1];
    if (res.isFinal) console.log(`結果: ${res[0].transcript}`);
    else console.log(`認識中: ${res[0].transcript}`);
  };

  recognition.onerror = (event) => {
    if (event.error === 'phrases-not-supported') {
      console.warn('コンテキストバイアスは、このブラウザ/サービスによってサポートされていません');
    } else {
      console.error(event.error, event);
    }
  };

  recognition.start();
}