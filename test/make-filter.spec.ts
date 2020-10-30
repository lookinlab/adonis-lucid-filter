/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { join } from 'path'
import { Kernel } from '@adonisjs/ace'
import { Filesystem } from '@poppinss/dev-utils'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { toNewlineArray, setupApplication } from '../test-helpers'

import MakeModelFilter from '../commands/MakeModelFilter'

test.group('MakeModelFilter', (group) => {
  let app: ApplicationContract
  let fs: Filesystem
  let templatesFs: Filesystem

  group.before(async () => {
    app = await setupApplication()

    fs = new Filesystem(app.appRoot)
    templatesFs = new Filesystem(join(app.appRoot, '../..', 'templates'))
  })

  group.after(() => fs.cleanup())

  test('make a model inside the default directory', async (assert) => {
    const makeModelFilter = new MakeModelFilter(app, new Kernel(app))
    makeModelFilter.name = 'User'
    await makeModelFilter.run()

    const userFilter = await fs.get('app/Models/Filters/UserFilter.ts')
    const schemaTemplate = await templatesFs.get('filter.txt')

    assert.deepStrictEqual(
      toNewlineArray(userFilter),
      toNewlineArray(
        schemaTemplate
          .replace('{{ filename }}', 'UserFilter')
          .replace(/{{ model }}/g, 'User')
      ),
    )
  })

  test('make a model when name as lowercase', async (assert) => {
    const makeModelFilter = new MakeModelFilter(app, new Kernel(app))
    makeModelFilter.name = 'profile'
    await makeModelFilter.run()

    const profileFilter = await fs.get('app/Models/Filters/ProfileFilter.ts')
    const schemaTemplate = await templatesFs.get('filter.txt')

    assert.deepStrictEqual(
      toNewlineArray(profileFilter),
      toNewlineArray(
        schemaTemplate
          .replace('{{ filename }}', 'ProfileFilter')
          .replace(/{{ model }}/g, 'Profile')
      ),
    )
  })
})
