const { Event, util: { codeBlock } } = require("klasa");
const { MessageEmbed } = require("discord.js");

class CommandError extends Event {

  run(message, command, params, error) {
    if(error instanceof Error) this.client.console.wtf(`[COMMAND] ${command.path}\n${error.stack || error}`);
    if(typeof error === "string") {
      message.sendMessage(error).catch(err => this.client.emit("wtf", err));
    } else {
      message.send("Something went wrong, please try again later.").catch((err) => this.client.emit("wtf", err));
      const channel = this.client.channels.get("454776836929617921");
      if(!channel) return;
      const embed = new MessageEmbed()
        .setTitle("CommandError")
        .setColor(0xff0000)
        .setDescription(`An Error occured in command: ${command.name}\n${codeBlock("js", error.stack || error)}`)
        .setFooter(`User: ${message.author.tag}, Guild: ${message.guild ? message.guild.name : "DM" }`);
      channel.send({ embed });
    }
  }
}

module.exports = CommandError;