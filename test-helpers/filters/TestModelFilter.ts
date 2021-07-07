/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseModelFilter } from '../../src/BaseModel'

export default class TestModelFilter extends BaseModelFilter {
  public static blacklist: string[] = ['company', 'password']

  public username (username: string) {
    this.$query.where('username', 'LIKE', `%${username}%`)
  }

  public email (email: string) {
    this.$query.where('email', 'LIKE', `%${email}%`)
  }

  public company (id: number) {
    this.$query.where('company_id', +id)
  }

  public companyId (id: number) {
    this.$query.where('company_id', +id)
  }

  public isAdmin (flag: boolean) {
    this.$query.where('is_admin', flag)
  }

  public title (value: string): void {
    this.$query.where('title', 'LIKE', `%${value}%`)
  }

  public text (value: string): void {
    this.$query.where('text', 'LIKE', `%${value}%`)
  }

  public mobilePhone (value: string) {
    console.log(value)
  }
}
