const debug = require('util').debuglog('hode');
const lixy = require('lixy');
const hotRequire = require('./require');

const proxy = filename => {
  debug(`Proxying ${filename}`);
  return lixy.lazy(() => {
    const module =  hotRequire(filename);
    debug(`Sourcing ${filename}`, module);
    return module;
  });
};

module.exports = proxy
