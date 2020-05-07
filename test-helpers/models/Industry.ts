/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import BaseModel from './BaseModel'
import { manyToMany } from '@adonisjs/lucid/build/src/Orm/Decorators'
import { ManyToMany } from '@ioc:Adonis/Lucid/Relations'
import User from './User'

export default class Industry extends BaseModel {
  @manyToMany(() => User)
  public users: ManyToMany<typeof User>
}
