const { Command } = require("klasa");

class Announce extends Command {
  constructor(...args) {
    super(...args, {
      description: "Announces something to a role.",
      extendedHelp: "This makes the role mentionable for a sec and pings it with your message and then change it back to unmentionable.",
      permissionLevel: 6,
      aliases: ["announcement"],
      usage: "[channel:channelname] <role:rolename> <message:...string>",
      usageDelim: " ",
      runIn: ["text"],
      quotedStringSupport: true
    });
  }
  
  async run(msg, [channel = msg.channel, role, message]) {
    if(!channel.postable) throw "I can't post in that channel.";
    if(!channel.permissionsFor(msg.member).has("SEND_MESSAGES") && !await msg.hasAtleastPermissionLevel(10)) throw "You can't post in that channel.";
    if(role.position >= msg.guild.me.roles.highest.position) throw "I can't edit that role, make sure my role order is above it.";
    await role.edit({ mentionable: true });
    await channel.send(`${role.toString()}, ${message}`);
    await role.edit({ mentionable: false });
    if(channel !== msg.channel) return msg.send(`Done, successfully posted your announcement for the role **${role.name}**`);
  }
}

module.exports = Announce;