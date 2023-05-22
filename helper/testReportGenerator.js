const Mocha = require('mocha');
const colors = require('colors');
const path = require('path');

class CustomReporter extends Mocha.reporters.Base {
    constructor(runner) {
        super(runner);
        // Track the test results

        process.stdout.write(colors.blue(`Test Report\n\n`));
        try {
            let failedEndPoints = [];
            let failedCount = 0;
            let parentName = '';
            let currentFile;
            let testFileCount= 0;

            // Listen for test events
            runner.on('pass', ({ parent, title, file }) => {
                if (currentFile != path.basename(file)) {
                    process.stdout.write(colors.yellow(`\n /-----/  On executing ${path.basename(file)} /-----/ \n`));
                }

                if (parentName != parent.title) {
                    process.stdout.write(colors.white(`\n\tOn Method : ${parent.title} \n\n`));
                }
                if (currentFile == '' || currentFile != path.basename(file)){
                    currentFile = path.basename(file);
                    testFileCount++;
                }

                if (parentName == '' || parentName != parent.title)
                    parentName = parent.title;
                process.stdout.write(colors.green(`\t\t✓ ${title} \n`));
            });


            runner.on('fail', ({ parent, title, file }) => {
                if (currentFile != path.basename(file)) {
                    process.stdout.write(colors.yellow(`\n /-----/ On executing ${path.basename(file)} /-----/ \n`));              
                }
                if (currentFile == '' || currentFile != path.basename(file)){
                    currentFile = path.basename(file);
                    testFileCount++;
                }
                if (!failedEndPoints.includes(parent.title)) failedEndPoints.push(parent.title);
                if (parentName != parent.title) {
                    process.stdout.write(colors.white(`\n\tOn Method : ${parent.title} \n\n`));
                }
                if (parentName == '' || parentName != parent.title)
                    parentName = parent.title;
                process.stdout.write(colors.red(`\t\t✕ ${title} \n`));
                failedCount++;
            });

            runner.on('end', () => {
                process.stdout.write(colors.red(`\nFailed Methods:\n\n`));
                if (failedEndPoints.length) {
                    failedEndPoints.map((endPoint,index) => {
                        process.stdout.write(colors.red(`\t${index+1}. ${endPoint}\n`));
                    })
                } else {
                    process.stdout.write(colors.white(`\n\tNone\n`));

                }
                process.stdout.write(colors.blue(`\nReport Summary:\n`));
                process.stdout.write(colors.white(`\n\tTotal Methods: ${testFileCount}\n`));
                process.stdout.write(colors.white(`\n\tTotal Suits: ${this.stats.suites}\n`));
                process.stdout.write(colors.white(`\n\tTotal Tests: ${this.stats.tests}\n`));
                process.stdout.write(colors.white(`\n\tTotal Duration: ${this.stats.duration}ms\n`));
                process.stdout.write(colors.white(`\n\tTotal Passed test case count: ${this.stats.passes}\n`));
                process.stdout.write(colors.white(`\n\tTotal Failed test case count: ${this.stats.failures}\n`));
                process.stdout.write(colors.white(`\n\tTotal Failed method count : ${failedEndPoints.length}\n`));
                process.stdout.write(colors.white(`\n\tOverall status: `) + '' + (`${failedCount > 0 ? colors.red('Failed') : colors.green('Passed')}\n`));
            });
        } catch (e) {
            console.log("exception here ")
            console.log(e)
        }
    }
}

module.exports = CustomReporter;



