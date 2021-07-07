/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DatabaseContract } from '@ioc:Adonis/Lucid/Database'
import { LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'

/**
 * Define filter method to ModelQueryBuilder
 */
export function extendModelQueryBuilder (builder: DatabaseContract['ModelQueryBuilder']) {
  builder.macro('filter', function (input: any, Filter?: LucidFilterContract) {
    const filter = Filter || this.model.$filter()
    return (new filter(this, input)).handle()
  })
}
