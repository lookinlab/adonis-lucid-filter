'use strict'

/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const GE = require('@adonisjs/generic-exceptions')

class LucidFilter {
  register (Model, Filter) {
    if (!Filter || typeof (Filter) !== 'function') {
      throw GE.InvalidArgumentException.invalidParameter('Make sure to pass Filter as 2nd parameter to Filterable trait')
    }

    Model.queryMacro('filter', function (inputs = {}) {
      new Filter(this, inputs).handle()
      return this
    })
  }
}
module.exports = LucidFilter
