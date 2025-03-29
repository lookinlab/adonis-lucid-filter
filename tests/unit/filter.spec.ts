/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, ModelQueryBuilder, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import { extendModelQueryBuilder } from '../../src/bindings/model_query_builder.js'
import { createDatabase, createTables } from '../helpers.js'
import { Filterable } from '../../src/mixin.js'
import TestModelFilter from '../filters/test_model_filter.js'
import TestSetupFilter from '../filters/test_setup_filter.js'

test.group('BaseModelFilter', (group) => {
  group.setup(() => extendModelQueryBuilder(ModelQueryBuilder))

  test('exists filter method when define ModelFilter to Filterable mixin', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    class TestModel extends compose(BaseModel, Filterable) {
      static $filter = () => TestModelFilter
    }
    TestModel.boot()

    assert.instanceOf(TestModel.filter({}), ModelQueryBuilder)
    assert.instanceOf(TestModel.query().filter({}), ModelQueryBuilder)
  })

  test('exists filter method when define ModelFilter to function filter', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    class TestModel extends compose(BaseModel, Filterable) {
      static $filter = () => TestSetupFilter
    }
    TestModel.boot()

    assert.equal(
      TestModel.filter({ email: 'test' }).toQuery(),
      'select * from `test_models` where `is_active` = true'
    )
    assert.instanceOf(TestModel.filter({}, TestModelFilter), ModelQueryBuilder)
  })

  test('filter model by input data', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    class User extends compose(BaseModel, Filterable) {
      static $filter = () => TestModelFilter

      @column()
      declare username: string

      @column()
      declare email: string

      @column()
      declare isAdmin: number

      @column()
      declare companyId: number
    }
    User.boot()

    const user1 = new User()
    user1.fill({ username: 'Tony', email: 'tony@test.ru', isAdmin: 1, companyId: 1 })
    await user1.save()

    const user2 = new User()
    user2.fill({ username: 'Adonis', email: 'test2@test.ru', isAdmin: 0, companyId: 2 })
    await user2.save()

    const adonis = await User.filter({ username: 'adon', email: 'test2' }, TestModelFilter).first()
    assert.deepEqual(adonis!.toJSON(), user2.toJSON())

    const admin = await User.filter({ isAdmin: true }, TestModelFilter).first()
    assert.deepEqual(admin!.toJSON(), user1.toJSON())

    const companyUsers = await User.filter({ companyId: 2 }, TestModelFilter).exec()
    const companyUsersWithoutId = await User.filter({ company: 2 }, TestModelFilter).exec()
    assert.lengthOf(companyUsers, 1)
    assert.lengthOf(companyUsersWithoutId, companyUsers.length)

    const selected = await User.filter({ $select: ['username', 'email'] }, TestModelFilter).first()
    assert.properties(selected!.toJSON(), ['username', 'email'])
    assert.notAllProperties(selected!.toJSON(), ['isAdmin', 'companyId'])
  })

  test('filter model through filtration scope', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    class Industry extends compose(BaseModel, Filterable) {
      static $filter = () => TestModelFilter

      @column()
      declare title: string

      @column()
      declare text: string
    }
    Industry.boot()

    const industry1 = new Industry()
    industry1.fill({ title: 'Tony industry', text: 'Text for Tony industry' })
    await industry1.save()

    const industry2 = new Industry()
    industry2.fill({ title: 'Adonis industry', text: 'Text for Adonis industry' })
    await industry2.save()

    const tonyIndustry = await Industry.query()
      .apply((scopes) => scopes.filtration({ title: 'Tony industry' }))
      .first()
    assert.deepEqual(tonyIndustry!.toJSON(), industry1.toJSON())

    const adonisIndustry = await Industry.query()
      .apply((scopes) => scopes.filtration({ text: 'Adonis' }))
      .first()
    assert.deepEqual(adonisIndustry!.toJSON(), industry2.toJSON())
  })

  test('filter relations through filtration scope', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    class User extends compose(BaseModel, Filterable) {
      static $filter = () => TestModelFilter

      @column()
      declare id: number

      @column()
      declare username: string

      @column()
      declare email: string

      @column()
      declare isAdmin: number

      @column()
      declare companyId: number

      @manyToMany(() => Industry)
      declare industries: ManyToMany<typeof Industry>
    }
    User.boot()

    const user = new User()
    user.fill({ username: 'Lookin', email: 'lookin@test.ru', isAdmin: 1, companyId: 1 })
    await user.save()

    class Industry extends compose(BaseModel, Filterable) {
      static $filter = () => TestModelFilter

      @column()
      declare id: number

      @column()
      declare title: string

      @column()
      declare text: string

      @column()
      declare authorId: number
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

    const lookinIndustries = await user
      .related('industries')
      .query()
      .apply((scopes) => scopes.filtration({ text: 'Lookin' }))
      .exec()

    assert.lengthOf(lookinIndustries, 2)
  })

  test('filter of query exists into not Filterable model', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    class TestModel extends BaseModel {}
    TestModel.boot()

    assert.isFunction(TestModel.query().filter)
  })

  test('filter relations through filter of query', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    class User extends compose(BaseModel, Filterable) {
      static $filter = () => TestModelFilter

      @column()
      declare id: number

      @column()
      declare username: string

      @column()
      declare email: string

      @column()
      declare isAdmin: number

      @column()
      declare companyId: number

      @manyToMany(() => Industry)
      declare industries: ManyToMany<typeof Industry>
    }
    User.boot()

    const user = new User()
    user.fill({ username: 'Lookin1', email: 'lookin1@test.ru', isAdmin: 1, companyId: 1 })
    await user.save()

    class Industry extends compose(BaseModel, Filterable) {
      static $filter = () => TestModelFilter

      @column()
      declare id: number

      @column()
      declare title: string

      @column()
      declare text: string

      @column()
      declare authorId: number
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

    const lookinIndustries = await user
      .related('industries')
      .query()
      .filter({ text: 'Adonis' })
      .exec()

    assert.lengthOf(lookinIndustries, 1)
  })
})
