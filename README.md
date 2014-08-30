# css-minimizers-bench

Сompares the work of `CSS` minimizers.

## Which CSS minimizers are compared?

* [CSSO](https://github.com/css/csso)

* [clean-css](https://github.com/GoalSmashers/clean-css)

* [cssshrink](https://github.com/stoyan/cssshrink)

* [csswring](https://github.com/hail2u/node-csswring)

## Install

```bash
$ git clone https://github.com/eGavr/css-minimizers-bench.git

$ cd css-minimizers-bench

$ npm install
```

## Usage

```bash
$ bin/compare-minimizers
```

## Configuration

### How to configure paths?

Go to the [configuration file](https://github.com/eGavr/css-minimizers-bench/blob/master/lib/config.js#L14-L15). In this file you can configure paths with the help of these variables:

* `toRawCSS` - path to tests (raw, not minimized `CSS` files).
* `toMinCSS` - path where to output minimized `CSS` files.

**CAUTION!**
Configuration paths must exist on your file system.

### How to add your minimizer?

**1**. Go to the [package.json](https://github.com/eGavr/css-minimizers-bench/blob/master/package.json#L28-L30) and add your minimizer to the dependencies.

**2**. Go to the [configuration file](https://github.com/eGavr/css-minimizers-bench/blob/master/lib/config.js#L8-L10) and add your code according to the following template:

```js
name: minimize(require('module'), 'method')
```

where:

 * `name` - the name of your minimizer (it will be used in the log).
 * `module` - the required module of your minimizer.
 * `method` - the name of the minimization method of your minimizer (the method which recieves raw `CSS` and minifies it).

**3**. Reinstall the dependencies.

```bash
npm install
```

**4**. See [usage](https://github.com/eGavr/css-minimizers-bench#usage).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
