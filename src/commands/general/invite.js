const Command = require("../../structures/Command.js");


class Invite extends Command {
  constructor(...args) {
    super(...args, {
      description: "Invite me to your server!",
      aliases: ["inv"]
    });
  }

  async run(msg, args) { // eslint-disable-line no-unused-vars
    return msg.send(this.client.embed()
      .setTitle("Invite Miyako to your server")
      .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64 }))
      .setDescription("You can invite me to your server using the following link:\n\n[Invite Link](https://discordapp.com/oauth2/authorize?client_id=397796982120382464&permissions=2016537702&scope=bot)\n[Join Miyako Lounge](https://discord.gg/mDkMbEh)"));
  }
}

module.exports = Invite;
