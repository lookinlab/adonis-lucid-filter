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
import BaseModelFilter from '../src/BaseModel'
import TestModelFilter from '../test-helpers/filters/TestModelFilter'
import User from '../test-helpers/models/User'

test.group('ModelFilter', (group) => {
  let filter
  let input

  group.before(() => setup())
  group.beforeEach(() => {
    User.boot()

    input = {
      username: 'Tony',
      email: '',
      company_id: 2,
      roles: [1, 4, 7],
      industry: 5,
      surname: undefined,
    }
    filter = new TestModelFilter(User.query(), input)
  })
  group.after(() => cleanup())

  test('remove empty input', (assert) => {
    const filteredInput = TestModelFilter.removeEmptyInput(input)

    for (const key in filteredInput) {
      assert.notStrictEqual(filteredInput[key], '')
      assert.notStrictEqual(filteredInput[key], undefined)
    }
  })

  test('get filter method name in camelCase and without _id', (assert) => {
    const standard = {
      username: 'username',
      company_id: 'company',
      first_name: 'firstName',
    }

    for (const key in standard) {
      assert.strictEqual(filter.$getFilterMethod(key), standard[key])
    }
  })

  test('get filter method name in camelCase and with _id', (assert) => {
    class UserFilter extends BaseModelFilter {
      public static dropId: boolean = false
    }

    const userFilter = new UserFilter(User.query(), {})
    assert.strictEqual(userFilter.$getFilterMethod('company_id'), 'companyId')
  })

  test('whitelist method and method is callable', (assert) => {
    const userFilter = new TestModelFilter(User.query(), input)
    userFilter.handle()

    assert.strictEqual(userFilter.$methodIsCallable('company'), false)
    assert.strictEqual(userFilter.$methodIsBlacklisted('company'), true)

    const result = userFilter.whitelistMethod('company')
    assert.strictEqual(result, true)
    assert.notInclude(userFilter.$blacklist, 'company')
    assert.strictEqual(userFilter.$methodIsCallable('company'), true)

    const result2 = userFilter.whitelistMethod('missing_key')
    assert.strictEqual(result2, false)
  })
})
