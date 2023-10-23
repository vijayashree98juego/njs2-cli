oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @juego/oclif-cli
$ oclif-cli COMMAND
running command...
$ oclif-cli (--version)
@juego/oclif-cli/0.0.23 linux-x64 node-v18.18.0
$ oclif-cli --help [COMMAND]
USAGE
  $ oclif-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-cli help [COMMANDS]`](#oclif-cli-help-commands)
* [`oclif-cli plugins`](#oclif-cli-plugins)
* [`oclif-cli plugins:install PLUGIN...`](#oclif-cli-pluginsinstall-plugin)
* [`oclif-cli plugins:inspect PLUGIN...`](#oclif-cli-pluginsinspect-plugin)
* [`oclif-cli plugins:install PLUGIN...`](#oclif-cli-pluginsinstall-plugin-1)
* [`oclif-cli plugins:link PLUGIN`](#oclif-cli-pluginslink-plugin)
* [`oclif-cli plugins:uninstall PLUGIN...`](#oclif-cli-pluginsuninstall-plugin)
* [`oclif-cli plugins:uninstall PLUGIN...`](#oclif-cli-pluginsuninstall-plugin-1)
* [`oclif-cli plugins:uninstall PLUGIN...`](#oclif-cli-pluginsuninstall-plugin-2)
* [`oclif-cli plugins update`](#oclif-cli-plugins-update)

## `oclif-cli help [COMMANDS]`

Display help for oclif-cli.

```
USAGE
  $ oclif-cli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for oclif-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `oclif-cli plugins`

List installed plugins.

```
USAGE
  $ oclif-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ oclif-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.9.3/src/commands/plugins/index.ts)_

## `oclif-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ oclif-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ oclif-cli plugins add

EXAMPLES
  $ oclif-cli plugins:install myplugin 

  $ oclif-cli plugins:install https://github.com/someuser/someplugin

  $ oclif-cli plugins:install someuser/someplugin
```

## `oclif-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ oclif-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ oclif-cli plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.9.3/src/commands/plugins/inspect.ts)_

## `oclif-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ oclif-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ oclif-cli plugins add

EXAMPLES
  $ oclif-cli plugins:install myplugin 

  $ oclif-cli plugins:install https://github.com/someuser/someplugin

  $ oclif-cli plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.9.3/src/commands/plugins/install.ts)_

## `oclif-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ oclif-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help      Show CLI help.
  -v, --verbose
  --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ oclif-cli plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.9.3/src/commands/plugins/link.ts)_

## `oclif-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ oclif-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ oclif-cli plugins unlink
  $ oclif-cli plugins remove
```

## `oclif-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ oclif-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ oclif-cli plugins unlink
  $ oclif-cli plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.9.3/src/commands/plugins/uninstall.ts)_

## `oclif-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ oclif-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ oclif-cli plugins unlink
  $ oclif-cli plugins remove
```

## `oclif-cli plugins update`

Update installed plugins.

```
USAGE
  $ oclif-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.9.3/src/commands/plugins/update.ts)_
<!-- commandsstop -->
