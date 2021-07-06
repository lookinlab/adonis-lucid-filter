/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Lucid/Orm' {
  import { FilterableModel, LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'
  import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
  import { InputObject } from '@ioc:Adonis/Addons/LucidFilter'

  type ExcludeTypeMethods<Type, Model> = {
    [Method in keyof Type as (
      Model extends FilterableModel ? Method : never
    )]: Type[Method]
  }

  type FilterableModelMethods<Model extends LucidModel> = {
    filter<Filter extends LucidFilterContract = ReturnType<(FilterableModel & Model)['$filter']>>(
      input: InputObject<InstanceType<Filter>>,
      filter?: Filter
    ): ModelQueryBuilderContract<Model, InstanceType<Model>>
  }

  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>>
    extends ExcludeTypeMethods<FilterableModelMethods<Model>, Model> {}
}
