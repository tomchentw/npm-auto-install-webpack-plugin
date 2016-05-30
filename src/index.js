import {
  exec as nodeExec,
} from "child_process";

import {
  default as thenify,
} from "thenify";

import {
  default as webpack,
} from "webpack";

import {
  default as MemoryFS,
} from "memory-fs";

import {
  default as validateNpmPackageName,
} from "validate-npm-package-name";

const exec = thenify(nodeExec);

export class NpmAutoInstallWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      ...options,
      autoInstall: options.autoInstall !== false,
    };
  }

  apply(compiler) {
    const runCompilerThenCallback = (...args) => {
      const callback = args[args.length - 1];
      this._runCompiler(compiler)
        .then(() => callback(), callback);
    };

    compiler.plugin(`run`, runCompilerThenCallback);
    compiler.plugin(`watch-run`, runCompilerThenCallback);
  }

  async _runCompiler(compiler) {
    const { options } = compiler;
    const { plugins } = options;

    const moduleList = await this._findMissingModuleList({
      ...options,
      plugins: plugins.filter(it => it.constructor !== NpmAutoInstallWebpackPlugin),
    });

    if (this.options.autoInstall) {
      await this._installModuleList(moduleList);
    }
  }

  async _findMissingModuleList(webpackConfig) {
    const webpackCompiler = webpack(webpackConfig);
    webpackCompiler.outputFileSystem = new MemoryFS();

    const webpackStats = await thenify(::webpackCompiler.run)();
    const { errors } = webpackStats.toJson();

    const rawModuleList = errors
      .map(error => {
        if (/Module not found: Error: Cannot resolve module '(\S+)' in/.test(error)) {
          return RegExp.$1;
        } else {
          return undefined;
        }
      })
      .filter(it => !!it)
      .map(it => it.split(`/`)[0]);

    const areAllModuleValid = rawModuleList
      .every(it => validateNpmPackageName(it).validForNewPackages);

    if (!areAllModuleValid) {
      throw new Error(`Unexpected module name`);
    }
    return rawModuleList;
  }

  async _installModuleList(moduleList) {
    return exec(`npm install ${moduleList.join(` `)}`);
  }
}

export default NpmAutoInstallWebpackPlugin;
