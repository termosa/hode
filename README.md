# Hot reloading for NodeJS modules

## Usage

```bash
$ node index.js
# or
$ node --require ./hot app
```

## Tasks

- Wrap modules in Proxy
  - Return Proxy instead of a module
  - Store modules in a cache
  - Watch file updates and update cache
- Support `child_process`, see: CoffeeScript [implementation](https://github.com/jashkenas/coffeescript/blob/master/lib/coffeescript/register.js#L58)

