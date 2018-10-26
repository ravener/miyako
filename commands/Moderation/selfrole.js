const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

const error = "You do not have permissions to use this command, you need `Manage Server`";

class Selfrole extends Command {
  constructor(...args) {
    super(...args, {
      description: "Manage selfroles for this server",
      runIn: ["text"],
      usage: "<add|list|give|remove> (role:arg) [...]",
      usageDelim: " ",
      subcommands: true,
      requiredPermissions: ["MANAGE_ROLES"],
      aliases: ["selfroles"]
    });

    this.createCustomResolver("arg", (arg, possible, msg, [action]) => {
      if(action === "list") return undefined;
      return this.client.arguments.get("rolename").run(arg, possible, msg);
    });
  }

  async add(msg, [role]) {
    if(!await msg.hasAtLeastPermissionLevel(6)) throw error;
    if(msg.guild.settings.selfroles.includes(role.id)) throw "That role is already in the selfrole list";
    if(role.position >= msg.guild.me.roles.highest.position) throw "My role position must be higher than the role you are adding so i can be able to give it.";
    await msg.guild.settings.update("selfroles", role.id, msg.guild, { action: "add" });
    return msg.send(`Added the role **${role.name}** to selfrole list!`);
  }

  async remove(msg, [role]) {
    if(!await msg.hasAtLeastPermissionLevel(6)) throw error;
    if(!msg.guild.settings.selfroles.includes(role.id)) throw "That role doesn't exist in the selfrole list";
    await msg.guild.settings.update("selfroles", role.id, msg.guild, { action: "remove" });
    return msg.send(`Removed the role **${role.name}** from selfrole list`);
  }

  async list(msg) {
    if(!msg.guild.settings.selfroles.length) throw "There isn't any selfroles in this server.";
    const roles = msg.guild.settings.selfroles
      .map((r) => {
        const role = msg.guild.roles.get(r);
        if(!role) return;
        return `• **${role.name}**`;
      })
      .filter((x) => x !== undefined)
      .join("\n");
    const embed = new MessageEmbed()
      .setTitle("Selfrole list for this server")
      .setDescription(roles)
      .setColor(0xff0000)
      .setFooter(`To get any of the roles type ${msg.guild.settings.prefix}giveme <role>`);
    return msg.send({ embed });
  }

  async give(msg, [role]) {
    if(!msg.guild.settings.selfroles.includes(role.id)) throw `That role does not exist in the selfroles list, type \`${msg.guild.settings.prefix}selfrole list\` to get a list`;
    if(msg.member.roles.has(role.id)) throw "You already have that role!";
    if(role.position > msg.guild.me.roles.highest.position) throw "I can't add that role because my role position is lower than it, please ask an admin to move my role above the self role";
    await msg.member.roles.add(role);
    return msg.send(`Success, given the role **${role.name}** to you`);
  }
}

module.exports = Selfrole;
