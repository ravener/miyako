const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const cheerio = require("cheerio");
const superagent = require("superagent");
const querystring = require("querystring");

class Google extends Command {
  constructor(...args) {
    super(...args, {
      description: "Searches google for your query",
      aliases: ["g"],
      cooldown: 5,
      usage: "<query:string>"
    });
  }
  
  async run(message, [query]) {
    const msg = await message.send("Searching...");
    const $ = await superagent.get("https://google.com/search")
      .query({ q: query, safe: message.channel.nsfw ? "off" : "on" })
      .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36")
      .then((res) => cheerio.load(res.text))
      .catch(() => null);
      
    if(!$) throw "Something went wrong with google.";
   
    const results = [];
   
    $(".r").each((counter, elem) => {
      if(results.length === 5) return;
      let url = $(elem).find("a").attr("href");
      if(url && url.includes("/url?q=")) url = querystring.parse(url.replace("/url?", "")).q;
      const text = $(elem).text();
      if(!url || !text) return;
      results.push({ text, url });
    });
   
    if(!results.length) throw "No Results found.";
   
    const embed = new MessageEmbed()
      .setTitle("Search Results")
      .setColor(0xff0000)
      .setDescription(results.map((data) => `${data.text} ${data.url}`).join("\n\n"));
    return msg.edit({ embed });
  }
}

module.exports = Google;