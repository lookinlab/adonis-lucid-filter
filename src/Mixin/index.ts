/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FilterableMixin, LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'
import { QueryScope, QueryScopeCallback } from '@ioc:Adonis/Lucid/Orm'

export const Filterable: FilterableMixin = (superclass) => {
  class FilterableModel extends superclass {
    public static $filter: () => LucidFilterContract
    /**
     * Filter method of filterable model
     */
    public static filter (input: object, Filter?: LucidFilterContract) {
      const filter = Filter || this.$filter()
      return (new filter(this.query(), input)).handle()
    }

    /**
     * Filtration scope of filterable model
     */
    public static filtration = function (query, input, Filter?: LucidFilterContract) {
      const filter = Filter || (this.$filter as () => LucidFilterContract)()
      return (new filter(query, input)).handle()
    } as QueryScope<QueryScopeCallback>
  }
  return FilterableModel
}

