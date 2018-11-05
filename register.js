const fs = require('fs');
const Module = require('module');
const path = require('path');

const getRootModule = module => module.parent ? getRootModule(module.parent) : module;

const compile = (filename, options) => {
  console.log('compile', { filename, options })
  if (filename.endsWith('lib.js'))
    return 'exports.add = (a, b) => a - b';
  return fs.readFileSync(filename).toString();
};

const FILE_EXTENSIONS = ['.js', '.node'];

const helpers = {
  isCoffee: path => {
    console.log(`isCoffee(${path})`);
    return path.endsWith('.js');
  }
};

const loadFile = (module, filename) => {
  const options = module.options || getRootModule(module).options;
  const answer = compile(filename, options);
  return module._compile(answer, filename);
};

if (require.extensions) {
  const ref = FILE_EXTENSIONS;
  for (let i = 0; i < ref.length; i++) {
    const ext = ref[i];
    require.extensions[ext] = loadFile;
  }
  const findExtension = (filename) => {
    const extensions = path.basename(filename).split('.');
    if (extensions[0] === '') {
      extensions.shift();
    }
    while (extensions.shift()) {
      const curExtension = '.' + extensions.join('.');
      if (Module._extensions[curExtension]) {
        return curExtension;
      }
    }
    return '.js';
  };
  Module.prototype.load = function (filename) {
    this.filename = filename;
    this.paths = Module._nodeModulePaths(path.dirname(filename));
    const extension = findExtension(filename);
    Module._extensions[extension](this, filename);
    return this.loaded = true;
  };
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

