/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationContract } from '@ioc:Adonis/Core/Application'

/**
 * Provider to register lucid filter with the IoC container
 */
export default class LucidFilterProvider {
  public static needsApplication = true
  constructor (protected app: ApplicationContract) {}

  public register (): void {
    this.app.container.singleton('Adonis/Addons/LucidFilter', () => {
      const { BaseModelFilter } = require('../src/BaseModel')
      const { Filterable } = require('../src/Mixin')

      return { BaseModelFilter, Filterable }
    })
  }
}
