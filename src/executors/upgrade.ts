
import { Command } from "@oclif/core";
import * as fs from "fs";
import * as path from "path";
import ora from "ora";
import { execa } from "execa";
import chalk from "chalk";


export abstract class BaseCommand<T extends typeof Command> extends Command {
  async execute(version: string | undefined | void) {
    const spinner = ora(`Upgrading njs2 base ... `);

    try {
      if (!fs.existsSync(`${path.resolve(process.cwd(), `package.json`)}`)) {
        //throw new Error(chalk.red('njs2 upgrade should be ran from project root directory'));
        console.log(chalk.red('njs2 upgrade should be ran from project root directory'));
        process.exit(1);
      }

      const package_json = JSON.parse(
        fs.readFileSync(`${path.resolve(process.cwd(), `package.json`)}`, 'utf-8'));
      if (package_json['njs2-type'] != 'project') {
        //throw new Error(chalk.red('njs2 upgrade should be ran from project root directory'));
        console.log(chalk.red('njs2 upgrade should be ran from project root directory'));
        process.exit(1);
      }

      let REQUESTED_BASE_VERSION = "latest"
      if (version) {
        REQUESTED_BASE_VERSION = version;
      }
      spinner.start();

      await execa("npm", ["uninstall", `@njs2/base`], {
        shell: true,
      });
      await execa("npm", ["install", `@njs2/base@${REQUESTED_BASE_VERSION} --registry http://plugins.juegogames.com/`], {
        shell: true,
      });

      // TODO: get all files at root level of this project

      // TODO: get all files from framework Template

      // TODO: write new files to this project
      spinner.succeed(`Njs2 base version is upgraded to ${REQUESTED_BASE_VERSION} version successfully`);

    } catch (e) {
      //console.log(chalk.red(e.message));
      spinner.fail('Njs2 base version upgrade failed.Please try again\n' + chalk.red((e as Error).message));
    }

  }
}
