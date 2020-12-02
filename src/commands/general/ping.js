const Command = require("../../structures/Command.js");

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pong! Checks Bot latency."
    });
  }

  async run(msg, args) { // eslint-disable-line no-unused-vars
    const sent = await msg.send("Ping?");

    return sent.edit(this.client.utils.random(msg.language.get("PING_MESSAGES"))
      .replace(/{{user}}/g, msg.guild ? msg.member.displayName : msg.author.username)
      .replace(/{{ms}}/g, `${sent.createdTimestamp - msg.createdTimestamp}`));
  }
}

module.exports = Ping;
