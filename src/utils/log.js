const { inspect } = require("node:util");

const modes = [
  { name: "trace", color: "\x1b[34m", },
  { name: "debug", color: "\x1b[36m", },
  { name: "info",  color: "\x1b[32m", },
  { name: "warn",  color: "\x1b[33m", },
  { name: "error", color: "\x1b[31m", },
  { name: "fatal", color: "\x1b[35m", },
];

class Logger {
  constructor(level) {
    this.setLevel(level ?? "trace");

    for (let i = 0; i < modes.length; i++) {
      const mode = modes[i];
      const name = mode.name.toUpperCase();
      this[mode.name] = this.log.bind(this, i, name, mode.color);
    }
  }

  setLevel(level) {
    const index = modes.findIndex(m => m.name === level);

    if (index === -1) {
      throw new TypeError(`Invalid log level '${level}'`);
    }

    this.level = index;
    return this;
  }

  inspect(data) {
    if (Array.isArray(data)) {
      return data.map(data => this.inspect(data)).join("\n");
    } else if (typeof data === "object") {
      return inspect(data, { depth: 0, colors: true });
    }

    return String(data);
  }

  log(level, name, color, ...args) {
    if (level < this.level) return;

    const tag = name.padEnd(5, " ");
    const dt = new Date();
    const time = [dt.getHours(), dt.getMinutes(), dt.getSeconds()]
      .map(date => date.toString().padStart(2, "0"))
      .join(":");
    
    console.log(`${color}[${tag} ${time}]\x1b[0m`, this.inspect(args));
    return this;
  }
}

module.exports = Logger;
