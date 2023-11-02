const commandTemplate = (commandName: string) => {
  return `
    import {Args, Flags} from '@oclif/core'
    import { BaseCommand } from "../executors/${commandName}.js";

    export default class ${commandName} extends BaseCommand<typeof ${commandName}> {
        static description = "Creating a ${commandName}";
      
        static examples = ["<%= config.bin %> <%= command.id %>"];
      
        static flags = {
            from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
          }
        
          static args = {
            person: Args.string({description: 'Person to say hello to', required: true}),
          }
      
        public async run(): Promise<void> {
          const { args, flags } = await this.parse(${commandName});
          this.execute(args.person, flags.from);//to call command helper function
        }
      }`;
};

const executeTemplate = () => {
  return `
   import { Command } from "@oclif/core";

    export abstract class BaseCommand<T extends typeof Command> extends Command {
        async execute(argName: string, flagName: string | undefined | void) {
        }
    }
      `;
};

const testCaseTemplate = (commandName: string) => {
  return `
import {expect, test} from '@oclif/test'

describe('${commandName}', () => {
  test
  .stdout()
  .command(['${commandName}'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['${commandName}', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
  `;
};

export { commandTemplate, executeTemplate, testCaseTemplate };
