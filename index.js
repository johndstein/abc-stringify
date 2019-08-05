#!/usr/bin/env node

'use strict'
const isStringOrNumber = (o) => o &&
  Object.prototype.toString.call(o) === '[object String]' ||
  !isNaN(parseInt(o, 10))
const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '--circular--'
      }
      seen.add(value)
    }
    return value
  }
}
const excludeReplacer = (keys) => (key, value) =>
  keys.includes(key) ? undefined : value
const includeReplacer = (keys) => (key, value) =>
  keys.includes(key) || key === '' ? value : undefined
const getMultiReplacer = (replacers) => (key, value) => {
  let result
  for (const r of replacers) {
    if (r) {
      result = r(key, result || value)
      if (result === undefined) {
        return result
      }
    } else {
      result = result || value
    }
  }
  return result
}
class AbcStringify {
  constructor(options) {
    options = options || {}
    this.replacer
    this.errorReplacer = (key, value) =>
      value && value.name && value.message && value.stack ? {
        name: value.name,
        message: value.message,
        stack: value.stack
      } :
      value
    this.replacerArrayIncludes = true
    this.alwaysIncludeKeys = []
    this.alwaysExcludeKeys = []
    this.alwaysExcludeValues = []
    this.excludeValuesContains = true
    this.excludedValue = '***'
    this.space = null
    this.excludeValuesReplacer = (key, value) =>
      this.alwaysExcludeValues.includes(value) ? this.excludedValue : value
    this.replaceValuesReplacer = (key, value) => {
      for (const ev of this.alwaysExcludeValues) {
        if (Object.prototype.toString.call(value) === '[object String]') {
          return value.replace(ev, this.excludedValue)
        }
      }
      return value
    }
    Object.assign(this, options)
  }
  stringify(value, replacer, space) {
    if (isStringOrNumber(replacer)) {
      space = replacer
      replacer = null
    }
    replacer = replacer || this.replacer
    if (Array.isArray(replacer)) {
      if (this.replacerArrayIncludes) {
        replacer = replacer.concat(this.alwaysIncludeKeys)
        replacer = includeReplacer(replacer)
      } else {
        replacer = replacer.concat(this.alwaysExcludeKeys)
        replacer = excludeReplacer(replacer)
      }
    }
    return JSON.stringify(
      value,
      getMultiReplacer([
        getCircularReplacer(),
        replacer,
        this.excludeValuesReplacer,
        this.replaceValuesReplacer,
        this.errorReplacer,
      ]),
      space || this.space)
  }
}
exports = module.exports = AbcStringify
if (require.main === module) {
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

  // let ss = new AbcStringify({
  //   replacerArrayIncludes: false,
  //   space: 2,
  //   alwaysExcludeValues: ['string', 'three'],
  //   // excludedValue: '***REDACTED***',
  //   replacer: (key, value) => value
  // })
}
