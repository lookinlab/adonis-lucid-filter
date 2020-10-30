/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { setup, cleanup, setupApplication, getBaseModel } from '../test-helpers'
import filterable from '../src/Decorator'
import TestModelFilter from '../test-helpers/filters/TestModelFilter'
import { ModelQueryBuilder } from '@adonisjs/lucid/build/src/Orm/QueryBuilder'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { column } from '@adonisjs/lucid/build/src/Orm/Decorators'
import { LucidModel } from '@ioc:Adonis/Lucid/Model'

test.group('BaseModelFilter', (group) => {
  let app: ApplicationContract
  let BaseModel: LucidModel

  group.before(async () => {
    app = await setupApplication()
    BaseModel = getBaseModel(app)
    await setup()
  })

  group.after(() => cleanup())

  test('exists filter method when define ModelFilter to Filterable trait', (assert) => {
    @filterable(TestModelFilter)
    class TestModel extends BaseModel {}
    TestModel.boot()

    assert.instanceOf(TestModel.filter!({}), ModelQueryBuilder)
  })

  test('exists filter method when define ModelFilter to function filter', (assert) => {
    @filterable(TestModelFilter)
    class TestModel extends BaseModel {}
    TestModel.boot()

    assert.instanceOf(TestModel.filter!({}, TestModelFilter), ModelQueryBuilder)
  })

  test('filter model by input data', async (assert) => {
    @filterable(TestModelFilter)
    class User extends BaseModel {
      @column()
      public username: string

      @column()
      public email: string

      @column()
      public isAdmin: number

      @column()
      public companyId: number
    }
    User.boot()

    const user1 = new User()
    user1.fill({ username: 'Tony', email: 'tony@test.ru', isAdmin: 1, companyId: 1 })
    await user1.save()

    const user2 = new User()
    user2.fill({ username: 'Adonis', email: 'test2@test.ru', isAdmin: 0, companyId: 2 })
    await user2.save()

    const adonis = await User.filter!({ username: 'adon', email: 'test2' }, TestModelFilter).first()
    assert.deepStrictEqual(adonis!.toJSON(), user2.toJSON())

    const admin = await User.filter!({ isAdmin: 1 }, TestModelFilter).first()
    assert.deepStrictEqual(admin!.toJSON(), user1.toJSON())
  })
})
