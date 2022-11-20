const Event = require("../structures/Event.js");
const CommandContext = require("../structures/CommandContext.js");

class InteractionCreate extends Event {
  async run(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.commands.get(interaction.commandName);
    if (!command) return;

    const ctx = new CommandContext(command, { interaction });
    return command.execute(ctx);
  }
}

module.exports = InteractionCreate;
