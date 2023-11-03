

import { BaseCommand } from "@oclif-cli/executors/run.js";
import { Args, Flags, ux } from "@oclif/core";
import inquirer from "inquirer";

export default class run extends BaseCommand<typeof run> {
  //provide description of command
  static description = "Running a server on port";

  //provide examples of command
  static examples = ["oclif-cli run"];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(run);
    const options: string[] = ["express", "nodemon", "serverless"];

    //drop down option for serverType
    const serverType: { selectedOption: string } = await inquirer.prompt({
      type: "list",
      name: "selectedOption",
      message: "Please select a server type:",
      choices: options,
    });

    this.execute(serverType.selectedOption); //to call command helper function
  }
}
