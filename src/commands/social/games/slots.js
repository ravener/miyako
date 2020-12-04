const Command = require("../../../structures/Command.js");

const slots = require("../../../utils/slots.js");

class Slots extends Command {
  constructor(...args) {
    super(...args, {
      description: "Try your luck in the slot machine!",
      aliases: ["slot", "slotmachine", "slot-machine"],
      guildOnly: true,
      category: "Fun",
      cost: 10
    });
  }

  async run(msg) {
    // Play the slots.
    const { win, view, reward } = slots();

    const embed = this.client.embed()
      .setTitle(msg.tr("COMMAND_SLOTS_TITLE"))
      .setDescription(view)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }));

    let message;

    if(win) {
      // Grant points only if the social system is enabled.
      if(msg.guild.settings.social) {
        // Double points for upvoters.
        const voted = await this.client.dbl.hasVoted(msg.author.id);
        const points = voted ? reward * 2 : reward;

        // Make a message and remind them to vote if they haven't
        message = msg.tr("COMMAND_SLOTS_WIN", points);
        if(!voted) message += `\nYou can get double the points by upvoting me here: <${this.store.get("upvote").url}>`;

        // Pay the user.
        await msg.member.givePoints(points);
      } else {
        // If social system is disabled all we do is show a basic message.
        // Not fun without earning points but oh well.
        message = "Congratulation! You won! However the Social Economy system was disabled for this server so I could not pay you!";
      }
    } else {
      // Lost Message.
      message = "You lost, better luck next time.";
    }

    return msg.send(message, { embed });
  }
}

module.exports = Slots;
