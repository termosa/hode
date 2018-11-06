const debug = require('util').debuglog('hode');
const chokidar = require('chokidar');

const watch = (dir, update, ignored) => {
  return chokidar.watch(dir, { ignored })
    .on('change', update);
};

module.exports = watch;
