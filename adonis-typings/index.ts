declare module '@ioc:Adonis/Addons/LucidFilter' {
  import { ModelQueryBuilderContract, ModelConstructorContract } from '@ioc:Adonis/Lucid/Model'

  export interface InputContract {
    [propName: string]: any
  }
  export interface LucidFilterContract {
    handle(): ModelQueryBuilderContract<ModelConstructorContract>
  }
  export interface LucidFilterConstructorContract<Filter extends LucidFilterContract = LucidFilterContract> {
    new (query: ModelQueryBuilderContract<ModelConstructorContract>, input: InputContract): Filter
  }
  export const LucidFilter: LucidFilterConstructorContract
}
