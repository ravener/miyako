const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const ladybug = require("ladybug-fetch");

class Define extends Command {
  constructor(...args) {
    super(...args, {
      description: "Defines a word in the Oxford Dictionary.",
      aliases: ["def", "dict", "dictionary", "whatis"],
      usage: "<word:string>"
    });
  }
  
  async run(msg, [word]) {
    /* eslint-disable camelcase */
    const { app_key, app_id } = this.client.config.dictionary;
    const get = await ladybug(`https://od-api.oxforddictionaries.com/api/v1/entries/en/${encodeURIComponent(word)}`)
      .set({ app_key, app_id })
      .catch(() => null);
    /* eslint-enable camelcase */
    if(!get || !get.body || !get.body.results) throw "Unknown word";
    const res = get.body.results[0];
    const definitions = res.lexicalEntries
      .map(obj => [
        `\`[${obj.lexicalCategory}]\` **${obj.text}** (${obj.pronunciations[0].phoneticSpelling})`,
        `${obj.entries[0].senses[0].definitions
          ? obj.entries[0].senses[0].definitions[0]
          : obj.entries[0].senses[0].short_definitions[0]}`,
        obj.entries[0].senses[0].examples.map(ex => `_- ${ex.text}_`).join("\n")
      ].join("\n"));

    const embed = new MessageEmbed()
      .setTitle(`${res.lexicalEntries.length} result${res.lexicalEntries.length !== 1 ? "s" : ""} for ${res.id}:`)
      .setDescription(definitions.join("\n\n"))
      .setColor(0xFF0000);
    return msg.send({ embed });
  }
}

module.exports = Define;
