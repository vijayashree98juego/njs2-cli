import { Command } from '@oclif/core'
import * as fs from 'fs'
import * as path from 'path'
import * as execa from 'execa'
import chalk from 'chalk'
import ora from 'ora'
import { JSONObject } from '@oclif-cli/interface/index.js'

export abstract class BaseCommand<T extends typeof Command> extends Command {
  async execute(argName: string) {
    const spinner = ora(`Creating a endpoint... `);
    try {
      if (!fs.existsSync(`${path.resolve(process.cwd(), `package.json`)}`)) {
        //throw new Error(chalk.red('njs2 endpoint <endpoint-name> to be run from project root directory'))
        console.log(chalk.red('njs2 endpoint <endpoint-name> to be run from project root directory'));
        process.exit(1);
      }

      const package_json: JSONObject = JSON.parse(fs.readFileSync(`${path.resolve(process.cwd(), `package.json`)}`, { encoding: 'utf8', flag: 'r' }))

      if (package_json['njs2-type'] != 'project') {
        //throw new Error(chalk.red('njs2 endpoint <endpoint-name> to be run from project root directory'));
        console.log(chalk.red('njs2 endpoint <endpoint-name> to be run from project root directory'));
        process.exit(1);
      }

      let splitString: string[] = argName.split('/')
      splitString = splitString.map((element, index) => {
        //Checking for index > 1 because if method name is "/user/detail" then second resource(detail) should
        //get converted to Pascal case "user" should be camel case
        if (index == 1) {
          element = `.${element}`
        } else if (index > 1) {
          element = element.charAt(0).toUpperCase() + element.slice(1)
        }
        return element
      })
      const METHOD_NAME: string = splitString.join('')
      const METHODS_PATH: string = `src/methods/${METHOD_NAME}`
      if (fs.existsSync(METHODS_PATH)) {
        //throw new Error(chalk.red(`Method already exists: ${METHODS_PATH}`))
        console.log(chalk.red(`Method already exists: ${METHODS_PATH}`));
        process.exit(1);
      }

      spinner.start();
      const COPY_TEMP_SCRIPT: string = `cp -rn ${path.resolve(
        process.cwd(),
        '.',
      )}/node_modules/@njs2/base/template/methodStructure/. ${path.resolve(process.cwd(), '.')}/${METHODS_PATH}`

      execa.execaCommandSync(COPY_TEMP_SCRIPT)
      let executeFileContents = fs.readFileSync(path.resolve(process.cwd(), `${METHODS_PATH}/action.js`), 'utf8')
      executeFileContents = executeFileContents.replace(
        /<method-name>/g,
        METHOD_NAME.split(/(?:\.|-)+/)
          .map((key, index) => key.charAt(0).toUpperCase() + key.slice(1))
          .join(''),
      )
      fs.writeFileSync(path.resolve(process.cwd(), `${METHODS_PATH}/action.js`), executeFileContents)

      let initFileContents: any = fs.readFileSync(path.resolve(process.cwd(), `${METHODS_PATH}/init.js`), 'utf8')
      initFileContents = initFileContents
        .replace(
          /<method-name>/g,
          METHOD_NAME.split(/(?:\.|-)+/)
            .map((key, index) => key.charAt(0).toUpperCase() + key.slice(1))
            .join(''),
        )
        .replace(/<method-type>/g, 'GET')
        .replace(/<is-secured>/g, false)
      fs.writeFileSync(path.resolve(process.cwd(), `${METHODS_PATH}/init.js`), initFileContents);

      spinner.succeed(chalk.green("Endpoint created successfully.Please refer below path."))
      console.log(chalk.yellow(`Endpoint: ${METHOD_NAME}`));
      console.log(chalk.yellow(`Path:  ${METHODS_PATH}`))

    } catch (e) {
      //console.log(chalk.red(e.message));
      spinner.fail("Endpoint creation failed.Please try again after some time\n" + chalk.red((e as Error).message));
    }
  }
}
