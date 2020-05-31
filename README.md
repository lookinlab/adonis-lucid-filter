# Adonis Lucid Filter

Version [for **Adonis v4**](https://github.com/lookinlab/adonis-lucid-filter/tree/v1)

[![Greenkeeper badge](https://badges.greenkeeper.io/lookinlab/adonis-lucid-filter.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/lookinlab/adonis-lucid-filter.svg?branch=develop)](https://travis-ci.org/lookinlab/adonis-lucid-filter)
[![Coverage Status](https://coveralls.io/repos/github/lookinlab/adonis-lucid-filter/badge.svg?branch=develop)](https://coveralls.io/github/lookinlab/adonis-lucid-filter?branch=develop)

> Works with @adonisjs/lucid@alpha (^8.*.*)

This addon adds the functionality to filter Lucid Models
> Inspired by [EloquentFilter](https://github.com/Tucker-Eric/EloquentFilter)

## Introduction
Example, we want to return a list of users filtered by multiple parameters. When we navigate to:

`/users?name=Tony&last_name=&company_id=2&industry=5`

`request.all()` or `request.get()` will return:

```json
{
  "name": "Tony",
  "last_name": "",
  "company_id": 2,
  "industry": 5
}
```

To filter by all those parameters we would need to do something like:

```js
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {

  public async index ({ request }: HttpContextContract): Promise<User[]> {
    const { company_id, last_name, name, industry } = request.get()
  
    const query = User.query().where('company_id', +company_id)

    if (last_name) {
      query.where('last_name', 'LIKE', `%${last_name}%`)
    }
    if (name) {
      query.where(function () {
        this.where('first_name', 'LIKE', `%${name}%`)
          .orWhere('last_name', 'LIKE', `%${name}%`)
      })
    }

    return query.exec()
  }

}
```

To filter that same input with Lucid Filters:

```js
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {

  public async index ({ request }: HttpContextContract): Promise<User[]> {
    return User.filter(request.all()).exec()
  }
}
```

## Installation

Make sure to install it using `npm` or `yarn`.

```bash
# npm
npm i adonis-lucid-filter@alpha
node ace invoke adonis-lucid-filter

# yarn
yarn add adonis-lucid-filter@alpha
node ace invoke adonis-lucid-filter
```

## Usage

Make sure to register the provider inside `.adonisrc.json` file.

```json
"providers": [
  "...other packages",
  "adonis-lucid-filter"
]
```

For TypeScript projects add to `tsconfig.json` file:
```json
"compilerOptions": {
  "types": [
    "...other packages",
    "adonis-lucid-filter"
  ]
}
```

### Generating The Filter
> Only available if you have added `adonis-lucid-filter/build/commands` in `commands` array in your `.adonisrc.json'

You can create a model filter with the following ace command:

```bash
node ace make:filter User // or UserFilter
```

Where `User` is the Lucid Model you are creating the filter for. This will create `app/Models/Filters/UserFilter.js`

### Defining The Filter Logic
Define the filter logic based on the camel cased input key passed to the `filter()` method.

- Empty strings are ignored
- `setup()` will be called regardless of input
- `_id` is dropped from the end of the input to define the method so filtering `user_id` would use the `user()` method
- Input without a corresponding filter method are ignored
- The value of the key is injected into the method
- All values are accessible through the `this.$input` a property
- All QueryBuilder methods are accessible in `this.$query` object in the model filter class.

To define methods for the following input:

```json
{
  "company_id": 5,
  "name": "Tony",
  "mobile_phone": "888555"
}
```

You would use the following methods:

```js
import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Core/Lucid'
import User from 'App/Models/User'

export default class UserFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof User, User>
  
  public static blacklist: string[] = ['secretMethod']

  // This will filter 'company_id' OR 'company'
  company (id: number) {
    this.$query.where('company_id', id)
  }

  name (name: string) {
    this.$query.where(function () {
      this.where('first_name', 'LIKE', `%${name}%`)
        .orWhere('last_name', 'LIKE', `%${name}%`)
    })
  }

  mobilePhone (phone: string) {
    this.$query.where('mobile_phone', 'LIKE', `${phone}%`)
  }

  secretMethod (secretParameter: any) {
    this.$query.where('some_column', true)
  }
}
```

#### Blacklist

Any methods defined in the `blacklist` array will not be called by the filter. Those methods are normally used for internal filter logic.

The `whitelistMethod()` methods can be used to dynamically blacklist methods.

Example:
```js
setup ($query) {
  this.whitelistMethod('secretMethod')
  this.$query.where('is_admin', true)
}
```
> `setup()` not may be async

> **Note:** All methods inside `setup()` will be called every time `filter()` is called on the model

In the example above `secretMethod()` will not be called, even if there is a `secret_method` key in the input object. In order to call this method it would need to be whitelisted dynamically:

#### Static properties

```js
export default class UserFilter extends BaseModelFilter {
  // Blacklisted methods
  public static blacklist: string[] = []
  
  // Dropped `_id` from the end of the input
  // Doing this would allow you to have a `company()` filter method as well as a `companyId()` filter method.
  public static dropId: boolean = true
  
  // Doing this would allow you to have a mobile_phone() filter method instead of mobilePhone().
  // By default, mobilePhone() filter method can be called thanks to one of the following input key: mobile_phone, mobilePhone, mobile_phone_id
  public static camelCase: boolean = true
}
```

### Applying The Filter To A Model

```js
import UserFilter from 'App/Models/Filters/UserFilter'
import { filterable } from '@ioc:Adonis/Addons/LucidFilter'

@filterable(UserFilter)
export default class User extends BaseModel {
  // ...columns and props
}
```

This gives you access to the `filter()` method that accepts an object of input:

```js
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {

  public async index ({ request }: HttpContextContract): Promise<User[]> {
    return User.filter(request.all()).exec()
  }

  // or with paginate method

  public async index ({ request }: HttpContextContract): Promise<SimplePaginatorContract<User[]>> {
    const input = request.all()
    const page = input.page || 1

    return User.filter(input).paginate(page, 15)
  }

}
```

### Dynamic Filters

You can define the filter dynamically by passing the filter to use as the second parameter of the filter() method.
Defining a filter dynamically will take precedent over any other filters defined for the model.

```js
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminFilter from 'App/Models/Filters/AdminFilter'
import UserFilter from 'App/Models/Filters/UserFilter'

export default class UserController {

  public async index ({ request, auth }: HttpContextContract): Promise<User[]> {
    const Filter = auth.user.isAdmin() ? AdminFilter : UserFilter

    return User.filter(request.all(), Filter).exec()
  } 
}
```
