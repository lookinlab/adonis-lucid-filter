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
  register (Model, ModelFilter) {
    Model.ModelFilter = ModelFilter

    Model.queryMacro('filter', function (input = {}, Filter = null) {
      Filter = Filter || Model.ModelFilter

      if (typeof (Filter) !== 'function') {
        throw GE
          .InvalidArgumentException
          .invalidParameter('Make sure to pass ModelFilter as 2nd parameter to Filterable trait or function filter')
      }
      const modelFilter = new Filter(this, input)
      return modelFilter.handle()
    })
  }
}
module.exports = LucidFilter
