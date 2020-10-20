const Command = require("../../structures/Command.js");

const fetch = require("node-fetch");

class Wikipedia extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["wiki"],
      description: "Finds a Wikipedia Article by title.",
      usage: "wikipedia <query>"
    });
  }
  
  async run(msg, args) {
    const article = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(args.join(" "))}`)
      .then((res) => res.json())
      .catch(() => {
        throw "I couldn't find a wikipedia article with that title!";
      });
    
    if(!article.content_urls) throw "I couldn't find a wikipedia article with that title!";
    const embed = this.client.embed()
      .setThumbnail("https://i.imgur.com/fnhlGh5.png")
      .setURL(article.content_urls.desktop.page)
      .setTitle(article.title)
      .setDescription(article.extract);
    return msg.send({ embed });
  }
}

module.exports = Wikipedia;
