const { Command } = require("klasa");

class Disable extends Command {
  constructor(...args) {
    super(...args, {
      description: "Disables a command for this server",
      usage: "<command:command>",
      permissionLevel: 6
    });
  }

  async run(msg, [command]) {
    if(command.guarded) throw msg.language.get("COMMAND_CONF_GUARDED", command.name);
    if(msg.guild.settings.disabledCommands.includes(command.name) || !command.enabled) throw "That command is already disabled";
    await msg.guild.settings.update("disabledCommands", command.name, { action: "add" });
    return msg.send(`Successfully disabled command **${command.name}** for this server.`);
  }
}

module.exports = Disable;
