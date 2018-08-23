const { Event, util: { codeBlock } } = require("klasa");
const { MessageEmbed } = require("discord.js");

class WTF extends Event {

  run(failure) {
    this.client.console.wtf(failure);
    const channel = this.client.channels.get(this.client.constants.logsChannel);
    if(!channel) return;
    const embed = new MessageEmbed()
      .setTitle("What a terrible failure")
      .setColor(0xff0000)
      .setDescription(`A failure occured:\n${codeBlock("js", failure ? failure.stack ? failure.stack : failure : "Unknown Failure")}`);
    channel.send({ embed });
  }
}

module.exports = WTF;
