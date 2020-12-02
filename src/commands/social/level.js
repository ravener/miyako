const Command = require("../../structures/Command.js");

class Level extends Command {
  constructor(...args) {
    super(...args, {
      description: "Displays your current level.",
      usage: "level [user]",
      aliases: ["rank"],
      guildOnly: true
    });
  }

  async run(msg, [user]) {
    const member = await this.verifyMember(msg, user, true);
    await member.syncSettings();

    return msg.send(this.client.utils.random(member.id === msg.author.id ? msg.language.get("LEVEL_MESSAGES") :
      this.client.responses.otherLevelMessages)
      .replace(/{{user}}/g, member.displayName)
      .replace(/{{level}}/g, member.settings.level));
  }
}

module.exports = Level;
