/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/// <reference path="../../adonis-typings/index.ts" />

import camelCase from 'lodash/camelCase'
import { LucidFilter, LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'
import { LucidModel, LucidRow, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Model'

function StaticImplements<T> () {
  return (_t: T) => {}
}

/**
 * Class to filtering AdonisJS Lucid ORM
 *
 * @class BaseModelFilter
 * @constructor
 */
@StaticImplements<LucidFilterContract>()
export default class BaseModelFilter implements LucidFilter {
  public ['constructor']: typeof BaseModelFilter

  public static blacklist: string[] = []
  public static dropId: boolean = true
  public static camelCase: boolean = true

  public setup? ($query: any): void
  public $blacklist: string[]

  constructor (
    public $query: ModelQueryBuilderContract<LucidModel, LucidRow>,
    public $input: object
  ) {
    this.$input = BaseModelFilter.removeEmptyInput(this.$input)
    this.$blacklist = this.constructor.blacklist
  }

  public handle (): ModelQueryBuilderContract<LucidModel> {
    if (this.setup && typeof this.setup === 'function') {
      this.setup(this.$query)
    }
    this.filterByInput()

    return this.$query
  }

  public whitelistMethod (method): boolean {
    const index = this.$blacklist.indexOf(method)
    if (~index) {
      this.$blacklist.splice(index, 1)
    }

    return !!~index
  }

  public input (key: string, defaultValue: any = null): any {
    if (!key) {
      return this.$input
    }
    return this.$input[key] || defaultValue
  }

  public filterByInput (): void {
    for (const key in this.$input) {
      const method = this.getFilterMethod(key)
      const value = this.$input[key]

      if (this.methodIsCallable(method)) {
        this[method](value)
      }
    }
  }

  public getFilterMethod (key: string): string {
    const methodName = this.constructor.dropId ? key.replace(/^(.*)_id$/, '$1') : key
    return this.constructor.camelCase ? camelCase(methodName) : methodName
  }

  public static removeEmptyInput (input: object): object {
    const filteredInput = {}

    for (let key in input) {
      const value = input[key]

      if (value !== '' && value !== null) {
        filteredInput[key] = value
      }
    }
    return filteredInput
  }

  public methodIsCallable (method: string): boolean {
    return !!this[method] &&
      typeof this[method] === 'function' &&
      !this.methodIsBlacklisted(method)
  }

  public methodIsBlacklisted (method: string): boolean {
    return this.$blacklist.includes(method)
  }
}
