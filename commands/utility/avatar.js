const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class Avatar extends Command {
  constructor(...args) {
    super(...args, {
      description: "Grab someone's avatar.",
      aliases: ["av", "pfp"],
      usage: "avatar [@user]"
    });
  }

  async run(ctx, [userArg]) {
    const user = await this.verifyUser(ctx, userArg, true);
    
    return ctx.reply(new MessageEmbed()
      .setTitle(`${user.username}'s avatar`)
      .setAuthor(user.tag, user.displayAvatarURL({ size: 64 }))
      .setColor(0x9590EE)
      .setImage(user.displayAvatarURL({ size: 2048, format: "png", dynamic: true })));
  }
}

module.exports = Avatar;
