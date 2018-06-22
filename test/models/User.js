'use strict'

/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Model = use('Model')
const Industry = require('./Industry')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('@provider:Filterable')
  }
  static get hidden () {
    return [
      'created_at',
      'updated_at',
      'password'
    ]
  }
  industries () {
    return this.belongsToMany(Industry)
  }
}

module.exports = User
