const { Command } = require("klasa");

class GiveMe extends Command {
  constructor(...args) {
    super(...args, {
      description: "Gives a selfrole to you",
      runIn: ["text"],
      usage: "<role:rolename>",
      aliases: ["iam", "giverole", "giveselfrole", "im", "i'm"],
      requiredPermissions: ["MANAGE_ROLES"]
    });

    this.customizeResponse("role", (msg) => `Role must be a valid rolename and in the selfrole list, type \`${msg.guild.settings.prefix}selfrole list\` to get a list`);
  }

  async run(msg, [role]) {
    // Mostly a shorter alias to selfrole give
    return this.store.get("selfrole").give(msg, [role]);
  }
}

module.exports = GiveMe;
