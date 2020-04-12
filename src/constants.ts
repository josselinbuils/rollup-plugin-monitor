import { Plugin } from 'rollup';

export const PLUGIN_METHODS = [
  'augmentChunkHash',
  'banner',
  'buildEnd',
  'buildStart',
  'footer',
  'generateBundle',
  'intro',
  'load',
  'options',
  'outputOptions',
  'outro',
  'renderChunk',
  'renderDynamicImport',
  'renderError',
  'renderStart',
  'resolveDynamicImport',
  'resolveFileUrl',
  'resolveId',
  'resolveImportMeta',
  'transform',
  'watchChange',
  'writeBundle',

  // Deprecated
  'resolveAssetUrl',
] as (keyof Plugin)[];

export const PLUGIN_NAME = 'monitor';
