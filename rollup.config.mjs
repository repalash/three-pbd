// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import license from 'rollup-plugin-license'
import packageJson from './package.json' assert {type: 'json'};
import path from 'path'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { name, version, main, module, browser, author } = packageJson
const isProduction = process.env.NODE_ENV === 'production'

const settings = {
  globals: {
  },
  sourcemap: true
}

export default {
  input: './src/index.ts',
  output: [{
    file: main,
    name: main,
    ...settings,
    format: 'cjs',
    plugins: [
      isProduction && terser()
    ]
  }, {
    file: module,
    ...settings,
    name: name,
    format: 'es'
  }, {
    file: browser,
    ...settings,
    name: name,
    format: 'umd'
  }],
  external: [ "three" ],
  plugins: [
    json(),
    resolve({
    }),
    typescript({
    }),
    commonjs({
      include: 'node_modules/**',
      extensions: [ '.js' ],
      ignoreGlobal: false,
      sourceMap: false
    }),
    license({
      banner: {
        content: {
          file: path.join(__dirname, 'LICENSE'),
          encoding: 'utf-8', // Default is utf-8
        },
        data() {
          return {
            foo: 'foo',
          };
        },
      },
      thirdParty: {
        output: path.join(__dirname, 'dist', 'dependencies.txt'),
        includePrivate: true, // Default is false.
      },

    })
  ]
}
