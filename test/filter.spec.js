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

  test('throw exception when Filter are not defined', (assert) => {
    const Model = use('Model')
    class User extends Model {
      static boot () {
        super.boot()
        this.addTrait('@provider:Filterable', null)
      }
    }

    const fn = () => User._bootIfNotBooted()
    assert.throw(fn, 'E_INVALID_PARAMETER: Make sure to pass Filter as 2nd parameter to Filterable trait')
  })

  test('exists filter method when define model filter and return QueryBuilder instance', (assert) => {
    const Model = use('Model')
    class User extends Model {
      static boot () {
        super.boot()
        this.addTrait('@provider:Filterable', TestModelFilter)
      }
    }

    User._bootIfNotBooted()

    assert.exists(User.query().filter)
    assert.instanceOf(User.query().filter(), User.QueryBuilder)
  })
})
