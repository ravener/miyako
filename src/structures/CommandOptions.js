
// Dummy options wrapper to unify the use of arguments with slash commands.
class CommandOptions {
  constructor(options) {
    this.options = options;

    this.getUser = this.get.bind(this);
    this.getRole = this.get.bind(this);
    this.getMember = this.get.bind(this);
    this.getChannel = this.get.bind(this);
    this.getString = this.get.bind(this);
    this.getInteger = this.get.bind(this);
  }

  get(name) {
    return this.options[name];
  }
}

module.exports = CommandOptions;
