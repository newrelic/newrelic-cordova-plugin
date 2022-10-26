class Log {
  constructor() {
    this.verbose = false;
    this.nameSpace = '[NRMA]';
  }

  info(text) {
    console.log(`${this.nameSpace} ${text}`);
  }

  // only shows up in verbose mode
  debug(text) {
    if (this.verbose) {
      console.log(`${this.nameSpace}:DEBUG ${text}`);
    }
  }

  error(text) {
    //console.log(`${this.nameSpace} ${text}`);
  }

  warn(text) {
    console.log(`${this.nameSpace} ${text}`);
  }
}

export const LOG = new Log();
export default Log;
