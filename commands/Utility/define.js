const { Command, RichDisplay } = require("klasa");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");

class Define extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search the dictionary",
      extendedHelp: "Find a definition in the Oxford Dictionary",
      aliases: ["dict", "dictionary", "def"],
      cooldown: 5,
      usage: "<term:string>"
    });
  }

  async run(msg, [term]) {
    // eslint-disable-next-line camelcase
    const { app_id, app_key } = this.client.config.dictionary;
    const data = await superagent.get(`https://od-api.oxforddictionaries.com/api/v1/entries/en/${encodeURIComponent(term)}`)
      .set("app_id", app_id)
      .set("app_key", app_key)
      .then((res) => {
        if(!res.body.results || !res.body.results.length) throw "Couldn't find any results";
        const results = [];
        for(const x of res.body.results[0].lexicalEntries) {
          results.push({
            word: x.text,
            definitions: x.senses[0].definitions,
            examples: x.entries[0].senses[0].map((x) => x.text),
            shortDefinitions: x.entries[0].senses[0].short_definitions,
            category: x.lexicalCategory,
            derivatives: x.derivatives.map((x) => x.text),
            pronunciations: x.pronunciations[0]
          });
        }
        return results;
      })
      .catch((err) => {
        if(err.status === 404) throw "Couldn't find any results.";
        throw err;
      });

    const display = new RichDisplay(
      new MessageEmbed()
        .setColor(0xff0000)
    );
    for(const x of data) {
      display.addPage((em) => {
        em.setTitle(x.word);
        em.setDescription(`\`${x.category}\` ${x.word} ${x.pronunciations.phoneticSpelling} (${x.pronunciations.phoneticNotation})\n${x.definitions.join("\n\n")}\n\n**Examples**\n${x.examples.join("\n")}\n\n**Short Definitions**\n${x.short_definitions.join("\n")}`);
        return em;
      });
    }
    return display.run(await msg.send("Loading..."));
  }
}

module.exports = Define;
