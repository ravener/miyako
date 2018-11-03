const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const slots = require("../../utils/slots.js");

class Slots extends Command {
  constructor(...args) {
    super(...args, {
      description: "Try your luck in the slot machine!",
      permissionLevel: 2,
      aliases: ["slot", "slotmachine", "slot-machine"]
    });
  }

  async run(msg) {
    const { win, view, reward } = slots();
    const { currency } = this.client.constants;
    const embed = new MessageEmbed()
      .setTitle("Ladybug Slots")
      .setColor(0xff0000)
      .setDescription(view)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    let message;
    if(win) {
      const voted = await this.client.functions.isUpvoted(msg.author.id);
      const points = voted ? reward * 2 : reward;
      message = `Congratulation! You won **${points}** ${currency}`;
      if(!voted) message += `\nYou can get double the points by upvoting me here: <${this.store.get("upvote").url}>`;
      await msg.member.givePoints(points);
    } else {
      message = "You lost, better luck next time.";
    }
    return msg.send(message, { embed });
  }
}

module.exports = Slots;
