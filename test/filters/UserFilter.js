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

class UserFilter extends ModelFilter {
  username (name) {
    return this.where('username', 'LIKE', `%${name}%`)
  }
}
module.exports = UserFilter
