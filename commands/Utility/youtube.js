const { Command } = require("klasa");
const superagent = require("superagent");
const cheerio = require("cheerio");

class YouTube extends Command {
  constructor(...args) {
    super(...args, {
      description: "Searches something on YouTube",
      usage: "<query:string>",
      cooldown: 5,
      aliases: ["yt"]
    });
  }

  async run(msg, [query]) {
    const url = await superagent.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`)
      .then((res) => cheerio.load(res.text))
      .then(function find($) {
        const u = $(".yt-uix-tile-link").first().attr("href");
        
        /*
        Sometimes if video is an AD it sends garbage
        so instead remove it from the DOM and search again
        */
        if(u && u.startsWith("http")) {
          $(".yt-uix-tile-link").first().remove();
          return find($);
        }
        return u;
      });
    if(!url) throw "No Results Found.";  
    return msg.send(`https://youtube.com${url}`);
  }
}

module.exports = YouTube;