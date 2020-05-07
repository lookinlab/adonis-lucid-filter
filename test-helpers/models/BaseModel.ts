/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseModel } from '@adonisjs/lucid/build/src/Orm/BaseModel'
import { Database } from '@adonisjs/lucid/build/src/Database'
import { Adapter } from '@adonisjs/lucid/build/src/Orm/Adapter'
import { LucidModel } from '@ioc:Adonis/Lucid/Model'
import { Ioc } from '@adonisjs/fold/build'
import { dbConfig } from '../index'
import { Logger } from '@adonisjs/logger/build/standalone'
import { Emitter } from '@adonisjs/events/build/standalone'
import { Profiler } from '@adonisjs/profiler/build/standalone'
import { SqliteConfig } from '@ioc:Adonis/Lucid/Database'

const ioc = new Ioc()
const emitter = new Emitter(ioc)
const logger = new Logger({
  enabled: true,
  name: 'lucid',
  level: 'debug',
  prettyPrint: false,
})
const profiler = new Profiler(__dirname, logger, { enabled: true })

BaseModel.$container = ioc
BaseModel.$adapter = new Adapter(new Database({
  connection: 'sqlite',
  connections: { sqlite: dbConfig as SqliteConfig },
}, logger, profiler, emitter))

export default BaseModel as unknown as LucidModel
