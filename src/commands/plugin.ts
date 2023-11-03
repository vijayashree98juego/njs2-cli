
import { ux } from '@oclif/core'
import inquirer from 'inquirer';
import { BaseCommand } from '@oclif-cli/executors/plugin.js';


export default class plugin extends BaseCommand<typeof plugin> {
  //provide description of command
  static description = "Plugin Commands";

  //provide examples of command
  static examples = ["oclif-cli plugin"];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(plugin);
    const options: string[] = ["create", "install", "uninstall", "compile"];
    let pluginName: string | undefined;

    //drop down options for pluginAction
    const pluginAction: { selectedOption: string } = await inquirer.prompt({
      type: "list",
      name: "selectedOption",
      message: "Please select a plugin action:",
      choices: options,
    });

    //If selected pluginAction is install then plugin name is optional 
    if (pluginAction.selectedOption == 'install') {
      pluginName = await ux.prompt(`Enter the Plugin Name to ${pluginAction.selectedOption} or press "enter" to install all default plugins`, { required: false });
    }
    else if (pluginAction.selectedOption != "compile") { //plugin name is mandatory other than compile action
      pluginName = await ux.prompt(`Enter the Plugin Name to ${pluginAction.selectedOption}`, { required: true });
    }

    this.execute(pluginName ?? "", pluginAction.selectedOption);//to call command helper function
  }
}