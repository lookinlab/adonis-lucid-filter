'use strict'

/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const path = require('path')
const { Command } = require('@adonisjs/ace')

class MakeModelFilter extends Command {
  constructor (Helpers) {
    super()
    this.Helpers = Helpers
  }

  /* istanbul ignore next */
  static get inject () {
    return ['Adonis/Src/Helpers']
  }

  /* istanbul ignore next */
  static get signature () {
    return 'make:modelFilter { name: Name of the filter file }'
  }

  /* istanbul ignore next */
  static get description () {
    return 'Create sample filter file'
  }

  async handle ({ name }) {
    name = name.replace(/Filter$/g, '')
    name += `Filter`

    /**
     * Reading template as a string form the mustache file
     */
    const template = await this.readFile(path.join(__dirname, '../templates/filter.mustache'), 'utf8')

    /**
     * Directory paths
     */
    const relativePath = path.join('app/ModelFilters', `${name}.js`)
    const filterPath = path.join(this.Helpers.appRoot(), relativePath)

    if (!this.viaAce) {
      return this.generateFile(filterPath, template, { name })
    }

    /* istanbul ignore next */
    try {
      await this.generateFile(filterPath, template, { name })
      this.completed('create', relativePath)
    } catch (error) {
      this.error(`${relativePath} filter already exists`)
    }
  }
}

module.exports = MakeModelFilter
