
import { Command } from "@oclif/core";
import { handler as compileAllPluginHandler } from '@oclif-cli/cliHelper/compile-all-plugin.js'
import { handler as installPluginHandler } from '@oclif-cli/cliHelper/install-plugin.js'
import { handler as uninstallPluginHandler } from '@oclif-cli/cliHelper/uninstall-plugin.js'
import { handler as createPluginHandler } from '@oclif-cli/cliHelper/create-plugin.js'
import chalk from "chalk";

export abstract class BaseCommand<T extends typeof Command> extends Command {
  async execute(pluginName: string, pluginAction: string): Promise<void> {
    try {
      switch (pluginAction) {
        case "compile":
          compileAllPluginHandler();
          break;
        case "install":
          installPluginHandler(pluginName);
          break;
        case "uninstall":
          uninstallPluginHandler(pluginName);
          break;
        case "create":
          createPluginHandler(pluginName);
          break;
      }
    } catch (e) {
      console.log(chalk.red((e as Error).message));

    }

  }
}
