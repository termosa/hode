const debug = require('util').debuglog('hode');
const hotRequire = require('./require');

const handlerNames = [
  'apply', // (target, thisArgument, argumentsList) → any
  'construct', // (target, argumentsList, newTarget?) → Object
  'defineProperty', // (target, propertyKey, propDesc) → boolean
  'deleteProperty', // (target, propertyKey) → boolean
  'enumerate', // (target) → Iterator
  'get', // (target, propertyKey, receiver?) → any
  'getOwnPropertyDescriptor', // (target, propertyKey) → PropDesc|Undefined
  'getPrototypeOf', // (target) → Object|Null
  'has', // (target, propertyKey) → boolean
  'isExtensible', // (target) → boolean
  'ownKeys', // (target) → Array<PropertyKey>
  'preventExtensions', // (target) → boolean
  'set', // (target, propertyKey, value, receiver?) → boolean
  'setPrototypeOf', // (target, proto) → boolean
];

const handler = handlerNames.reduce((handler, name) => {
  return Object.assign(handler, { [name]: (target, ...args) => {
    debug(`> ${target.filename} is triggered with ${name}(...${args.length})`);
    const module = hotRequire(target.filename);
    return Reflect[name](module, ...args);
  }});
}, {});

const proxy = filename => {
  const trg = () => {};
  Object.assign(trg, { filename });
  return new Proxy(trg, handler);
};

module.exports = proxy;

// Notes
//  - If type of target will switch from/to function there is no way to update the proxy
//  - Static code works better then a list of generated methods (Chrome can interactively show the result of execution
//  - Should test the case when the object is replaced with the one that has/missed readonly properties
//    - will proxy recalculate invariants?
//    - if not, and it's not because we give it not the exact object, need to implement that check manually
