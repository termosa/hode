# Hot reloading for Node.js modules

![Hode - Hot reload for Node.js modules](https://raw.githubusercontent.com/termosa/hode/master/docs/hode.png)

## Usage

```bash
$ node --require hode index.js
```

or at the top of your entry file

```js
require('hode/register')
```

## Tasks

- Wrap modules in Proxy
  - Return Proxy instead of a module
  - Store modules in a cache
  - Watch file updates and update cache
- Support `child_process`, see: CoffeeScript [implementation](https://github.com/jashkenas/coffeescript/blob/master/lib/coffeescript/register.js#L58)

