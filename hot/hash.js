const crypto = require('crypto');

const hash = (path, content) => {
  if (typeof path !== 'string' || typeof content !== 'string')
    throw new TypeError('Both, path and content must be strings');
  return crypto
    .createHash('sha1')
    .update(path + content)
    .digest('base64')
    .replace(/\//g, '_');
};

module.exports = hash;
