import path from "path";

import MemoryFS from "memory-fs";
import webpack from "webpack";
import NpmAutoInstallWebpackPlugin from "../index";

describe(`NpmAutoInstallWebpackPlugin module`, () => {
  describe(`normal resolve`, () => {
    it(
      `should work as expected`,
      done => {
        const compiler = webpack({
          context: path.resolve(__dirname, `../../`),
          entry: {
            client: path.resolve(__dirname, `../__fixtures__/client.fixture.js`)
          },
          output: {
            path: __dirname // It will be in MemoryFS :)
          },
          plugins: [
            new NpmAutoInstallWebpackPlugin({
              useYarn: true
            })
          ]
        });
        compiler.outputFileSystem = new MemoryFS();

        compiler.run((err, stats) => {
          expect(err).toBeFalsy();

          done();
        });
      },
      10000
    );
  });

  describe(`nested resolve`, () => {
    it(
      `should work as expected`,
      done => {
        const compiler = webpack({
          context: path.resolve(__dirname, `../../`),
          entry: {
            client: path.resolve(__dirname, `../__fixtures__/nested.fixture.js`)
          },
          output: {
            path: __dirname // It will be in MemoryFS :)
          },
          plugins: [
            new NpmAutoInstallWebpackPlugin({
              useYarn: true
            })
          ]
        });
        compiler.outputFileSystem = new MemoryFS();

        compiler.run((err, stats) => {
          expect(err).toBeFalsy();

          done();
        });
      },
      10000
    );
  });
});
