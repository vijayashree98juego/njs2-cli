
import { commandTemplate, executeTemplate, testCaseTemplate } from "@oclif-cli/cliHelper/index.js";
import { Args, Command } from "@oclif/core";
import * as fs from "fs";


class Generate extends Command {
  //provide description of command
  static description = "Generate new command";

  //provide examples of command
  static examples = ["oclif-cli generate create"];

  //provide arguments of command
  static args = {
    command: Args.string({ description: "Command name", required: true }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Generate);

    //creating commandTemplate file
    fs.writeFileSync(
      `src/commands/${args.command}.ts`,
      commandTemplate(args.command)
    );
    //creating executeTemplate file
    fs.writeFileSync(`src/executors/${args.command}.ts`, executeTemplate());

    //creating testCaseTemplate file
    fs.writeFileSync(
      `test/commands/${args.command}.test.ts`,
      testCaseTemplate(args.command)
    );
  }
}

Generate.hidden = true;
export default Generate;
