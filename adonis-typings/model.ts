/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Addons/LucidFilter' {
  import { LucidModel, LucidRow, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Model'

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

  interface FilterableDecoratorContract {
    (filter: LucidFilterContract): <T extends LucidModel>(constructor: T) => void;
  }

  export const filterable: FilterableDecoratorContract
  export const BaseModelFilter: LucidFilterContract
}
