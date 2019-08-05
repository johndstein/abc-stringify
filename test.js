#!/usr/bin/env node

'use strict'

const SS = require('./')
const assert = require('assert')
let ss
let o
let x
//
// Handles recursive objects.
//
ss = new SS()
o = {
  a: 'a'
}
o.recursive = o
assert.equal(ss.stringify(o), '{"a":"a","recursive":"--circular--"}')
//
// Handles `Error` objects
//
ss = new SS()
x = ss.stringify(new Error('ugh!'))
// console.log(x)
assert(x.includes('"name":"Error"'))
assert(x.includes('"message":"ugh!"'))
assert(x.includes('"stack":"Error: ugh!\\n    at Object.<anonymous>'))
//
// and allows you to specify your own error replacer function.
//
ss = new SS({
  errorReplacer: (key, value) => {
    return value.stack
  }
})
x = ss.stringify(new Error('ugh!'))
// console.log(x)
assert(x.startsWith('"Error: ugh!\\n'))
//
// Allows array replacers to include keys.
//
ss = new SS()
o = {
  a: 'a',
  b: 'b',
  c: {
    d: 'd',
    e: 'e'
  }
}
x = ss.stringify(o, ['a', 'c', 'e'])
assert.equal(x, '{"a":"a","c":{"e":"e"}}')
// Allows setting default keys to include
ss = new SS({
  includeKeys: ['a', 'c']
})
x = ss.stringify(o, ['e'])
assert.equal(x, '{"a":"a","c":{"e":"e"}}')
//
// Allows array replacers to exclude keys.
//
ss = new SS({
  replacerArrayExcludes: true
})
x = ss.stringify(o, ['a', 'c', 'e'])
assert.equal(x, '{"b":"b"}')
// Allows setting default keys to exclude
ss = new SS({
  replacerArrayExcludes: true,
  excludeKeys: ['a', 'c']
})
x = ss.stringify(o, ['e'])
assert.equal(x, '{"b":"b"}')
//
// Specify list of values to replace.
//
ss = new SS({
  replaceValues: ['a', 'c', 'e']
})
x = ss.stringify(o)
assert.equal(x, '{"a":"***","b":"b","c":{"d":"d","e":"***"}}')
// console.log(x)
//
// Replaced values don't have to be exact match.
//
o = {
  a: 'abcdefg'
}
x = ss.stringify(o)
// console.log(x)
assert.equal(x, '{"a":"***b***d***fg"}')
//
// Exact match replace won't replace if not exact match.
//
ss = new SS({
  replaceValues: ['a', 'c', 'e'],
  exactMatch: true
})
x = ss.stringify(o)
assert.equal(x, '{"a":"abcdefg"}')
//
// Just pass the space parameter
//
ss = new SS()
x = ss.stringify({
  a: 'a',
  b: 'b'
}, 1)
// console.log(x)
assert.equal(x, `{
 "a": "a",
 "b": "b"
}`)
