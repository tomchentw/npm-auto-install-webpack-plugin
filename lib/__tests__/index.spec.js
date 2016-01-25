"use strict";

var _path = require("path");

var _tape = require("tape");

var _tape2 = _interopRequireDefault(_tape);

var _memoryFs = require("memory-fs");

var _memoryFs2 = _interopRequireDefault(_memoryFs);

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _index = require("../index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)("NpmAutoInstallWebpackPlugin", function (t) {
  var compiler = (0, _webpack2.default)({
    context: (0, _path.resolve)(__dirname, "../../"),
    entry: {
      client: (0, _path.resolve)(__dirname, "../__fixtures__/client.fixture.js")
    },
    output: {
      path: __dirname },
    // It will be in MemoryFS :)
    module: {
      loaders: [{
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        loader: "babel"
      }]
    },
    plugins: [new _index2.default()]
  });
  compiler.outputFileSystem = new _memoryFs2.default();

  compiler.run(function (err, stats) {
    t.equal(err, null);

    t.end();
  });
});