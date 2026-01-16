import { ButtonC, DivC } from "SengenUI/index";


import { HEXColor, 明るくて優しい色をランダムに出力, 色を強くする } from "./RandomColor";

// インターフェース定義
/**
 * リアクティブカラーリング枠線の対象要素の型
 */
export interface Iリアクティブカラーリング対象要素 {
    setStyleCSS(styles: { borderColor: string; transition: string }): this;
    addTypedEventListener(event: 'mouseover' | 'mouseout' | 'mousedown' | 'mouseup', listener: () => void): this;
    style: {
        borderColor: string;
        transition: string;
    };
}

/**
 * 色情報を格納するインターフェース
 */
export interface I色情報 {
    /** 元の色（通常時） */
    originalColor: HEXColor;
    /** ホバー時の色 */
    hoverColor: HEXColor;
    /** クリック時の色 */
    clickColor: HEXColor;
}

/**
 * リアクティブカラーリング枠線の設定オプション
 */
export interface Iリアクティブカラーリング設定 {
    /** ホバー時の色の強度倍率 */
    hoverIntensity?: number;
    /** クリック時の色の強度倍率 */
    clickIntensity?: number;
    /** トランジション時間 */
    transitionDuration?: string;
    /** クリック時のトランジション時間 */
    clickTransitionDuration?: string;
}

/**
 * 指定された要素にリアクティブカラーリング枠線効果を適用する
 * @param targetElement 対象の要素
 * @param settings 設定オプション（オプショナル）
 * @returns 適用された色情報
 */
export function リアクティブカラーリング枠線を適用(
    targetElement: Iリアクティブカラーリング対象要素,
    settings?: Iリアクティブカラーリング設定
): I色情報 {
    const originalColor = 明るくて優しい色をランダムに出力();
    const hoverColor = 色を強くする(originalColor, settings?.hoverIntensity ?? 1.3);
    const clickColor = 色を強くする(originalColor, settings?.clickIntensity ?? 1.8);

    // 初期スタイル設定
    targetElement.setStyleCSS({
        borderColor: originalColor.hex, 
        transition: settings?.transitionDuration ?? 'border-color 0.2s ease'
    });

    // イベントリスナー設定
    targetElement
        .addTypedEventListener('mouseover', () => {
            targetElement.style.borderColor = hoverColor.hex;
        })
        .addTypedEventListener('mouseout', () => {
            targetElement.style.borderColor = originalColor.hex;
        })
        .addTypedEventListener('mousedown', () => {
            targetElement.style.borderColor = clickColor.hex;
            targetElement.style.transition = settings?.clickTransitionDuration ?? 'border-color 0.1s ease';
        })
        .addTypedEventListener('mouseup', () => {
            targetElement.style.transition = settings?.transitionDuration ?? 'border-color 0.3s ease';
            targetElement.style.borderColor = hoverColor.hex;
            
            setTimeout(() => {
                targetElement.style.transition = settings?.transitionDuration ?? 'border-color 0.2s ease';
            }, 300);
        });

    // 必要に応じて色情報を返す
    return { originalColor, hoverColor, clickColor };
}
