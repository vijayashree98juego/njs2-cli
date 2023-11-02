import * as path from "path";
import * as fs from 'fs-extra';
import * as bytenode from 'bytenode';
import { JSONObject } from "../interface/index.js";
const filePath = process.argv.slice(2)[0];
const excludeFolders: JSONObject | string = process.argv.slice(2)[1];

const package_json = JSON.parse(
  fs.readFileSync(`${filePath}/package.json`, "utf-8")
);


const obfuscateFilesInDirectory = async (dirPath: string, excludeFolders: JSONObject | string) => {
    try {
      let files = fs.readdirSync(dirPath);
      //Checks if path specified in arguments has a sub directory        
      for (let i = 0; i < files.length; i++) {
        let pathName = path.join(dirPath, files[i]);
        let stat = fs.lstatSync(pathName);
        if (package_json['njs2-type'] == 'base' && pathName.replace(/\\/g, '/') == 'dist/compiled/template') continue;
        if (stat.isDirectory() && !excludeFolders.includes(pathName.replace(/\\/g, '/'))) {
          await obfuscateFilesInDirectory(pathName, excludeFolders);
        } else if (stat.isFile() && path.extname(pathName) == '.js') {
          const response = await bytenode.compileFile({
            filename: pathName        });
          fs.removeSync(pathName);
          console.log("Successfully encrypted : ", pathName);
        }
      }
    } catch (e) {
      console.log("\nError in encrypting files in directory", dirPath, e);
    }
  }
  const obfuscateFiles = async (filePath = "src", excludeFolders: JSONObject | string) => {
    try {
      let stat = fs.lstatSync(filePath);
      for (let index = 0; index < excludeFolders.length; index++) {
        (excludeFolders[index] as JSONObject) = excludeFolders[index].replace(/\\/g, '/');
      }
      if (stat.isFile()) {
        if (path.extname(filePath) != '.js') {
          console.log("Skipping ", filePath);
          return;
        }
        const response = await bytenode.compileFile({
          filename: filePath      });
        fs.removeSync(filePath);
        console.log("Successfully encrypted : ", filePath);
      } else if (stat.isDirectory() && !excludeFolders.includes(filePath.replace(/\\/g, '/'))) {
        await obfuscateFilesInDirectory(filePath, excludeFolders);
      }
    } catch (e) {
      console.log("\nError in encrypting file", e);
    }
  }


  console.log('filePath==>', process.cwd(), filePath);
  console.log('excludeFolders==>', excludeFolders);
  (async () => {
    try {
        if (!fs.existsSync(`${path.resolve(filePath, `package.json`)}`))
          throw new Error('njs2 compile (Run from package directory) root directory');
        let package_json = require(`${path.resolve(filePath, `package.json`)}`);
        if (!(package_json['njs2-type'] == 'endpoint' || package_json['njs2-type'] == 'helper')) {
          throw new Error('njs2 other compile (Run from plugin directory) root directory');
        }
        package_json.nodeVersion = process.versions.node;
        fs.writeFileSync(`${path.resolve(filePath, `package.json`)}`, JSON.stringify(package_json, null, 2));
        await obfuscateFiles(filePath, excludeFolders);
    } catch(e) {
        console.log(e);
        fs.emptyDirSync(filePath);
        return;
    }
  })();