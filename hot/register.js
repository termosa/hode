const fs = require('fs');
const debug = require('util').debuglog('hode');
const { dirname, sep } = require('path');
const proxify = require('./proxify');
const { ignore } = require('./config');
const { isIgnored, hotExt } = require('./helpers');
const hash = require('./hash');
const hotRequire = require('./require');
const Module = require('module');
const cache = require('./cache');
const watch = require('./watch');

const aliasModule = (alias, parent) => {
  const module = new Module(alias, parent);
  module.load(alias);
  Module._cache[alias] = module;
  Module._pathCache[alias + '\x00'] = alias;
  debug(`Aliased ${alias}`);
};

const resetFile = (filename, module) => {
  const source = fs.readFileSync(filename).toString();
  const fileId = dirname(filename) + sep + hash(filename, source) + hotExt;
  cache.set(fileId, source);
  hotRequire.register(filename, fileId);
  aliasModule(fileId, module.parent);
}

const loadFile = (defaultLoader, module, filename) => {
  if (isIgnored(filename, ignore)) {
    return defaultLoader(module, filename);
  }
  debug(`Request ${filename}`);
  resetFile(filename, module);
  const code = proxify(filename);
  return module._compile(code, filename);
};

if (require.extensions) {
  const exts = require.extensions;
  Object.keys(exts)
    .forEach((ext) => {
      exts[ext] = loadFile.bind(exts[ext], exts[ext].bind(exts));
    });
}

require.extensions = require.extensions || {};
require.extensions[hotExt] = (module, filename) => {
  const code = cache.get(filename);
  if (typeof code === 'undefined')
    throw new RefferenceError(`Cannot load module '${filename}'`);
  return module._compile(code, filename);
};

watch(process.cwd(), filename => {
  debug(`Replace ${filename}`);
  resetFile(filename, module);
});
