import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  logLevel: LogLevel = LogLevel.DEBUG;

  debug(message?: any, ...optionalParams: any[]) {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.log(message);
    }
  }
  info(message?: any, ...optionalParams: any[]) {
    if (this.logLevel <= LogLevel.INFO) {
      console.info(message, optionalParams);
    }
  }
  warn(message?: any, ...optionalParams: any[]) {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(message, optionalParams);
    }
  }
  error(message?: any, ...optionalParams: any[]) {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(message, optionalParams);
    }
  }
  fatal(message: string, ...optionalParams: any[]) {
    if (this.logLevel <= LogLevel.FATAL) {
      console.error('[ 🛑 FATAL ]', message);
    }
  }

  constructor() {}

  log(message: string) {
    console.log(message);
  }
}

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
  OFF = 5,
}
