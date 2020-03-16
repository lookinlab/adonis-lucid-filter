/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { IocContract } from '@adonisjs/fold'
import LucidFilter from '../src/Model'

/**
 * Provider to register lucid filter with the IoC container
 */
export default class LucidFilterProvider {
  constructor (protected container: IocContract) {
  }

  public register (): void {
    this.container.singleton('Adonis/Addons/LucidFilter', () => ({ LucidFilter }))
  }

  public boot (): void {
    this.container.with(['Adonis/Lucid/Database'], (Database) => {
      Database.ModelQueryBuilder.macro('filter', function (input: any = {}, Filter?: any) {
        Filter = Filter || this.model.filter
        return new Filter(this, input).handle()
      })
    })
  }
}
