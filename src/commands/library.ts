import { BaseCommand } from '@oclif-cli/executors/library.js';
import { Args, Flags } from '@oclif/core'
import inquirer from 'inquirer';

export default class library extends BaseCommand<typeof library> {
  //provide description of command
  static description = "Creating a library";

  //provide examples of command
  static examples = ["oclif-cli library sqlLib user"];

  //provide arguments of command
  static args = {
    folderName: Args.string({ description: '', required: true }),
    fileName: Args.string({ description: '', required: true })
  }

  public async run(): Promise<void> {
    const { args } = await this.parse(library);
    const options: string[] = ["sql", "mongo"];

    //drop down options for dbType
    const dbType: { selectedOption: string } = await inquirer.prompt({
      type: "list",
      name: "selectedOption",
      message: "Please select a db type:",
      choices: options,
    });
    this.execute(args.folderName, args.fileName, dbType.selectedOption);//to call command helper function
  }
}