/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// declare module '@ioc:Adonis/Lucid/Orm' {
//   import type { LucidFilterContract } from '@ioc:Adonis/Addons/LucidFilter'
//   import type { LucidModel, QueryScope, QueryScopeCallback } from '@ioc:Adonis/Lucid/Orm'
//   import type { InputObject } from '@ioc:Adonis/Addons/LucidFilter'

//   type FilterableModel = LucidModel & {
//     $filter: () => LucidFilterContract
//     filtration: QueryScope<QueryScopeCallback>
//   }

//   type ExcludeMethods<Type, Model> = {
//     [Method in keyof Type]: Model extends FilterableModel ? Type[Method] : never
//   }

//   type FilterableModelMethods<Model extends LucidModel> = {
//     filter<Filter extends LucidFilterContract = ReturnType<(FilterableModel & Model)['$filter']>>(
//       input: InputObject<InstanceType<Filter>>,
//       filter?: Filter
//     ): ModelQueryBuilderContract<Model, InstanceType<Model>>
//   }

//   interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>>
//     extends ExcludeMethods<FilterableModelMethods<Model>, Model> {}
// }
