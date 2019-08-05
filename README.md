# abc-stringify

Safe, simple, configurable
[JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

Handles recursive objects.

Handles `Error` objects and allows you to specify your own error
replacer function.

Allows array replacers to either include or exclude keys.

Allows you to specify a list of values to replace (think passwords and
keys in your config).

Allows omitting the replacer parameter and just pass the space
parameter.

## Quick Start

```js
let ss = new AbcStringify()
const o = {
  name: 'abc stringify',
  error: new Error('something bad happened'),
  address: {
    street: '123 string st',
    city: 'hershey',
    st: 'pa',
    zip: '17033'
  },
  nest: {
    really: {
      deep: {
        stuff: ['one', 2, {
          another: 'thing here'
        }]
      }
    }
  }
}
o.circular = o
console.log(ss.stringify(o, 2))
```

Output

```json
{
  "name": "abc stringify",
  "error": {
    "name": "Error",
    "message": "something bad happened",
    "stack": "Error: something bad happened\n    at Object.<anonymous> (/abc-stringify/index.js:99:12)\n    at Module._compile (internal/modules/cjs/loader.js:776:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:787:10)\n    at Module.load (internal/modules/cjs/loader.js:653:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:593:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:585:3)\n    at Function.Module.runMain (internal/modules/cjs/loader.js:829:12)\n    at startup (internal/bootstrap/node.js:283:19)\n    at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)"
  },
  "address": {
    "street": "123 string st",
    "city": "hershey",
    "st": "pa",
    "zip": "17033"
  },
  "nest": {
    "really": {
      "deep": {
        "stuff": [
          "one",
          2,
          {
            "another": "thing here"
          }
        ]
      }
    }
  },
  "circular": "--circular--"
}
```
