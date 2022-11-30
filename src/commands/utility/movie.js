const Command = require("../../structures/Command.js");
const { request } = require("undici");

class Movie extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["movies", "film", "films"],
      description: "Finds a movie on TMDB.org",
      extendedHelp: "e.g. `m!movie infinity war, 2`",
      usage: "movie <query>, [page]",
      cooldown: 5,
      delim: ", ",
      options: [
        {
          name: "query",
          description: "Name of the movie to search",
          type: "string",
          required: true
        },
        {
          name: "page",
          description: "The page number of results",
          type: "integer"
        }
      ]
    });
  }

  async run(ctx, options) {
    const query = options.getString("query");
    const page = options.getInteger("query") ?? 1;
    const url = new URL("https://api.themoviedb.org/3/search/movie");

    url.search = new URLSearchParams([
      ["api_key", process.env.TMDB],
      ["query", query]
    ]);

    const body = await request(url)
      .then(({ body }) => body.json())
      .catch(() => {
        throw `I couldn't find a movie with title **${query}** in page ${page}.`;
      });

    const movie = body.results[parseInt(page) - 1];
    if (!movie) {
      throw `I couldn't find a movie with title **${query}** in page ${page}.`;
    }

    const embed = this.client.embed(ctx.author)
      .setImage(`https://image.tmdb.org/t/p/original${movie.poster_path}`)
      .setTitle(`${movie.title} (${page} out of ${body.results.length} results)`)
      .setDescription(movie.overview)
      .setFooter({
        text: `${this.client.user.username} uses the TMDb API but is not endorsed or certified by TMDb.`,
        iconURL: "https://www.themoviedb.org/assets/1/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png"
      });

    if (movie.title !== movie.original_title) {
      embed.addFields({
        name: "Original Title",
        value: movie.original_title,
        inline: true
      });
    }

    embed.addFields([
      {
        name: "Vote Count",
        value: movie.vote_count.toString(),
        inline: true
      },
      {
        name: "Vote Average",
        value: movie.vote_average.toString(),
        inline: true
      },
      {
        name: "Popularity",
        value: movie.popularity.toString(),
        inline: true
      },
      {
        name: "Adult Content",
        value: movie.adult ? "Yes" : "No",
        inline: true
      },
      {
        name: "Release Date",
        value: movie.release_date || "Unknown",
        inline: true
      }
    ]);

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = Movie;
