const Command = require("../../structures/Command.js");

class DM extends Command {
  constructor(...args) {
    super(...args, {
      description: "DMs someone",
      ownerOnly: true,
      usage: "dm <user> <msg...>",
      aliases: ["pm"]
    });
  }

  async run(msg, [user, ...message]) {
    user = await this.verifyUser(msg, user);

    try {
      await user.send(`${message.join(" ")}\n\n**The message above was sent by the bot owner. You may join our support server at https://discord.gg/mDkMbEh for replying and further discussions.**`);
      return msg.send(`Message sent to **${user.tag}** (${user.id})`);
    } catch(err) {
      if(err.status === 403) return msg.send("I cannot DM that user, they probably have DMs blocked.");
      throw err;
    }
  }
}

module.exports = DM;
