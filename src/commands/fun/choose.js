const Command = require("../../structures/Command.js");

class Choose extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pick a random choice!",
      extendedHelp: "Seperate choices with a comma.",
      usage: "choose <option 1, option 2, option 3 ...>",
      aliases: ["choice", "pick"]
    });
  }
  
  async run(msg, args) {
    const choices = args.join(" ").split(",");
    if(choices.length < 2) return msg.send("Not enough choices to pick from. Seperate your choices with a comma.");

    const sent = await msg.sendLocale("COMMAND_CHOOSE_THINKING", [this.client.user.username]);

    await this.client.utils.sleep(Math.floor(Math.random() * 1500) + 1000);

    const choice = this.client.utils.random(choices);

    return sent.edit(msg.language.get("COMMAND_CHOOSE", [`\`${choice.trim()}\``]));
  }
}

module.exports = Choose;
