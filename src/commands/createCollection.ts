
import { BaseCommand } from '@oclif-cli/executors/createCollection.js';
import { Args, Flags } from '@oclif/core'

export default class createCollection extends BaseCommand<typeof createCollection> {
  static description = "Creating a createCollection";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(createCollection);
    this.execute();//to call command helper function          
  }
}