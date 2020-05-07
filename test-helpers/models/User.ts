/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import BaseModel from './BaseModel'
import { manyToMany, column } from '@adonisjs/lucid/build/src/Orm/Decorators'
import { ManyToMany } from '@ioc:Adonis/Lucid/Relations'
import Industry from './Industry'
import filterable from '../../src/Decorator'
import TestModelFilter from '../filters/TestModelFilter'

@filterable(TestModelFilter)
export default class User extends BaseModel {
  @column()
  public username: string

  @column()
  public email: string

  @column()
  public isAdmin: boolean

  @column()
  public companyId: number

  @manyToMany(() => Industry)
  public industries: ManyToMany<typeof Industry>
}
