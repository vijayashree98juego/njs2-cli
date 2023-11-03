import chalk from 'chalk';
import * as path from "path";
import ora, { Ora } from "ora";
import fs from 'fs'
import { execa, execaCommandSync } from "execa";
import { AsyncFunction } from '@oclif-cli/interface/index.js';


export const handler: AsyncFunction<void> = async (pluginName: string) => {
  // Initialize a loading spinner using the ora library.
  // The spinner is created with the message "Creating a package ..."
  const spinner: Ora = ora(`Creating a package ... `);
  try {
    const PLUGIN_NAME: string = pluginName;
    // Validations
    // if (!PLUGIN_NAME) {
    //   throw new Error(chalk.red('Package name is mandatory parameter'));
    // }

    if (fs.existsSync(PLUGIN_NAME)) {
      //throw new Error(chalk.red(`Package folder already exists: ${PLUGIN_NAME}`));
      console.log(chalk.red(`Package folder already exists: ${PLUGIN_NAME}`));
      process.exit(1);
    }

    spinner.start();
    // Create package folder

    fs.mkdirSync(PLUGIN_NAME);

    await execa(`mkdir`, ["tmp-package"]);
    await execaCommandSync(`git clone https://github.com/Njs2/njs2-package-template.git`, {
      stdio: "ignore", // Redirects child process's stdio to the parent process
      shell: true,
      cwd: `${path.resolve(process.cwd(), "./tmp-package")}`,
    });

    await execaCommandSync(`cp -r ./tmp-package/njs2-package-template/package/* ${PLUGIN_NAME}`, {
      stdio: "ignore", // Redirects child process's stdio to the parent process
      shell: true,
      cwd: process.cwd(),
    });

    await execaCommandSync(
      `rm -rf ./tmp-package`,
      {
        stdio: "ignore",
        shell: true,
        cwd: process.cwd(),
      }
    );
    spinner.succeed(`Package setup completed successfully`);
  } catch (e) {
    //console.error(chalk.red(error.message));
    spinner.fail("Plugin creation failed\n" + chalk.red((e as Error).message))
  }
};
