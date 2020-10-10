import path from 'path'

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'

const production = !process.env.ROLLUP_WATCH

const privStatic = path.resolve(__dirname, '../priv/static')

export default [
  {
    input: path.resolve(__dirname, 'src/app/index.ts'),
    output: {
      sourcemap: !production,
      format: 'iife',
      name: 'app',
      file: path.join(privStatic, 'app.js')
    },
    plugins: [
      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css: css => {
          css.write('app.css')
        },
        preprocess: sveltePreprocess()
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      commonjs(),
      typescript({
        watch: true,
        tsconfig: path.resolve(__dirname, 'tsconfig.app.json'),
        sourceMap: !production,
        inlineSources: !production
      }),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      // !production && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      // !production && livereload('public'),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),

      copy({
        watch: true,
        targets: [{ src: 'static/**/*', dest: privStatic }],
        copyOnce: false,
        flatten: false
      })
    ],
    watch: {
      clearScreen: false
    }
  },
  {
    input: path.resolve(__dirname, 'src/serviceworker/index.ts'),
    output: {
      sourcemap: !production,
      format: 'iife',
      name: 'serviceworker',
      file: path.join(privStatic, 'sw.js')
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        watch: true,
        tsconfig: path.resolve(__dirname, 'tsconfig.serviceworker.json'),
        sourceMap: !production,
        inlineSources: !production
      }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  }
]
