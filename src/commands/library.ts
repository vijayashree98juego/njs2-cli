import { BaseCommand } from '@oclif-cli/executors/library.js';
import { Args, Flags } from '@oclif/core'
import inquirer from 'inquirer';

export default class library extends BaseCommand<typeof library> {
  static description: string = "Creating a library";

  static examples: string[] = ["oclif-cli library sqlLib user"];

  static args = {
    folderName: Args.string({ description: '', required: true }),
    fileName: Args.string({ description: '', required: true })
  }

  public async run(): Promise<void> {
    const { args } = await this.parse(library);
    const options: string[] = ["sql", "mongo"];
    const serverType: { selectedOption: string } = await inquirer.prompt({
      type: "list",
      name: "selectedOption",
      message: "Please select a db type:",
      choices: options,
    });
    this.execute(args.folderName, args.fileName, serverType.selectedOption);//to call command helper function
  }
}