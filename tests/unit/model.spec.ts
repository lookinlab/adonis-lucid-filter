/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { BaseModel } from '@adonisjs/lucid/orm'
import BaseModelFilter from '../../src/base_model.js'
import TestModelFilter from '../filters/test_model_filter.js'

test.group('ModelFilter', () => {
  test('remove empty input', async ({ assert }) => {
    const filteredInput = TestModelFilter.removeEmptyInput({
      username: 'Tony',
      email: '',
      company_id: 2,
      roles: [1, 4, 7],
      industry: 5,
      surname: undefined,
    })

    for (const key in filteredInput) {
      const keyName = key as keyof typeof filteredInput

      assert.notStrictEqual(filteredInput[keyName], '')
      assert.notStrictEqual(filteredInput[keyName], undefined)
    }
  })

  test('get filter method name in camelCase and without _id', ({ assert }) => {
    class User extends BaseModel {}
    User.boot()

    const filter = new TestModelFilter(User.query(), {
      username: 'Tony',
      email: '',
      company: 2,
      companyId: 2,
      company_id: 2,
      roles: [1, 4, 7],
      industry: 5,
      surname: undefined,
    })

    const standard = {
      username: 'username',
      company: 'company',
      companyId: 'company',
      company_id: 'company',
      first_name: 'firstName',
    }

    for (const key in standard) {
      const keyName = key as keyof typeof standard
      assert.strictEqual(filter.$getFilterMethod(key), standard[keyName])
    }
  })

  test('get filter method name in camelCase and with _id', ({ assert }) => {
    class User extends BaseModel {}
    User.boot()

    class UserFilter extends BaseModelFilter {
      static dropId: boolean = false
    }

    const userFilter = new UserFilter(User.query(), {})
    assert.strictEqual(userFilter.$getFilterMethod('company_id'), 'companyId')
    assert.strictEqual(userFilter.$getFilterMethod('companyId'), 'companyId')
  })

  test('whitelist method and method is callable', ({ assert }) => {
    class User extends BaseModel {}
    User.boot()

    const userFilter = new TestModelFilter(User.query(), {
      username: 'Tony',
      email: '',
      company_id: 2,
      roles: [1, 4, 7],
      industry: 5,
      surname: undefined,
    })
    userFilter.handle()

    assert.strictEqual(userFilter.$methodIsCallable('email'), false)
    assert.strictEqual(userFilter.$methodIsBlacklisted('email'), true)

    const result = userFilter.whitelistMethod('email')
    assert.strictEqual(result, true)
    assert.notInclude(userFilter.$blacklist, 'email')
    assert.strictEqual(userFilter.$methodIsCallable('email'), true)

    const result2 = userFilter.whitelistMethod('missing_key')
    assert.strictEqual(result2, false)
  })
})
