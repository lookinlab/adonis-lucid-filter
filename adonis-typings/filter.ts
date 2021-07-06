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
   * Input object of filter model
   */
  export type InputObject<Instance extends InstanceType<LucidFilterContract>> = {
    [Prop in keyof Instance as Exclude<Prop, keyof LucidFilter | 'constructor'>]?: (
      Parameters<
        Instance[Prop] extends (...args: any) => any
          ? Instance[Prop]
          : never
      >[number]
    )
  }

  /**
   * Filterable model
   */
  export interface FilterableModel {
    $filter: () => LucidFilterContract
    filtration: QueryScope<QueryScopeCallback>
    filter<
      Model extends LucidModel & FilterableModel,
      Filter extends LucidFilterContract = ReturnType<Model['$filter']>
    >(
      this: Model,
      input: InputObject<InstanceType<Filter>>,
      filter?: Filter
    ): ModelQueryBuilderContract<Model, InstanceType<Model>>
  }

  /**
   * Filterable mixin
   */
  export interface FilterableMixin {
    <T extends NormalizeConstructor<LucidModel>>(superclass: T): T & FilterableModel
  }

  export const Filterable: FilterableMixin
  export const BaseModelFilter: LucidFilterContract
}
