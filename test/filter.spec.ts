/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { setup, cleanup } from '../test-helpers'
import TestModelFilter from '../test-helpers/filters/TestModelFilter'
import filterable from '../src/Decorator'
import { User, Industry, BaseModel } from '../test-helpers/models'
import { ModelQueryBuilder } from '@adonisjs/lucid/build/src/Orm/QueryBuilder'

test.group('BaseModelFilter', (group) => {
  let user1
  let user2

  group.before(async () => {
    await setup()

    User.boot()
    Industry.boot()

    user1 = new User()
    user1.fill({ username: 'Anton', email: 'test@test.ru', is_admin: 1, company_id: 1 })
    await user1.save()

    user2 = new User()
    user2.fill({ username: 'Adonis', email: 'test2@test.ru', is_admin: 0, company_id: 2 })
    await user2.save()
  })

  group.after(async () => {
    await cleanup()
  })

  test('exists filter method when define ModelFilter to Filterable trait', (assert) => {
    @filterable(TestModelFilter)
    class TestModel extends BaseModel {
    }
    TestModel.boot()

    assert.instanceOf(TestModel.filter!({}), ModelQueryBuilder)
  })

  test('exists filter method when define ModelFilter to function filter', (assert) => {
    @filterable(TestModelFilter)
    class TestModel extends BaseModel {
    }
    TestModel.boot()

    assert.instanceOf(TestModel.filter!({}, TestModelFilter), ModelQueryBuilder)
  })

  test('filter model by input data', async (assert) => {
    const input1 = {
      username: 'adon',
      email: 'test2',
    }
    const input2 = {
      isAdmin: true,
    }

    const adonis = await User.filter!(input1, TestModelFilter).first()
    assert.deepStrictEqual(adonis!.toJSON(), user2.toJSON())

    const anton = await User.filter!(input2, TestModelFilter).first()
    assert.deepStrictEqual(anton!.toJSON(), user1.toJSON())
  })

  // test('filter model by input data with relationship', async (assert) => {
  //   await user1.related('industries').createMany([
  //     { title: 'Industry 1', revenue: 10000 },
  //     { title: 'Industry 2', revenue: 20000 },
  //     { title: 'Industry 3', revenue: 50000 }
  //   ])
  //
  //   await user2.related('industries').createMany([
  //     { title: 'Industry 4', revenue: 25000 },
  //     { title: 'Industry 5', revenue: 35000 }
  //   ])
  //
  //   const userByIndustry2 = await User.filter({ industry: 2 }, TestModelFilter).first()
  //   assert.deepEqual(userByIndustry2.toJSON(), user1.toJSON())
  //
  //   const userByIndustry5 = await User.query().filter({ industry: 5 }, TestModelFilter).first()
  //   assert.deepEqual(userByIndustry5.toJSON(), user2.toJSON())
  //
  //   const userByRevenue = await User.query().filter({ revenue: 40000 }, TestModelFilter).first()
  //   assert.deepEqual(userByRevenue.toJSON(), user1.toJSON())
  // })
})
