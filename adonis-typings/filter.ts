/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Addons/LucidFilter' {
  import { NormalizeConstructor } from '@ioc:Adonis/Core/Helpers'
  import {
    LucidModel,
    LucidRow,
    ModelQueryBuilderContract,
    QueryScope,
    QueryScopeCallback,
  } from '@ioc:Adonis/Lucid/Orm'

  /**
   * Lucid filter instance
   */
  export interface LucidFilter {
    $input: object;
    $query: ModelQueryBuilderContract<LucidModel, LucidRow>;
    $blacklist: string[];

    setup?($query: any): void;
    whitelistMethod(method: string): boolean;
    handle(): any;

    $filterByInput(): void;
    $getFilterMethod(key: string): string;
    $methodIsCallable(method: string): boolean;
    $methodIsBlacklisted(method: string): boolean;
  }

  /**
   * Lucid filter static contract
   */
  export interface LucidFilterContract {
    blacklist: string[];
    dropId: boolean;
    camelCase: boolean;
    removeEmptyInput(input: object): object;
    new (
      $query: ModelQueryBuilderContract<LucidModel, LucidRow>,
      $input: object
    ): LucidFilter;
  }

  /**
   * Filter method of filterable model
   */
  export type Filter<ModelFilter extends LucidFilterContract> = <
    Model extends LucidModel,
    Result = InstanceType<Model>,
    DynamicFilter extends LucidFilterContract | undefined = undefined,
    Instance = InstanceType<DynamicFilter extends undefined ? ModelFilter : DynamicFilter>
  >(
    this: Model,
    input: Partial<{
      [Prop in keyof Instance as Exclude<Prop, keyof LucidFilter | 'constructor'>]: (
        Parameters<Instance[Prop] extends (...args: any) => any ? Instance[Prop] : never>[number]
      )
    }>,
    filter?: DynamicFilter
  ) => ModelQueryBuilderContract<Model, Result>

  /**
   * Filterable model
   */
  export interface FilterableModel {
    $filter: () => LucidFilterContract
    filter: Filter<LucidFilterContract>
    filtration: QueryScope<QueryScopeCallback>
  }

  /**
   * Filterable mixin
   */
  export interface FilterableMixin {
    <T extends NormalizeConstructor<LucidModel>>(superclass: T): T & FilterableModel
  }

  /**
   * Decorator of LucidModel property
   */
  export type FilterDecorator = (filter: () => LucidFilterContract) => <
    Model extends LucidModel & FilterableModel
  >(target: Model, property: string) => void

  export const filter: FilterDecorator
  export const Filterable: FilterableMixin
  export const BaseModelFilter: LucidFilterContract
}
