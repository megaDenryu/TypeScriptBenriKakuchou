export {};

declare global {
    interface Element {
        getFirstHTMLElementByClassName(className: string): HTMLElement;
        getFirstTextAreaElementByClassName(className: string): HTMLTextAreaElement;
    }

    interface Map<K, V> {
        getNthKey(n: number): K;
        getNthValue(n: number): V;
        sort(compareFunction: (a: [K, V], b: [K, V]) => number): void;
        convert2keysArray(): K[];
    }

    interface Window {
        ai: any;
    }
}