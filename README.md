Oclif CLI - A Command Line Interface for Njs2 Framework
================================================

The `@juego/oclif-cli` is a utility cli for Njs2 framework that helps to initialise project, endpoint, library, upgrade Njs2 base, perform plugin actions and run the project in Express, nodemon or with Serverless.

## Installation
Install the `@juego/oclif-cli` globally using below command. 
```
npm i @juego/oclif-cli --registry=http://plugins.juegogames.com/
```

## Getting started with CLI
Once the project is installed, you can directly start working with CLI using `oclif-cli
` command.
```
oclif-cli --help
```

## Creating a new Project
To create a new project, run `project` command with project name as an argument. The command will generate the project structure and install the dependencies for the project.
```
oclif-cli project PROJECTNAME 
```
This will create the new project with the latest version of ```@njs2/base``` package!

If you intend to pass a different version than latest, use the below option:
```
oclif-cli project PROJECTNAME [--version <value>]
```
e.g.:
```
oclif-cli project cricket-backend --version=2.1.0
```

Users can input the package name, version, description, and author information for the project.

## Upgrade an existing project
To upgrade the existing project to use a latest version of ```@njs2/base``` pacakge use the below command
```
oclif-cli upgrade
```
This will upgrade the current project to the latest version of ```@njs2/base``` package!

If you intend to pass a different version than latest, use the below option:
```
oclif-cli upgrade [--version <value>]
```
e.g.:
```
oclif-cli upgrade --version=2.1.0
```

## Creating an endpoint
To create an endpoint go to project directory, then run `endpoint` command with endpoint name as an argument. This command will generate the structure for the endpoint.
```
oclif-cli endpoint ENDPOINTNAME
```
e.g.:
```
oclif-cli endpoint user/detail
```

## Run the project
To run the project, use `run` command. 
```
oclif-cli run 
```

The available options to run the project are listed below:
```
Please select a server type: (Use arrow keys)
❯ express 
  nodemon 
  serverless  
```
 This will generate the postman definition and start the API and socket server and the postman definition is served at `'api_base_url'/postman` endpoint.

## Creating a library
To create a library go to project directory, then run `library` command with folderName and fileName. This command will generate new library helper file.
```
oclif-cli library FOLDERNAME FILENAME
```
e.g.:
```
oclif-cli library sqlLib user 
OR
oclif-cli library mongoLib user 
```

The available options for database type are listed below:
```
Please select a db type: (Use arrow keys)
❯ sql 
  mongo
```


## Plugin Commands
Use this command to perform plugin related actions.
```
oclif-cli plugin
```

The available actions for plugin commands are listed below:
```
Please select a plugin action: (Use arrow keys)
❯ create 
  install 
  uninstall 
  compile 
```

```create``` -> This command requires plugin name and creates the project structure for developing a new Njs2 Private Plugin.

```install``` -> This command takes plugin name if provided or install all private plugins by reading the package.json file.

```uninstall``` -> This command uninstall plugin.

```compile``` -> This command prepares compiled folders of the plugin for multiple node versions and uploads only the compiled code of the Private Plugin created in the ”dist” directory to Juego Registry.

Pre-requisites -> Node Version Manager installed locally.
               -> Need to be logged into Juego NPM Registry before uploading the Plugin.


Developers reference
====================

Requisites -> node version 18
           -> Typescript installed

## How to create a command using oclif-cli?
```
oclif-cli generate COMMAND
```
e.g.:
```
oclif-cli generate create
```

This command wil generate 3 files in 3 different folders respectively.
1. src->commands->create.ts
  Flags, arguments, description, examples of the command can be defined here and command helper function is called.
2. src->executors->create.ts
  Here, functionality of the command can be defined.
3. test->commands->create.test.ts
  Here, test report of command is generated.
  
Once command creation is completed, you can run command:
```
oclif-cli COMMAND [required or optional arguments or flags]
```
e.g.:
```
oclif-cli create PERSON -f <value>
```
