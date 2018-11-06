const getRootModule = module => module.parent ? getRootModule(module.parent) : module;

const isIgnored = (path, ignores) => {
  return ignores.find(rule => {
    if (rule instanceof RegExp) {
      return rule.test(path);
    } else {
      return ~path.indexOf(rule);
    }
  });
};

module.exports = {
  hotExt: '.hot',
  getRootModule,
  isIgnored
};
