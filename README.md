# Adonis Lucid Filter

[![Greenkeeper badge](https://badges.greenkeeper.io/lookinlab/adonis-lucid-filter.svg)](https://greenkeeper.io/)

> Works with @adonisjs/lucid 5.0.3 or greater.

This addon adds the functionality to filter Lucid Models
> This is adaptation a [EloquentFilter](https://github.com/Tucker-Eric/EloquentFilter) for AdonisJS Lucid ORM

## Introduction
Example, we want to return a list of users filtered by multiple parameters. When we navigate to:

`/users?name=er&last_name=&company_id=2&roles[]=1&roles[]=4&roles[]=7&industry=5`

`request.all()` or `request.get()` will return:

```json
{
  "name": "er",
  "last_name": "",
  "company_id": 2,
  "roles": [1, 4, 7],
  "industry": 5
}
```

To filter by all those parameters we would need to do something like:

```js
'use strict'

const User = use('App/Models/User')

class UserController {

  async index ({ request }) {
    const { company_id, last_name, name, roles, industry } = request.get()
  
    const query = User.query().where('company_id', +company_id)

    if (last_name) {
      query.where('last_name', 'LIKE', `%${last_name}%`)
    }
    if (name) {
      query.where((builder) => {
        builder.where('first_name', 'LIKE', `${name}%`)
          .orWhere('last_name', 'LIKE', `%${name}%`)
      })
    }

    query.whereHas('roles', (builder) => {
      builder.whereIn('id', roles)

    }).whereHas('clients', (builder) => {
      builder.whereHas('industry_id', +industry)
    })

    return await query.fetch()
  }

}
```

To filter that same input with Lucid Filters:

```js
'use strict'

const User = use('App/Models/User')

class UserController {

  async index ({ request }) {
    return await User.query()
      .filter(request.all())
      .fetch()
  }

}
```

## Installation

Make sure to install it using `npm` or `yarn`.

```bash
# npm
npm i adonis-lucid-filter

# yarn
yarn add adonis-lucid-filter
```

## Usage

Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
  'adonis-lucid-filter/providers/LucidFilterProvider'
]
```

### Generating The Filter
> Only available if you have registered `LucidFilterProvider` in the providers array in your `start/app.js'

You can create a model filter with the following ace command:

```bash
adonis make:modelFilter UserFilter
```

Where `User` is the Lucid Model you are creating the filter for. This will create `app/ModelFilters/UserFilter.js`

### Defining The Filter Logic
Define the filter logic based on the camel cased input key passed to the `filter()` method.

- Empty strings are ignored
- `_id` is dropped from the end of the input to define the method so filtering `user_id` would use the `user()` method
- Input without a corresponding filter method are ignored
- The value of the key is injected into the method
- All values are accessible through the `this.input()` method or a single value by key `this.input(key)`
- All Query Builder methods are accessible in `this` context in the model filter class.

To define methods for the following input:

```json
{
  "company_id": 5,
  "name": "Tuck",
  "mobile_phone": "888555"
}
```

You would use the following methods:

```js
'use strict'

const ModelFilter = use('ModelFilter')

class UserFilter extends ModelFilter {

  // This will filter 'company_id' OR 'company'
  company (id) {
    return this.where('company_id', +id);
  }

  name (name) {
    return this.where((builder) => {
      builder.where('first_name', 'LIKE', `%${name}%`)
        .orWhere('last_name', 'LIKE', `%${name}%`);
    });
  }

  mobilePhone (phone) {
    return this.where('mobile_phone', 'LIKE', `${phone}%`);
  }

  secretMethod (secretParameter) {
    return this.where('some_column', true);
  }
}
```

> **Note:**  In the above example if you do not want `_id` dropped from the end of the input you can set `static get dropId () { return false }` on your filter class. Doing this would allow you to have a `company()` filter method as well as a `companyId()` filter method.

> **Note:** In the example above all methods inside `setup()` will be called every time `filter()` is called on the model

#### Blacklist

Any methods defined in the `blackist` array will not be called by the filter. Those methods are normally used for internal filter logic.

The `blacklistMethod()` and `whitelistMethod()` methods can be used to dynamically blacklist and whitelist methods.

In the example above `secretMethod()` will not be called, even if there is a `secret_method` key in the input array. In order to call this method it would need to be whitelisted dynamically:

Example:
```js
setup () {
  const user = await auth.getUser()

  if (user.isAdmin()) {
    this.whitelistMethod('secretMethod');
  }
}
```

### Applying The Filter To A Model

Implement the `@provider:Filterable` trait on any Lucid model:

```js
'use strict'

const UserFilter = use('App/ModelFilters/UserFilter')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('@provider:Filterable', UserFilter)
  }

  // User Class
}
```

This gives you access to the `filter()` method that accepts an object of input:

```js
const User = use('App/Models/User')

class UserController {

  async index ({ request }) {
    return await User.query()
      .filter(request.all())
      .fetch();
  }

  // or with paginate method

  async index ({ request }) {
    const query = request.all()
    const page = query.page || 1

    return await User.query()
      .filter(query)
      .paginate(page, 15)
  }

}
```

## TODO
- add `setup` method
- add relations filter
