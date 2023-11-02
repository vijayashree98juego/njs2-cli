import * as fs from 'fs'
import * as path from 'path'
import { execa } from 'execa'
import chalk from 'chalk'
import { ArrayProps, AsyncFunction, ObjectProps } from '../interface/index.js'


export const initPackage: AsyncFunction<void> = async (LIBRARY_NAME: string) => {
  const PACKAGE: ObjectProps<any> = JSON.parse(
    fs.readFileSync(`${path.resolve(`./node_modules/${LIBRARY_NAME}/package.json`)}`, 'utf-8'),
  )

  try {
    const PLUGINS: ArrayProps<string> = PACKAGE['njs2-endpoints']
    await Promise.all(PLUGINS.map(async (plugin: string) => {
      const METHOD_NAME: string = `${PACKAGE['njs2-method-prefix']}.${plugin}`
      const METHODS_PATH: string = `src/methods/${METHOD_NAME}`
      await execa('cp', ['-r', './node_modules/@njs2/base/template/pluginStructure/', `./${METHODS_PATH}/`])

      // execaCommandSync(COPY_TEMP_SCRIPT)
      let executeFileContents: string = fs.readFileSync(path.resolve(`./${METHODS_PATH}/action.js`), 'utf8')
      executeFileContents = executeFileContents
        .replace(
          /<method-name>/g,
          METHOD_NAME.split(/(?:\.|-)+/)
            .map((key, index) => key.charAt(0).toUpperCase() + key.slice(1))
            .join(''),
        )
        .replace(/<lib-name>/g, `${LIBRARY_NAME}/${plugin}`)
      fs.writeFileSync(path.resolve(`./${METHODS_PATH}/action.js`), executeFileContents)

      let initFileContents: string = fs.readFileSync(path.resolve(`./${METHODS_PATH}/init.js`), 'utf8')
      initFileContents = initFileContents
        .replace(
          /<method-name>/g,
          METHOD_NAME.split(/(?:\.|-)+/)
            .map((key, index) => key.charAt(0).toUpperCase() + key.slice(1))
            .join(''),
        )
        .replace(/<lib-name>/g, `${LIBRARY_NAME}/${plugin}`)
      fs.writeFileSync(path.resolve(`./${METHODS_PATH}/init.js`), initFileContents)
    }));
  } catch (e) {
    //console.log(chalk.red(e.message));
    throw new Error((e as Error).message);
  }
}
