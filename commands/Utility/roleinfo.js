const { Command, Timestamp } = require("klasa");
const { capitalize } = require("../../utils/utils.js");
const { MessageEmbed } = require("discord.js");

class RoleInfo extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ["text"],
      description: "Get information on a role with an id or a mention.",
      usage: "<role:rolename>"
    });
    
    this.perms = {
      MANAGE_GUILD: "Manage Server",
      VIEW_CHANNEL: "Read Text Channels and See Voice Channels",
      USE_VAD: "Use Voice Activity"
    };
    this.timestamp = new Timestamp("MMMM dd YYYY");
  }
  
  run(msg, [role]) {
    const allPermissions = Object.entries(role.permissions.serialize()).filter(perm => perm[1]).map(([perm]) => this.perms[perm] ? this.perms[perm] : capitalize(perm)).join(", ");
    
    const embed = new MessageEmbed()
      .setColor(role.hexColor || 0xff0000)
      .addField("❯ Name", role.name, true)
      .addField("❯ ID", role.id, true)
      .addField("❯ Color", role.hexColor || "None", true)
      .addField("❯ Creation Date", this.timestamp.display(role.createdAt), true)
      .addField("❯ Hoisted", role.hoist ? "Yes" : "No", true)
      .addField("❯ Mentionable", role.mentionable ? "Yes" : "No", true)
      .addField("❯ Permissions", allPermissions);
    return msg.send({ embed });
  }
}

module.exports = RoleInfo;
