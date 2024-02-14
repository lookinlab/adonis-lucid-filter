/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { LucidFilterContract, InputObject } from 'adonis-lucid-filter/types/filter'

declare module '@adonisjs/lucid/types/model' {
  type FilterableModel = LucidModel & {
    $filter: () => LucidFilterContract
    filtration: QueryScope<LucidModel, QueryScopeCallback>
  }

  type ExcludeMethods<Type, Model> = {
    [Method in keyof Type]: Model extends FilterableModel ? Type[Method] : never
  }

  type FilterableModelMethods<Model extends LucidModel> = {
    filter<Filter extends LucidFilterContract = ReturnType<(FilterableModel & Model)['$filter']>>(
      input: InputObject<InstanceType<Filter>>,
      filter?: Filter
    ): ModelQueryBuilderContract<Model, InstanceType<Model>>
  }

  export interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>>
    extends ExcludeMethods<FilterableModelMethods<Model>, Model> {}
}
