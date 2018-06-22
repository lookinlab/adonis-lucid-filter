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
const ModelFilter = require('../src/Model')
const TestModelFilter = require('./filters/TestModelFilter')

test.group('ModelFilter', (group) => {
  let filter, input
  let User

  group.before(async () => {
    await setup.up()

    User = require('./models/User')
  })

  group.beforeEach(() => {
    User._bootIfNotBooted()

    input = {
      'username': 'er',
      'email': '',
      'company_id': 2,
      'roles': [1, 4, 7],
      'industry': 5
    }
    filter = new TestModelFilter(User.query(), input)
  })

  group.after(async () => {
    await setup.down()
  })

  test('remove empty input', (assert) => {
    const filteredInput = filter._removeEmptyInput(input)

    for (let key in filteredInput) {
      assert.notEqual(filteredInput[key], '')
    }
  })

  test('get filter method name in camelCase and without _id', (assert) => {
    const standard = {
      username: 'username',
      company_id: 'company',
      first_name: 'firstName'
    }

    for (let key in standard) {
      assert.equal(filter._getFilterMethod(key), standard[key])
    }
  })

  test('get filter method name in camelCase and with _id', (assert) => {
    class UserFilter extends ModelFilter {
      static get dropId () {
        return false
      }
    }

    const userFilter = new UserFilter(User.query())
    assert.equal(userFilter._getFilterMethod('company_id'), 'companyId')
  })

  test('input method of filter model', (assert) => {
    const filteredInput = filter._removeEmptyInput(input)

    for (let key in filteredInput) {
      assert.equal(filter.input(key), filteredInput[key])
    }

    assert.deepEqual(filter.input(), filteredInput)
    assert.isNull(filter.input('missing_key'))
    assert.equal(filter.input('missing_key', 'my_default'), 'my_default')
  })

  test('whitelist method and method is callable', (assert) => {
    const userFilter = new TestModelFilter(User.query(), input)
    userFilter.handle()

    assert.equal(userFilter._methodIsCallable('company'), false)
    assert.equal(userFilter._methodIsBlacklisted('company'), true)

    const result = userFilter.whitelistMethod('company')
    assert.equal(result, true)
    assert.notInclude(userFilter.$blacklist, 'company')
    assert.equal(userFilter._methodIsCallable('company'), true)

    const result2 = userFilter.whitelistMethod('missing_key')
    assert.equal(result2, false)
  })
})
