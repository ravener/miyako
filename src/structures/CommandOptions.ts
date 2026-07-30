import type { OptionResolver } from '../types.js';

// Dummy options wrapper to unify the use of arguments with slash commands.
class CommandOptions implements OptionResolver {
  options: Record<string, any>;
  getUser: (name: string) => any;
  getRole: (name: string) => any;
  getMember: (name: string) => any;
  getChannel: (name: string) => any;
  getString: (name: string) => any;
  getInteger: (name: string) => any;

  constructor(options: Record<string, any>) {
    this.options = options;

    this.getUser = this.get.bind(this);
    this.getRole = this.get.bind(this);
    this.getMember = this.get.bind(this);
    this.getChannel = this.get.bind(this);
    this.getString = this.get.bind(this);
    this.getInteger = this.get.bind(this);
  }

  get(name: string) {
    return this.options[name];
  }
}

export default CommandOptions;
