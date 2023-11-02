
import { commandTemplate, executeTemplate, testCaseTemplate } from "@oclif-cli/cliHelper/index.js";
import { Args, Command } from "@oclif/core";
import * as fs from "fs";


class Generate extends Command {
  static description: string = "Generate new command";

  static examples: string[] = ["oclif-cli generate create"];

  static args = {
    command: Args.string({ description: "Command name", required: true }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Generate);

    fs.writeFileSync(
      `src/commands/${args.command}.ts`,
      commandTemplate(args.command)
    );
    fs.writeFileSync(`src/executors/${args.command}.ts`, executeTemplate());
    fs.writeFileSync(
      `test/commands/${args.command}.test.ts`,
      testCaseTemplate(args.command)
    );
  }
}

Generate.hidden = true;
export default Generate;
