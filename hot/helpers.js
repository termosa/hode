exports.isIgnored = (path, ignores) => {
  return ignores.find(rule => {
    if (rule instanceof RegExp) {
      return rule.test(path);
    } else {
      return ~path.indexOf(rule);
    }
  });
};
