const Command = require("../../structures/Command.js");


class Invite extends Command {
  constructor(...args) {
    super(...args, {
      description: "Invite me to your server!",
      aliases: ["inv"]
    });
  }

  async run(msg, args) { // eslint-disable-line no-unused-vars
    return msg.send(this.client.embed(this.client.user)
      .setTitle("Invite Miyako to your server")
      .setDescription("You can invite me to your server using the following link:\n\n[Invite Link](https://discordapp.com/oauth2/authorize?client_id=397796982120382464&permissions=2016537702&scope=bot)\n[Join Miyako Lounge](https://discord.gg/mDkMbEh)\n[Upvote Miyako](https://top.gg/bot/397796982120382464/vote)"));
  }
}

module.exports = Invite;
