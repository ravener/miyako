const { Command } = require("klasa");

class Take extends Command {
  constructor(...args) {
    super(...args, {
      description: "Takes away a selfrole",
      usage: "<role:rolename>",
      requiredPermissions: ["MANAGE_ROLES"],
      aliases: ["iamnot", "imnot", "takeselfrole", "i'mnot"]
    });
    this.customizeResponse("role", (msg) => `Role must be a valid rolename and in the
 selfrole list, type \`${msg.guild.settings.prefix}selfrole list\` to get a list`);
  }

  async run(msg, [role]) {
    return this.store.get("selfrole").take(msg, [role]);
  }
}

module.exports = Take;
