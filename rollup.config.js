import simpleTS from './lib/simple-ts';
import del from 'del';
import { terser } from 'rollup-plugin-terser';

function removeDefs() {
  return {
    generateBundle(_, bundle) {
      for (const key of Object.keys(bundle)) {
        if (key.includes('.d.ts')) delete bundle[key];
      }
    },
  };
}

export default async function () {
  await del('dist');

  return {
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
        strict: false,
        exports: 'default',
        plugins: [removeDefs()],
      },
      {
        file: 'dist/iife.min.js',
        format: 'iife',
        name: 'idbReady',
        esModule: false,
        plugins: [removeDefs(), terser()],
      },
    ],
  };
}
