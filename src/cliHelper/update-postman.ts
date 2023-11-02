import * as fs from 'fs'
import * as path from 'path'
import { ExecaReturnValue, execa } from 'execa'
import { createRequire } from "module";
import ora from 'ora';
import chalk from 'chalk';
const require = createRequire(import.meta.url);
global.baseInitialize = require(`${path.resolve(process.cwd(), `node_modules/@njs2/base/base/baseInitialize.class.js`)}`);


export default class updatePostman  {
   baseInitialize :any;

  constructor() {
    this.baseInitialize = require(`${path.resolve(process.cwd(), `node_modules/@njs2/base/base/baseInitialize.class.js`)}`);
  }

  async postmanCollectionHelper() {
    const spinner = ora(`Processing collection ... `).start();
    try {
      const packageJsonContent: ExecaReturnValue<string> = await execa(
        "cat",
        [`${path.resolve(process.cwd(), `package.json`)}`]
      );

    
      const packageJson: any = JSON.parse(packageJsonContent.stdout);
     
      const configContent: ExecaReturnValue<string> = await execa("cat", [
        `${path.resolve(process.cwd(), `src/config/config.json`)}`,
      ]);

      const base_url = JSON.parse(configContent.stdout).API_ENDPOINT;
      const apiPaths = fs
        .readdirSync(path.resolve(process.cwd(), "src/methods"), {
          withFileTypes: true,
        })
        .filter((dirent: any) => dirent.isDirectory())
        .map((dirent: any) => dirent.name);
      const apiRes: any = {
        info: {
          _postman_id: packageJson.name,
          name: packageJson.name,
          description: `${packageJson.description}`,
          schema:
            "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        },
        item: [],
      };
      //console.log("api res iterating")

      apiRes.item = await Promise.all(apiPaths.map(async (apiPath) => {
        let apiInit = require(path.resolve(process.cwd(), `src/methods/${apiPath}/init.js`));
        const apiInitObj = new apiInit();
        const paramsList = apiInitObj.getParameter();
        // console.log("paramlist")
        // console.log(paramsList)
        let fileExists = false;
        Object.keys(paramsList).map((key) => {
          if (paramsList[key].type == "file") fileExists = true;
        });

        let apiDefination: any = {
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
      // console.log("postman content")
      // console.log(apiRes)
      fs.writeFileSync("postman.json", JSON.stringify(apiRes, null, 2));
      spinner.succeed("Updated collection in postman.json file")
      return apiRes;
    } catch (e: any) {
      // console.log('error ids there')
      // console.log(e.message)
      spinner.fail("Updating collection in postman.json file failed\n" + chalk.red((e as Error).message))
    }
  }

}