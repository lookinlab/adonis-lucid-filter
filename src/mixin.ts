/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import type { InputObject, LucidFilterContract } from 'adonis-lucid-filter/types/filter'
import type {
  ModelQueryBuilderContract,
  QueryScope,
  QueryScopeCallback,
} from '@adonisjs/lucid/types/model'

export const Filterable = <Model extends NormalizeConstructor<typeof BaseModel>>(
  superclass: Model
) => {
  class FilterableModel extends superclass {
    declare static $filter: () => LucidFilterContract

    /**
     * Filter method of filterable model
     */
    static filter<
      T extends typeof FilterableModel,
      Filter extends LucidFilterContract = ReturnType<T['$filter']>,
    >(
      this: T,
      input: InputObject<InstanceType<Filter>>,
      filter?: Filter
    ): ModelQueryBuilderContract<T> {
      const Filter = filter || this.$filter()
      return new Filter(this.query(), input).handle()
    }

    /**
     * Filtration scope of filterable model
     */
    static filtration = function (
      this: typeof FilterableModel,
      query,
      input,
      filter?: LucidFilterContract
    ) {
      const Filter = filter || this.$filter()
      return new Filter(query, input).handle()
    } as QueryScope<Model, QueryScopeCallback>
  }
  return FilterableModel
}
