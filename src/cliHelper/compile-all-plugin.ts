import * as path from 'path'
import ora, { Ora } from 'ora';
import chalk from 'chalk'
import { execa, execaCommandSync, execaCommand } from 'execa'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import { ArrayProps, AsyncFunction, PackageJonProps, userProps } from '@oclif-cli/interface/index.js'


// const filePath = 'dist/compiled';
let excludeFolders: ArrayProps<string> = ['tmp']
let registryUrl: string = 'http://plugins.juegogames.com'

let syncRemote: boolean = false
let encryptStatus: boolean = true
let versionManager: boolean | string = false
let nodeVersions: ArrayProps<string> = ['12', '14', '16']

const checkIfUserLoggedIn: AsyncFunction<void> = async () => {
  try {
    // Check if user logged into NPM
    const user: userProps<string, number, boolean> = await execaCommandSync(`npm whoami --registry=${registryUrl}`, { encoding: 'utf8', stdio: 'pipe' })
    console.log(chalk.bold(`Logged in as: ${user}`))
  } catch (e) {
    throw `
    It appears that you are not logged into NPM!

    Run following command to login:
      ${chalk.white('npm login --registry=http://plugins.juegogames.com')}
    `
  }
}

const uploadFileToRegistry: AsyncFunction<void> = async (filepath: string) => {
  await execaCommandSync(`cp package.json ${filepath} & cd ${filepath} & npm publish --registry ${registryUrl}`, {
    stdio: 'ignore',
    shell: true,
  })
}

const getRegistryUploadStatus: AsyncFunction<void> = async () => {
  const cliRes: { [key: string]: string } = await inquirer.prompt([
    {
      type: 'list',
      name: 'sync-remote',
      message: 'Update plugin to Juego Registry?',
      choices: ['Yes', 'No'],
    },
  ])
  syncRemote = cliRes['sync-remote'] == 'Yes'
}

const getVersionManagerChoice: AsyncFunction<void> = async () => {
  const cliRes: { [key: string]: string } = await inquirer.prompt([
    {
      type: 'list',
      name: 'version-manager',
      message: `It is a pre-requisite for you to have a Node Version Manager installed locally.
                Which one do you have?`,
      choices: ['NVM', 'Not Installed'],
    },
  ])
  versionManager = cliRes['version-manager'] == 'Not Installed' ? false : cliRes['version-manager']
}

/** * @description * njs2 compile * */
export const handler: AsyncFunction<void> = async () => {
  let spinner: Ora = ora();
  try {

    const packageJson: PackageJonProps = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
    if (!packageJson || !packageJson['njs2-type']) {
      //throw new Error(chalk.red('Run this comand from NJS2 base/endpoint/helper package directory...'))
      console.log(chalk.red('Run this comand from NJS2 base/endpoint/helper package directory...'));
      process.exit(1);
    }
    // spinner.stop()

    // get version manager
    await getVersionManagerChoice()

    if (!versionManager) {
      //throw new Error(chalk.yellow('Compile process cannot continue without a Node Version manager. Good Bye!!!'))
      spinner.warn(chalk.yellow('Compile process cannot continue without a Node Version manager. Good Bye!!!'))
      process.exit(1);
    }

    if (!fs.existsSync(`${path.resolve(process.cwd(), `package.json`)}`)) {
      //throw new Error(chalk.red('njs2 compile (Run from plugin directory) root directory'))
      console.log(chalk.red('njs2 compile (Run from plugin directory) root directory'))
      process.exit(1);
    }


    let package_json: PackageJonProps = JSON.parse(
      fs.readFileSync(`${path.resolve(process.cwd(), `package.json`)}`, 'utf-8'),
    )

    if (!(package_json['njs2-type'] == 'endpoint' || package_json['njs2-type'] == 'helper')) {
      //throw new Error(chalk.red('njs2 compile (Run from plugin directory) root directory'))
      console.log(chalk.red('njs2 compile (Run from plugin directory) root directory'))
      process.exit(1);
    }

    // add node version in package.json
    package_json.nodeVersion = process.version
    fs.writeFileSync(`${path.resolve(process.cwd(), `package.json`)}`, JSON.stringify(package_json, null, 2))

    //await getRegistryUploadStatus()

    //Check the Current Node version
    let nodeVersion: string = process.version.slice(1, 3)
    console.log(chalk.green(`\n ***Current Node Version ${nodeVersion}***`));

    //nodeVersions.push(nodeVersion);
    if (!fs.existsSync('dist')) fs.mkdirSync('dist')

    //Iterating to create compiled file for the above Node version
    await Promise.all(
      nodeVersions.map(async (version) => {
        try {
          spinner.text = `Compiling for node version ${version}`
          spinner.start();

          let filePath: string = `dist/${version}`
          if (!fs.existsSync(`dist/${version}`)) fs.mkdirSync(`dist/${version}`)
          else {
            // empty dist folder
            fs.emptyDirSync(`dist/${version}`)
          }

          // Check if plugin name exists, if yes delete the existing files and copy current folder contents to dist/compiled folder
          // console.log( execaCommandSync(` rsync -r --exclude 'dist' * ./dist/${version}`));

          // await execa('rsync', ['-r', '--exclude', 'dist', process.cwd(), `./dist/${version}`]);
          const command: string = `rsync -r --exclude dist ${process.cwd()}/ ./dist/${version}`
          execaCommandSync(command)
          //console.log(`Compiling for node version ${version}`.green);

          if (encryptStatus) {
            if (versionManager === 'NVM') {
              await execaCommand(
                `. ~/.nvm/nvm.sh && nvm run ${version} ~/.nvm/versions/node/${process.version
                }/lib/node_modules/@njs2/cli/helper/compile-all-plugin-helper.js ${process.cwd()}/${filePath} ${excludeFolders[0]
                }`,
                { shell: true },
              )
            }
            spinner.succeed(chalk.green(`Compiled for node version ${version}`));
          }

        } catch (err) {
          spinner.fail(`Node Version: ${version}.x not found!`)
          fs.emptyDirSync(`dist/${version}`)
          return
        }
      })
    )
    spinner.succeed('Compilation completed!')

    await getRegistryUploadStatus();

    if (syncRemote) {
      spinner.text = `Uploading file to registry ${registryUrl}\n`
      spinner.start()
      try {
        await checkIfUserLoggedIn()
        await uploadFileToRegistry('dist')
        spinner.succeed(chalk.green('File uploading success'))
      } catch (e) {
        spinner.fail(chalk.red('File uploading failed. Try again after some time.\n') + (e as Error).message)
      }
    } else {
      process.exit(1)
    };

  } catch (e) {
    // console.error(chalk.red(e.message));
    spinner.fail("Compilation failed\n" + chalk.red((e as Error).message));
  }
}
