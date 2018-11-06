const { resolve } = require('path');

const proxyPath = resolve(__dirname, 'proxy.js');
const requirePath = resolve(__dirname, 'require.js');

const normalize = path => path.replace(/'/g, '\\\'');

const proxify = path => `// This is proxied (not original) file
const proxy = require('${normalize(proxyPath)}');
module.exports = proxy('${normalize(path)}');`;

module.exports = proxify;
