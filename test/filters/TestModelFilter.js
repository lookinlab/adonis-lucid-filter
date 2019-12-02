'use strict'

/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const ModelFilter = require('../../src/Model')

class TestModelFilter extends ModelFilter {
  static get blacklist () {
    return ['company', 'password']
  }

  username (username) {
    return this.where('username', 'LIKE', `%${username}%`)
  }

  email (email) {
    return this.where('email', 'LIKE', `%${email}%`)
  }

  company (id) {
    return this.where('company_id', +id)
  }

  industry (id) {
    return this.related('industries', 'industry_id', +id)
  }

  revenue (revenue) {
    return this.related('industries', 'revenue', '>', revenue)
  }

  isAdmin (flag) {
    return this.where('is_admin', flag)
  }
}
module.exports = TestModelFilter
