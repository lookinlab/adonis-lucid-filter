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
    return ['company']
  }
  username (username) {
    return this.where('username', 'LIKE', `%${username}%`)
  }
  company (id) {
    return this.where('company_id', +id)
  }
}
module.exports = TestModelFilter
