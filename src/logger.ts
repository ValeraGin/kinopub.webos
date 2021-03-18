function log(method: 'log' | 'warn' | 'error', prefix: string, message?: any, ...optionalParams: any[]) {
  console[method](`${prefix}: `, message, ...optionalParams);
}

export class Logger {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  log = (message?: any, ...optionalParams: any[]) => {
    log('log', this.prefix, message, ...optionalParams);
  };

  warn = (message?: any, ...optionalParams: any[]) => {
    log('warn', this.prefix, message, ...optionalParams);
  };

  error = (message?: any, ...optionalParams: any[]) => {
    log('error', this.prefix, message, ...optionalParams);
  };
}

export default new Logger('app');
