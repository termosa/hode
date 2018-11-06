const cache = require('./cache');

const pathMap = new Map();

const hotRequire = path => {
  const fileId = pathMap.get(path);
  console.log(`Retrieve ${path}\n  from ${fileId}`);
  if (!fileId) throw new ReferenceError(`Cannot find module '${path}'`);
  // TODO: this require fails because module alias is not registered in the cache
  // I've expected the module._compile in register.js does it, but it's not.
  // The next step would be to check if my guess is true and see the implementation
  // of _compile method and cache in NodeJS sources
  require(fileId);
};

hotRequire.register = (path, fileId) => {
  console.log(`Register ${path}\n  within ${fileId}`);
  pathMap.set(path, fileId);
};

module.exports = hotRequire;
