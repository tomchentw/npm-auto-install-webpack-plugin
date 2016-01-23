"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NpmAutoInstallWebpackPlugin = undefined;

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _memoryFs = require("memory-fs");

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _thenify = require("thenify");

var _thenify2 = _interopRequireDefault(_thenify);

var _child_process = require("child_process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exec = (0, _thenify2.default)(_child_process.exec);

var NpmAutoInstallWebpackPlugin = exports.NpmAutoInstallWebpackPlugin = function () {
  function NpmAutoInstallWebpackPlugin() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, NpmAutoInstallWebpackPlugin);

    this.options = (0, _extends3.default)({}, options, {
      autoInstall: options.autoInstall !== false
    });
  }

  (0, _createClass3.default)(NpmAutoInstallWebpackPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      var runCompilerThenCallback = function runCompilerThenCallback() {
        var callback = arguments.length <= arguments.length - 1 + 0 ? undefined : arguments[arguments.length - 1 + 0];
        _this._runCompiler(compiler).then(function () {
          return callback();
        }, callback);
      };

      compiler.plugin("run", runCompilerThenCallback);
      compiler.plugin("watch-run", runCompilerThenCallback);
    }
  }, {
    key: "_runCompiler",
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(compiler) {
        var options, plugins, moduleList;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = compiler.options;
                plugins = options.plugins;
                _context.next = 4;
                return this._findMissingModuleList((0, _extends3.default)({}, options, {
                  plugins: plugins.filter(function (it) {
                    return it.constructor !== NpmAutoInstallWebpackPlugin;
                  })
                }));

              case 4:
                moduleList = _context.sent;

                if (!this.options.autoInstall) {
                  _context.next = 8;
                  break;
                }

                _context.next = 8;
                return this._installModuleList(moduleList);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      return function _runCompiler(_x2) {
        return ref.apply(this, arguments);
      };
    }()
  }, {
    key: "_findMissingModuleList",
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(webpackConfig) {
        var webpackCompiler, webpackStats, _webpackStats$toJson, errors;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                webpackCompiler = (0, _webpack2.default)(webpackConfig);

                webpackCompiler.outputFileSystem = new _memoryFs2.default();

                _context2.next = 4;
                return (0, _thenify2.default)(webpackCompiler.run.bind(webpackCompiler))();

              case 4:
                webpackStats = _context2.sent;
                _webpackStats$toJson = webpackStats.toJson();
                errors = _webpackStats$toJson.errors;
                return _context2.abrupt("return", errors.map(function (error) {
                  if (/Module not found: Error: Cannot resolve module '(\S+)' in/.test(error)) {
                    return RegExp.$1;
                  }
                }).filter(function (it) {
                  return !!it;
                }));

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
      return function _findMissingModuleList(_x3) {
        return ref.apply(this, arguments);
      };
    }()
  }, {
    key: "_installModuleList",
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(moduleList) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", exec("npm install " + moduleList.join(" ")));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
      return function _installModuleList(_x4) {
        return ref.apply(this, arguments);
      };
    }()
  }]);
  return NpmAutoInstallWebpackPlugin;
}();

exports.default = NpmAutoInstallWebpackPlugin;