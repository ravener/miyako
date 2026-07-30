import { inspect } from 'node:util';

type LogMethod = (...args: unknown[]) => void;

interface LogMode {
  name: string;
  color: string;
}

const modes: LogMode[] = [
  { name: 'trace', color: '\x1b[34m' },
  { name: 'debug', color: '\x1b[36m' },
  { name: 'info',  color: '\x1b[32m' },
  { name: 'warn',  color: '\x1b[33m' },
  { name: 'error', color: '\x1b[31m' },
  { name: 'fatal', color: '\x1b[35m' }
];

class Logger {
  level!: number;
  trace!: LogMethod;
  debug!: LogMethod;
  info!: LogMethod;
  warn!: LogMethod;
  error!: LogMethod;
  fatal!: LogMethod;

  constructor(level?: string) {
    this.setLevel(level ?? 'trace');

    for (let i = 0; i < modes.length; i++) {
      const mode = modes[i];
      const name = mode.name.toUpperCase();
      (this as unknown as Record<string, LogMethod>)[mode.name] = this.log.bind(this, i, name, mode.color);
    }
  }

  setLevel(level: string) {
    const index = modes.findIndex(m => m.name === level);

    if (index === -1) {
      throw new TypeError(`Invalid log level '${level}'`);
    }

    this.level = index;
    return this;
  }

  inspect(data: unknown): string {
    if (Array.isArray(data)) {
      return data.map(data => this.inspect(data)).join('\n');
    } else if (typeof data === 'object') {
      return inspect(data, { depth: 0, colors: true });
    }

    return String(data);
  }

  log(level: number, name: string, color: string, ...args: unknown[]) {
    if (level < this.level) return;

    const tag = name.padEnd(5, ' ');
    const dt = new Date();
    const time = [dt.getHours(), dt.getMinutes(), dt.getSeconds()]
      .map(date => date.toString().padStart(2, '0'))
      .join(':');

    console.log(`${color}[${tag} ${time}]\x1b[0m`, this.inspect(args));
    return this;
  }
}

export default Logger;
