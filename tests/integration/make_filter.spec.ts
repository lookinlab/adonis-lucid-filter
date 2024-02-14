/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { AceFactory } from '@adonisjs/core/factories'
import MakeFilter from '../../commands/make_filter.js'

test.group('MakeFilter', () => {
  test('make a model inside the default directory', async ({ assert, fs }) => {
    const ace = await new AceFactory().make(fs.baseUrl, { importer: () => {} })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeFilter, ['user'])
    await command.exec()

    command.assertLog('green(DONE:)    create app/models/filters/user_filter.ts')
    await assert.fileContains(
      'app/models/filters/user_filter.ts',
      `import { BaseModelFilter } from 'adonis-lucid-filter'`
    )
    await assert.fileContains(
      'app/models/filters/user_filter.ts',
      `export default class UserFilter extends BaseModelFilter {`
    )
  })
})
