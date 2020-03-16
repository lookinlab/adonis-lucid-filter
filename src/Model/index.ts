/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelCase from 'lodash/camelCase'
import { InputContract, LucidFilterConstructorContract, LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelConstructorContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Model'

/**
 * Methods of query builder to be added
 * to lucid filter
 */
const aggregates = [
  'where',
  'whereNot',
  'whereIn',
  'whereNotIn',
  'whereNull',
  'whereNotNull',
  'whereExists',
  'whereNotExists',
  'whereBetween',
  'whereNotBetween',
  'whereRaw',
  'whereHas',
  'orWhereHas',
  'whereDoesntHave',
  'orWhereDoesntHave',
  'with',
  'withCount',
  'has',
  'orHas',
  'doesntHave',
  'orDoesntHave',
]

function StaticImplements<T> () {
  return (_t: T) => {}
}

/**
 * LucidFilter class to filtering Adonis Lucid ORM
 *
 * @class LucidFilter
 * @constructor
 */
@StaticImplements<LucidFilterConstructorContract>()
export default class LucidFilter implements LucidFilterContract {
  public ['constructor']: typeof LucidFilter

  public static blacklist: string[] = []
  public static dropId: boolean = true
  public static camelCase: boolean = true

  public setup? (query: ModelQueryBuilderContract<ModelConstructorContract>): void
  private $input: InputContract
  private $query: ModelQueryBuilderContract<ModelConstructorContract>
  private $blacklist: string[]

  constructor (
    query: ModelQueryBuilderContract<ModelConstructorContract>,
    input: InputContract
  ) {
    this.$query = query
    this.$input = LucidFilter._removeEmptyInput(input)
    this.$blacklist = this.constructor.blacklist
  }

  public handle (): ModelQueryBuilderContract<ModelConstructorContract> {
    /* istanbul ignore next */
    if (this.setup && typeof this.setup === 'function') {
      this.setup(this.$query)
    }
    this._filterByInput()

    return this.$query
  }

  public whitelistMethod (method): boolean {
    const index = this.$blacklist.indexOf(method)
    if (~index) {
      this.$blacklist.splice(index, 1)
    }

    return !!~index
  }

  public input (key: string, defaultValue: any = null) {
    if (!key) {
      return this.$input
    }
    return this.$input[key] || defaultValue
  }

  private _filterByInput (): void {
    for (const key in this.$input) {
      const method = this._getFilterMethod(key)
      const value = this.$input[key]

      if (this._methodIsCallable(method)) {
        this[method](value)
      }
    }
  }

  private _getFilterMethod (key: string): string {
    const methodName = this.constructor.dropId ? key.replace(/^(.*)_id$/, '$1') : key
    return this.constructor.camelCase ? camelCase(methodName) : methodName
  }

  private static _removeEmptyInput (input: InputContract): object {
    const filterableInput = {}

    for (let key in input) {
      const value = input[key]

      if (value !== '' && value !== null) {
        filterableInput[key] = value
      }
    }
    return filterableInput
  }

  private _methodIsCallable (method: string): boolean {
    return !!this[method] &&
      typeof this[method] === 'function' &&
      !this._methodIsBlacklisted(method)
  }

  private _methodIsBlacklisted (method: string): boolean {
    return this.$blacklist.includes(method)
  }
}

aggregates.forEach((method) => {
  LucidFilter.prototype[method] = function (...args) {
    return this.$query[method](...args)
  }
})
