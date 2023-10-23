import * as fs from "fs";
import * as path from "path";
import ora from "ora";
import { execaCommandSync } from "execa";
import chalk from "chalk";
import { JSONObject } from "../interface/index.js";



export const handler = async (pluginName: string) => {
  const spinner = ora(`Uninstalling plugin for node version ${process.versions.node} ... `);
  try {
    if (!fs.existsSync(`${path.resolve(`./package.json`)}`)) {
      //throw new Error(chalk.red('Run from project root direcory: njs2 plugin uninstall <plugin-name> (Eg: njs2-auth-email)'));
      console.log(chalk.red('Run from project root direcory: njs2 plugin uninstall <plugin-name> (Eg: njs2-auth-email)'));
      process.exit(1);
    }
      

    const packageJson: JSONObject = JSON.parse(fs.readFileSync(`${path.resolve(`./package.json`)}`, 'utf-8'));
    if (packageJson['njs2-type'] != 'project') {
      //throw new Error(chalk.red('Run from project root directory: njs2 plugin uninstall <plugin-name> (Eg: njs2 plugin uninstall njs2-auth-email)'));
      console.log(chalk.red('Run from project root directory: njs2 plugin uninstall <plugin-name> (Eg: njs2 plugin uninstall njs2-auth-email)'));
      process.exit(1);
    }


    let PLUGIN_NAME: string = pluginName;
    if (!PLUGIN_NAME || PLUGIN_NAME.length == 0) {
      //throw new Error(chalk.red('Invalid plugin name'));
      console.log(chalk.red('Invalid plugin name'));
      process.exit(1);
    }


    if (!PLUGIN_NAME.startsWith("@juego")) {
      PLUGIN_NAME = "@juego/" + PLUGIN_NAME.split('/').pop();
    }

    const packageExists: string[] = Object.keys(packageJson.dependencies).filter(packageName => packageName == PLUGIN_NAME);
    if (packageExists.length == 0) {
      //throw new Error(chalk.red("Plugin Dose not exists!"));
      console.log(chalk.red("Plugin Dose not exists!"));
      process.exit(1);
    }
    spinner.start();
    execaCommandSync(`npm uninstall ${PLUGIN_NAME}`, { stdio: "ignore" });
    spinner.succeed(`Uninstalled Successfully!`);
  } catch (e) {
    spinner.fail("Uninstallation failed\n" + chalk.red((e as Error).message))
  }
};
