Oclif CLI - A Command Line Interface for Njs2 Framework
================================================

The `@juego/oclif-cli` is a utility cli for Njs2 framework that helps to initialise project, endpoint, library, upgrade Njs2 base, perform plugin actions and run the project in Express, nodemon or with Serverless.

## Installation
Install the cli `@juego/oclif-cli` globally using below command. 
```
npm i -g @juego/oclif-cli --registry= http://plugins.juegogames.com/
```

## Getting started with CLI
Once the cli is installed, you can directly start working with CLI using `oclif-cli
` command.
```
oclif-cli --help
```

## Creating a new Project
To create a new project, run `project` command with project name as an argument. 
Once project template is ready , cli will prompt for installing the depencencies.If user confirms then it will install  the dependencies else it will terminate the process.
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

Users can input the  version, description, and author information for the project.

![Screenshot from 2023-10-25 16-01-46](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/431b6c0d-e010-4285-b31b-1990e2ef4d65)

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
![Screenshot from 2023-10-25 16-13-45](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/f3230549-ff1b-4794-b293-80eeef23bfc5)


## Creating an endpoint
To create an endpoint go to project directory, then run `endpoint` command with endpoint name as an argument. This command will generate the structure for the endpoint.
```
oclif-cli endpoint ENDPOINTNAME
```
e.g.:
```
oclif-cli endpoint user/detail
```
![Screenshot from 2023-10-25 15-54-16](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/2582d52c-78ed-4fef-8105-ff62f31eb47f)

## Run the project
To run the project, use `run` command. 
```
oclif-cli run 
```

The available options to run the project are listed below:

![Screenshot from 2023-10-25 16-12-25](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/92c432ef-384e-4da6-bca3-7e240427b367)

 This will generate the postman definition and start the API and socket server and the postman definition is served at `'api_base_url'/postman` endpoint.

## Creating a library
To create a library go to project directory, then run `library` command with folderName and fileName. This command will generate new library helper file.
```
oclif-cli library FOLDERNAME FILENAME
```
e.g.:
```
oclif-cli library sqlLib user 
```
Cli will prompt for db type as mentioned below 

![Screenshot from 2023-10-25 16-31-04](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/2fecdc3f-e1b4-4f2a-98db-82bfd75ebf74)

After selecting the db type, cli will create respective lib file in below mentioned path

![Screenshot from 2023-10-25 16-00-54](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/4091dc54-a262-4716-9b0a-3f4e83e68b5e)

## Plugin Commands
Use this command to perform plugin related actions.
```
oclif-cli plugin
```

The available actions for plugin commands are listed below:

![Screenshot from 2023-10-25 16-05-26](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/e78edc6b-dc97-4036-a048-1ae6df91ce49)

Description:

```create``` -> This command requires plugin name and creates the project structure for developing a new Njs2 Private Plugin.
![Screenshot from 2023-10-25 16-04-56](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/2adb7d41-55f5-40c3-8ac7-0c5019849a5f)

```install``` -> This command takes plugin name if provided or install all private plugins by reading the package.json file.
![Screenshot from 2023-10-25 16-06-15](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/ff116c1f-814c-443e-8f7d-03db6369ca8e)

```uninstall``` -> This command uninstall plugin.

```compile``` -> This command prepares compiled folders of the plugin for multiple node versions and uploads only the compiled code of the Private Plugin created in the ”dist” directory to Juego Registry.

Pre-requisites -> Node Version Manager installed locally.
               -> Need to be logged into Juego NPM Registry before uploading the Plugin.

![Screenshot from 2023-10-25 16-07-05](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/28fb216f-d8c5-48ba-a3f3-6cbc7a6181e4)

![Screenshot from 2023-10-25 16-07-20](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/98e0dbcd-a074-475f-9f5b-3731cfab5900)

![Screenshot from 2023-10-25 16-09-23](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/3526a468-6615-4e68-9e94-36a2e4f0d1df)

![Screenshot from 2023-10-25 16-11-31](https://github.com/vijayashree98juego/njs2-cli/assets/125428593/e1b853ed-ca8d-4c82-9e23-821991f948dc)           
               






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
