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
import { Application } from '@adonisjs/application/build/standalone'
import { toNewlineArray } from '../test-helpers'

import MakeModelFilter from '../commands/MakeModelFilter'

const fs = new Filesystem(join(__dirname, '__app'))
const templatesFs = new Filesystem(join(__dirname, '..', 'templates'))

test.group('MakeModelFilter', (group) => {
  group.afterEach(async () => {
    delete process.env.ADONIS_ACE_CWD
    await fs.cleanup()
  })

  test('make a model inside the default directory', async (assert) => {
    process.env.ADONIS_ACE_CWD = fs.basePath
    const app = new Application(join(fs.basePath, 'build'), {} as any, {} as any, {})

    const makeModelFilter = new MakeModelFilter(app, new Kernel(app))
    makeModelFilter.name = 'user'
    await makeModelFilter.handle()

    const userFilter = await fs.get('app/Models/Filters/UserFilter.ts')
    const schemaTemplate = await templatesFs.get('filter.txt')

    assert.deepStrictEqual(
      toNewlineArray(userFilter),
      toNewlineArray(schemaTemplate.replace('{{ filename }}', 'UserFilter')),
    )
  })
})
