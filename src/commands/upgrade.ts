
import { BaseCommand } from '@oclif-cli/executors/upgrade.js';
import { Args, Flags } from '@oclif/core'

export default class upgrade extends BaseCommand<typeof upgrade> {
  static description: string = "Upgrading njs2 base version";

  static examples: string[] = ["oclif-cli upgrade --version=2.1.0"];

  static flags = {
    version: Flags.string(),
    // flag with a value (-n, --name=VALUE)
    // version: Flags.version({
    //   char: "v",
    //   description: "njs2 base version ",
    //   required: false,
    // }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(upgrade);
    this.execute(flags.version);//to call command helper function
  }
}