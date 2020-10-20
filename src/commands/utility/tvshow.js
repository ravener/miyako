const Command = require("../../structures/Command.js");

const fetch = require("node-fetch");

class TVShow extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["tvshows", "tv", "tvseries"],
      description: "Finds a TV show on TMDB.org",
      extendedHelp: "e.g. `m!tvshow universe, 2`",
      usage: "tvshow <query>, [page]",
      cooldown: 5
    });
  }

  async run(msg, args) {
    if(!args.length) return msg.send("Baka! What am I supposed to search?");

    const [query, page = 1] = args.join(" ").split(",");
    if(isNaN(parseInt(page))) return msg.send("Baka! Page must be a number.");

    const url = new URL("https://api.themoviedb.org/3/search/tv");
    url.search = new URLSearchParams([["api_key", process.env.TMDB], ["query", query]]);

    const body = await fetch(url)
      .then((res) => res.json())
      .catch(() => {
        throw `I couldn't find a TV show with title **${query}** in page ${page}.`;
      });

    const show = body.results[parseInt(page) - 1];
    if (!show) throw `I couldn't find a TV show with title **${query}** in page ${page}.`;

    const embed = this.client.embed()
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

    return msg.send({ embed });
  }
}

module.exports = TVShow;
