/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { LucidFilterContract, FilterableModel } from 'adonis-lucid-filter/types/filter'
import type { QueryScope, QueryScopeCallback } from '@adonisjs/lucid/types/model'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'

export const Filterable = <T extends NormalizeConstructor<typeof BaseModel>>(
  superclass: T
): T & FilterableModel => {
  class FilterableModel extends superclass {
    declare static $filter: () => LucidFilterContract

    /**
     * Filter method of filterable model
     */
    static filter(input: object, Filter?: LucidFilterContract) {
      const filter = Filter || this.$filter()
      return new filter(this.query(), input).handle()
    }

    /**
     * Filtration scope of filterable model
     */
    static filtration = function (
      this: typeof FilterableModel,
      query,
      input,
      Filter?: LucidFilterContract
    ) {
      const filter = Filter || this.$filter()
      return new filter(query, input).handle()
    } as QueryScope<T, QueryScopeCallback>
  }
  return FilterableModel
}
