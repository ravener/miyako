const Command = require("../../structures/Command.js");


class Support extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get the link to our support server."
    });
  }

  async run(msg, args) { // eslint-disable-line no-unused-vars
    return msg.send(this.client.embed()
      .setTitle("Join Miyako Lounge")
      .setDescription("If you need help with setting me up on your server or just want to hangout, join Miyako Lounge.\nYou also get an oppurtunity to become a Premium user which can only be obtained through a role in our server.\nYou will also recieve updates about the bot and much more!\n\n[Join Miyako Lounge](https://discord.gg/mDkMbEh)")
      .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64 })));
  }
}

module.exports = Support;
