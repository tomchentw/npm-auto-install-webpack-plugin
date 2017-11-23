# npm-auto-install-webpack-plugin
> Auto installing missing dependencies in package.json before webpack compilation step

[![Version][npm-image]][npm-url] [![Travis CI][travis-image]][travis-url] [![Quality][codeclimate-maintainability-image]][codeclimate-maintainability-url] [![Coverage][codeclimate-c-image]][codeclimate-c-url] [![Dependencies][gemnasium-image]][gemnasium-url] [![Gitter][gitter-image]][gitter-url]


## Installation

```sh
npm i --save npm-auto-install-webpack-plugin
```

## Usage

### `webpack.config.babel.js`

```js
import NpmAutoInstallWebpackPlugin from "npm-auto-install-webpack-plugin";

export default {
  plugins: [
    new UnusedFilesWebpackPlugin(options),
  ],
};
```

### `webpack.config.js`

```js
const { NpmAutoInstallWebpackPlugin } = require("npm-auto-install-webpack-plugin");

module.exports = {
  plugins: [
    new NpmAutoInstallWebpackPlugin(options),
  ],
};
```


## Options

```js
new NpmAutoInstallWebpackPlugin(options)
```

### options.disabled

Disable auto-installing missing dependencies with the command.

* Default: `false`

### options.useYarn

If true, it will use `yarn add` for installing dependencies instead of `npm install`.

* Default: `false`


## Contributing

[![devDependency Status][david-dm-image]][david-dm-url]

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


[npm-image]: https://img.shields.io/npm/v/npm-auto-install-webpack-plugin.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/npm-auto-install-webpack-plugin

[travis-image]: https://img.shields.io/travis/tomchentw/npm-auto-install-webpack-plugin.svg?style=flat-square
[travis-url]: https://travis-ci.org/tomchentw/npm-auto-install-webpack-plugin
[codeclimate-maintainability-image]: https://img.shields.io/codeclimate/maintainability/tomchentw/npm-auto-install-webpack-plugin.svg?style=flat-square
[codeclimate-maintainability-url]: https://codeclimate.com/github/tomchentw/npm-auto-install-webpack-plugin
[codeclimate-c-image]: https://img.shields.io/codeclimate/c/tomchentw/npm-auto-install-webpack-plugin.svg?style=flat-square
[codeclimate-c-url]: https://codeclimate.com/github/tomchentw/npm-auto-install-webpack-plugin
[gemnasium-image]: https://img.shields.io/gemnasium/tomchentw/npm-auto-install-webpack-plugin.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/tomchentw/npm-auto-install-webpack-plugin
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/tomchentw/npm-auto-install-webpack-plugin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[david-dm-image]: https://img.shields.io/david/dev/tomchentw/npm-auto-install-webpack-plugin.svg?style=flat-square
[david-dm-url]: https://david-dm.org/tomchentw/npm-auto-install-webpack-plugin#info=devDependencies

