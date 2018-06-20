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
const path = require('path')
const MakeModelFilter = require('../commands/MakeModelFilter')
const { Helpers } = require('@adonisjs/sink')
const { Command } = require('@adonisjs/ace')
const { ioc } = require('@adonisjs/fold')
const ModelFilter = require('../src/Model')

test.group('Make ModelFilter', (group) => {
  group.before(async () => {
    ioc.bind('ModelFilter', () => ModelFilter)

    await new Command().pathExists(path.join(__dirname, './app'))
  })

  group.beforeEach(async () => {
    await new Command().emptyDir(path.join(__dirname, './app'))
  })

  group.after(async () => {
    await new Command().removeDir(path.join(__dirname, './app'))
  })

  test('make a model filter class', async (assert) => {
    const make = new MakeModelFilter(new Helpers(path.join(__dirname)))

    // Name without word 'Filter'
    await make.handle({ name: 'User' })
    const UserFilter = require(path.join(__dirname, './app/ModelFilters/UserFilter'))

    // Name with word 'Filter'
    await make.handle({ name: 'PostFilter' })
    const PostFilter = require(path.join(__dirname, './app/ModelFilters/PostFilter'))

    assert.equal(UserFilter.name, 'UserFilter')
    assert.equal(PostFilter.name, 'PostFilter')
    assert.instanceOf(new UserFilter(), ModelFilter)
  })

  test('return error when file already exists', async (assert) => {
    assert.plan(1)

    const make = new MakeModelFilter(new Helpers(path.join(__dirname)))
    await make.handle({ name: 'UserFilter' })
    try {
      await make.handle({ name: 'UserFilter' })
    } catch ({ message }) {
      assert.match(message, /UserFilter\.js already exists/)
    }
  })
})
