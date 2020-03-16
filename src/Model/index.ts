/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ModelQueryBuilder } from '@adonisjs/lucid/build/src/Orm/QueryBuilder'
import camelCase from 'lodash/camelCase'

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

/**
 * LucidFilter class to filtering Adonis Lucid ORM
 *
 * @class LucidFilter
 * @constructor
 */
export default class LucidFilter {
  public static blacklist: string[] = []
  public static dropId: boolean = true
  public static setup? (query: any): void
  public static camelCase: boolean = true

  private static $input: object
  private static $query: any

  public static handle (query: ModelQueryBuilder, input): ModelQueryBuilder {
    this.$input = this._removeEmptyInput(input)
    this.$query = query

    /* istanbul ignore next */
    if (this.setup && typeof (this.setup) === 'function') {
      this.setup(query)
    }
    this._filterByInput()

    return query
  }

  public static whitelistMethod (method): boolean {
    const index = this.blacklist.indexOf(method)
    if (~index) {
      this.blacklist.splice(index, 1)
    }

    return !!~index
  }

  public static input (key: string, defaultValue: any = null) {
    if (!key) {
      return this.$input
    }
    return this.$input[key] || defaultValue
  }

  public static related (relation, column, operator, value: any = null) {
    if (value === null) {
      value = operator
      operator = '='
    }
    this.$query.whereHas(relation, (builder) => {
      builder.where(column, operator, value)
    })
  }

  private static _filterByInput (): void {
    for (const key in this.$input) {
      const method = this._getFilterMethod(key)
      const value = this.$input[key]

      if (this._methodIsCallable(method)) {
        this[method](value)
      }
    }
  }

  private static _getFilterMethod (key): string {
    const methodName = this.dropId ? key.replace(/^(.*)_id$/, '$1') : key
    return this.camelCase ? camelCase(methodName) : methodName
  }

  private static _removeEmptyInput (input): object {
    const filterableInput = {}

    for (let key in input) {
      const value = input[key]

      if (value !== '' && value !== null) {
        filterableInput[key] = value
      }
    }
    return filterableInput
  }

  private static _methodIsCallable (method): boolean {
    return !!this[method] &&
      !this._methodIsBlacklisted(method) &&
      typeof (this[method]) === 'function'
  }

  private static _methodIsBlacklisted (method): boolean {
    return !!~this.blacklist.indexOf(method)
  }
}

aggregates.forEach((method) => {
  LucidFilter[method] = function (...args) {
    return this.$query[method](...args)
  }
})
