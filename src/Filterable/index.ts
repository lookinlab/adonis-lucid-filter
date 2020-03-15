/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'

export default (Filter: LucidFilterContract) => {
  return function<T extends { new (...args: any[]): {} }> (constructor: T) {
    return class extends constructor {
      public static filter: LucidFilterContract = Filter
    }
  }
}
