/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseModelFilter } from '../../src/base_model.js'

export default class TestModelFilter extends BaseModelFilter {
  static blacklist: string[] = ['email', 'password']

  username(username: string) {
    this.$query.where('username', 'LIKE', `%${username}%`)
  }

  email(email: string) {
    this.$query.where('email', 'LIKE', `%${email}%`)
  }

  company(id: number) {
    this.$query.where('company_id', +id)
  }

  companyId(id: number) {
    this.$query.where('company_id', +id)
  }

  isAdmin(flag: boolean) {
    this.$query.where('is_admin', flag)
  }

  title(value: string): void {
    this.$query.where('title', 'LIKE', `%${value}%`)
  }

  text(value: string): void {
    this.$query.where('text', 'LIKE', `%${value}%`)
  }

  mobilePhone(value: string) {
    console.log(value)
  }

  $select(value: string | string[]): void {
    this.$query.select(Array.isArray(value) ? value : [value])
  }
}
