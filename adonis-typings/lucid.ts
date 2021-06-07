/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Lucid/Orm' {
  import { LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'

  interface LucidModel {
    filter<Model extends LucidModel, Result extends any = InstanceType<Model>>(
      this: Model,
      input: object,
      filter?: LucidFilterContract
    ): ModelQueryBuilderContract<Model, Result>

    filtration: QueryScope<QueryScopeCallback>
  }
}
