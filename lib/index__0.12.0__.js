"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NpmAutoInstallWebpackPlugin = void 0;

var _classCallCheck2 = _interopRequireDefault(
  require("babel-runtime/helpers/classCallCheck")
);

var _createClass2 = _interopRequireDefault(
  require("babel-runtime/helpers/createClass")
);

var _extends2 = _interopRequireDefault(
  require("babel-runtime/helpers/extends")
);

var _promise = _interopRequireDefault(require("babel-runtime/core-js/promise"));

var _regenerator = _interopRequireDefault(require("babel-runtime/regenerator"));

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

var findMissingModuleList = (function() {
  var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(webpackConfig) {
      var webpackCompiler,
        webpackStats,
        _webpackStats$toJson,
        errors,
        rawModuleList,
        areAllModuleValid;

      return _regenerator.default.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                webpackCompiler = (0, _webpack.default)(webpackConfig);
                webpackCompiler.outputFileSystem = new _memoryFs.default();
                _context.next = 4;
                return (0, _util.default)(
                  webpackCompiler.run.bind(webpackCompiler)
                )();

              case 4:
                webpackStats = _context.sent;
                (_webpackStats$toJson = webpackStats.toJson()),
                  (errors = _webpackStats$toJson.errors);
                rawModuleList = errors
                  .map(function(error) {
                    if (
                      // v3
                      /Module not found: Error: Can't resolve '(\S+)' in/.test(
                        error
                      )
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
                  .filter(function(it) {
                    return !!it;
                  })
                  .map(function(it) {
                    return it.split("/")[0];
                  });
                areAllModuleValid = rawModuleList.every(function(it) {
                  return (0,
                  _validateNpmPackageName.default)(it).validForNewPackages;
                });

                if (areAllModuleValid) {
                  _context.next = 10;
                  break;
                }

                throw new Error("Unexpected module name");

              case 10:
                return _context.abrupt("return", rawModuleList);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        },
        _callee,
        this
      );
    })
  );

  return function findMissingModuleList(_x) {
    return _ref.apply(this, arguments);
  };
})();

var installModuleList = (function() {
  var _ref2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2(moduleList, plugin) {
      var command;
      return _regenerator.default.wrap(
        function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                command = plugin.options.useYarn
                  ? "yarn add ".concat(moduleList.join(" "))
                  : "npm install ".concat(moduleList.join(" "));
                _context2.next = 3;
                return new _promise.default(function(resolve, reject) {
                  var cp = (0, _child_process.exec)(
                    "".concat(command, " ").concat(moduleList.join(" "))
                  );
                  cp.once("close", resolve);
                  cp.once("error", reject);
                });

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        },
        _callee2,
        this
      );
    })
  );

  return function installModuleList(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

var runCompiler = (function() {
  var _ref3 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee3(compiler, plugin) {
      var options, moduleList;
      return _regenerator.default.wrap(
        function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                if (!plugin.options.disabled) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                options = compiler.options;
                _context3.next = 5;
                return findMissingModuleList(
                  (0, _extends2.default)({}, options, {
                    plugins: options.plugins.filter(function(it) {
                      return it !== plugin;
                    })
                  })
                );

              case 5:
                moduleList = _context3.sent;
                _context3.next = 8;
                return installModuleList(moduleList, plugin);

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        },
        _callee3,
        this
      );
    })
  );

  return function runCompiler(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
})();

var NpmAutoInstallWebpackPlugin =
  /*#__PURE__*/
  (function() {
    function NpmAutoInstallWebpackPlugin() {
      var options =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      (0, _classCallCheck2.default)(this, NpmAutoInstallWebpackPlugin);
      this.options = (0, _extends2.default)({}, options, {
        disabled: options.disabled === true
      });
    }

    (0, _createClass2.default)(NpmAutoInstallWebpackPlugin, [
      {
        key: "apply",
        value: function apply(compiler) {
          var _this = this;

          var runCompilerThenCallback = function runCompilerThenCallback() {
            var _ref4;

            var done = ((_ref4 = arguments.length - 1),
            _ref4 < 0 || arguments.length <= _ref4
              ? undefined
              : arguments[_ref4]);
            runCompiler(compiler, _this).then(done, done);
          };

          compiler.plugin("run", runCompilerThenCallback);
          compiler.plugin("watch-run", runCompilerThenCallback);
        }
      }
    ]);
    return NpmAutoInstallWebpackPlugin;
  })();

exports.NpmAutoInstallWebpackPlugin = NpmAutoInstallWebpackPlugin;
var _default = NpmAutoInstallWebpackPlugin;
exports.default = _default;
