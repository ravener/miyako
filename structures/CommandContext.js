
/**
 * Command execution context.
 */
class CommandContext {
  constructor(client, msg) {
    this.client = client;
    this.message = msg;

    // The following fields are initialized manually when a CommandContext is created.
    this.args = [];
    this.flags = {};
    this.parsedContent = "";
    this.command = null;
    this.invokedName = ""; // The exact alias the user used to refer to the command.
    this.prefix = "m!"; // Prefix used to invoke the command.
  }

  /**
   * Gets the raw args.
   * By default it trims extra spaces and stuff.
   * This is useful for e.g code to preserve indents and all.
   */
  get rawArgs() {
    // Slice prefix + command name and trim the start/ending spaces.
    return this.message.content.slice(this.prefix.length + this.invokedName.length).trim();
  }

  get member() {
    return this.message.member;
  }

  get channel() {
    return this.message.channel;
  }

  get author() {
    return this.message.author;
  }

  get guild() {
    return this.message.guild;
  }

  reply(...args) {
    return this.channel.send(...args);
  }

  success() {
    return this.message.react("519166152488910850")
      .catch(() => null);
  }

  failure() {
    return this.message.react("519166256214048769")
      .catch(() => null);
  }

  random(arr, replace = {}) {
    let res = this.client.utils.random(arr);

    for(const [k, v] of Object.entries(replace))
      res = res.replace(new RegExp(`{{${k}}}`, "g"), v);

    return this.reply(res);
  }
}

module.exports = CommandContext;
