const child_process = require("child_process");
const path = require('path');
const fs = require('fs');
const { generateTest } = require('./testGenerator');

/**
 * @param {*} CLI_KEYS 
 * @param {*} CLI_ARGS 
 * Example:
 * njs2 run serverless
 * njs2 run express
 * njs2 run nodemon
 * njs2 run -- will fallback to express
 */
const execute = async (CLI_KEYS, CLI_ARGS) => {
  // Validation to run from project folder
  if (!fs.existsSync(`${path.resolve(process.cwd(), `package.json`)}`))
    throw new Error('Run from project root direcory: njs2 run'.red);

  const packageJson = require(`${path.resolve(process.cwd(), `package.json`)}`);
  // console.log(packageJson)
  if (packageJson['njs2-type'] != 'project') {
    throw new Error('Run from project root direcory: njs2 run'.red);
  }

  // Creates postman.json that can be imported in postman
  require('./update-postman').updatePostman();

  // Runs the lint proccess for syntax validations
  child_process.execSync('npm run lint', { stdio: 'inherit' });
  const cliFilePath = `~/.nvm/versions/node/${process.version}/lib/node_modules/@juego/njs3-cli`;

  //  const testReporterInstance = new testReportFilePath();
  switch (CLI_ARGS[0]) {
    case 'serverless':
      child_process.execSync('sls offline start --noPrependStageInUrl', { stdio: 'inherit' });
      break;

    case 'nodemon':
      child_process.exec('./node_modules/.bin/nodemon express.js').stdout.pipe(process.stdin);
      child_process.exec('./node_modules/.bin/nodemon socketio.js').stdout.pipe(process.stdin);
      break;

    case 'test':
      await generateTest();
      child_process.execSync(`npm i --save-dev supertest chai mocha `, { stdio:'ignore' });
      child_process.exec(`mocha \"./src/test/**/*.test.js\" --reporter ${cliFilePath}/helper/testReportGenerator.js`).stdout.pipe(process.stdin);
      break;

    case 'express':
    default:
      child_process.exec('node express.js').stdout.pipe(process.stdin);
      child_process.exec('node socketio.js').stdout.pipe(process.stdin);
      break;
  }
}

module.exports.execute = execute;