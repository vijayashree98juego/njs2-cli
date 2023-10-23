
import * as fs from "fs";
import * as path from "path";
import { JSONObject } from "../interface/index.js";

export const initEnv = async (LIBRARY_NAME: string) => {
  try {
    let envFileContents: string = fs.readFileSync(
      path.resolve(`./node_modules/${LIBRARY_NAME}/env.json`),
      "utf8"
    );
    let projectEnvFileContents: string = fs.readFileSync(
      path.resolve(`./src/config/config.json`),
      "utf8"
    );
    let envFileContentsObject: JSONObject = JSON.parse(envFileContents);
    let projectEnvFileContentsObject: JSONObject = JSON.parse(projectEnvFileContents);

    if (Array.isArray(envFileContentsObject)) {
      // If public plugin then read other then organisation name key
      const configKey: string =
        LIBRARY_NAME.split("/").length == 1
          ? LIBRARY_NAME.toUpperCase()
          : LIBRARY_NAME.split("/")[1].toUpperCase();
          envFileContentsObject.forEach((envDetail: JSONObject) => {
        if (envDetail.parent == "") {
          if (projectEnvFileContentsObject[configKey]) {
            Object.keys(envDetail).map((key: string | number) => {
              if (!projectEnvFileContentsObject[configKey][key] && key != "parent")
              projectEnvFileContentsObject[configKey][key] = envDetail[key];
            });
          } else {
            delete envDetail.parent;
            projectEnvFileContentsObject[configKey] = envDetail;
          }
        } else {
          let parentName: string = envDetail.parent;

          if (projectEnvFileContents[envDetail.parent]) {
            Object.keys(envDetail).map((key: string | number) => {
              projectEnvFileContentsObject[parentName][LIBRARY_NAME] = {
                mCron: envDetail.mCron,
                cron: envDetail.cron,
              };
            });
          } else {
            delete envDetail.parent;
            projectEnvFileContentsObject[parentName] = { [LIBRARY_NAME]: envDetail };
          }
        }
      });

      fs.writeFileSync(
        path.resolve(`./src/config/config.json`),
        JSON.stringify(projectEnvFileContents, null, 2),
        "utf8"
      );
    } else {
      // If public plugin then read other then organisation name key
      const configKey: string =
        LIBRARY_NAME.split("/").length == 1
          ? LIBRARY_NAME
          : LIBRARY_NAME.split("/")[1].toUpperCase();
      if (projectEnvFileContentsObject[configKey]) {
        Object.keys(envFileContentsObject).map((key: string | number) => {
          if (!projectEnvFileContentsObject[configKey][key])
          projectEnvFileContentsObject[configKey][key] = envFileContentsObject[key];
        });
      } else {
        projectEnvFileContentsObject[configKey] = envFileContentsObject;
      }

      fs.writeFileSync(
        path.resolve(`./src/config/config.json`),
        JSON.stringify(projectEnvFileContents, null, 2),
        "utf8"
      );
    }
  } catch (e) {
    throw new Error((e as Error).message)
  }
};



