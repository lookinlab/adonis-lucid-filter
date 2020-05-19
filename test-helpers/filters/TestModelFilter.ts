/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import BaseModelFilter from '../../src/BaseModel'

export default class TestModelFilter extends BaseModelFilter {
  public static blacklist: string[] = ['company', 'password']

  constructor (public $query, public $input) {
    super($query, $input)
  }

  public username (username) {
    this.$query.where('username', 'LIKE', `%${username}%`)
  }

  public email (email) {
    this.$query.where('email', 'LIKE', `%${email}%`)
  }

  public company (id) {
    this.$query.where('company_id', +id)
  }

  public isAdmin (flag) {
    this.$query.where('is_admin', flag)
  }
}