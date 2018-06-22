'use strict'

/*
 * adonis-lucid-filter
 *
 * (c) Lookin Anton <lookin@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const path = require('path')
const fs = require('fs')
const { registrar, ioc } = require('@adonisjs/fold')
const { setupResolver, Config } = require('@adonisjs/sink')

module.exports = {
  up: function () {
    setupResolver()
    ioc.bind('Adonis/Src/Config', () => {
      const config = new Config()

      config.set('database', {
        connection: process.env.DB,
        sqlite: {
          client: 'sqlite3',
          connection: {
            filename: path.join(__dirname, 'db.sqlite3')
          }
        }
      })

      return config
    })

    return registrar
      .providers([
        '@adonisjs/lucid/providers/LucidProvider'
      ])
      .registerAndBoot()
      .then(() => {
        const schema = ioc.use('Database').schema

        schema.createTable('users', (table) => {
          table.increments()
          table.string('username').unique()
          table.string('email').unique()
          table.boolean('is_admin').default(false)
          table.string('password')
          table.integer('company_id')
          table.timestamps()
        })
        schema.createTable('industries', (table) => {
          table.increments()
          table.string('title')
          table.integer('revenue')
          table.timestamps()
        })
        schema.createTable('roles', (table) => {
          table.increments()
          table.string('title')
          table.timestamps()
        })
        schema.createTable('industry_user', (table) => {
          table.increments()
          table.integer('user_id')
          table.integer('industry_id')
        })

        return schema
      })
  },

  down () {
    return ioc
      .use('Database')
      .schema
      .dropTable('users')
      .dropTable('industry_user')
      .dropTable('industries')
      .then(() => {
        if (process.env.DB === 'sqlite') {
          fs.unlinkSync(path.join(__dirname, 'db.sqlite3'))
        }
      })
  }
}
