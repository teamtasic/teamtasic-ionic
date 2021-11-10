import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DebugService {
  constructor() {}

  public log(message: string, source: LogSource) {
    console.log(`[ ${logSourceString[source]} ]`, message);
  }

  public error(message: string, source: LogSource) {
    console.error(`[ ${logSourceString[source]} ]`, message);
  }
  public warn(message: string, source: LogSource) {
    console.warn(`[ ${logSourceString[source]} ]`, message);
  }
}

export const enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}
export const enum LogSource {
  AUTH = 0,
  DRS = 1,
  CDS = 2,
  CHAT = 3,
  UI = 4,
  API = 5,
  OTHER = 6,
}

const logSourceString = ['AUTH', 'DRS', 'CDS', 'CHAT', 'UI', 'API', 'OTHER'];
