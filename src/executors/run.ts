import { Command } from '@oclif/core'
import * as fs from 'fs'
import * as path from 'path'
import { ExecaReturnValue, execa } from 'execa'
import chalk from 'chalk'
import updatePostman from '@oclif-cli/cliHelper/update-postman.js'

// import data from '../utils/index.js'

/**
 * @param {*} CLI_KEYS
 * @param {*} CLI_ARGS
 * Example:
 * njs2 run serverless
 * njs2 run express
 * njs2 run nodemon
 * njs2 run -- will fallback to express
 */

export abstract class BaseCommand<T extends typeof Command> extends Command {
  async execute(serverType: string): Promise<void> {
    try {
      if (!fs.existsSync(`${path.resolve(process.cwd(), `package.json`)}`)) {
        //throw new Error(chalk.red('Run from project root direcory: njs2 run'))
        console.log(chalk.red('Run from project root direcory: njs2 run'));
        process.exit(1);
      }

      const packageJsonContent: ExecaReturnValue<string> = await execa(
        'cat',
        [`${path.resolve(process.cwd(), `package.json`)}`],
        {},
      )
      const packageJson = JSON.parse(packageJsonContent.stdout)
      if (packageJson['njs2-type'] != 'project') {
        //throw new Error(chalk.red('Run from project root directory: njs2 run'))
        console.log(chalk.red('Run from project root directory: njs2 run'))
        process.exit(1);
      }

      // Runs the lint proccess for syntax validations
      // await execa("npm", ["run", "lint"], {
      //   cwd: `${path.resolve(process.cwd())}`,
      // });

      // Creates postman.json that can be imported in postman
      const postmanInstance = new updatePostman();
      await postmanInstance.postmanCollectionHelper();

      switch (serverType) {
        case 'serverless':
          await execa('sls', ['offline', 'start'], {
            cwd: `${path.resolve(process.cwd())}`,
            stdio: 'inherit',
          })

          break

        case 'nodemon':
          await execa('./node_modules/.bin/nodemon', ['express.js'], {
            cwd: `${path.resolve(process.cwd())}`,
            stdio: 'inherit',
          })

          await execa('./node_modules/.bin/nodemon', ['socketio.js'], {
            cwd: `${path.resolve(process.cwd())}`,
            stdio: 'inherit',
          })

          break

        case 'express':
        default:
          await execa('node', ['express.js'], {
            cwd: `${path.resolve(process.cwd())}`,
            stdout: 'inherit',
          })
          await execa('node', ['socketio.js'], {
            cwd: `${path.resolve(process.cwd())}`,
            stdout: 'inherit',
          })
          break
      }
    } catch (e) {
      //console.log('error here')
      console.log(chalk.red((e as Error).message))
      // console.log(chalk.red("Sever port is busy.Please free up the port!!! Try again."));
    }
  }
}
