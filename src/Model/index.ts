/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'
const _ = require('lodash')

/**
 * Methods of query builder to be added
 * to model filter
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
export default class LucidFilter implements LucidFilterContract {
  public $input
  public $blacklist: string[] = []
  public setup? (query: any): void

  constructor (private query, input = {}) {
    this.$input = this._removeEmptyInput(input)
  }

  /**
   * Drop `_id` from the end of input keys when referencing methods
   *
   * @method dropId
   * @static
   *
   * @return {Boolean}
   */
  public get dropId (): boolean {
    return true
  }

  /**
   * Handle all filters
   *
   * @method handle
   *
   * @return {QueryBuilder}
   */
  public handle () {
    /* istanbul ignore next */
    if (this.setup && typeof (this.setup) === 'function') {
      this.setup(this.query)
    }
    this._filterInput()

    return this.query
  }

  /**
   * Remove a method from the blacklist
   *
   * @method whitelistMethod
   *
   * @param {String} method
   *
   * @return {Boolean}
   */
  public whitelistMethod (method) {
    const index = this.$blacklist.indexOf(method)
    if (~index) {
      this.$blacklist.splice(index, 1)
    }

    return (!!~index)
  }

  /**
   * Retrieve input by key or all input as object
   *
   * @method input
   *
   * @param {String} key
   * @param {String} defaultValue
   *
   * @return {Object|String|Null}
   */
  public input (key = '', defaultValue = null) {
    if (key) {
      return this.$input
    }
    return this.$input[key] || defaultValue
  }

  /**
   * Add a where constraint to a relationship
   *
   * @method related
   *
   * @param {String} relation
   * @param {String} column
   * @param {String|Number} operator
   * @param {String|Number} value
   *
   * @return {QueryBuilder}
   */
  public related (relation, column, operator, value = null) {
    if (value === null) {
      value = operator
      operator = '='
    }
    return this.query.whereHas(relation, (builder) => {
      builder.where(column, operator, value)
    })
  }

  /**
   * Filter with input object
   *
   * @method _filterInput
   * @private
   *
   * @return {void}
   */
  private _filterInput () {
    const input = this.$input

    for (const key in input) {
      const method = this._getFilterMethod(key)
      const value = input[key]

      if (this._methodIsCallable(method)) {
        this[method](value)
      }
    }
  }

  /**
   * Get filter method name
   *
   * @method _getFilterMethod
   * @private
   *
   * @param {String} key
   *
   * @return {String}
   */
  private _getFilterMethod (key) {
    return _.camelCase(this.dropId ? key.replace(/^(.*)_id$/, '$1') : key)
  }

  /**
   * Remove empty strings from the input data
   *
   * @method _removeEmptyInput
   * @private
   *
   * @param {Object} input
   *
   * @return {Object}
   */
  private _removeEmptyInput (input) {
    const filterableInput = {}

    for (const key in input) {
      const value = input[key]

      if (value !== '' && value !== null) {
        filterableInput[key] = value
      }
    }
    return filterableInput
  }

  /**
   * Check if the method is not blacklisted
   * and callable on the extended class
   *
   * @method _methodIsCallable
   * @private
   *
   * @param {String} method
   *
   * @return {Boolean}
   */
  private _methodIsCallable (method) {
    return !!this[method] &&
      !this._methodIsBlacklisted(method) &&
      typeof (this[method]) === 'function'
  }

  /**
   * Check if the method exists in blacklist
   *
   * @method _methodIsBlacklisted
   * @private
   *
   * @param {String} method
   *
   * @return {Boolean}
   */
  private _methodIsBlacklisted (method) {
    return !!(~this.$blacklist.indexOf(method))
  }
}

aggregates.forEach((method) => {
  LucidFilter.prototype[method] = function (...args) {
    return this.query[method](...args)
  }
})
