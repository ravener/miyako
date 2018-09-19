const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const { URL, URLSearchParams } = require("url");
const fetch = require("node-fetch");

class TVShow extends Command {

  constructor(...args) {
    super(...args, {
      aliases: ["tvshows", "tv", "tvseries"],
      description: "Finds a TV show on TMDB.org",
      extendedHelp: "e.g. `s.tvshow universe, 2`",
      usage: "<Query:str> [Page:number]",
      usageDelim: ","
    });
  }

  async run(msg, [query, page = 1]) {
    const url = new URL("https://api.themoviedb.org/3/search/tv");
    url.search = new URLSearchParams([["api_key", this.client.config.tmdb], ["query", query]]);

    const body = await fetch(url)
      .then(response => response.json());
    const show = body.results[page - 1];
    if (!show) throw `I couldn't find a TV show with title **${query}** in page ${page}.`;

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setImage(`https://image.tmdb.org/t/p/original${show.poster_path}`)
      .setTitle(`${show.name} (${page} out of ${body.results.length} results)`)
      .setDescription(show.overview)
      .setFooter(`${this.client.user.username} uses the TMDb API but is not endorsed or certified by TMDb.`,
        "https://www.themoviedb.org/assets/1/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png");
    if (show.title !== show.original_name) embed.addField("Original Title", show.original_name, true);
    embed
      .addField("Vote Count", show.vote_count, true)
      .addField("Vote Average", show.vote_average, true)
      .addField("Popularity", show.popularity, true)
      .addField("First Air Date", show.first_air_date || "Unknown");

    return msg.sendEmbed(embed);
  }
}

module.exports = TVShow;
