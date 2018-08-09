const { Command, RichDisplay } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Discrim extends Command {
  constructor(...args) {
    super(...args, {
      description: "Finds people with a discrim.",
      usage: "(discrim:discrim)",
      aliases: ["discriminator"]
    });
    
    this.createCustomResolver("discrim", (arg, possible, msg) => {
      if(!arg) return undefined;
      possible.max = 9999; 
      return String(this.client.arguments.get("integer").run(arg, possible, msg));
    });
  }
  
  async run(msg, [discrim = msg.author.discriminator]) {
    const ppl = this.client.users.filter((x) => x.discriminator === discrim).array();
    if(!ppl.length) throw "No one found wih that discrim";
    const display = new RichDisplay(
      new MessageEmbed()
        .setTitle(`Results for #${discrim}`)
        .setColor(0xff0000)
    );
    
    for (let x = 0, t = ppl.length; x < t; x += 5) {
      const curr = ppl.slice(x, x + 5);
      display.addPage((em) => em.setDescription(curr.map((x) => `• **${x.tag}**`)));
    } 
    
    return display.run(await msg.send("Loading..."));
  }
}

module.exports = Discrim;
