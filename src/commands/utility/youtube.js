const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

class YouTube extends Command {
  constructor(...args) {
    super(...args, {
      description: "Searches something on YouTube",
      usage: "youtube <query>",
      cooldown: 5,
      aliases: ["yt"],
      // FIXME: This is broken, so for now disable it.
      enabled: false
    });
  }

  async run(msg, args) {
    if(!args.length) return msg.send("Baka! What do you want me to search?");

    const url = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(args.join(" "))}`)
      .then((res) => res.text())
      .then((html) => cheerio.load(html))
      .then(function find($) {
        const u = $(".yt-uix-tile-link").first().attr("href");   
        
        // Sometimes if video is an AD it sends garbage
        // so instead remove it from the DOM and search again
        if(u && u.startsWith("http")) {
          $(".yt-uix-tile-link").first().remove();
          return find($);
        }
        return u;
      });

    if(!url) return msg.send("No Results Found.");  
    return msg.send(`https://youtube.com${url}`);
  }
}

module.exports = YouTube;
