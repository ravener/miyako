const { Command } = require("klasa");

class Enable extends Command {
  constructor(...args) {
    super(...args, {
      description: "Enables a command previously disabled",
      permissionLevel: 6,
      usage: "<command:command>"
    });
  }

  async run(msg, [command]) {
    if(!command.enabled) throw "That command may not be enabled as it has been disabled globally by owner for other reasons.";
    if(!msg.guild.settings.disabledCommands.includes(command.name)) throw "That command is not disabled.";
    await msg.guild.settings.update("disabledCommands", command.name, { action: "remove" });
    return msg.send(`Successfully enabled back the command **${command.name}** for this server.`);
  }
}

module.exports = Enable;
