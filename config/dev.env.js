'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  INDEX_ID: '1',
  INDEX_CHILD_ID: '600',
})
