
import { Command } from "@oclif/core";
import * as fs from "fs";
import * as path from "path";
import { execaCommandSync } from "execa";
import chalk from "chalk";
import ora, { Ora } from "ora";
import { PackageJonProps } from "@oclif-cli/interface/index.js";

export abstract class BaseCommand<T extends typeof Command> extends Command {
  async execute(folderName: string, fileName: string, serverType: string | undefined | void): Promise<void> {
    const spinner: Ora = ora(`Creating a library... `);
    try {
      if (!fs.existsSync(`${path.resolve(process.cwd(), `package.json`)}`)) {
        console.log(
          chalk.red(
            "njs2 library <path> to be run from project root directory")
        );
        process.exit(1);

      }

      const package_json: PackageJonProps = JSON.parse(fs.readFileSync(`${path.resolve(
        process.cwd(),
        `package.json`
      )}`, { encoding: 'utf8', flag: 'r' }));

      if (package_json["njs2-type"] != "project") {
        console.log(chalk.red(
          "njs2 library <path> to be run from project root directory")
        );
        process.exit(1);
      }



      let COPY_TEMP_SCRIPT: string = "";
      const LIB_NAME: string = folderName;
      const LIB_PATH: string = `src/library/${LIB_NAME}`;
      if (!fs.existsSync(LIB_PATH)) {
        fs.mkdirSync(LIB_PATH);
      }
      const LIB_FILE_NAME: string = fileName;
      const LIB_FILE_PATH: string = `src/library/${LIB_NAME}/${LIB_FILE_NAME}.lib.js`;

      if (fs.existsSync(LIB_FILE_PATH)) {
        //throw new Error(chalk.red(`library file name  already exists: ${LIB_FILE_PATH}`));
        console.log(chalk.red(`library file name  already exists: ${LIB_FILE_PATH}`));
        process.exit(1);
      }
      spinner.start();
      if (serverType === "sql") {
        COPY_TEMP_SCRIPT = `cp -rn ${path.resolve(
          process.cwd(),
          "."
        )}/node_modules/@njs2/base/template/libraryStructure/sql/. ${path.resolve(
          process.cwd(),
          "."
        )}/${LIB_PATH}`;
      } else if (serverType === "mongo") {
        COPY_TEMP_SCRIPT = `cp -rn ${path.resolve(
          process.cwd(),
          "."
        )}/node_modules/@njs2/base/template/libraryStructure/mongo/. ${path.resolve(
          process.cwd(),
          "."
        )}/${LIB_PATH}`;
      } else {
        COPY_TEMP_SCRIPT = `cp -rn ${path.resolve(
          process.cwd(),
          "."
        )}/node_modules/@njs2/base/template/libraryStructure/default/. ${path.resolve(
          process.cwd(),
          "."
        )}/${LIB_PATH}`;
      }

      execaCommandSync(COPY_TEMP_SCRIPT);

      fs.renameSync(
        `${path.resolve(
          process.cwd(),
          `src/library/` + folderName + `/` + serverType + `.lib.js`
        )}`,
        `${path.resolve(
          process.cwd(),
          `src/library/` + folderName + `/` + LIB_FILE_NAME + ".lib.js"
        )}`
      );

      let executeFileContents = fs.readFileSync(
        path.resolve(process.cwd(), LIB_PATH + "/" + LIB_FILE_NAME + ".lib.js"),
        "utf8"
      );

      executeFileContents = executeFileContents
        .replace(
          /<class-name>/g,
          LIB_FILE_NAME.charAt(0).toLowerCase() + LIB_FILE_NAME.slice(1)
        )
        .replace(
          /<function-name>/g,
          LIB_FILE_NAME.charAt(0).toUpperCase() + LIB_FILE_NAME.slice(1)
        );

      let Path: string = path.resolve(process.cwd(), `${LIB_PATH}/${LIB_FILE_NAME}.lib.js`);
      fs.writeFileSync(
        path.resolve(process.cwd(), `${LIB_PATH}/${LIB_FILE_NAME}.lib.js`),
        executeFileContents
      );
      // console.log('\x1b[32m', chalk.green(`Sucessfully created ${LIB_PATH}/${LIB_FILE_NAME}.lib.js`));

      if (serverType === "mongo") {
        fs.renameSync(
          `${path.resolve(
            process.cwd(),
            `src/library/` + folderName + `/` + `model/model.js`
          )}`,
          `${path.resolve(
            process.cwd(),
            `src/library/` + folderName + `/` + `model/` + LIB_FILE_NAME + ".js"
          )}`
        );

        executeFileContents = fs.readFileSync(
          path.resolve(process.cwd(), `src/library/` + folderName + `/` + `model/` + LIB_FILE_NAME + ".js"),
          "utf8"
        );
        executeFileContents = executeFileContents
          .replace(
            /<class-name>/g,
            LIB_FILE_NAME.charAt(0).toLowerCase() + LIB_FILE_NAME.slice(1)
          )
          .replace(
            /<function-name>/g,
            LIB_FILE_NAME.charAt(0).toUpperCase() + LIB_FILE_NAME.slice(1)
          );

        Path = path.resolve(process.cwd(), `src/library/` + folderName + `/` + `model/` + LIB_FILE_NAME + ".js");
        fs.writeFileSync(
          path.resolve(process.cwd(), `src/library/` + folderName + `/` + `model/` + LIB_FILE_NAME + ".js"),
          executeFileContents
        );
      }
      spinner.succeed(chalk.green(`Library created successfully.Please refer below path.`))
      console.log(chalk.yellow(`Library: ${LIB_FILE_NAME}`));
      console.log(chalk.yellow(`Path:   ${Path}`))
    } catch (e) {
      //console.log(chalk.red(e.message));
      spinner.fail('Library creating failed.Please try again after some time\n' + chalk.red((e as Error).message))
    }
  }
}
