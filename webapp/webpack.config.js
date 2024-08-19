// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { exec } from 'child_process'
import path from 'path'
import manifest from '../plugin.json' with {type: 'json'}
import { fileURLToPath } from 'url'

const _filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/naming-convention
const __dirname = path.dirname(_filename)

const PLUGIN_ID = manifest.id

const NPM_TARGET = process.env.npm_lifecycle_event
const isDev = NPM_TARGET === 'debug' || NPM_TARGET === 'debug:watch'

const plugins = []
if (NPM_TARGET === 'build:watch' || NPM_TARGET === 'debug:watch') {
  plugins.push({
    apply: (compiler) => {
      compiler.hooks.watchRun.tap('WatchStartPlugin', () => {
        console.log('Change detected. Rebuilding webapp.')
      })
      compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
        exec('cd .. && make deploy-from-watch', (err, stdout, stderr) => {
          if (err != null) {
            console.error(err)
          }
          if (stdout != null) {
            process.stdout.write(stdout)
          }
          if (stderr != null) {
            process.stderr.write(stderr)
          }
        })
      })
    }
  })
}

const config = {
  entry: [
    './src/index.tsx'
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    modules: [
      'src',
      'node_modules',
      path.resolve(__dirname)
    ],
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true

            // Babel configuration is in babel.config.js because jest requires it to be there.
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['node_modules/compass-mixins/lib', 'sass']
              }
            }
          }
        ]
      }
    ]
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    redux: 'Redux',
    'react-redux': 'ReactRedux',
    'prop-types': 'PropTypes',
    'react-bootstrap': 'ReactBootstrap',
    'react-router-dom': 'ReactRouterDom'
  },
  output: {
    devtoolNamespace: PLUGIN_ID,
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'main.js'
  },
  mode: (isDev) ? 'eval-source-map' : 'production',
  plugins
}

if (isDev) {
  Object.assign(config, { devtool: 'eval-source-map' })
}

export default config
