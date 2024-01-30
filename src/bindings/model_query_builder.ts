/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder'
import type { LucidFilterContract } from '../types/filter.js'

/**
 * Define filter method to ModelQueryBuilder
 */
export function extendModelQueryBuilder (builder: DatabaseQueryBuilderContract) {
  builder.macro('filter', function (input: any, Filter?: LucidFilterContract) {
    const filter = Filter || this.model.$filter()
    return (new filter(this, input)).handle()
  })
}
