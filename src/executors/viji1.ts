
   import { Command } from "@oclif/core";

    export abstract class BaseCommand<T extends typeof Command> extends Command {
        async execute(argName: string, flagName: string | undefined | void) {
        }
    }
      