"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

var _path = _interopRequireDefault(require("path"));

var _memoryFs = _interopRequireDefault(require("memory-fs"));

var _webpack = _interopRequireDefault(require("webpack"));

var _index = _interopRequireDefault(require("../index"));

describe("NpmAutoInstallWebpackPlugin module", function() {
  describe("normal resolve", function() {
    it(
      "should work as expected",
      function(done) {
        var compiler = (0, _webpack.default)({
          context: _path.default.resolve(__dirname, "../../"),
          entry: {
            client: _path.default.resolve(
              __dirname,
              "../__fixtures__/client.fixture.js"
            )
          },
          output: {
            path: __dirname // It will be in MemoryFS :)
          },
          plugins: [
            new _index.default({
              useYarn: true
            })
          ]
        });
        compiler.outputFileSystem = new _memoryFs.default();
        compiler.run(function(err, stats) {
          expect(err).toBeFalsy();
          done();
        });
      },
      10000
    );
  });
  describe("nested resolve", function() {
    it(
      "should work as expected",
      function(done) {
        var compiler = (0, _webpack.default)({
          context: _path.default.resolve(__dirname, "../../"),
          entry: {
            client: _path.default.resolve(
              __dirname,
              "../__fixtures__/nested.fixture.js"
            )
          },
          output: {
            path: __dirname // It will be in MemoryFS :)
          },
          plugins: [
            new _index.default({
              useYarn: true
            })
          ]
        });
        compiler.outputFileSystem = new _memoryFs.default();
        compiler.run(function(err, stats) {
          expect(err).toBeFalsy();
          done();
        });
      },
      10000
    );
  });
});
