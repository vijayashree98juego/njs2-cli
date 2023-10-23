import { BaseCommand } from '@oclif-cli/executors/library.js';
import { Args, Flags } from '@oclif/core'
import inquirer from 'inquirer';

export default class library extends BaseCommand<typeof library> {
  static description = "Creating a library";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static args = {
    folderName: Args.string({ description: '', required: true }),
    fileName: Args.string({ description: '', required: true }),
  }

  public async run(): Promise<void> {
    const { args } = await this.parse(library);
    const options = ["sql", "mongo"];
    const serverType = await inquirer.prompt({
      type: "list",
      name: "selectedOption",
      message: "Please select a db type:",
      choices: options,
    });
    this.execute(args.folderName, args.fileName, serverType.selectedOption);//to call command helper function
  }
}