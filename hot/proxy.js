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
    console.log(`> ${target.label} is triggered with ${name}(...${args.length})`);
    return Reflect[name](target.source, ...args);
  }});
}, {});

const proxy = (target, label = Math.random().toString().slice(2, 8)) => {
  const trg = typeof target === 'function' ? () => {} : {};
  Object.assign(trg, { label, source: target });
  return new Proxy(trg, handler);
};

module.exports = proxy;

// Notes
//  - If type of target will switch from/to function there is no way to update the proxy
//  - Static code works better then a list of generated methods (Chrome can interactively show the result of execution
//  - Should test the case when the object is replaced with the one that has/missed readonly properties
//    - will proxy recalculate invariants?
//    - if not, and it's not because we give it not the exact object, need to implement that check manually
