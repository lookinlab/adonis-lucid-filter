/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/// <reference path="../types/querybuilder.ts" />

import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import type { LucidFilterContract } from 'adonis-lucid-filter/types/filter'

/**
 * Define filter method to ModelQueryBuilder
 */
export function extendModelQueryBuilder(builder: any) {
  builder.macro(
    'filter',
    function (this: ModelQueryBuilder, input: any, filter?: LucidFilterContract) {
      const Filter = filter || (this.model as any).$filter()
      return new Filter(this, input).handle()
    }
  )
}
