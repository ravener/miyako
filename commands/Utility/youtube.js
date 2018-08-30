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
    const $ = await superagent.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`)
      .then((res) => cheerio.load(res.text));
    const url = $(".yt-uix-tile-link").first().attr("href");
    if(!url) throw "No Results Found.";
    return msg.send(`https://youtube.com${url}`);
  }
}

module.exports = YouTube;
