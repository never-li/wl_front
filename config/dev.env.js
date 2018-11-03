'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"http://127.0.0.1:8060"',
  //BASE_API: '"http://10.8.26.40:8060"',
  //BASE_API: '"http://tswl.opsteel.net"',
  BASE_API: '"http://tscc.gdzixin.net/web-api"',
})
