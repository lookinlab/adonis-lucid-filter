/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'
import { LucidModel } from '@ioc:Adonis/Lucid/Model'

export default function (modelFilter: LucidFilterContract) {
  return function (constructor: LucidModel) {
    constructor['filter'] = function (
      input: object,
      Filter = modelFilter
    ) {
      const filter = new Filter(constructor.query(), input)
      return filter.handle()
    }
  }
}
