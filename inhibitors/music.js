const { Inhibitor } = require("klasa");

class Music extends Inhibitor {
  constructor(...args) {
    super(...args, {
      spamProtection: true
    });
  }

  async run(msg, command) {
    if(!msg.guild || command.category !== "Music") return;
    if(command.name === "lyrics") return;
    if(!msg.member.voice.channel) throw "You need to be in a voice channel to run this command.";
    if(!msg.guild.me.voice.channel) throw "I need to be in a voice channel for this command.";
    if(msg.member.voice.channel !== msg.guild.me.voice.channel) throw "You must be in the same voice channel as me for this command.";
  }
}

module.exports = Music;
