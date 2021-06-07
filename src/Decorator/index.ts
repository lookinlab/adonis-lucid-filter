/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'
import { LucidModel, ModelQueryBuilderContract, QueryScope, QueryScopeCallback } from '@ioc:Adonis/Lucid/Orm'

export default function (modelFilter: LucidFilterContract) {
  return function <Model extends LucidModel>(constructor: Model) {
    /**
     * Scope filtration function
     */
    const scopeFn = (
      query: ModelQueryBuilderContract<Model>,
      input: object,
      Filter = modelFilter
    ) => (new Filter(query, input)).handle()

    /**
     * Filter function
     */
    const filterFn = (input: object, Filter = modelFilter) => {
      return scopeFn(constructor.query(), input, Filter)
    }

    constructor['filter'] = filterFn
    constructor['filtration'] = scopeFn as QueryScope<QueryScopeCallback>
  }
}
