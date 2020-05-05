const Command = require("../../structures/Command.js");
const pokemons = require("../../assets/json/pokemon.json");
const { MessageEmbed } = require("discord.js");

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

  async run(ctx) {
    const pokemon = this.client.utils.random(pokemons);

    const embed = new MessageEmbed()
      .setTitle("You have 15 seconds to guess! Who's that Pokémon!")
      .setAuthor(ctx.member.displayName, ctx.author.displayAvatarURL({ size: 64 }))
      .setImage(pokemon.imageURL)
      .setColor(0x9590EE);
    
    const msg = await ctx.reply({ embed });
    const filter = (msg) => msg.author.id === ctx.author.id;
    const attempts = await ctx.channel.awaitMessages(filter, { time: 15000, max: 1 });
      
    if(!attempts || !attempts.size) {
      await msg.delete();
      return ctx.reply(`Ba-Baka! You took too long to answer. It was ${pokemon.name}.`);
    } 
      
    const answer = attempts.first().content.toLowerCase();
      
    if(answer === pokemon.name) {
      await msg.delete();
      let points = "";

      if(ctx.guild.settings.social) {
        await ctx.member.givePoints(200);
        points = ` You got **¥200**`;
      }

      return ctx.reply(`Yatta! Well done, **${this.client.utils.toProperCase(pokemon.name)}** was correct.${points}`);
    }

    await msg.delete();
    return ctx.reply(`Ba-Baka! You answered incorrectly, It was **${this.client.utils.toProperCase(pokemon.name)}.**`);
  } 
}

module.exports = Pokemon;
