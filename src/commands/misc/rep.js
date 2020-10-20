const Command = require("../../structures/Command.js");

class Reputation extends Command {
  constructor(...args) {
    super(...args, {
      description: "Give a reputation point to someone.",
      usage: "rep <@user>",
      guildOnly: true,
      aliases: ["reputation"]
    });
  }

  async run(msg, [user]) {
    user = await this.verifyUser(msg, user);
    if(user.bot) return msg.send("Baka! Bots cannot earn reputation points.");
    if(user.id === msg.author.id) return msg.send("Baka! You cannot give a reputation point to yourself.");
    if(msg.author.settings.repcooldown && (Date.now() < msg.author.settings.repcooldown))
      return msg.send(`Baka! You can give another reputation point in **${this.client.utils.getDuration(msg.author.settings.repcooldown - Date.now())}**`);
    await user.syncSettings();
    const reputation = user.settings.reputation + 1;
    await user.update({ reputation });
    await msg.author.update({ repcooldown: new Date(msg.createdTimestamp + 43200000) });
    return msg.send(`Successfully gave a reputation point to ${user}`);
  }
}

module.exports = Reputation;
