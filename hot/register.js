const fs = require('fs');
const proxify = require('./proxify');
const { ignore } = require('./config');
const { isIgnored, fsPrefix } = require('./helpers');
const hash = require('./hash');
const hotRequire = require('./require');

const loadFile = (defaultLoader, module, filename) => {
  if (isIgnored(filename, ignore)) {
    console.log(`Igonred ${filename}`);
    return defaultLoader(module, filename);
  }
  console.log(`Request ${filename}`);
  const source = fs.readFileSync(filename).toString();
  const fileId = fsPrefix + hash(filename, source);
  hotRequire.register(filename, fileId);
  const code = proxify(filename);
  console.log(`Compile ${fileId}\n---\n${code}\n---`);
  return module._compile(code, fileId);
};

if (require.extensions) {
  const exts = require.extensions;
  Object.keys(exts)
    .forEach((ext) => {
      exts[ext] = loadFile.bind(exts[ext], exts[ext].bind(exts));
    });
}

