const debug = require('util').debuglog('hode');

const cache = new Map();

const get = path => {
  debug(`cache.get(${JSON.stringify(path)})`);
  return cache.get(path);
};

const set = (path, obj) => {
  debug(`cache.set(${JSON.stringify(path)})`);
  if (!path) throw new ReferenceError('Can not cache files without path')
  cache.set(path, obj);
};

module.exports = {
  get,
  set
};
