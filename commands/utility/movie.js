const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Movie extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["movies", "film", "films"],
      description: "Finds a movie on TMDB.org",
      extendedHelp: "e.g. `m!movie infinity war, 2`",
      usage: "movie <query>, [page]",
      cooldown: 5
    });
  }

  async run(ctx, args) {
    if(!args.length) return ctx.reply("Baka! What am I supposed to search?");

    const [query, page = 1] = args.join(" ").split(",");
    if(isNaN(parseInt(page))) return ctx.reply("Baka! Page must be a number.");

    const url = new URL("https://api.themoviedb.org/3/search/movie");
    url.search = new URLSearchParams([["api_key", this.client.config.tmdb], ["query", query]]);

    const body = await fetch(url)
      .then((res) => res.json())
      .catch(() => { throw `I couldn't find a movie with title **${query}** in page ${page}.`; });

    const movie = body.results[parseInt(page) - 1];
    if (!movie) throw `I couldn't find a movie with title **${query}** in page ${page}.`;

    const embed = new MessageEmbed()
      .setImage(`https://image.tmdb.org/t/p/original${movie.poster_path}`)
      .setTitle(`${movie.title} (${page} out of ${body.results.length} results)`)
      .setDescription(movie.overview)
      .setFooter(`${this.client.user.username} uses the TMDb API but is not endorsed or certified by TMDb.`,
        "https://www.themoviedb.org/assets/1/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png");
    if (movie.title !== movie.original_title) embed.addField("Original Title", movie.original_title, true);
    embed
      .addField("Vote Count", movie.vote_count, true)
      .addField("Vote Average", movie.vote_average, true)
      .addField("Popularity", movie.popularity, true)
      .addField("Adult Content", movie.adult ? "Yep" : "Nope", true)
      .addField("Release Date", movie.release_date || "Unknown");

    return ctx.reply({ embed });
  }
}

module.exports = Movie;
