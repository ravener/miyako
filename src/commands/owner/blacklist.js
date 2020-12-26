const Command = require("../../structures/Command.js");

class Blacklist extends Command {
  constructor(...args) {
    super(...args, {
      description: "Blacklist a user or a guild. Or unblacklist if already blacklisted",
      ownerOnly: true,
      usage: "blacklist <user|guild>",
      aliases: ["bl"]
    });
  }

  async run(msg, [userOrGuild]) {
    if(!userOrGuild) return msg.send("Baka! Specify a user or a guild to (un)blacklist.");
    
    // Guild ID.
    if(this.client.guilds.cache.has(userOrGuild)) {
      const guildBlacklist = this.client.settings.guildBlacklist || [];
      let unblacklist = false;

      if(guildBlacklist.includes(userOrGuild)) {
        guildBlacklist.splice(guildBlacklist.indexOf(userOrGuild), 1);
        unblacklist = true;
      } else {
        guildBlacklist.push(userOrGuild);
      }

      await this.client.user.update({ guildBlacklist });
      return msg.sendLocale(`COMMAND_BLACKLIST_GUILD_${unblacklist ? "UN" : ""}BLACKLIST`, [this.client.guilds.cache.get(userOrGuild)]);
    }

    const user = await this.verifyUser(msg, userOrGuild).catch(() => null);
    if(!user) return msg.send("That guild/user wasn't found.");

    const blacklist = this.client.user.settings.blacklist || [];
    let unblacklist = false;
    
    if(blacklist.includes(user.id)) {
      blacklist.splice(blacklist.indexOf(user.id), 1);
      unblacklist = true;
    } else {
      blacklist.push(user.id);
    }

    await this.client.user.update({ blacklist });
    return msg.sendLocale(`COMMAND_BLACKLIST_USER_${unblacklist ? "UN" : ""}BLACKLIST`, [user]);
  }
}

module.exports = Blacklist;
