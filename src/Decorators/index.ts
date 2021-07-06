/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HasFilterDecorator } from '@ioc:Adonis/Addons/LucidFilter'

/**
 * Filter decorator for LucidModel property
 */
export const hasFilter: HasFilterDecorator = ($filter) => {
  return (target) => {
    target.boot()
    target.$filter = $filter
  }
}
