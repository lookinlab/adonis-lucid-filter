/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelCase from 'lodash/camelCase.js'
import type { LucidFilter, LucidFilterContract } from './types/filter.js'

function StaticImplements<T>() {
  return (_t: T) => {}
}

/**
 * Class to filtering AdonisJS Lucid ORM
 *
 * @class BaseModelFilter
 * @constructor
 */
@StaticImplements<LucidFilterContract>()
export class BaseModelFilter implements LucidFilter {
  declare ['constructor']: typeof BaseModelFilter

  static blacklist: string[] = []
  static dropId: boolean = true
  static camelCase: boolean = true

  declare setup?: ($query: any) => void
  declare $blacklist: string[]

  constructor(
    public $query: any,
    public $input: object
  ) {
    this.$input = BaseModelFilter.removeEmptyInput(this.$input)
    this.$blacklist = this.constructor.blacklist
  }

  handle(): any {
    if (this.setup && typeof this.setup === 'function') {
      this.setup(this.$query)
    }
    this.$filterByInput()

    return this.$query
  }

  whitelistMethod(method: string): boolean {
    const index = this.$blacklist.indexOf(method)

    const isBlacklisted = index !== -1
    if (isBlacklisted) this.$blacklist.splice(index, 1)

    return isBlacklisted
  }

  $filterByInput(): void {
    for (const key in this.$input) {
      const method = this.$getFilterMethod(key)

      const keyName = key as keyof typeof this.$input
      const value: unknown = this.$input[keyName]

      if (this.$methodIsCallable(method)) {
        ;(this[method as keyof this] as Function)(value)
      }
    }
  }

  $getFilterMethod(key: string): string {
    const methodName = this.constructor.dropId ? key.replace(/^(.*)(_id|Id)$/, '$1') : key
    return this.constructor.camelCase ? camelCase(methodName) : methodName
  }

  static removeEmptyInput(input: object): object {
    const filteredInput = {}

    for (const key in input) {
      const keyName = key as keyof typeof input
      const value = input[keyName]

      if (value !== '' && value !== null && value !== undefined) {
        filteredInput[keyName] = value
      }
    }
    return filteredInput
  }

  $methodIsCallable(method: string): boolean {
    const methodKey = method as keyof this

    return (
      !!this[methodKey] &&
      typeof this[methodKey] === 'function' &&
      !this.$methodIsBlacklisted(method)
    )
  }

  $methodIsBlacklisted(method: string): boolean {
    return this.$blacklist.includes(method)
  }
}
export default BaseModelFilter
