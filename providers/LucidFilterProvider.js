'use strict'

/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const { ServiceProvider } = require('@adonisjs/fold')

class LucidFilterProvider extends ServiceProvider {
  _registerFilter () {
    this.app.bind('Adonis/Addons/LucidFilter', () => {
      const LucidFilter = require('../src/LucidFilter')
      return new LucidFilter()
    })
    this.app.alias('Adonis/Addons/LucidFilter', 'Lucid/Filter')
  }

  _registerCommand () {
    this.app.bind('Adonis/Commands/Make:ModelFilter', () => require('../commands/MakeModelFilter'))
  }

  _registerModel () {
    this.app.bind('Adonis/Src/ModelFilter', () => require('../src/Model'))
    this.app.alias('Adonis/Src/ModelFilter', 'ModelFilter')
  }

  register () {
    this._registerFilter()
    this._registerModel()
    this._registerCommand()
  }

  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/Make:ModelFilter')
  }
}

module.exports = LucidFilterProvider
