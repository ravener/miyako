const { Event } = require("klasa");
const Cleverbot = require("cleverbot.io");

class CommandUnknown extends Event {
  constructor(...args) {
    super(...args);
    this.bot = new Cleverbot(this.client.config.cleverbot.user, this.client.config.cleverbot.key);
    this.bot.setNick("Ladybug");
    this.mention = null;
  }

  async run(msg, cmd) {
    const res = await this.client.commands.get("tag").get(msg, cmd.toLowerCase()).catch(() => false);
    if(res) return;
    // CleverBot
    const match = this.mention.exec(msg.content) || this.client.options.regexPrefix.exec(msg.content);
    if(!match) return;
    const prefix = match[0];
    await msg.channel.startTyping();
    const text = msg.content.slice(prefix.length).trim();
    return this.bot.ask(text, (err, res) => {
      if(err) throw err;
      return msg.send(res);
    });
  }

  async init() {
    this.mention = new RegExp(`^<@!?${this.client.user.id}>`);
  }
}

module.exports = CommandUnknown;
