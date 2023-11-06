

export type AsyncFunction<T> = (...args: any[]) => Promise<T>

export type Function<T> = (...args: any[]) => T;

export type ArrayProps<T> = T[];

export type PackageJonProps = { [key: string]: string }

export type ObjectProps<T> = { [key: string]: T }

export type directProps = {
  isDirectory(): boolean,
  name: string
}

export type apiResProps = {
  info: { [key: string]: string },
  item: { [key: string]: any }[]
}

export type apiDefinationProps = {
  name: string,
  request: { [key: string]: string }[] | any,
  response: { [key: string]: string }[]
}

export type statProps = {
  isDirectory(): boolean,
  isFile(): boolean
}

export type userProps<S, N, B> = { [key: string]: S | N | B }

export type paramsProps = {
  RoleArn: string,
  RoleSessionName: string,
}

export  interface cliTopicProps {
  name?:string;
  description?:string;
}
declare global {
  var baseInitialize: any;
}