import simpleTS from './lib/simple-ts';
import del from 'del';
import { terser } from 'rollup-plugin-terser';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

function removeDefs() {
  return {
    generateBundle(_, bundle) {
      for (const key of Object.keys(bundle)) {
        if (key.includes('.d.ts')) delete bundle[key];
      }
    },
  };
}

const babelPreset = [['@babel/preset-env', { targets: { ie: '10' } }]];

function getBabelPlugin() {
  return getBabelOutputPlugin({
    presets: babelPreset,
    allowAllFormats: true,
  });
}

export default async function () {
  await del('dist');

  return [
    // Main builds
    {
      input: 'src/index.ts',
      plugins: [simpleTS('./')],
      output: [
        {
          file: 'dist/index.js',
          format: 'es',
        },
        {
          file: 'dist/index.cjs',
          format: 'cjs',
          exports: 'default',
        },
        {
          file: 'dist/iife.min.js',
          format: 'iife',
          name: 'idbReady',
          esModule: false,
          plugins: [
            terser({
              compress: { ecma: 2020 },
            }),
            removeDefs(),
          ],
        },
      ],
    },
    // Compat builds
    {
      input: 'src/index.ts',
      external: (id) => {
        if (id.startsWith('@babel/runtime')) return true;
      },
      plugins: [simpleTS('./', { noBuild: true })],
      output: [
        {
          file: 'dist/compat.js',
          format: 'es',
          plugins: [getBabelPlugin()],
        },
        {
          file: 'dist/compat.cjs',
          format: 'cjs',
          exports: 'default',
          plugins: [getBabelPlugin()],
        },
        {
          file: 'dist/iife-compat.min.js',
          format: 'iife',
          name: 'idbReady',
          esModule: false,
          plugins: [
            getBabelPlugin(),
            terser({
              compress: { ecma: 5 },
            }),
            removeDefs(),
          ],
        },
      ],
    },
  ];
}
