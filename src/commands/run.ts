

import { BaseCommand } from "@oclif-cli/executors/run.js";
import { Args, Flags, ux } from "@oclif/core";
import inquirer from "inquirer";

export default class run extends BaseCommand<typeof run> {
  static description = "Running a server on port";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(run);
    const options = ["express", "nodemon", "serverless"];
    const serverType = await inquirer.prompt({
      type: "list",
      name: "selectedOption",
      message: "Please select a server type:",
      choices: options,
    });

    this.execute(serverType.selectedOption); //to call command helper function
  }
}
