import { Command, Help, Config } from '@oclif/core'
import { Topic } from '@oclif/core/lib/interfaces/topic.js'
import chalk from 'chalk'
import Table from 'cli-table'

export default class HelpClass extends Help {
  constructor(options: Config) {
    super(options)
  }

  protected command(command: Command.Loadable): string {
    return this.formatCommand(command)
  }

  // display help for a command
  async showCommandHelp(command: Command.Loadable): Promise<void> {
    this.log(this.formatCommand(command))
  }

  // displayed for the root help
  formatRoot(): string {
    let rootContent = `\n oclif njs2 CLI (ESM)

${chalk.bold.white('VERSION')}
  ${this.config.userAgent}
    
${chalk.bold.white('USAGE')}
  $ ${this.config.bin} [COMMAND]`
    return rootContent
  }

  // // the formatting for an individual topic
  formatTopic(topic: Topic): string {
    return `${topic.name}   ${topic.description}`
  }

  // // the formatting for a list of topics
  formatTopics(topics: Topic[]): string {
    let topicData = `${chalk.bold.white('TOPICS')}\n`
    const packageJson = this.config.pjson
    if (packageJson && packageJson.oclif && packageJson.oclif.topics) {
      const topicsFromPackageJson = packageJson.oclif.topics
      let table1 = new Table({
        head: ['NAME', 'DESCRIPTION'],
        colWidths: [20, 30],
        style: { head: ['green'] },
      })
      Object.values(topicsFromPackageJson).map((topic: any) => {
        table1.push([topic.name, topic.description])
      })
      topicData += table1.toString()
    } else {
      topicData = 'No topics mentioned in package.json.\n'
    }
    return topicData
  }

  // // the formatting for a list of commands
  formatCommands(commands: Command.Loadable[]): string {
    let commandList = `${chalk.bold.white('COMMANDS')}\n\n`
    const userCommands = commands.filter((command) => command.id != 'plugins' && command.id != 'help')
    // Create a table using ux.table
    let table1 = new Table({
      head: ['NAME', 'DESCRIPTION'],
      colWidths: [20, 30],
      style: { head: ['green'] },
    })

    userCommands.map((command: any) => {
      table1.push([command.id, command.description ?? '-'])
    })
    commandList += table1.toString()

    return commandList
  }

  // // the formatting for an individual command
  formatCommand(command: Command.Loadable): string {
    const argsName: Array<string> = []
    const flags: Array<any> = []
    Object.values(command.args).map((arg) => {
      argsName.push(arg.name.toUpperCase())
    })

    Object.values(command.flags).map((flag) => {
      flags.push(`[-${flag.name.toUpperCase()}]`)
    })

    let resData = ``
    resData += `${chalk.bold.white('USAGE')}\n`
    resData += ` $ ${this.config.bin} ${command.id} ${argsName.join(' ')} ${flags.join(' ')} \n\n`

    resData += `${chalk.bold.white('ARGUMENTS')}\n`
    let argData: any = []
    let table1 = new Table({
      head: ['NAME', 'DESCRIPTION', 'MANDATORY'],
      colWidths: [20, 20, 20],
      style: { head: ['green'] },
    })
    if (Object.values(command.args).length) {
      Object.values(command.args).map((arg: any) => {
        argData.push({ name: arg.name, isRequired: arg.required, type: 1 })
        table1.push([arg.name, arg.description && arg.description != '' ? arg.description : '-', arg.required ?? false])
      })
      resData += table1.toString()
    } else {
      resData += ` No argument found `
    }

    let table2 = new Table({
      head: ['NAME', 'FLAG', 'DESCRIPTION', 'MANDATORY'],
      colWidths: [20, 20, 20, 20],
      style: { head: ['green'] },
    })
    resData += `\n\n${chalk.bold.white('FLAGS')}\n`
    if (Object.values(command.flags).length) {
      Object.values(command.flags).map((flag: any) => {
        argData.push({ name: flag.name, isRequired: flag.required ?? false, type: 2 })
        table2.push([
          flag.name,
          flag.char ?? '-',
          (flag.description && flag.description! + '') ?? '-',
          flag.required ?? false,
        ])
      })
      resData += table2.toString()
    } else {
      resData += ` No flags found `
    }
    resData += `\n\n${chalk.bold.white('DESCRIPTION')}\n`
    resData += ` ${command.description}\n`
    resData += `\n${chalk.bold.white('EXAMPLES')}\n`
    let isIterationDone = false;

    do {
      if (argData.length) {

        resData += ` $ ${this.config.bin} ${command.id} `
        let isOptionalIndex = -1
        argData.map((arg: { name: any; type: number; isRequired: boolean }, index: any) => {
          isOptionalIndex = isOptionalIndex < 0 && !arg.isRequired ? index + 1 : isOptionalIndex
          if (arg.type == 1) {
            resData += ` ${arg.name} `
          } else {
            resData += ` --${arg.name}=FlagName${index + 1} `
          }
          if (isOptionalIndex >= 0) {
            argData = argData.splice(isOptionalIndex)
          } else {
            isIterationDone = true
          }
        })

        resData += `\n`
      } else {
        isIterationDone = true
      }
    } while (!isIterationDone)
    resData +=
      ` ` +
      command.examples
        ?.join(`\n `)
        .replace('<%= config.bin %>', `$ ` + this.config.bin)
        .replace('<%= command.id %>', command.id)
    return resData
  }
}
