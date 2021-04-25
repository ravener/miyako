const Command = require("../../structures/Command.js");

class Avatar extends Command {
  constructor(...args) {
    super(...args, {
      description: "Grab someone's avatar.",
      aliases: ["av", "pfp"],
      usage: "avatar [@user]"
    });
  }

  async run(msg, [userArg]) {
    const user = await this.verifyUser(msg, userArg, true);
    
    return msg.send(this.client.embed(user)
      .setTitle(msg.tr("COMMAND_AVATAR_TITLE", user.username))
      .setImage(user.displayAvatarURL({ size: 2048, format: "png", dynamic: true })));
  }
}

module.exports = Avatar;
