const Command = require("../../structures/Command.js");

class Deploy extends Command {
  constructor(...args) {
    super(...args, {
      description: "Deploys slash commands.",
      ownerOnly: true,
      modes: ["text"] 
    });
  }

  async run(ctx) {
    try {
      const body = [];

      for (const command of this.client.commands.values()) {
        if (command.modes.includes("slash") && command.enabled && !command.ownerOnly) {
          body.push(command.getSlashCommandData().toJSON());
        }
      }

      await this.client.application.commands.set(body);
      return ctx.reply(`Successfully registered ${body.length} application commands.`);
    } catch (err) {
      return ctx.reply(`There was an error registering commands: \`${err.message}\``);
    }
  }
}

module.exports = Deploy;
