import * as fs from 'fs';
import * as path from 'path';
import ora from "ora";
import { execaCommandSync } from 'execa';

import chalk from 'chalk';
import { updateNodeModulesStructure, updateSrcFiles } from './utils.js';

const excludeFolders: string[] = ["node_modules", "package.json"];

export const handler = async (pluginName: string) => {
  const spinner = ora(`Installing plugin for node version ${process.versions.node} ... `);
  try {

    let PLUGIN_NAME: string = pluginName;
    let localFolder: boolean = false;

    const registryUrl: string = "http://plugins.juegogames.com/";
    const nodeVersion: string = process.version.slice(1, 3);

    if (PLUGIN_NAME) {
      if (!PLUGIN_NAME.startsWith("@juego")) {
        PLUGIN_NAME = "@juego/" + PLUGIN_NAME.split('/').pop();
        localFolder = true;
      }

      if (!fs.existsSync(path.resolve(process.cwd(), ".npmrc"))) {
        console.log("Created .npmrc file");
        fs.writeFileSync(path.resolve(process.cwd(), ".npmrc"), `@juego:registry=${registryUrl}`);
      }

      spinner.start();
      if (fs.existsSync(path.resolve(`./node_modules/${pluginName}`))) {
        await execaCommandSync(`npm uninstall ${pluginName}`, { stdio: 'ignore' });
      }

      // install the packages
      await execaCommandSync(`npm i ${pluginName}`, { stdio: 'ignore' });

      // Check if compiled version exists for a particular node version
      if (
        !localFolder &&
        !fs.existsSync(path.resolve(`./node_modules/${PLUGIN_NAME}/${nodeVersion}`))
      ) {
        let pluginFolders: string[] = await fs.promises.readdir(path.resolve(`./node_modules/${PLUGIN_NAME}`));

        let availableVersions: string[] = [];
        pluginFolders.map((folder: string) => {
          if (!excludeFolders.includes(folder)) {
            availableVersions.push(folder + ".x");
          }
        });

        const availableVersionString: string = availableVersions.join(" | ");

        spinner.stop();
        execaCommandSync(`npm uninstall ${pluginName}`, { stdio: 'ignore' });
        throw new Error(chalk.red(`
        The Plugin you are trying to install does not exist for the current Node version: ${nodeVersion}!
        Plugin is only Available for following Major versions: ${availableVersionString}
        You can request the Maintianer to update the Plugin or Switch to the Supported Node Versions.
        `));
      }

      if (!localFolder) await updateNodeModulesStructure(PLUGIN_NAME);
      await updateSrcFiles(PLUGIN_NAME);
      spinner.succeed(chalk.green(`Installation completed!!`));
    } else {
      const spinner = ora(`Installing plugin for node version ${process.versions.node} ... `).start();

      // Update plugin structure in node_modules
      let packageList: string[] = await fs.promises.readdir(path.resolve(`./node_modules/@juego/`));
      await Promise.all(
        packageList.map(async (PLUGIN_NAME: string) => {
          await updateNodeModulesStructure(`@juego/${PLUGIN_NAME}`);
        })
      );
      spinner.succeed(chalk.green(`Installation completed!!`));
    }

  } catch (e) {
    //console.error(chalk.red(e.message));
    spinner.fail("Installation failed\n" + chalk.red((e as Error).message));
    process.exit(1);
  }
}
