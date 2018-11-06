const cahce = new Map();

const get = path => {
  console.log(`cachce.get(${JSON.stringify(path)})`);
  return cache.get(path);
};

const set = (path, obj) => {
  console.log(`cahce.set(${JSON.stringify(path)})`);
  if (!path) throw new ReferenceError('Can not cache files without path')
  cache.set(path, obj);
};

module.exports = {
  get,
  set
};
