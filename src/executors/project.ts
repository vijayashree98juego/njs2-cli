import { Command, ux } from "@oclif/core";
import { exit } from "process";
import * as fs from "fs";
import * as path from "path";
import { execa, execaCommandSync } from "execa";
import chalk from "chalk";
import ora from "ora";

export abstract class BaseCommand<T extends typeof Command> extends Command {
  async execute(projectName: string, version: string | undefined | void) {
    const spinner = ora(`Creating a project template... `);
    try {
      const PROJECT_NAME = projectName;
      let BASE_VERSION = "latest";

      if (!PROJECT_NAME) {
        console.log("Project name is mandatory parameter");
        process.exit(1);
      }
      if (fs.existsSync(PROJECT_NAME)) {
        console.log(
          chalk.red(`Project folder already exists: ${PROJECT_NAME}`)
        );
        process.exit(1);
      }
      if (version) {
        BASE_VERSION = version; //checkAndFindVersion(CLI_ARGS)
      } else {
        console.log(chalk.bold.white("Defaulting to @njs2/base@latest"));
        console.log(chalk.bold.white(
          "Did you know now you can pass version to njs2 project command? e.g.: njs2 project <project-name> version 2.0.1"
        )
        );
      }
      const packageName: string = await ux.prompt("Package name", {
        required: false,
      });
      const packageVersion: string | number = await ux.prompt("Version ", {
        // default: version ?? "1.0.0",
        required: false,
      });
      const description = await ux.prompt("Description", { required: false });
      const author = await ux.prompt("Author", { required: false });
      let packageJson: { [key: string]: string | object } = {};
      packageJson["njs2-type"] = "project";
      packageJson["name"] = packageName ? packageName : PROJECT_NAME;
      packageJson["version"] = packageVersion ? packageVersion : "0.0.0";
      packageJson["description"] = description;
      packageJson["author"] = author;
      packageJson["dependencies"] = {
        "@njs2/base": `${BASE_VERSION}`,
      };

      console.log(
        `\nAbout to write to ${path.resolve(
          process.cwd(),
          `${PROJECT_NAME}/package.json`
        )}`
      );

      console.log(chalk.white((JSON.stringify(JSON.parse(JSON.stringify(packageJson)), null, 2))));

      const response = await ux.confirm("Is this ok ? y/n");

      if (response) {
        await execa(`mkdir`, [`${PROJECT_NAME}`]);

        fs.writeFileSync(
          `${path.resolve(process.cwd(), `${PROJECT_NAME}/package.json`)}`,
          JSON.stringify(packageJson, null, 2)
        );
        spinner.start();

        await execaCommandSync(`cd ${PROJECT_NAME}`, {
          shell: true,
          cwd: process.cwd(),
        });

        await execa("npm", ["install", `@njs2/base@${BASE_VERSION} `], {
          stdio: "ignore", // Redirects child process's stdio to the parent process
          shell: true,
          cwd: `${path.resolve(process.cwd(), `${PROJECT_NAME}`)}`,
        });

        await execaCommandSync(`npm install eslint --save-dev`, {
          stdio: "ignore", // Redirects child process's stdio to the parent process
          shell: true,
          cwd: `${path.resolve(process.cwd(), `${PROJECT_NAME}`)}`,
        });

        await execaCommandSync(
          `cp -rf ./node_modules/@njs2/base/template/frameworkStructure/. .`,
          {
            shell: true,
            cwd: `${path.resolve(process.cwd(), `${PROJECT_NAME}`)}`,
          }
        );

        let packageJsonExist = JSON.parse(
          fs.readFileSync(
            `${path.resolve(process.cwd(), `${PROJECT_NAME}/package.json`)}`,
            "utf-8"
          )
        );
        packageJsonExist["njs2-type"] = "project";
        packageJsonExist["name"] = packageName;
        packageJsonExist["version"] = packageVersion;
        packageJsonExist["description"] = description;
        packageJsonExist["author"] = author;
        packageJsonExist["dependencies"] = packageJson["dependencies"];
        fs.writeFileSync(
          `${path.resolve(process.cwd(), `${PROJECT_NAME}/package.json`)}`,
          JSON.stringify(packageJsonExist, null, 2)
        );

        spinner.stop();
        const confirm: boolean = await ux.confirm("Are you willing to install the dependency ? y/n");
        if (confirm) {
          spinner.text = "Installing Dependencies..."
          spinner.start();
          await execaCommandSync(`cd ${PROJECT_NAME} `, { shell: true });
          await execa("npm", ["install"], {
            cwd: `${path.resolve(process.cwd(), `${PROJECT_NAME}`)}`,
          });
          spinner.succeed(`Project setup completed successfully`);
        } else {
          console.log(chalk.green("Project template Created Successfully. Please refer below instruction for more detail"));
          console.log(chalk.yellow(`->Go to project folder ${path.resolve(process.cwd(), `${PROJECT_NAME}`)}\n->Execute command 'npm i'`));
        }

      } else {
        spinner.warn(chalk.yellow("Please attempt to create the project again!!!"));
        exit();
      }
    } catch (e) {
      //console.log(chalk.red(e.message));
      spinner.fail('Project  creation failed\n' + chalk.red((e as Error).message));
    }
  }
}
