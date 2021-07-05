/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { NormalizeConstructor } from '@ioc:Adonis/Core/Helpers'
import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import { FilterableMixin, LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'

export const Filterable: FilterableMixin = <T extends NormalizeConstructor<LucidModel>> (superclass: T) => {
  class FilterableModel extends superclass {
    public static $filter: () => LucidFilterContract
    /**
     * Filter method of filterable model
     */
    public static filter (input: object, dynamicFilter?: LucidFilterContract) {
      const filter = dynamicFilter || this.$filter()
      return (new filter(this.query(), input)).handle()
    }
  }
  return FilterableModel
}

