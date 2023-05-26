#!/usr/bin/env node
const child_process = require("child_process");
const { promisify } = require('util');
const exec = promisify(child_process.exec);
let CLI_KEYS = {};
let CLI_ARGS = [];

for (let i = 0; i < process.argv.slice(2).length; i++) {
  if (process.argv.slice(2)[i].split("--").length > 1) {
    CLI_KEYS[process.argv.slice(2)[i].split("--")[1]] =
      process.argv.slice(2)[i + 1];
    i++;
  } else {
    CLI_ARGS.push(process.argv.slice(2)[i]);
  }
}

const CMD = CLI_ARGS[0];
CLI_ARGS = CLI_ARGS.slice(1);
const cliFilePath = `~/.nvm/versions/node/${process.version}/lib/node_modules/@juego/njs3-cli`;

switch (CMD) {
  case "project":
    // Create new project
    require("./helper/new-project").execute(CLI_KEYS, CLI_ARGS);
    break;

  case "endpoint":
    // Create new endpoint
    require("./helper/create-endpoint").execute(CLI_KEYS, CLI_ARGS);
    break;

  case "run":
    require("./helper/run").execute(CLI_KEYS, CLI_ARGS);
    break;

  case 'test':
    require('./helper/testGenerator.js').generateTest().then(async () => {
       exec(`npm i --save-dev supertest chai mocha `, { stdio: 'ignore' }).then(()=>{
        child_process.exec(`./node_modules/.bin/mocha \"./src/test/**/*.test.js\" --reporter ${cliFilePath}/helper/testReportGenerator.js`).stdout.pipe(process.stdin);
       })
    }).catch((e) => {
      console.log(e)
    })
    break;

  case "plugin":
    // Plugin related actions will be handled here
    require("./helper/plugin-commands").execute(CLI_KEYS, CLI_ARGS);
    break;

  // create library files
  case "library":
    require("./helper/create-library").execute(CLI_KEYS, CLI_ARGS);
    break;

  case "upgrade":
    require("./helper/upgrade-project").execute(CLI_KEYS, CLI_ARGS);
    break;

  // case "plugin-local":
  //   // Install Locally Developed Private plugins to project
  //   require("./helper/install-plugin-local-testing").execute(CLI_KEYS, CLI_ARGS);
  //   break;

  // case "plugin":
  //   // Install plugins to project
  //   require("./helper/install-plugin").execute(CLI_KEYS, CLI_ARGS);
  //   break;

  // case "rm-plugin":
  //   require("./helper/uninstall-plugin").execute(CLI_KEYS, CLI_ARGS);
  //   break;

  // case "compile":
  //   // Complie plugins and create build
  //   require("./helper/compile-plugin").execute(CLI_KEYS, CLI_ARGS);
  //   break;

  // case "compile-all":
  //   // Compile plugins and create build
  //   require("./helper/compile-all-plugin").execute(CLI_KEYS, CLI_ARGS);
  //   break;

  // create plugin
  // case "create-plugin":
  //   require("./helper/create-plugin").execute(CLI_KEYS, CLI_ARGS);
  //   break;

  // case "install":
  //   require("./helper/install-private-plugin").execute(CLI_KEYS, CLI_ARGS);
  //   break;

  case "help":
    console.log(`
njs3 project <project-name> [version] [version-number] 
njs3 endpoint <endpoint-name>
njs3 run serverless
njs3 run express
njs3 run nodemon
njs3 test
njs3 plugin <plugin-name>
njs3 plugin uninstall <plugin-name>
njs3 plugin compile
njs3 plugin install [<plugin-name>]
njs3 library <folder-name> <filename> <options : [sql,mongo]>
njs3 upgrade [version] [version-number]`);

    break;

  default:
    console.log(`
njs3 project <project-name> [version] [version-number] 
njs3 endpoint <endpoint-name>
njs3 run serverless
njs3 run express
njs3 run nodemon
njs3 test
njs3 plugin <plugin-name>
njs3 plugin uninstall <plugin-name>
njs3 plugin compile
njs3 plugin install [<plugin-name>]
njs3 library <folder-name> <filename> <options : [sql,mongo]>
njs3 upgrade [version] [version-number]`);
    break;
}

