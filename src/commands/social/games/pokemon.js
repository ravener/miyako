const Command = require("../../../structures/Command.js");
const pokemons = require("@json/pokemon");


class Pokemon extends Command {
  constructor(...args) {
    super(...args, {
      description: "Guess That Pokemon",
      category: "Fun",
      aliases: ["guessthatpokemon"],
      guildOnly: true,
      cost: 20
    });
  }

  async run(msg) {
    const pokemon = this.client.utils.random(pokemons);

    const embed = this.client.embed(msg.author)
      .setTitle(msg.tr("COMMAND_POKEMON_GUESS"))
      .setImage(pokemon.imageURL);
    
    const sent = await msg.send({ embed });
    const filter = (m) => m.author.id === msg.author.id;
    const attempts = await msg.channel.awaitMessages(filter, {
      time: 15000,
      max: 1
    });
      
    if (!attempts || !attempts.size) {
      if (sent.deletable) await sent.delete();
      return msg.send(`Ba-Baka! You took too long to answer. It was ${pokemon.name}.`);
    }

    const answer = attempts.first().content.toLowerCase();
      
    if (answer === pokemon.name) {
      if (sent.deletable) await sent.delete();
      let points = "";

      if (msg.guild.settings.social) {
        await msg.member.givePoints(200);
        points = " You got **¥200**";
      }

      return msg.send(`Yatta! Well done, **${this.client.utils.toProperCase(pokemon.name)}** was correct.${points}`);
    }

    if (sent.deletable) await sent.delete();
    return msg.send(`Ba-Baka! You answered incorrectly, It was **${this.client.utils.toProperCase(pokemon.name)}.**`);
  }
}

module.exports = Pokemon;
