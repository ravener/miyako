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

  async run(ctx, [user]) {
    const member = await this.verifyMember(ctx, user, true);
    await member.syncSettings();

    return ctx.reply(this.client.utils.random(member.id === ctx.author.id ? this.client.responses.levelMessages :
      this.client.responses.otherLevelMessages)
      .replace(/{{user}}/g, member.displayName)
      .replace(/{{level}}/g, member.settings.level));
  }
}

module.exports = Level;
