/**
 * HSL色の値を表すインターフェース
 */
export interface IHSL色値 {
    /** 色相 (0-360) */
    h: number;
    /** 彩度 (0-1) */
    s: number;
    /** 明度 (0-1) */
    l: number;
}

/**
 * RGB色の値を表すインターフェース
 */
export interface IRGB色値 {
    /** 赤成分 (0-255) */
    r: number;
    /** 緑成分 (0-255) */
    g: number;
    /** 青成分 (0-255) */
    b: number;
}

/**
 * 明るくて優しい色の生成設定
 */
export interface I明るくて優しい色設定 {
    /** 彩度の最小値 (0-1) */
    saturationMin?: number;
    /** 彩度の最大値 (0-1) */
    saturationMax?: number;
    /** 明度の最小値 (0-1) */
    lightnessMin?: number;
    /** 明度の最大値 (0-1) */
    lightnessMax?: number;
}

export interface HEXColor {
    hex: string; // HEXカラーコード (#RRGGBB)
}

/**
 * HSL値をRGB値に変換するヘルパー関数
 * 参考: https://www.rapidtables.com/convert/color/hsl-to-rgb.html
 * @param hsl HSL色値オブジェクト
 * @returns RGB値オブジェクト
 */
function hslToRgb(hsl: IHSL色値): IRGB色値;
/**
 * HSL値をRGB値に変換するヘルパー関数（従来の引数形式との互換性のため）
 * @param h 色相 (0-360)
 * @param s 彩度 (0-1)
 * @param l 明度 (0-1)
 * @returns RGB値の配列 [r, g, b] (0-255)
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number];
function hslToRgb(hslOrH: IHSL色値 | number, s?: number, l?: number): IRGB色値 | [number, number, number] {
  let h: number, sValue: number, lValue: number;
  
  if (typeof hslOrH === 'object') {
    h = hslOrH.h;
    sValue = hslOrH.s;
    lValue = hslOrH.l;
  } else {
    h = hslOrH;
    sValue = s!;
    lValue = l!;
  }

  sValue /= 1; // 彩度を0-1の範囲に変換済みと仮定
  lValue /= 1; // 明度を0-1の範囲に変換済みと仮定

  const c = (1 - Math.abs(2 * lValue - 1)) * sValue;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = lValue - c / 2;

  let r, g, b;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  if (typeof hslOrH === 'object') {
    return { r, g, b };
  } else {
    return [r, g, b];
  }
}

/**
 * RGB値をHEXカラーコードに変換するヘルパー関数
 * @param rgb RGB色値オブジェクト
 * @returns HEXカラーコード (#RRGGBB)
 */
function rgbToHex(rgb: IRGB色値): HEXColor;
/**
 * RGB値をHEXカラーコードに変換するヘルパー関数（従来の引数形式との互換性のため）
 * @param r 赤成分 (0-255)
 * @param g 緑成分 (0-255)
 * @param b 青成分 (0-255)
 * @returns HEXカラーコード (#RRGGBB)
 */
function rgbToHex(r: number, g: number, b: number): HEXColor;
function rgbToHex(rgbOrR: IRGB色値 | number, g?: number, b?: number): HEXColor {
  let r: number, gValue: number, bValue: number;
  
  if (typeof rgbOrR === 'object') {
    r = rgbOrR.r;
    gValue = rgbOrR.g;
    bValue = rgbOrR.b;
  } else {
    r = rgbOrR;
    gValue = g!;
    bValue = b!;
  }

  const toHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return {hex:`#${toHex(r)}${toHex(gValue)}${toHex(bValue)}`};
}

/**
 * 明るくて優しい色のHEXカラーコードをランダムに生成する関数
 * 美術的な観点から、HSLモデルの彩度と明度を調整しています。
 * 彩度 (Saturation): 40% - 60% (優しさ、鮮やかすぎない)
 * 明度 (Lightness): 75% - 90% (明るさ)
 * 色相 (Hue): 0 - 360 (任意の色相)
 * @param settings 色生成の設定（オプショナル）
 * @returns ランダムに生成された明るくて優しい色のHEXカラーコード (#RRGGBB)
 */
export function 明るくて優しい色をランダムに出力(settings?: I明るくて優しい色設定): HEXColor {  // 色相 (Hue): 0 から 360 の間でランダム
  const h = Math.floor(Math.random() * 361);

  // 彩度 (Saturation): デフォルト40% から 60% の間でランダム (優しさ)
  const satMin = settings?.saturationMin ?? 0.4;
  const satMax = settings?.saturationMax ?? 0.6;
  const s = (Math.random() * (satMax - satMin) + satMin);

  // 明度 (Lightness): デフォルト75% から 90% の間でランダム (明るさ)
  const lightMin = settings?.lightnessMin ?? 0.75;
  const lightMax = settings?.lightnessMax ?? 0.9;
  const l = (Math.random() * (lightMax - lightMin) + lightMin);

  // HSLをRGBに変換
  const [r, g, b] = hslToRgb(h, s, l);

  // RGBをHEXに変換して返す
  return rgbToHex(r, g, b);
}

/**
 * HEXカラーコードの色を強くする関数（彩度と明度を調整）
 * @param hexColor HEXカラーコード (#RRGGBB)
 * @param intensity 強度の倍率 (1.0が元の色、1.5だと1.5倍強くなる)
 * @returns 強くした色のHEXカラーコード
 */
export function 色を強くする(hexColor: HEXColor, intensity: number = 1.3): HEXColor {
  // HEXからRGBに変換
  const r = parseInt(hexColor.hex.slice(1, 3), 16);
  const g = parseInt(hexColor.hex.slice(3, 5), 16);
  const b = parseInt(hexColor.hex.slice(5, 7), 16);
  
  // RGBからHSLに変換
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h, s, l:number;
  
  l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // グレースケール
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = 0; // 初期化
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }
  
  // 彩度を強くし、明度を少し下げる
  s = Math.min(1, s * intensity);
  l = Math.max(0.3, l * (1 / Math.sqrt(intensity))); // 明度は少し下げる
  
  // HSL（0-360, 0-1, 0-1）をRGBに変換
  const [newR, newG, newB] = hslToRgb(h * 360, s, l);
  
  return rgbToHex(newR, newG, newB);
}

