'use strict'
/**
 * 文档配置参照
 * https://blog.csdn.net/itkingone/article/details/70331783
 */
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const extractTextPlugin = require('extract-text-webpack-plugin');
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [

      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    disableHostCheck: true, //Invalid Host header 加上这段
  },
  plugins: [
    // DefinePlugin 是webpack 的内置插件，该插件可以在打包时候替换制定的变量
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin

    /**
     * TODO 20180503 HtmlWebpackPlugin 配置说明
     * new HtmlWebpackPlugin 申明每个页面，借助Webpack工具，用于在dist/目录下生成html的压缩版文件用于发布使用
     * 具体说明见 https://segmentfault.com/a/1190000007294861
     *
     * title
     *    顾名思义，设置生成的 html 文件的标题。
     *
     * filename
     *    也没什么说的，生成 html 文件的文件名。默认为 index.html.
     *
     * template
     *    根据自己的指定的模板文件来生成特定的 html 文件。这里的模板类型可以是任意你喜欢的模板，可以是 html, jade, ejs, hbs, 等等，
     *    但是要注意的是，使用自定义的模板文件时，需要提前安装对应的 loader， 否则webpack不能正确解析。以 jade 为例。
     *
     * inject
     *    注入选项。有四个选项值 true, body, head, false.
     *     true
     *       默认值，script标签位于html文件的 body 底部
     *     body
     *       同 true
     *     head
     *       script 标签位于 head 标签内
     *     false
     *       不插入生成的 js 文件，只是单纯的生成一个 html 文件
     *
     * favicon
     *    给生成的 html 文件生成一个 favicon。属性值为 favicon 文件所在的路径名。
     *    生成的 html 标签中会包含这样一个 link 标签
     *    <link rel="shortcut icon" href="example.ico"> 同 title 和 filename 一样，如果在模板文件指定了 favicon，会忽略该属性。
     *
     * minify
     *    minify 的作用是对 html 文件进行压缩，minify 的属性值是一个压缩选项或者 false 。默认值为false, 不对生成的 html 文件进行压缩。来看看这个压缩选项。
     *    html-webpack-plugin 内部集成了 html-minifier ,这个压缩选项同 html-minify 的压缩选项完全一样，
     *    看一个简单的例子。
     *      new HtmlWebpackPlugin({
     *        ...
     *        minify: {
     *            removeAttributeQuotes: true // 移除属性的引号
     *        }
     *      })
     *
     *       <!-- 原html片段 -->
     *       <div id="example" class="example">test minify</div>
     *       <!-- 生成的html片段 -->
     *       <div id=example class=example>test minify</div>
     *
     * hash
          hash选项的作用是 给生成的 js 文件一个独特的 hash 值，该 hash 值是该次 webpack 编译的 hash 值。默认值为 false 。同样看一个例子。
          // webpack.config.js
          plugins: [
              new HtmlWebpackPlugin({
                  ...
                  hash: true
              })
          ]
          <script type=text/javascript src=bundle.js?22b9692e22e7be37b57e></script>

          执行 webpack 命令后，你会看到你的生成的 html 文件的 script 标签内引用的 js 文件，是不是有点变化了。
          bundle.js 文件后跟的一串 hash 值就是此次 webpack 编译对应的 hash 值。
          $ webpack
          Hash: 22b9692e22e7be37b57e
          Version: webpack 1.13.2

      cache
          默认值是 true。表示只有在内容变化时才生成一个新的文件。

      showErrors
          showErrors 的作用是，如果 webpack 编译出现错误，webpack会将错误信息包裹在一个 pre 标签内，属性的默认值为 true ，也就是显示错误信息。

      chunks
          chunks 选项的作用主要是针对多入口(entry)文件。当你有多个入口文件的时候，对应就会生成多个编译后的 js 文件。那么 chunks 选项就可以决定是否都使用这些生成的 js 文件。
          chunks 默认会在生成的 html 文件中引用所有的 js 文件，当然你也可以指定引入哪些特定的文件。
          看一个小例子。
          // webpack.config.js
          entry: {
              index: path.resolve(__dirname, './src/index.js'),
              index1: path.resolve(__dirname, './src/index1.js'),
              index2: path.resolve(__dirname, './src/index2.js')
          }
          ...
          plugins: [
              new HtmlWebpackPlugin({
                  ...
                  chunks: ['index','index2']
              })
          ]
          执行 webpack 命令之后，你会看到生成的 index.html 文件中，只引用了 index.js 和 index2.js
          ...
          <script type=text/javascript src=index.js></script>
          <script type=text/javascript src=index2.js></script>
          而如果没有指定 chunks 选项，默认会全部引用。


      excludeChunks
          弄懂了 chunks 之后，excludeChunks 选项也就好理解了，跟 chunks 是相反的，排除掉某些 js 文件。 比如上面的例子，其实等价于下面这一行
          ...
          excludeChunks: ['index1.js']

      chunksSortMode
          这个选项决定了 script 标签的引用顺序。默认有四个选项，'none', 'auto', 'dependency', '{function}'。
          'dependency' 不用说，按照不同文件的依赖关系来排序。
          'auto' 默认值，插件的内置的排序方式，具体顺序这里我也不太清楚...
          'none' 无序？ 不太清楚...
          {function} 提供一个函数？但是函数的参数又是什么? 不太清楚...

      xhtml
          一个布尔值，默认值是 false ，如果为 true ,则以兼容 xhtml 的模式引用文件。

     *
     *
     */


    new HtmlWebpackPlugin({
      filename: 'admin.html',
      template: 'index.html',
      chunks:['admin','vendor','manifest'],
      inject: true,
      chunksSortMode: 'dependency'
    }),
    new HtmlWebpackPlugin({
      filename: 'certificate.html',
      template: 'certificate.html',
      chunks:['certificate','vendor','manifest'],
      inject: true,
      chunksSortMode: 'dependency'
    }),
    new extractTextPlugin("[name].css"),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    /*
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      chunks:['index'],
      inject: true //
    }),
    new HtmlWebpackPlugin({
      filename: 'admin2.html',
      template: 'index.html',
      chunks:['admin2'],
      inject: true
    }),

    new HtmlWebpackPlugin({
      filename: 'framework.html',
      template: 'index.html',
      chunks:['framework'],
      inject: true
    }),

    new HtmlWebpackPlugin({
      filename: 'table.html',
      template: 'index.html',
      chunks:['table'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'resource.html',
      template: 'index.html',
      chunks:['resource'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'mould.html',
      template: 'index.html',
      chunks:['mould'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'form.html',
      template: 'index.html',
      chunks:['form'],
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'setting.html',
      template: 'index.html',
      chunks:['setting'],
      inject: true
    }),
    */
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])

    /**
    // 可以自动加载当前模块依赖的其他模块并已制定别名注入到当前的模块中，引入jq
    // 在网上看到的文章，救了我的命 ProvidePlugin + expose-loader 引入jq
    //
    // 如果你把jQuery看做是一个普通的js模块来加载（要用到jQuery的模块统统先require
    // 后再使用），那么，当你加载老式jQuery插件时，往往会提示找不到jQuery实例
    // 有时候是提示找不到$），这是为啥呢？
    // 要解释这个问题，就必须先稍微解释一下jQuery插件的机制：jQuery插件是通过
    // jQuery提供的jQuery.fn.extend(object)和jQuery.extend(object)这俩方法，来
    // 把插件本身实现的方法挂载到jQuery（也即$）这个对象上的。传统引用jQuery及
    // 其插件的方式是先用<script>加载jQuery本身，然后再用同样的方法来加载其插件；
    // jQuery会把jQuery对象设置为全局变量（当然也包括了$），既然是全局变量，那么
    // 插件们很容易就能找到jQuery对象并挂载自身的方法了。
    //
    // 而webpack作为一个遵从模块化原则的构建工具，自然是要把各模块的上下文环境给
    // 分隔开以减少相互间的影响；而jQuery也早已适配了AMD/CMD等加载方式，换句话说，
    // 我们在require jQuery的时候，实际上并不会把jQuery对象设置为全局变量。说到
    // 这里，问题也很明显了，jQuery插件们找不到jQuery对象了，因为在它们各自的上下
    // 文环境里，既没有局部变量jQuery（因为没有适配AMD/CMD，所以就没有相应的requi
    // re语句了），也没有全局变量jQuery。
    //
    // A: ProvidePlugin的机制是：当webpack加载到某个js模块里，出现了未定义且名称符合
    // （字符串完全匹配）配置中key的变量时，会自动require配置中value所指定的js模块
    // expose-loader，这个loader的作用是，将指定js模块export的变量声明为全局变量。
    //
    // B:externals 调用jq
    // externals是webpack配置中的一项，用来将某个全局变量“伪装”成某个js模块的exports，
    // 如下面这个配置：
    // externals: {'jquery': 'window.jQuery',},
    // 那么，当某个js模块显式地调用var $ = require('jquery')的时候，就会把window,
    // jQuery返回给它,与上述ProvidePlugin + expose-loader的方案相反，此方案是先用
    // <script>加载的jQuery满足老式jQuery插件的需要，再通过externals将其转换成符合
    // 模块化要求的exports。
    ,new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      'window.$': 'jquery',
    })
    */
  ]
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
