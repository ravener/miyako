const { Command, RichDisplay } = require("klasa");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");

class Urban extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search a term in urban dictionary!",
      cooldown: 5,
      runIn: ["text"],
      aliases: ["ud", "urbandictionary", "urbandict"],
      usage: "<term:string>",
      requiredPermissions: ["MANAGE_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS"]
    });
    this.handlers = new Map();
  }
  
  async run(msg, [term]) {
    if(!msg.channel.nsfw) throw "You can use urban in nsfw channels only! sorry but it has inappropriate words, which could be against Discord ToS (Terms of Services).";
    
    const res = await superagent.get(`https://api.urbandictionary.com/v0/define?term=${term}`).catch(() => null);
    if(!res) throw "Something went wrong with urban, try again later.";
    const previous = this.handlers.get(msg.author.id);
    if(previous) previous.stop();
    const display = new RichDisplay(
      new MessageEmbed()
        .setTitle("Urban Dictionary")
        .setColor(0xff0000)
    );
    
    for(const data of res.body.list) {
      const format = `${this.format(data.definition)}\n\n*${this.format(data.example)}*`.length > 1980 ? false : true;
      const definition = format ? this.format(data.definition) : data.definition;
      const example = format ? this.format(data.example) : data.example;
      display.addPage((em) => em.setDescription(`${definition}\n\n*${example}*\n\n**Votes**\n:thumbsup: ${data.thumbs_up} :thumbsdown: ${data.thumbs_down}\n\nDefinition written by **${data.author}**`)); 
    }
    
    const handler = await display.run(await msg.send("Loading urban..."), {
      filter: (reaction, user) => user.id === msg.author.id,
      time: 1000 * 60 * 3
    });
    handler.on("end", () => this.handlers.delete(msg.author.id));
    this.handlers.set(msg.author.id, handler);
    return handler;
  }

  format(str) {
    // https://stackoverflow.com/questions/52374809/javascript-regular-expression-to-catch-boxes
    return str.replace(/\[([^\][]+)\]/g, (x, y) => `${x}(https://www.urbandictionary.com/define.php?term=${y.replace(/\s+/g, "+")})`);
  }
}

module.exports = Urban;
