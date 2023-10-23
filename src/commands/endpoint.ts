import { BaseCommand } from '@oclif-cli/executors/endpoint.js';
import {Args, Flags} from '@oclif/core'

export default class endpoint extends BaseCommand<typeof endpoint> {
    static description = "Creating a endpoint";
  
    static examples = ["<%= config.bin %> <%= command.id %>"];
  
      static args = {
        endpointName: Args.string({description: 'Enter endpoint', required: true}),
      }
  
    public async run(): Promise<void> {
      const { args, flags } = await this.parse(endpoint);
      this.execute(args.endpointName);//to call command helper function
    }
  }