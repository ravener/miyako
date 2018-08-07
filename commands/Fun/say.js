const { Command } = require("klasa");

class Say extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ["text"],
      aliases: ["echo", "talk", "repeat"],
      description: "Send a message to a channel through the bot.",
      usage: "[channel:channel] <message:string> [...]",
      usageDelim: " "
    });
  }

  async run(msg, [channel = msg.channel, ...message]) {
    if (channel.guild !== msg.guild) throw "You can't echo in other servers!";
    if (!channel.postable) throw "The selected channel is not postable.";
    if(!channel.permissionsFor(msg.member).has("SEND_MESSAGES")) throw "You do not have permissions to send messages in that channel.";
    if(msg.deletable) await msg.delete();
    return channel.send(message.join(" ").replace("@everyone", "@\u200beveryone").replace("@here", "@\u200bhere"));
  }
}

module.exports = Say;