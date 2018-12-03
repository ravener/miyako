const { Extendable } = require("klasa");
const { Message } = require("discord.js");

class MessageExtendable extends Extendable {
  constructor(...args) {
    super(...args, { appliesTo: [Message] });
  }

  failure() {
    const { emojis } = this.client.guilds.get(this.client.constants.mainGuild);
    return this.react(emojis.get("519166256214048769"));
  }
  
  success() {
    const { emojis } = this.client.guilds.get(this.client.constants.mainGuild);
    return this.react(emojis.get("519166152488910850")).catch(() => null);
  }
}

module.exports = MessageExtendable;
