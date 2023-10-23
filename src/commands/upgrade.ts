
import { BaseCommand } from '@oclif-cli/executors/upgrade.js';
import {Args, Flags} from '@oclif/core'

export default class upgrade extends BaseCommand<typeof upgrade> {
    static description = "Upgrading njs2 base version";
  
    static examples = ["<%= config.bin %> <%= command.id %>"];
  
      static flags = {
        // flag with a value (-n, --name=VALUE)
        version: Flags.version({
          char: "v",
          description: "njs2 base version ",
          required: false,
        }),
      };
  
    public async run(): Promise<void> {
      const { flags } = await this.parse(upgrade);
      this.execute(flags.version);//to call command helper function
    }
  }