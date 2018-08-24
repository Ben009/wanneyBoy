'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    /**
     * TODO 案例 代理配置proxy 20180509
     *  https://www.cnblogs.com/tugenhua0707/p/8052051.html  代理参考文档地址
     */
    proxyTable: {
      '/njmind': {//字典资源服务
        target: 'http://192.168.99.118:7900/njmind', // 接口的域名  http://192.168.99.118 公司服务器
        // 服务本地发布 方式 见/svn/开发库/V3.0/开发手册/开发环境/5、附件服务/说明
        // http://localhost:7900/swagger-ui.html 发布后的api文档
        // http://192.168.99.118:7900/swagger-ui.html 发布后的api文档
        // secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/njmind': ''
        }
      },
      '/layimWeb': {//即时通讯服务
        target: 'http://192.168.99.118:8087/im-server', //http://192.168.99.118:8087/qiqiim-server 公司服务器 
        // secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/layimWeb': ''
        }
      },
      '/back': {//后台服务
        target: 'http://localhost:8081/back',
        //http://192.168.99.118:8081/back/swagger-ui.html 发布后的api文档
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/back': ''
        }
      },
    },

    // Various Dev Server settings
    //TODO 20180503 前端发布 地址
    host:'0.0.0.0', // '0.0.0.0' localhost,127.0.0.1,ip 均可以访问 can be overwritten by process.env.HOST
    // host: '192.168.1.110', // can be overwritten by process.env.HOST
    //TODO 20180503 前端发布 端口号
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
