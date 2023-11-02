
import { BaseCommand } from "@oclif-cli/executors/project.js";
import { Args, Flags } from "@oclif/core";

export default class project extends BaseCommand<typeof project> {
  static description: string = "Creating a project";

  static examples: string[] = ["oclif-cli project cricket-backend --version=2.1.0"];

  static flags = {
    version: Flags.string(),
    // flag with a value (-n, --name=VALUE)
    // version: Flags.version({
    //   char: "v",
    //   description: "njs2 base version ",
    //   required: true,
    // }),
  };

  static args = {
    projectName: Args.string({ description: "Project Name", required: true }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(project);
    this.execute(args.projectName, flags.version); //to call command helper function
  }
}
