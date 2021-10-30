enum Level {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

type Logger = Record<Level, (message: string | Error) => void>;

export class ConsoleLogger implements Logger {
  prefix?: string;

  constructor(prefix?: string) {
    this.prefix = prefix;
  }

  protected log(level: Level, message: string | Error) {
    message = message instanceof Error ? message.stack ?? message.message : message;
    for (const line of message.split('\n')) {
      if (this.prefix) {
        console.error(`${level} | ${this.prefix} | ${line}`);
      } else {
        console.error(`${level} | ${line}`);
      }
    }
  }

  trace(message: string | Error) {
    this.log(Level.TRACE, message);
  }

  debug(message: string | Error) {
    this.log(Level.DEBUG, message);
  }

  info(message: string | Error) {
    this.log(Level.INFO, message);
  }

  warn(message: string | Error) {
    this.log(Level.WARN, message);
  }

  error(message: string | Error) {
    this.log(Level.ERROR, message);
  }
}

export { Logger };
