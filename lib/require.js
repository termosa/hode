const debug = require('util').debuglog('hode');
const cache = require('./cache');

const pathMap = new Map();

const hotRequire = path => {
  const fileId = pathMap.get(path);
  debug(`Retrieve ${path}\n  from ${fileId}`);
  if (!fileId) throw new ReferenceError(`Cannot find module '${path}'`);
  return require(fileId);
};

hotRequire.register = (path, fileId) => {
  debug(`Register ${path}\n  within ${fileId}`);
  pathMap.set(path, fileId);
};

module.exports = hotRequire;
