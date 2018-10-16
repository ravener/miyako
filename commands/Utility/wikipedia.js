const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Wikipedia extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["wiki"],
      description: "Finds a Wikipedia Article by title.",
      usage: "<query:string>"
    });
  }
  
  async run(msg, [query]) {
    const article = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`)
      .then(response => response.json())
      .catch(() => {
        throw "I couldn't find a wikipedia article with that title!";
      });
    
    if(!article.content_urls) throw "I couldn't find a wikipedia article with that title!";
    const embed = new MessageEmbed()
      .setColor(4886754)
      .setThumbnail("https://i.imgur.com/fnhlGh5.png")
      .setURL(article.content_urls.desktop.page)
      .setTitle(article.title)
      .setDescription(article.extract);
    return msg.send({ embed });
  }
}

module.exports = Wikipedia;
