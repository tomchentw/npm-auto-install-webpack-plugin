"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NpmAutoInstallWebpackPlugin = void 0;

var _extends2 = _interopRequireDefault(
  require("babel-runtime/helpers/extends")
);

var _promise = _interopRequireDefault(require("babel-runtime/core-js/promise"));

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _child_process = require("child_process");

var _util = _interopRequireDefault(require("util.promisify"));

var _webpack = _interopRequireDefault(require("webpack"));

var _memoryFs = _interopRequireDefault(require("memory-fs"));

var _validateNpmPackageName = _interopRequireDefault(
  require("validate-npm-package-name")
);

let findMissingModuleList = (() => {
  var _ref = (0, _asyncToGenerator2.default)(function*(webpackConfig) {
    const webpackCompiler = (0, _webpack.default)(webpackConfig);
    webpackCompiler.outputFileSystem = new _memoryFs.default();
    const webpackStats = yield (0, _util.default)(
      webpackCompiler.run.bind(webpackCompiler)
    )();

    const _webpackStats$toJson = webpackStats.toJson(),
      errors = _webpackStats$toJson.errors;

    const rawModuleList = errors
      .map(error => {
        if (
          // v3
          /Module not found: Error: Can't resolve '(\S+)' in/.test(error)
        ) {
          return RegExp.$1;
        } else if (
          // v1
          /Module not found: Error: Cannot resolve module '(\S+)' in/.test(
            error
          )
        ) {
          return RegExp.$1;
        } else {
          return undefined;
        }
      })
      .filter(it => !!it)
      .map(it => it.split(`/`)[0]);
    const areAllModuleValid = rawModuleList.every(
      it => (0, _validateNpmPackageName.default)(it).validForNewPackages
    );

    if (!areAllModuleValid) {
      throw new Error(`Unexpected module name`);
    }

    return rawModuleList;
  });

  return function findMissingModuleList(_x) {
    return _ref.apply(this, arguments);
  };
})();

let installModuleList = (() => {
  var _ref2 = (0, _asyncToGenerator2.default)(function*(moduleList, plugin) {
    const command = plugin.options.useYarn
      ? `yarn add ${moduleList.join(` `)}`
      : `npm install ${moduleList.join(` `)}`;
    yield new _promise.default((resolve, reject) => {
      const cp = (0, _child_process.exec)(`${command} ${moduleList.join(` `)}`);
      cp.once("close", resolve);
      cp.once("error", reject);
    });
  });

  return function installModuleList(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

let runCompiler = (() => {
  var _ref3 = (0, _asyncToGenerator2.default)(function*(compiler, plugin) {
    if (plugin.options.disabled) {
      return;
    }

    const options = compiler.options;
    const moduleList = yield findMissingModuleList(
      (0, _extends2.default)({}, options, {
        plugins: options.plugins.filter(it => it !== plugin)
      })
    );
    yield installModuleList(moduleList, plugin);
  });

  return function runCompiler(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
})();

class NpmAutoInstallWebpackPlugin {
  constructor(options = {}) {
    this.options = (0, _extends2.default)({}, options, {
      disabled: options.disabled === true
    });
  }

  apply(compiler) {
    const runCompilerThenCallback = (...args) => {
      const done = args[args.length - 1];
      runCompiler(compiler, this).then(done, done);
    };

    compiler.plugin(`run`, runCompilerThenCallback);
    compiler.plugin(`watch-run`, runCompilerThenCallback);
  }
}

exports.NpmAutoInstallWebpackPlugin = NpmAutoInstallWebpackPlugin;
var _default = NpmAutoInstallWebpackPlugin;
exports.default = _default;
