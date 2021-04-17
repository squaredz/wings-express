// Global variables
const webpack = require('webpack')
const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin")

//todo: посмотреть как подключить бабель в проект, запустить сервер


// Production and Development mode
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
   const config = {
      splitChunks: {
         chunks: 'all'
      }
   }
   if (isProd) {
      config.minimizer = [
         new TerserPlugin
      ]
   }
   return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`


module.exports = {
   entry:['@babel/polyfill', './src/app.js'],
   mode: 'development',
   output: {
      filename: filename('js'),
      path: path.resolve(__dirname, 'build')
   },
   resolve: {
      alias: {
         'semantic-ui': path.join(__dirname, "node_modules", "semantic-ui-css", "semantic.min.js"),
      },
      extensions: ['.js']
   },
   devServer: {
      historyApiFallback: true,
      hot: isDev,
      inline: true,
      host: 'localhost',
      port: 3000,
      proxy: {
         '^/api/*': {
            target: 'http://localhost:8080/api/',
            secure: false
         }
      }
   },
   optimization: optimization(),
   plugins: [
      new HTMLPlugin({
         template: "src/index.html",
         minify: {
            collapseWhitespace: isProd
         }
      }),
      new CleanWebpackPlugin(),
      new webpack.ProvidePlugin({
         $: "jquery",
         jQuery: "jquery"
      }),
      new MiniCssExtractPlugin({
         filename: filename('css')
      })
   ],
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env']
               }
            }
         },
         {
            test: /\.css$/i,
            use: [{
               loader: MiniCssExtractPlugin.loader,
            }, 'css-loader'
            ],
         },
         {
            test: /\.s[ac]ss$/i,
            use: [
               {
                  loader: MiniCssExtractPlugin.loader,
               }, 'css-loader', 'sass-loader',
            ]
         },
         {
            test: /\.(png|jpg|gif|ico|svg)$/,
            loader: 'file-loader',
            options: {
               name: '[path][name].[ext]',
            }
         },
         {
            test: /\.(ttf|woff|woff2|eot)$/,
            loader: 'file-loader',
            options: {
               name: '[path][name].[ext]',
            }
         }
      ],
   },
}
