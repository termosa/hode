const fs = require('fs');
const { dirname, sep } = require('path');
const proxify = require('./proxify');
const { ignore } = require('./config');
const { isIgnored, hotExt } = require('./helpers');
const hash = require('./hash');
const hotRequire = require('./require');
const Module = require('module');
const cache = require('./cache');

const aliasModule = (alias, parent) => {
  const module = new Module(alias, parent);
  module.load(alias);
  Module._cache[alias] = module;
  Module._pathCache[alias + '\x00'] = alias;
  console.log(`Aliased ${alias}`);
}

const loadFile = (defaultLoader, module, filename) => {
  if (isIgnored(filename, ignore)) {
    console.log(`Igonred ${filename}`);
    return defaultLoader(module, filename);
  }
  console.log(`Request ${filename}`);
  const source = fs.readFileSync(filename).toString();
  const fileId = dirname(filename) + sep + hash(filename, source) + hotExt;
  cache.set(fileId, source);
  hotRequire.register(filename, fileId);
  aliasModule(fileId, module.parent);
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
  console.log('requiring');
  const code = cache.get(filename);
  if (typeof code === 'undefined')
    throw new RefferenceError(`Cannot load module '${filename}'`);
  return module._compile(code, filename);
};

