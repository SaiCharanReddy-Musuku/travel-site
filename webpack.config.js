const path = require('path')
const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('postcss-hexrgba')
]
module.exports = {
  entry: './app/assets/scripts/App.js',
  output: {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'app')
  },
  devServer: {
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
  },
  mode: 'development',
  module: {
      rules: [
          {
              test: /\.css$/i,
              use: ['style-loader','css-loader?url=false',{loader:"postcss-loader",options:{postcssOptions:{plugins:postCSSPlugins}}}]
          }
      ]
  }
}