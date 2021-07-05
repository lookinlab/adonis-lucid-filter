/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FilterDecorator } from '@ioc:Adonis/Addons/LucidFilter'

/**
 * Filter decorator for LucidModel property
 */
export const filter: FilterDecorator = (modelFilter) => {
  return (target) => {
    target.boot()
    target.$filter = modelFilter
  }
}
