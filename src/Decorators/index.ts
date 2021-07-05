/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FilterableDecorator, FilterDecorator, LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'
import { QueryScope, QueryScopeCallback } from '@ioc:Adonis/Lucid/Orm'

/**
 * Filterable decorator for model
 * @deprecated
 */
export const filterable: FilterableDecorator = function (modelFilter: LucidFilterContract) {
  return function (constructor) {
    /**
     * Scope filtration function
     */
    const scopeFn = (
      query,
      input,
      Filter = modelFilter
    ) => (new Filter(query, input)).handle()

    /**
     * Filter function
     */
    const filterFn = (input, Filter = modelFilter) => {
      return scopeFn(constructor.query(), input, Filter)
    }

    constructor['filter'] = filterFn
    constructor['filtration'] = scopeFn as QueryScope<QueryScopeCallback>
  }
}

/**
 * Filter decorator for LucidModel property
 */
export const filter: FilterDecorator = (modelFilter) => {
  return (target) => {
    target.boot()
    target.$filter = modelFilter
  }
}
