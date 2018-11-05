const Module = require('module');
const fs = require('fs');
const path = require('path');
const { fileExtensions, ignore } = require('./config');
const { isIgnored } = require('./helpers');

const getRootModule = module => module.parent ? getRootModule(module.parent) : module;

const wrap = (filename, options) => {
  return fs.readFileSync(filename).toString();
};

const loadFile = (defaultLoader, module, filename) => {
  const options = module.options || getRootModule(module).options;
  if (isIgnored(filename, ignore)) {
    return defaultLoader(module, filename);
  }
  const proxied = wrap(filename, options);
  return module._compile(proxied, filename);
};

if (require.extensions) {
  const exts = require.extensions;
  Object.keys(exts)
    .forEach((ext) => {
      exts[ext] = loadFile.bind(exts[ext], exts[ext].bind(exts));
    });
}

/* TODO
child_process = require('child_process');
if (child_process) {
  const {fork} = child_process;
  const binary = require.resolve('../../bin/coffee');
  child_process.fork = function(path, args, options) {
    if (helpers.isCoffee(path)) {
      if (!Array.isArray(args)) {
        options = args || {};
        args = [];
      }
      args = [path].concat(args);
      path = binary;
    }
    return fork(path, args, options);
  };
}
*/

