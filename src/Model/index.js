'use strict'

/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const camelCase = require('lodash/camelCase')

/**
 * ModelFilter class to filtering Adonis Lucid ORM
 *
 * @class ModelFilter
 * @constructor
 */
class ModelFilter {
  /**
   * ModelFilter constructor
   *
   * @param {QueryBuilder} query
   * @param {Object} input
   *
   * @return {void}
   */
  constructor (query, input = {}) {
    this.$query = query
    this.$input = this._removeEmptyInput(input)
    this.$blacklist = this.constructor.blacklist
  }

  /**
   * Drop `_id` from the end of input keys when referencing methods
   *
   * @method dropId
   *
   * @return {Boolean}
   */
  static get dropId () {
    return true
  }

  /**
   * Array of method names that should not be called
   *
   * @method blacklist
   *
   * @return [String]
   */
  static get blacklist () {
    return []
  }

  /**
   * Handle all filters
   *
   * @method handle
   *
   * @return {QueryBuilder}
   */
  handle () {
    /* istanbul ignore next */
    if (this.setup && typeof (this.setup) === 'function') {
      this.setup.call(this.$query, this)
    }
    this._filterInput()

    return this.$query
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
  whitelistMethod (method) {
    const index = this.$blacklist.indexOf(method)
    if (~index) this.$blacklist.splice(index, 1)

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
  input (key = null, defaultValue = null) {
    if (key === null) {
      return this.$input
    }
    return this.$input[key] || defaultValue
  }

  /**
   * Filter with input object
   *
   * @method _filterInput
   * @private
   *
   * @return {void}
   */
  _filterInput () {
    const input = this.$input

    for (let key in input) {
      const method = this._getFilterMethod(key)
      const value = input[key]

      if (this._methodIsCallable(method)) {
        this[method].call(this.$query, value)
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
  _getFilterMethod (key) {
    return camelCase(this.constructor.dropId ? key.replace(/^(.*)_id$/, '$1') : key)
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
  _removeEmptyInput (input) {
    const filterableInput = {}

    for (let key in input) {
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
  _methodIsCallable (method) {
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
   * @param method
   *
   * @return {Boolean}
   */
  _methodIsBlacklisted (method) {
    return !!(~this.$blacklist.indexOf(method))
  }
}
module.exports = ModelFilter
