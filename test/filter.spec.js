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
  let User, Industry
  let user1, user2

  group.before(async () => {
    await setup.up()
    ioc.bind('Filterable', () => new LucidFilter())

    User = require('./models/User')
    Industry = require('./models/Industry')

    User._bootIfNotBooted()
    Industry._bootIfNotBooted()

    user1 = new User()
    user1.fill({ username: 'Anton', email: 'test@test.ru', is_admin: 1, company_id: 1 })
    await user1.save()

    user2 = new User()
    user2.fill({ username: 'Adonis', email: 'test2@test.ru', is_admin: 0, company_id: 2 })
    await user2.save()
  })

  group.after(async () => {
    await setup.down()
  })

  test('throw exception when ModelFilter are not defined', (assert) => {
    const Model = use('Model')
    class TestModel extends Model {
      static boot () {
        super.boot()
        this.addTrait('@provider:Filterable')
      }
    }
    TestModel._bootIfNotBooted()

    const fn = () => TestModel.query().filter()
    assert.throws(fn, 'Make sure to pass ModelFilter as 2nd parameter to Filterable trait or function filter')
  })

  test('exists filter method when define ModelFilter to Filterable trait', (assert) => {
    const Model = use('Model')
    class TestModel extends Model {
      static boot () {
        super.boot()
        this.addTrait('@provider:Filterable', TestModelFilter)
      }
    }
    TestModel._bootIfNotBooted()

    assert.instanceOf(TestModel.query().filter({}), TestModel.QueryBuilder)
  })

  test('exists filter method when define ModelFilter to function filter', (assert) => {
    const Model = use('Model')
    class TestModel extends Model {
      static boot () {
        super.boot()
        this.addTrait('@provider:Filterable')
      }
    }
    TestModel._bootIfNotBooted()

    assert.instanceOf(TestModel.query().filter({}, TestModelFilter), TestModel.QueryBuilder)
  })

  test('filter model by input data', async (assert) => {
    const input1 = {
      username: 'adon',
      email: 'test2'
    }
    const input2 = {
      isAdmin: true
    }

    const adonis = await User.query().filter(input1, TestModelFilter).first()
    assert.deepEqual(adonis.toJSON(), user2.toJSON())

    const anton = await User.query().filter(input2, TestModelFilter).first()
    assert.deepEqual(anton.toJSON(), user1.toJSON())
  })

  test('filter model by input data with relationship', async (assert) => {
    await user1.industries().createMany([
      { title: 'Industry 1', revenue: 10000 },
      { title: 'Industry 2', revenue: 20000 },
      { title: 'Industry 3', revenue: 50000 }
    ])

    await user2.industries().createMany([
      { title: 'Industry 4', revenue: 25000 },
      { title: 'Industry 5', revenue: 35000 }
    ])

    const userByIndustry2 = await User.query().filter({ industry: 2 }, TestModelFilter).first()
    assert.deepEqual(userByIndustry2.toJSON(), user1.toJSON())

    const userByIndustry5 = await User.query().filter({ industry: 5 }, TestModelFilter).first()
    assert.deepEqual(userByIndustry5.toJSON(), user2.toJSON())

    const userByRevenue = await User.query().filter({ revenue: 40000 }, TestModelFilter).first()
    assert.deepEqual(userByRevenue.toJSON(), user1.toJSON())
  })
})
