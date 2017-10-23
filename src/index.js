import { exec as nativeExec } from "child_process";
import promisify from "util.promisify";
import webpack from "webpack";
import MemoryFS from "memory-fs";
import validateNpmPackageName from "validate-npm-package-name";

async function findMissingModuleList(webpackConfig) {
  const webpackCompiler = webpack(webpackConfig);
  webpackCompiler.outputFileSystem = new MemoryFS();

  const webpackStats = await promisify(
    webpackCompiler.run.bind(webpackCompiler)
  )();
  const { errors } = webpackStats.toJson();

  const rawModuleList = errors
    .map(error => {
      if (
        // v3
        /Module not found: Error: Can't resolve '(\S+)' in/.test(error)
      ) {
        return RegExp.$1;
      } else if (
        // v1
        /Module not found: Error: Cannot resolve module '(\S+)' in/.test(error)
      ) {
        return RegExp.$1;
      } else {
        return undefined;
      }
    })
    .filter(it => !!it)
    .map(it => it.split(`/`)[0]);

  const areAllModuleValid = rawModuleList.every(
    it => validateNpmPackageName(it).validForNewPackages
  );

  if (!areAllModuleValid) {
    throw new Error(`Unexpected module name`);
  }
  return rawModuleList;
}

async function installModuleList(moduleList, plugin) {
  const command = plugin.options.useYarn
    ? `yarn add ${moduleList.join(` `)}`
    : `npm install ${moduleList.join(` `)}`;

  await new Promise((resolve, reject) => {
    const cp = nativeExec(`${command} ${moduleList.join(` `)}`);
    cp.once("close", resolve);
    cp.once("error", reject);
  });
}

async function runCompiler(compiler, plugin) {
  if (plugin.options.disabled) {
    return;
  }
  const { options } = compiler;
  const moduleList = await findMissingModuleList({
    ...options,
    plugins: options.plugins.filter(it => it !== plugin)
  });
  await installModuleList(moduleList, plugin);
}

export class NpmAutoInstallWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      ...options,
      disabled: options.disabled === true
    };
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

export default NpmAutoInstallWebpackPlugin;
