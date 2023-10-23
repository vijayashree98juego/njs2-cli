
    import {Args, Flags} from '@oclif/core'
    import { BaseCommand } from "../executors/viji1.js";

    export default class viji1 extends BaseCommand<typeof viji1> {
        static description = "Creating a viji1";
      
        static examples = ["<%= config.bin %> <%= command.id %>"];
      
        static flags = {
            from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
          }
        
          static args = {
            person: Args.string({description: 'Person to say hello to', required: true}),
          }
      
        public async run(): Promise<void> {
          const { args, flags } = await this.parse(viji1);
          this.execute(args.person, flags.from);//to call command helper function
        }
      }