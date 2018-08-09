const { Command, Timestamp } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Tag extends Command {
  constructor(...args) {
    super(...args, {
      description: "Manage custom guild tags",
      usage: "<list|all|create|remove|new|info|delete|tag:string> [args:string] [...]",
      extendedHelp: "Example:\nlb.tag create something this is some text\nlb.tag something\nlb.tag remove something\nlb.tag info something",
      usageDelim: " ",
      runIn: ["text"],
      aliases: ["tags"],
      cooldown: 5
    });
    this.timestamp = new Timestamp("d MMMM YYYY");
  }
  
  async run(msg, [action, ...args]) {
    if(["list", "all"].includes(action)) return this.list(msg);
    if(["remove", "delete"].includes(action)) return this.remove(msg, args[0]);
    if(["create", "new"].includes(action)) return this.create(msg, args);
    if(action === "info") return this.info(msg, args[0]);
    return this.get(msg, action);
  }
  
  async remove(msg, key) {
    if(!key) throw "Tag name is required.";
    const tag = msg.guild.configs.tags.find((x) => x.name === key);
    if(!tag) throw "That tag doesn't exist.";
    if(tag.user !== msg.author.id && !await msg.hasAtLeastPermissionLevel(6)) throw "You cannot delete that tag.";
    await msg.guild.configs.update("tags", tag, { action: "remove" });
    return msg.send(`Successfully deleted the tag with the name **${tag.name}**`);
  }
  
  async create(msg, [name, ...content]) {
    if(!name) throw "Name is a required argument.";
    if(["new", "list", "all", "create", "info", "remove", "delete"].includes(name)) throw "That is a reserved name!";
    if(!content.length) throw "Content is a required argument";
    if(msg.guild.configs.tags.find((x) => x.name === name)) throw "A tag with that name already exists.";
    const obj = { user: msg.author.id, date: Date.now(), content: content.join(" "), name, uses: 0 };
    await msg.guild.configs.update("tags", obj, { action: "add" });
    return msg.send(`Created a new tag with the name **${name}**`);
  }
  
  async list(msg) {
    let counter = 1;
    const tags = msg.guild.configs.tags.map((x) => `${counter++}. **${x.name}**`);
    if(!tags.length) throw "There is no tags yet.";
    const embed = new MessageEmbed()
      .setTitle("Tags List")
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(tags.join("\n"))
      .setColor(0xff0000);
    return msg.send({ embed });
  }
  
  async info(msg, key) {
    if(!key) throw "Tag name is required.";
    const tag = msg.guild.configs.tags.find((x) => x.name === key);
    if(!tag) throw "That tag doesn't exist.";
    const user = msg.guild.members.get(tag.user);
    const embed = new MessageEmbed()
      .setTitle(`Info for tag: ${tag.name}`)
      .addField("Creator", user ? user.user.tag : "Unknown")
      .addField("Name", tag.name)
      .addField("Created At", this.timestamp.display(new Date(tag.date)))
      .addField("Uses", tag.uses)
      .setColor(0xff0000)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    return msg.send({ embed });
  }
  
  async get(msg, key) {
    const tag = msg.guild.configs.tags.find((x) => x.name === key);
    if(!tag) throw "That tag doesn't exist.";
    await msg.guild.configs.update("tags", tag, { action: "remove" });
    tag.uses++;
    await msg.guild.configs.update("tags", tag, { action: "add" });
    return msg.send(tag.content);
  }
  
  async init() {
    const { schema } = this.client.gateways.guilds;
    if(!schema.has("tags")) {
      await schema.add("tags", {
        type: "any",
        array: true,
        configurable: false
      });
    }
  }
}

module.exports = Tag;
