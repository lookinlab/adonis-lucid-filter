declare module '@ioc:Adonis/Addons/LucidFilter' {
  export interface LucidFilterContract {
    $input: object
    setup? (query: any): void
  }
  export const filterable: (Filter: LucidFilterContract) => (constructor: Function) => void
}
