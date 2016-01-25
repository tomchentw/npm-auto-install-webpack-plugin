import {
  resolve as resolvePath,
} from "path";

import {
  default as test,
} from "tape";

import {
  default as MemoryFS,
} from "memory-fs";

import {
  default as webpack,
} from "webpack";

import {
  default as NpmAutoInstallWebpackPlugin,
} from "../index";

test(`NpmAutoInstallWebpackPlugin`, t => {
  const compiler = webpack({
    context: resolvePath(__dirname, `../../`),
    entry: {
      client: resolvePath(__dirname, `../__fixtures__/client.fixture.js`),
    },
    output: {
      path: __dirname, // It will be in MemoryFS :)
    },
    module: {
      loaders: [
        {
          test: /\.js(x?)$/,
          exclude: /node_modules/,
          loader: `babel`,
        },
      ],
    },
    plugins: [new NpmAutoInstallWebpackPlugin()],
  });
  compiler.outputFileSystem = new MemoryFS();

  compiler.run((err, stats) => {
    t.equal(err, null);

    t.end();
  });
});
