

// 2番目のジェネリクス `Brand` を追加
export abstract class ValueObjectBase<
  T extends Record<string, any>,
  Brand extends string
> {
  protected readonly props: T;

  // この `_brand` が型のマーカー。`!` を使い、実行時には存在しないことを示す
  protected readonly _brand!: Brand;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }
}