
import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as path from "path";
import ora, { Ora } from "ora";
import { execaCommandSync } from "execa";

import chalk from "chalk";
import { ArrayProps, AsyncFunction, ObjectProps, PackageJonProps, paramsProps, Function } from "@oclif-cli/interface/index.js";
import { initPackage } from "./init-plugin.js";
import { initEnv } from "./init-env.js";

const nodeVersions: ArrayProps<string> = ['12', '14', '16'];

/**
 * 
 * @param {*} awsConfig {
 * AWS_ROLE_ARN: 'arn:aws:iam::123456789012:role/njs2-cli-role',
 * AWS_REGION: 'us-east-1',
 * AWS_PROFILE: 'njs2-cli-profile',
 * AWS_ACCESS_KEY_ID: '',
 * AWS_SECRET_ACCESS_KEY: ''
 * }
 * @returns credentials
 */
export const getCrossAccountCredentials: AsyncFunction<{ [key: string]: string }> = async (awsConfig: ObjectProps<any>) => {
  return new Promise((resolve, reject) => {
    if (!awsConfig.AWS_ROLE_ARN || (awsConfig.AWS_ROLE_ARN && awsConfig.AWS_ROLE_ARN.length == 0)) {
      resolve({
        region: awsConfig.AWS_REGION,
        accessKeyId: awsConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: awsConfig.AWS_SECRET_ACCESS_KEY_ID
      });
    } else {
      const sts: any = new AWS.STS({
        region: awsConfig.AWS_REGION,
        accessKeyId: awsConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: awsConfig.AWS_SECRET_ACCESS_KEY_ID,
      });
      const timestamp: number = (new Date()).getTime();
      const params: paramsProps = {
        RoleArn: awsConfig.AWS_ROLE_ARN,
        RoleSessionName: `NJS-CLI-${timestamp}`
      };

      sts.assumeRole(params, (err: string, data: ObjectProps<any>) => {
        if (err) reject(err);
        else {
          resolve({
            region: awsConfig.AWS_REGION,
            accessKeyId: data.Credentials.AccessKeyId,
            secretAccessKey: data.Credentials.SecretAccessKey,
            sessionToken: data.Credentials.SessionToken,
          });
        }
      });
    }
  });
}

export const isValidVarName: Function<boolean> = (name: string) => {
  try {
    Function('var ' + name);
  } catch (e) {
    return false;
  }
  return true;
}

export const validatePackageVersion: Function<boolean | string> = (val: ObjectProps<any> | string) => {
  return val == 'latest' || (val && val.length > 0 && val.split('.').map((val: string) => isNaN(parseInt(val)) ? 0 : 1).reduce((accumulator: number, currentValue: number) => accumulator + currentValue) == 3);
}

export const checkAndFindVersion: Function<boolean | string> = (CLI_ARGS: string) => {
  return CLI_ARGS.includes("version") ? CLI_ARGS[CLI_ARGS.indexOf("version") + 1] ?? false : false;
}

export const updateNodeModulesStructure: AsyncFunction<void> = async (pluginName: string) => {
  // Initialize a loading spinner using the ora library.
  // The spinner is created with the message "Copying files to root folder ... "
  const spinner: Ora = ora(`Copying files to root folder ... `);
  try {
    const nodeVersion: string = process.version.slice(1, 3);

    // get path to private plugin. plugin starting with `@juego`
    const pluginPath: string = path.resolve(`./node_modules/${pluginName}/${nodeVersion}`)

    // check if folder exists
    if (!fs.existsSync(pluginPath)) {
      //throw new Error(chalk.red(`Package ${pluginName} for node version ${nodeVersion} is not found. Please try with other node version.`))
      console.log(chalk.red(`Package ${pluginName} for node version ${nodeVersion} is not found. Please try with other node version.`));
      process.exit(1);
    }

    let fileList: ArrayProps<string> = await fs.promises.readdir(pluginPath);

    // Check if folder is empty
    if (fileList.length === 0) {
      //throw new Error(chalk.red(`Package ${pluginName} for node version ${nodeVersion} is not found. Please try with other node version.`))
      console.log(chalk.red(`Package ${pluginName} for node version ${nodeVersion} is not found. Please try with other node version.`))
      process.exit(1);
    }
    spinner.start();
    // Get destination folder name
    const destinationPath: string = path.resolve(`./node_modules/${pluginName}/`);

    // copy all files from version specific folder to root folder
    execaCommandSync(`cp -r ${pluginPath}/. ${destinationPath}`);
    spinner.stop();
    console.log(chalk.bold("****** Copied files to root folder ******"));

    // install the packages

    // remove version specific folders
    const folderNames: ArrayProps<string> = await fs.promises.readdir(path.resolve(`./node_modules/${pluginName}`))

    await Promise.all(folderNames.map(async (folderName: string) => {
      // ignore if not version folder
      if (!nodeVersions.includes(folderName)) return;
      //console.log(chalk.green(`Copied files for Node v${folderName}.x.x`));
      spinner.succeed(chalk.green(`Copied files for Node v${folderName}.x.x`))
      const folderPath: string = path.resolve(`./node_modules/${pluginName}/${folderName}`);
      if (fs.existsSync(folderPath)) {
        execaCommandSync(`rm -rf ${folderPath}`)
      }
    }))

    console.log(chalk.bold("****** Version specific folders deleted ******"));
  } catch (e) {
    //console.log(chalk.red(e.message));
    throw new Error((e as Error).message);
    // process.exit(1);
  }
}

export const updateSrcFiles: AsyncFunction<void> = async (folderName: string) => {

  const pluginPackageJson: PackageJonProps = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), `./node_modules/${folderName}/package.json`), 'utf-8'));

  if (pluginPackageJson['njs2-type'] == 'endpoint') {
    await initPackage(folderName);
  }

  if (pluginPackageJson['loadEnv']) {
    await initEnv(folderName);
  }

}