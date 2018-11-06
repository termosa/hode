const { resolve } = require('path');

const proxyPath = resolve(__dirname, 'proxy.js');
const requirePath = resolve(__dirname, 'require.js');

const normalize = path => path.replace(/'/g, '\\\'');

const proxify = path => `// This is proxied (not original) file
const hotRequire = require('${normalize(requirePath)}');
const proxy = require('${normalize(proxyPath)}');
const target = hotRequire('${normalize(path)}');
module.exports = proxy(target, '${normalize(path)}');`;

module.exports = proxify;
