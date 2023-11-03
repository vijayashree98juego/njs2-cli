import * as fs from "fs";
import * as path from "path";
import ora, { Ora } from "ora";
import { execaCommandSync } from "execa";
import chalk from "chalk";
import { ArrayProps, AsyncFunction, PackageJonProps } from "@oclif-cli/interface/index.js";

export const handler: AsyncFunction<void> = async (pluginName: string) => {
  // Initialize a loading spinner using the ora library.
  // The spinner is created with the message "Uninstalling plugin for node version 12 ... "
  const spinner: Ora = ora(`Uninstalling plugin for node version ${process.versions.node} ... `);
  try {
    if (!fs.existsSync(`${path.resolve(`./package.json`)}`)) {
      //throw new Error(chalk.red('Run from project root direcory: njs2 plugin uninstall <plugin-name> (Eg: njs2-auth-email)'));
      console.log(chalk.red('Run from project root direcory: njs2 plugin uninstall <plugin-name> (Eg: njs2-auth-email)'));
      process.exit(1);
    }


    const packageJson: PackageJonProps = JSON.parse(fs.readFileSync(`${path.resolve(`./package.json`)}`, 'utf-8'));
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

    const packageExists: ArrayProps<string> = Object.keys(packageJson.dependencies).filter(packageName => packageName == PLUGIN_NAME);
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
