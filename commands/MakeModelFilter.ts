/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { join } from 'path'
import { BaseCommand, args } from '@adonisjs/ace'

export default class MakeModelFilter extends BaseCommand {
  public static commandName = 'make:filter'
  public static description = 'Make a new Lucid filter'

  /**
   * The name of the model file.
   */
  @args.string({ description: 'Name of the filter class' })
  public name: string

  /**
   * Execute command
   */
  public async handle (): Promise<void> {
    const stub = join(__dirname, '..', 'templates', 'filter.txt')
    const path = this.application.resolveNamespaceDirectory('filters')

    this.name = this.name.replace(/Filter$/g, '')
    this.name += 'Filter'

    this
      .generator
      .addFile(this.name, { pattern: 'pascalcase', form: 'singular' })
      .stub(stub)
      .destinationDir(path || 'app/Models/Filters')
      .useMustache()
      .appRoot(this.application.cliCwd || this.application.appRoot)

    await this.generator.run()
  }
}
