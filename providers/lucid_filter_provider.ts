/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/// <reference path="../src/types/querybuilder.ts" />

import type { ApplicationService } from '@adonisjs/core/types'
import { extendModelQueryBuilder } from '../src/bindings/model_query_builder.js'

/**
 * Lucid Filter service provider
 */
export default class LucidFilterProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const { ModelQueryBuilder } = await import('@adonisjs/lucid/orm')
    extendModelQueryBuilder(ModelQueryBuilder)
  }
}
