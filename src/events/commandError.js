const Event = require("../structures/Event.js");

class CommandError extends Event {
  async run(msg, err) {
    // Allow `throw "Error message"` to rewind stack and reply from nested calls from a command.
    if (typeof err === "string") return msg.send(err);

    console.log(`[COMMAND] ${msg.command.name}: ${err.stack || err}`);

    await msg.send(`Uh! Something went wrong unexpectedly!${msg.author.id !== this.client.constants.ownerID ? " Don't worry my master will keep track of the problem and fix it soon." : ""}`);

    const channel = this.client.channels.cache.get("454776836929617921");
    if (!channel) return;

    const embed = this.client.embed(msg.author)
      .setTitle("Command Error")
      .setDescription(`An Error occured in command: ${msg.command.name}\n\`\`\`js\n${err.stack || err}\`\`\``)
      .setFooter(`User ID: ${msg.author.id}, Guild: ${msg.guild ? msg.guild.name : "DM" }`);

    return channel.send({ embed }).catch(() => null);
  }
}

module.exports = CommandError;
