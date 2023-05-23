const fs = require("fs");
const path = require("path");
const folderToCreated = "./src/test";
const fileToCreate = folderToCreated + "/njs2.test.js";
let customTestFileToCreate = folderToCreated + "/custom.test.js";
let testTemplate = [];
let testCaseData = [];
const child_process = require('child_process')

let defaultTemplate = [`
const supertest = require("supertest");
let server;
const chai = require('chai');
let superTestAgent;
const expect = chai.expect;
superTestAgent =  supertest(server);

afterEach((done) => {
    server.close(()=>{
        done();
    });
})
  
beforeEach(async()=>{
    console.log = () => { };
    server = require("./express");
    superTestAgent = await supertest(server);
})
`];

/*To find all kind of combination of array elements*/
module.exports.findCombination = (array) => {
    const results = [[]];

    for (const value of array) {
        const temp = [...results];
        for (const prefix of temp) {
            results.push(prefix.concat(value));
        }
    }
    return results;
}

//base initialization
baseInitialize = require(`${path.resolve(
    process.cwd(),
    `node_modules/@njs2/base/base/baseInitialize.class`
)}`);

const generateTest = async () => {
    testCaseData = [`/*This is the auto generated test file. It's in view only mode */\n`, ...defaultTemplate];

    //get all API paths from src/methods/
    const apiPaths = fs
        .readdirSync(path.resolve(process.cwd(), "src/methods"), {
            withFileTypes: true,
        })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    //create folder before file creation
    if (!fs.existsSync(path.resolve(process.cwd(), folderToCreated))) {
        fs.mkdirSync(path.resolve(process.cwd(), folderToCreated));
    }

    if (!fs.existsSync(path.resolve(process.cwd(), fileToCreate))) {
        fs.writeFileSync(path.resolve(process.cwd(), fileToCreate), initialCode = "", "utf-8");
    }

    /*giving write access to file*/
    fs.chmodSync(path.resolve(process.cwd(), fileToCreate), 0o666);
    fs.writeFileSync(path.resolve(process.cwd(), fileToCreate), initialCode = "", "utf-8");

    //test
    fs.writeFileSync(path.resolve(process.cwd(), customTestFileToCreate), initialCode = "", "utf-8");


    apiPaths.map((apiPath) => {
        // customTestFileToCreate = folderToCreated + `/${apiPath}.test.js`
        // fs.writeFileSync(customTestFileToCreate, initialCode = "", "utf-8");
        const apiInit = require(path.resolve(
            process.cwd(),
            `src/methods/${apiPath}/init.js`
        ));

        const apiInitObj = new apiInit();
        const paramsList = apiInitObj.getParameter();

        let fileExists = false;
        Object.keys(paramsList).map((key) => {
            if (paramsList[key].type == "file") fileExists = true;
        });

        //getting parameters from init.js
        const requiredFields = [];
        let paramsDef = []
        Object.keys(paramsList).map((params) => {
            let paramObj = {
                key: paramsList[params].name,
                value: paramsList[params].default,
                disabled: !paramsList[params].required,
                description: paramsList[params].description,
                type:
                    fileExists &&
                        apiInitObj.initializer.requestMethod[0].toUpperCase() ==
                        "POST" &&
                        paramsList[params].type == "file"
                        ? "file"
                        : paramsList[params].type,
            };
            if (paramsList[params].required) {
                requiredFields.push(paramObj)
            }
            paramsDef.push(paramObj);
        });

        let method =
            typeof apiInitObj.initializer.requestMethod == "string"
                ? apiInitObj.initializer.requestMethod.toUpperCase()
                : apiInitObj.initializer.requestMethod[0].toUpperCase();
        const paramCombo = this.findCombination(paramsDef);

        if (method == 'POST') {
            testCaseData.push(
                `\ndescribe('${apiPath}', () => {`
            );
            paramCombo.map((param) => {
                let requestFields = param.reduce(
                    (obj, item) =>
                        Object.assign(obj, { [item.key]: item.type == "number" ? Math.floor(Math.random() * 10) + 10 : Math.random().toString(36).substring(2, 7) }), {});
                if (!Object.keys(requestFields).length) {
                    testCaseData.push(
                        `    it('No input fields ', async () => {\n` +
                        `         let { body, statusCode } = await superTestAgent.post('/${apiPath}');\n` +
                        `         expect(statusCode).to.be.equal(200);`
                    );
                    if (requiredFields.length) {
                        testCaseData.push(
                            `        expect(body.responseCode).to.be.equal(100007);`
                        )
                    }

                    testCaseData.push(
                        `    })\n`
                    );
                } else {
                    testCaseData.push(
                        `    it('Validating input Fields ${Object.keys(requestFields).toString().replaceAll(',', ' and ')}', async () => {\n` +
                        `        let { body, statusCode } = await superTestAgent.post('/${apiPath}').send(${JSON.stringify(requestFields)});\n` +
                        `        expect(statusCode).to.be.equal(200);`
                    )

                    if (!param.includes(...requiredFields)) {
                        testCaseData.push(
                            `        expect(body.responseCode).to.be.equal(100007);`
                        )
                    }

                    testCaseData.push(
                        `    })\n`
                    );
                }
            })

            testCaseData.push(`})`);

        } else if (method == 'GET') {
            testCaseData.push(
                `describe('${apiPath}', () => {`);

            paramCombo.map((param) => {
                let requestFields = param.reduce(
                    (obj, item) =>
                        Object.assign(obj, { [item.key]: item.type == "number" ? Math.floor(Math.random() * 10) + 10 : Math.random().toString(36).substring(2, 7) }), {});
                if (!Object.keys(requestFields).length) {
                    testCaseData.push(
                        `    it('No input fields ', async () => {\n` +
                        `        let { body, statusCode } = await superTestAgent.get('/${apiPath}');\n` +
                        `        expect(statusCode).to.be.equal(200);`
                    )

                    if (requiredFields.length) {
                        testCaseData.push(
                            `        expect(body.responseCode).to.be.equal(100007);`
                        )
                    }

                    testCaseData.push(
                        `    })\n`
                    );
                } else {
                    testCaseData.push(
                        `    it('Validating input Fields ${Object.keys(requestFields).toString().replaceAll(',', ' and ')}', async () => {\n` +
                        `        let { body, statusCode } = await superTestAgent.get('/${apiPath}').query(${JSON.stringify(requestFields)});\n` +
                        `        expect(statusCode).to.be.equal(200);`
                    );

                    if (!param.includes(...requiredFields)) {
                        testCaseData.push(
                            `        expect(body.responseCode).to.be.equal(100007);`
                        )
                    }
                    testCaseData.push(
                        `    })\n`
                    );
                }
            })
            testCaseData.push(`})`);
        }
        // testTemplate = [`/*Custom test file*/`, ...defaultTemplate];
        // testTemplate.push(
        //     `describe('${apiPath}', () => {` +
        //     `it('Sample test case', async () => {` +
        //     `/* write test here */` +
        //     `})\n` +
        //     `})`
        // );
        // testTemplate.map((test, index) => {
        //     if (test) {
        //         index != 0 ? test = "\n" + test : null;
        //         fs.appendFileSync(customTestFileToCreate, test, "utf-8");
        //     }
        // });
        // testTemplate = [];
    })

    testTemplate = [`/*Custom test file*/`, ...defaultTemplate];
    testTemplate.push(
        `describe('Custom Test Cases', () => {\n` +
        `    it('Sample test case', async () => {\n` +
        `        /* write test here */\n` +
        `    })\n` +
        `})`
    );
    testTemplate.map((test, index) => {
        if (test) {
            index != 0 ? test = "\n" + test : null;
            fs.appendFileSync(path.resolve(process.cwd(), customTestFileToCreate), test, "utf-8");
        }
    });


    // for each API test results, write the code to the file
    testCaseData.map((test, index) => {
        if (test) {
            index != 0 ? test = "\n" + test : null;
            fs.appendFileSync(fileToCreate, test.replace('\t', ''), "utf-8");
        }
    });

    /*removing write access from file*/
    fs.chmodSync(fileToCreate, 0o500);
};




module.exports.generateTest = generateTest;

