/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { join } from 'path'
import knex from 'knex'
import { Filesystem } from '@poppinss/dev-utils'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { Application } from '@adonisjs/core/build/standalone'
import { BaseModel } from '@adonisjs/lucid/build/src/Orm/BaseModel'
import { Adapter } from '@adonisjs/lucid/build/src/Orm/Adapter'
import { Database } from '@adonisjs/lucid/build/src/Database'
import { SqliteConfig } from '@ioc:Adonis/Lucid/Database'
import { LucidModel } from '@ioc:Adonis/Lucid/Model'

const fs = new Filesystem(join(__dirname, 'tmp'))

export const dbConfig: SqliteConfig = {
  client: 'sqlite3',
  connection: { filename: join(fs.basePath, 'db.sqlite3') },
  debug: false,
  useNullAsDefault: true,
}

export async function setup (destroyDb: boolean = true) {
  await fs.ensureRoot()
  const db = knex(dbConfig)

  const hasUsers = await db.schema.hasTable('users')
  if (!hasUsers) {
    await db.schema.createTable('users', (table) => {
      table.increments()
      table.string('username').unique()
      table.string('email').unique()
      table.boolean('is_admin')
      table.string('password')
      table.integer('company_id')
      table.timestamps()
    })
  }

  const hasIndustries = await db.schema.hasTable('industries')
  if (!hasIndustries) {
    await db.schema.createTable('industries', (table) => {
      table.increments()
      table.string('title')
      table.integer('revenue')
      table.timestamps()
    })
  }

  const hasRoles = await db.schema.hasTable('roles')
  if (!hasRoles) {
    await db.schema.createTable('roles', (table) => {
      table.increments()
      table.string('title')
      table.timestamps()
    })
  }

  const hasIndustryUser = await db.schema.hasTable('industry_user')
  if (!hasIndustryUser) {
    await db.schema.createTable('industry_user', (table) => {
      table.increments()
      table.integer('user_id')
      table.integer('industry_id')
    })
  }

  if (destroyDb) {
    await db.destroy()
  }
}

export async function cleanup () {
  const db = knex(dbConfig)

  await db.schema.dropTableIfExists('users')
  await db.schema.dropTableIfExists('industries')
  await db.schema.dropTableIfExists('roles')
  await db.schema.dropTableIfExists('industry_user')

  await db.destroy()
  await fs.cleanup()
}

/**
 * Split string to an array using cross platform new lines
 */
export function toNewlineArray (contents: string): string[] {
  return contents.split(/\r?\n/)
}

/**
 * Setup application
 */
export async function setupApplication (): Promise<ApplicationContract> {
  await fs.add('.env', '')
  await fs.add(
    'config/app.ts',
    `
      export const appKey = 'averylong32charsrandomsecretkey'
      export const http = {
        cookie: {},
        trustProxy: () => true,
      }
    `
  )

  await fs.add(
    'config/database.ts',
    `
      const dbConfig = undefined
      export default dbConfig
    `
  )

  const app = new Application(fs.basePath, 'test', {
    aliases: { App: './app' },
    providers: ['@adonisjs/core'],
  })

  app.setup()
  app.registerProviders()
  await app.bootProviders()

  return app
}

/**
 * Get BaseModel of application
 */
export function getBaseModel (app: ApplicationContract) {
  BaseModel.$container = app.container
  BaseModel.$adapter = new Adapter(new Database(
    {
      connection: 'sqlite',
      connections: { sqlite: dbConfig as SqliteConfig },
    },
    app.container.use('Adonis/Core/Logger'),
    app.container.use('Adonis/Core/Profiler'),
    app.container.use('Adonis/Core/Event')
  ))

  return (BaseModel as unknown) as LucidModel
}
