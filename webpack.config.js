const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// to reduce size of css file
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')
const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('postcss-hexrgba')
]
let cssConfig = {
  test: /\.css$/i,
  use: ['css-loader?url=false',{loader:"postcss-loader",options:{postcssOptions:{plugins:postCSSPlugins}}}]
}
class RunAfterCompile{
  apply(compiler){
    compiler.hooks.done.tap('Copy Images', function(){
      fse.copySync('./app/assets/images','./docs/assets/images')
    })
  }
}
// common for dev and build
let config = {
    entry: './app/assets/scripts/App.js',
    plugins: [new HtmlWebpackPlugin({filename: 'index.html', template: './app/index.html'})],
    module: {
      rules: [
        cssConfig
      ]
  }
}
if(currentTask == 'dev'){
    cssConfig.use.unshift('style-loader')
    config.output = {
      filename: 'bundled.js',
      path: path.resolve(__dirname, 'app')
    }
    config.devServer = {
      /* reloads browser for us when we change any .html file */
      before: function(app, server){
        server._watch('./app/**/*.html')
      },
      contentBase: path.join(__dirname, 'app'),
      /* Inject css and js to browser's memory without having to fully reload */
      hot: true,
      port: 3000,
      /* Access this website on our mobile phone */
      host: '0.0.0.0'
  }
      config.mode = 'development'
}
if(currentTask == 'build'){
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use:{
      loader: 'babel-loader',
      options: {
        presets:['@babel/preset-env']
      }
    }
  })
  cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    config.output = {
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'docs')
    }
    config.mode = 'production'
    config.optimization = {
      splitChunks: {chunks: 'all'},
      minimize: true,
      minimizer:  [`...`,new CssMinimizerPlugin()]
    }
    config.plugins.push(new CleanWebpackPlugin(), 
    new MiniCssExtractPlugin({filename:'style.[chunkhash].css'}),
    new RunAfterCompile()
    )
}
module.exports = config