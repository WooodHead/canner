const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

module.exports = {
  devServer: {
    historyApiFallback: {
      index: '/docs/'
    }
  },
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    index: './docs/index.js',
  },
  externals: {
    'react': "React",
    'react-dom': "ReactDOM",
    'antd': 'antd',
    'lodash': '_',
    'firebase': 'firebase',
    'immutable': 'Immutable',
    'styled-components': 'styled',
    'canner-slate-editor': 'CannerSlateEditor'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/docs/static/',
  },
  resolve: {
    alias: {
      'canner-graphql-interface': path.resolve(__dirname, 'node_modules/canner-graphql-interface'),
      'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
      'cms-helpers': path.resolve(__dirname, 'node_modules', 'cms-helpers'),
      '@canner': path.resolve(__dirname, 'node_modules', '@canner'),
      'antd': path.resolve(__dirname, 'node_modules/antd')
    }
  },
  resolveLoader: {
     moduleExtensions: ["-loader"]
  },
  plugins: [
    new webpack.DefinePlugin({
      FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
    })
  ],
  module: {
    rules: [
      {
        test: /(\.schema\.js|canner\.def\.js)$/,
        use: [{
          loader: 'canner-schema-loader',
        }, {
          loader: 'babel-loader',
          /**
          * babel-loader doesn't load the .babelrc
          * TODO: Remove once the issue is addressed
          * https://github.com/babel/babel-loader/issues/624
          */
          options: Object.assign(
            {
              babelrc: false,
              cacheDirectory: true
            },
            JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc'), 'utf-8'))
          ),
        }],
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'docs'),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/@canner/image-upload')
        ],
        use: {
          loader: 'babel-loader',
          /**
          * babel-loader doesn't load the .babelrc
          * TODO: Remove once the issue is addressed
          * https://github.com/babel/babel-loader/issues/624
          */
          options: Object.assign(
             {
               babelrc: false,
               cacheDirectory: true
             },
             JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc'), 'utf-8'))
          ),
        },
      },
      {
        test: /\.css$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }]
      }
    ],
  },
};
