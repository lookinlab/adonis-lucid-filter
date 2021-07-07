/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Addons/LucidFilter' {
  import { CamelCase, SnakeCase, Split } from 'type-fest'
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

  type PickFilterKeys<Keys> = {
    [Key in keyof Keys as SnakeCase<Exclude<Key, keyof LucidFilter | 'constructor'>>]: (
      Parameters<
        Keys[Key] extends (...args: any) => any
          ? Keys[Key]
          : never
      >[0]
    )
  }

  type KeysWithIds<SCKeys> = {
    [Key in keyof SCKeys as
      Key extends string ?
        'id' extends Split<Key, '_'>[number] ? never :
          SCKeys[Key] extends number ? `${string & Key}_id` : never
      : never
    ]?: SCKeys[Key]
  }

  type CamelCased<Keys> = {
    [Key in keyof Keys as CamelCase<`${string & Key}`>]?: Keys[Key]
  }

  /**
   * Input object of filter model
   */
  export type InputObject<Instance extends InstanceType<LucidFilterContract>> =
    Partial<PickFilterKeys<Instance>> &
    KeysWithIds<PickFilterKeys<Instance>> &
    CamelCased<PickFilterKeys<Instance>> &
    CamelCased<KeysWithIds<PickFilterKeys<Instance>>>

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
