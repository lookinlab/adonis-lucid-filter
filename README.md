# Adonis Lucid Filter

[![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

This addon adds the functionality to filter Lucid Models
> Inspired by [EloquentFilter](https://github.com/Tucker-Eric/EloquentFilter)

## Versions

> **Note**: Check before install :point_down:

| adonis-lucid-filter                 | adonis-lucid        |
|-------------------------------------|---------------------|
| ^4.\*.* (latest)                    | ^15.\*.* and latest |
| ^3.\*.* (`@filterable()` decorator) | ^15.\*.*            |
| ^2.\*.*                             | 14.\*.*             |

- Docs [for **Adonis v4**](https://github.com/lookinlab/adonis-lucid-filter/tree/v1)
- Docs [for `@filterable()` decorator](https://github.com/lookinlab/adonis-lucid-filter/tree/v3)

## Introduction
Example, we want to return a list of users filtered by multiple parameters. When we navigate to:

`/users?name=Tony&lastName=&companyId=2&industry=5`

`request.all()` or `request.qs()` will return:

```json
{
  "name": "Tony",
  "lastName": "",
  "companyId": 2,
  "industry": 5
}
```

To filter by all those parameters we would need to do something like:

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {
  public async index({ request }: HttpContextContract): Promise<User[]> {
    const { companyId, lastName, name, industry } = request.qs()
  
    const query = User.query().where('company_id', +companyId)

    if (lastName) {
      query.where('last_name', 'LIKE', `%${lastName}%`)
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

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {
  public async index({ request }: HttpContextContract): Promise<User[]> {
    return User.filter(request.qs()).exec()
  }
}
```

## Installation

Make sure to install it using `npm` or `yarn`.

```bash
# npm
npm i adonis-lucid-filter
node ace configure adonis-lucid-filter

# yarn
yarn add adonis-lucid-filter
node ace configure adonis-lucid-filter
```

## Usage

Make sure to register the provider inside `.adonisrc.json` file.

```json
{
  "providers": [
    "...other packages",
    "adonis-lucid-filter"
  ] 
}
```

For TypeScript projects add to `tsconfig.json` file:
```json
{
  "compilerOptions": {
    "types": [
      "...other packages",
      "adonis-lucid-filter"
    ]
  } 
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
  "companyId": 5,
  "name": "Tony",
  "mobilePhone": "888555"
}
```

You would use the following methods:

```ts
import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Core/Lucid'
import User from 'App/Models/User'

export default class UserFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof User, User>
  
  public static blacklist: string[] = ['secretMethod']

  // This will filter 'companyId', 'company_id' OR 'company'
  company(id: number) {
    this.$query.where('company_id', id)
  }

  name(name: string) {
    this.$query.where((builder) => {
      builder
        .where('first_name', 'LIKE', `%${name}%`)
        .orWhere('last_name', 'LIKE', `%${name}%`)
    })
  }

  mobilePhone(phone: string) {
    this.$query.where('mobile_phone', 'LIKE', `${phone}%`)
  }

  secretMethod(secretParameter: any) {
    this.$query.where('some_column', true)
  }
}
```

#### Blacklist

Any methods defined in the `blacklist` array will not be called by the filter.
Those methods are normally used for internal filter logic.

The `whitelistMethod()` methods can be used to dynamically blacklist methods.

Example:
```ts
setup($query) {
  this.whitelistMethod('secretMethod')
  this.$query.where('is_admin', true)
}
```
> `setup()` not may be async

> **Note:** All methods inside `setup()` will be called every time `filter()` is called on the model

In the example above `secretMethod()` will not be called, even if there is a `secret_method` key in the input object.
In order to call this method it would need to be whitelisted dynamically:

#### Static properties

```ts
export default class UserFilter extends BaseModelFilter {
  // Blacklisted methods
  public static blacklist: string[] = []
  
  // Dropped `_id` from the end of the input
  // Doing this would allow you to have a `company()` filter method as well as a `companyId()` filter method.
  public static dropId: boolean = true
  
  // Doing this would allow you to have a mobile_phone() filter method instead of mobilePhone().
  // By default, mobilePhone() filter method can be called thanks to one of the following input key:
  // mobile_phone, mobilePhone, mobile_phone_id, mobilePhoneId
  public static camelCase: boolean = true
}
```

### Applying The Filter To A Model

```ts
import UserFilter from 'App/Models/Filters/UserFilter'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable  } from '@ioc:Adonis/Addons/LucidFilter'

export default class User extends compose(BaseModel, Filterable) {
  public static $filter = () => UserFilter

  // ...columns and props
}
```

This gives you access to the `filter()` method that accepts an object of input:

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {
  public async index({ request }: HttpContextContract): Promise<User[]> {
    return User.filter(request.qs()).exec()
  }

  // or with paginate method

  public async index({ request }: HttpContextContract): Promise<SimplePaginatorContract<User>> {
    const { page = 1, ...input } = request.qs()
    return User.filter(input).paginate(page, 15)
  }
}
```

### Dynamic Filters

You can define the filter dynamically by passing the filter to use as the second parameter of the filter() method.
Defining a filter dynamically will take precedent over any other filters defined for the model.

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminFilter from 'App/Models/Filters/AdminFilter'
import UserFilter from 'App/Models/Filters/UserFilter'

export default class UserController {
  public async index({ request, auth }: HttpContextContract): Promise<User[]> {
    const Filter = auth.user.isAdmin() ? AdminFilter : UserFilter

    return User.filter(request.qs(), Filter).exec()
  } 
}
```

### Filtering relations

For filtering relations of model may be use `.query().filter()` or scope `filtration`, example:

```ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserPostsController {
  /**
   * Get a list posts of user
   * GET /users/:user_id/posts
   */
  public async index({ params, request }: HttpContextContract): Promise<Post[]> {
    const user: User = await User.findOrFail(params.user_id)
    
    return user.related('posts').query()
      .apply(scopes => scopes.filtration(request.qs()))
      .exec()
    
    // or
    
    return user.related('posts').query().filter(request.qs()).exec()
  }
}
```

Documentation by [Query Scopes](https://preview.adonisjs.com/guides/models/query-scopes)

**Note:** The relation model must be Filterable and `$filter` must be defined in it

[npm-image]: https://img.shields.io/npm/v/adonis-lucid-filter?logo=npm&style=for-the-badge
[npm-url]: https://www.npmjs.com/package/adonis-lucid-filter

[license-image]: https://img.shields.io/npm/l/adonis-lucid-filter?style=for-the-badge&color=blueviolet
[license-url]: https://github.com/lookinlab/adonis-lucid-filter/blob/develop/LICENSE.md

[typescript-image]: https://img.shields.io/npm/types/adonis-lucid-filter?color=294E80&label=%20&logo=typescript&style=for-the-badge
[typescript-url]: https://github.com/lookinlab
