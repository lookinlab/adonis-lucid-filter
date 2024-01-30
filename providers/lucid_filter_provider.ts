/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationService } from '@adonisjs/core/types'

/**
 * Lucid Filter service provider
 */
export default class LucidFilterProvider {
  public static needsApplication = true
  constructor (protected app: ApplicationService) {}

  public register(): void {
    // this.app.container.singleton('Adonis/Addons/LucidFilter', () => {
    //   const { BaseModelFilter } = require('../src/BaseModel')
    //   const { Filterable } = require('../src/Mixin')

    //   return { BaseModelFilter, Filterable }
    // })
  }

  public boot(): void {
    // this.app.container.withBindings(['Adonis/Lucid/Database'], ({ ModelQueryBuilder }) => {
    //   const { extendModelQueryBuilder } = require('../src/Bindings/ModelQueryBuilder')
    //   extendModelQueryBuilder(ModelQueryBuilder)
    // })
  }
}
