
import { Command } from "@oclif/core";
import chalk from "chalk";
import * as fs from 'fs'
import { ExecaReturnValue, execa } from "execa";
import path from "path";
import ora from "ora";
import { createRequire } from "module";
import { JSONObject } from "@oclif-cli/interface/index.js";
const require = createRequire(import.meta.url);
global.baseInitialize = require(`${path.resolve(process.cwd(), `node_modules/@njs2/base/base/baseInitialize.class.js`)}`);

export abstract class BaseCommand<T extends typeof Command> extends Command {
    async execute() {
     
        //updatePostman();
        const spinner = ora(`Processing collection ... `).start();
        try {
          if (!fs.existsSync(`${path.resolve(process.cwd(), `package.json`)}`)) {
            //throw new Error(chalk.red('Run from project root direcory: njs2 run'))
            console.log(chalk.red('Run from project root direcory: njs2 run'));
            process.exit(1);
          }
    
          const packageJson_content: ExecaReturnValue<string> = await execa(
            'cat',
            [`${path.resolve(process.cwd(), `package.json`)}`],
            {},
          )
          const package_json = JSON.parse(packageJson_content.stdout)
          if (package_json['njs2-type'] != 'project') {
            //throw new Error(chalk.red('Run from project root directory: njs2 run'))
            console.log(chalk.red('Run from project root directory: njs2 run'))
            process.exit(1);
          }

          const packageJsonContent: ExecaReturnValue<string> = await execa(
            "cat",
            [`${path.resolve(process.cwd(), `package.json`)}`]
          );
      
          // console.log("package json content")
          // console.log(packageJsonContent)
          const packageJson: JSONObject = JSON.parse(packageJsonContent.stdout);
          // console.log("package json here")
          // console.log(packageJson)
          const configContent: ExecaReturnValue<string> = await execa("cat", [
            `${path.resolve(process.cwd(), `src/config/config.json`)}`,
          ]);
      
          const base_url = JSON.parse(configContent.stdout).API_ENDPOINT;
          const apiPaths = fs
            .readdirSync(path.resolve(process.cwd(), "src/methods"), {
              withFileTypes: true,
            })
            .filter((dirent: JSONObject) => dirent.isDirectory())
            .map((dirent: JSONObject) => dirent.name);
          const apiRes: JSONObject = {
            info: {
              _postman_id: packageJson.name,
              name: packageJson.name,
              description: `${packageJson.description}`,
              schema:
                "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
            },
            item: [],
          };
      
          apiRes.item = await Promise.all(apiPaths.map(async (apiPath) => {
            let apiInit = require(path.resolve(process.cwd(), `src/methods/${apiPath}/init.js`));
            const apiInitObj = new apiInit();
            const paramsList = apiInitObj.getParameter();
            let fileExists = false;
            Object.keys(paramsList).map((key) => {
              if (paramsList[key].type == "file") fileExists = true;
            });
      
            let apiDefination: JSONObject = {
              name: apiPath.split(".").join("/"),
              request: {
                method:
                  typeof apiInitObj.initializer.requestMethod == "string"
                    ? apiInitObj.initializer.requestMethod.toUpperCase()
                    : apiInitObj.initializer.requestMethod[0].toUpperCase(),
                header: [
                  {
                    key: "enc_state",
                    value: "1",
                    disabled: true,
                    description: "Encryption status: 1- Enable, 2- Disable",
                    type: "text",
                  },
                  {
                    key: "lng_key",
                    value: "en",
                    disabled: true,
                    description: "Language key",
                    type: "text",
                  },
                ],
                url: {
                  raw: `${base_url && base_url.length ? base_url : "{{base_url}}"
                    }/${apiPath.split(".").join("/")}`,
                  host: [
                    `${base_url && base_url.length ? base_url : "{{base_url}}"}`,
                  ],
                  path: apiPath.split("."),
                },
              },
              response: [],
            };
      
            if (apiInitObj.initializer.isSecured) {
              apiDefination.request.header.push({
                key: "access_token",
                value: "",
                description: "JWT access token",
                type: "text",
              });
            }
            let paramsDef = Object.keys(paramsList).map((params) => {
              return {
                key: paramsList[params].name,
                value: paramsList[params].default,
                disabled: !paramsList[params].required,
                description: paramsList[params].description,
                type:
                  fileExists &&
                    apiInitObj.initializer.requestMethod[0].toUpperCase() == "POST" &&
                    paramsList[params].type == "file"
                    ? "file"
                    : "text",
              };
            });
      
            if (
              !(
                fileExists &&
                apiInitObj.initializer.requestMethod[0].toUpperCase() == "POST"
              )
            ) {
              paramsDef.push({
                key: "data",
                value: "",
                disabled: true,
                description:
                  "Encrypted data and url encode(URLSearchParams) the encrypted data to handle special characters",
                type: "text",
              });
            }
      
            if (apiInitObj.initializer.requestMethod[0].toUpperCase() == "GET") {
              apiDefination.request.url.query = paramsDef;
            } else if (
              apiInitObj.initializer.requestMethod[0].toUpperCase() == "POST"
            ) {
              if (fileExists) {
                apiDefination.request.body = {
                  mode: "formdata",
                  formdata: paramsDef,
                };
              } else {
                apiDefination.request.body = {
                  mode: "urlencoded",
                  urlencoded: paramsDef,
                };
              }
            }
            return apiDefination;
          }));
          fs.writeFileSync("postman.json", JSON.stringify(apiRes, null, 2));
          spinner.succeed("Updated collection in postman.json file")
          return apiRes;
        } catch (e) {
          // console.log('error ids there')
          // console.log((e as Error).message)
          spinner.fail("Failed to update postman collection\n"+chalk.red((e as Error).message));
        }
    }
}
