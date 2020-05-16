/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Lucid/Model' {
  import { LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'

  interface LucidModel {
    filter(
      input: object,
      filter?: LucidFilterContract
    ): ModelQueryBuilderContract<LucidModel, LucidRow>
  }
}
