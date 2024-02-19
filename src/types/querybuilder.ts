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

  type ExcludeFilterableMethods<Methods, Model> = {
    [Method in keyof Methods]: Model extends FilterableModel ? Methods[Method] : never
  }

  type FilterableMethods<Model extends LucidModel> = {
    filter<Filter extends LucidFilterContract = ReturnType<(FilterableModel & Model)['$filter']>>(
      input: InputObject<InstanceType<Filter>>,
      filter?: Filter
    ): ModelQueryBuilderContract<Model, InstanceType<Model>>
  }

  export interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>>
    extends ExcludeFilterableMethods<FilterableMethods<Model>, Model> {}
}
