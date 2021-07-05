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
import { filterable } from '../src/Decorators'
import TestModelFilter from '../test-helpers/filters/TestModelFilter'
import { ModelQueryBuilder } from '@adonisjs/lucid/build/src/Orm/QueryBuilder'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { column, manyToMany } from '@adonisjs/lucid/build/src/Orm/Decorators'
import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import { ManyToMany } from '@ioc:Adonis/Lucid/Orm'

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

  test('filter model through filtration scope', async (assert) => {
    @filterable(TestModelFilter)
    class Industry extends BaseModel {
      @column()
      public title: string

      @column()
      public text: string
    }
    Industry.boot()

    const industry1 = new Industry()
    industry1.fill({ title: 'Tony industry', text: 'Text for Tony industry' })
    await industry1.save()

    const industry2 = new Industry()
    industry2.fill({ title: 'Adonis industry', text: 'Text for Adonis industry' })
    await industry2.save()

    const tonyIndustry = await Industry.query()
      .apply(scopes => scopes.filtration({ title: 'Tony industry' }))
      .first()
    assert.deepStrictEqual(tonyIndustry!.toJSON(), industry1.toJSON())

    const adonisIndustry = await Industry.query()
      .apply(scopes => scopes.filtration({ text: 'Adonis' }))
      .first()
    assert.deepStrictEqual(adonisIndustry!.toJSON(), industry2.toJSON())
  })

  test('filter relations through filtration scope', async (assert) => {
    @filterable(TestModelFilter)
    class User extends BaseModel {
      @column()
      public id: number

      @column()
      public username: string

      @column()
      public email: string

      @column()
      public isAdmin: number

      @column()
      public companyId: number

      @manyToMany(() => Industry)
      public industries: ManyToMany<typeof Industry>
    }
    User.boot()

    const user = new User()
    user.fill({ username: 'Lookin', email: 'lookin@test.ru', isAdmin: 1, companyId: 1 })
    await user.save()

    @filterable(TestModelFilter)
    class Industry extends BaseModel {
      @column()
      public id: number

      @column()
      public title: string

      @column()
      public text: string

      @column()
      public authorId: number
    }
    Industry.boot()

    await user.related('industries').createMany([
      {
        title: 'Industry 1',
        text: 'Industry by Lookin',
      },
      {
        title: 'Industry 2',
        text: 'Industry by Lookin',
      },
      {
        title: 'Industry 3',
        text: 'Industry by Adonis',
      },
    ])

    const lookinIndustries = await user.related('industries').query()
      .apply(scopes => scopes.filtration({ text: 'Lookin' }))
      .exec()

    assert.lengthOf(lookinIndustries, 2)
  })
})
