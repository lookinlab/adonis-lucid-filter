/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { IocContract } from '@adonisjs/fold'
import BaseModelFilter from '../src/BaseModel'

/**
 * Provider to register lucid filter with the IoC container
 */
export default class LucidFilterProvider {
  constructor (protected container: IocContract) {
  }

  public register (): void {
    this.container.singleton('Adonis/Addons/LucidFilter', () => ({ BaseModelFilter }))
  }
}
