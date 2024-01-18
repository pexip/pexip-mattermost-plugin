import path from 'path'

import { fileURLToPath } from 'url'
const _filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/naming-convention
const __dirname = path.dirname(_filename)

export default {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}
