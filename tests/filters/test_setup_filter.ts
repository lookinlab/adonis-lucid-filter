/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseModelFilter } from '../../src/base_model.js'

export default class TestSetupFilter extends BaseModelFilter {
  static blacklist: string[] = ['email', 'password']
  static camelCase = false

  setup(query: any) {
    query.where('is_active', true)
  }

  username(username: string) {
    this.$query.where('username', 'LIKE', `%${username}%`)
  }

  email(email: string) {
    this.$query.where('email', 'LIKE', `%${email}%`)
  }
}
