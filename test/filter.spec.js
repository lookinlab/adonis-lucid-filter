'use strict'

/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const test = require('japa')
const setup = require('./helpers/setup')
const { ioc } = require('@adonisjs/fold')
const LucidFilter = require('../src/LucidFilter')
const TestModelFilter = require('./filters/TestModelFilter')

test.group('LucidFilter', (group) => {
  group.before(async () => {
    await setup.up()
    ioc.bind('Filterable', () => new LucidFilter())
  })

  group.after(async () => {
    await setup.down()
  })

  test('throw exception when ModelFilter are not defined', (assert) => {
    const Model = use('Model')
    class User extends Model {
      static boot () {
        super.boot()
        this.addTrait('@provider:Filterable')
      }
    }
    User._bootIfNotBooted()

    const fn = () => User.query().filter()
    assert.throws(fn, 'E_INVALID_PARAMETER: Make sure to pass ModelFilter as 2nd parameter to Filterable trait or function filter')
  })

  test('exists filter method when define ModelFilter to Filterable trait', (assert) => {
    const Model = use('Model')
    class User extends Model {
      static boot () {
        super.boot()
        this.addTrait('@provider:Filterable', TestModelFilter)
      }
    }
    User._bootIfNotBooted()

    assert.instanceOf(User.query().filter({}), User.QueryBuilder)
  })

  test('exists filter method when define ModelFilter to function filter', (assert) => {
    const Model = use('Model')
    class User extends Model {
      static boot () {
        super.boot()
        this.addTrait('@provider:Filterable')
      }
    }
    User._bootIfNotBooted()

    assert.instanceOf(User.query().filter({}, TestModelFilter), User.QueryBuilder)
  })
})
