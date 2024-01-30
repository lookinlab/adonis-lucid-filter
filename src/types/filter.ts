/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <alf@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CamelCase, SnakeCase, Split } from 'type-fest'
import type { NormalizeConstructor } from '@adonisjs/core/helpers'
import type {
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
 * Pick keys from methods of filter with a type of first value
 */
type PickKeys<Filter> = {
  [Key in keyof Filter as SnakeCase<Exclude<Key, keyof LucidFilter | 'constructor'>>]: (
    Filter[Key] extends (value: infer V, ...args: any) => any ? V : never
  )
}

/**
 * Add `_id` to end of SnakeCase keys with number type
 */
type KeysWithIds<SCKeys> = {
  [Key in keyof SCKeys as (
    Key extends string
      ? 'id' extends Split<Key, '_'>[number]
        ? never
        : SCKeys[Key] extends number
          ? `${string & Key}_id`
          : never
      : never
  )]?: SCKeys[Key]
}

/**
 * Convert all keys to CamelCase
 */
type CamelCased<Keys> = {
  [Key in keyof Keys as CamelCase<`${string & Key}`>]?: Keys[Key]
}

/**
 * Input object of filter model
 */
export type InputObject<Instance extends InstanceType<LucidFilterContract>> =
  Partial<PickKeys<Instance>> &
  KeysWithIds<PickKeys<Instance>> &
  CamelCased<PickKeys<Instance>> &
  CamelCased<KeysWithIds<PickKeys<Instance>>>

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
