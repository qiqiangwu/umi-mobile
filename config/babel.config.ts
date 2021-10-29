/*
 * babel插件配置
 */

import path from 'path';
import hasha from 'hasha';

type IBabelPresetOrPlugin = Function | string | [string, any, string?];

const generateScopedName = (name: string, filename: string) => {
  const hash = hasha(filename + name, { algorithm: 'md5' });
  const basename = path.basename(filename, '.less');
  return `${basename}-${name}-${hash.slice(0, 5)}`;
};

export default [
  [
    'react-css-modules',
    {
      generateScopedName,
      filetypes: {
        '.less': {
          syntax: 'postcss-less',
          plugins: ['postcss-nested'],
        },
      },
      autoResolveMultipleImports: true,
    },
  ],
  ['lodash'],
] as IBabelPresetOrPlugin[];
