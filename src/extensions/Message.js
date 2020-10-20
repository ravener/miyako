const { Structures, APIMessage } = require("discord.js");
const schema = require("@utils/schema");

module.exports = Structures.extend("Message", (Message) => class MiyakoMessage extends Message {
  constructor(...args) {
    super(...args);
    // Last response sent if any, for editing.
    this.lastResponse = null;
    // The used alias to invoke the command.
    this.alias = null;
    // Content with --flags removed.
    this.parsedContent = null;
    // Command arguments.
    this.args = [];
    // The invoked command.
    this.command = null;
    // Prefix used to invoke the command.
    this.prefix = schema.guilds.prefix;
    // Parsed --flags
    this.commandFlags = {};
  }

  get rawArgs() {
    return this.parsedContent.slice(this.prefix.length).trim().slice(this.alias.length).trim();
  }

  get member() {
    if(this.guild) return super.member;
    return { user: this.author, displayName: this.author.username };
  }

  get settings() {
    if(this.guild) return this.guild.settings;
    return schema.guilds;
  }

  async awaitReply(question, filter, limit = 60000, embed) {
    await this.channel.send(question, embed);

    return this.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] })
      .then(collected => collected.first().content)
      .catch(() => false);
  }

  async send(content, options) {
    const transformedOptions = APIMessage.transformOptions(content, options);

    // Condition 1: Attachments cannot be edited.
    if("files" in transformedOptions) return this.channel.send(transformedOptions);

    // When editing always remove the previous content/embed
    if(!transformedOptions.content) transformedOptions.content = null;
    if(!transformedOptions.embed) transformedOptions.embed = null;

    // Condition 2: A last response is available and we can edit it.
    if(this.lastResponse && !this.lastResponse.deleted && !this.lastResponse.attachments.size) {
      return this.lastResponse.edit(transformedOptions);
    }

    // Condition 4: No previous reply to edit. Send a reply and save it.
    const sent = await this.channel.send(transformedOptions);

    // Store the response for editing.
    this.lastResponse = Array.isArray(sent) ? sent.slice(-1)[0] : sent;

    return sent;
  }
  
  reply(content, options) {
    return this.send(APIMessage.transformOptions(content, options, { reply: this.member || this.author }));
  }

  success() {
    return this.react("519166152488910850")
      .catch(() => null);
  }

  failure() {
    return this.react("519166256214048769")
      .catch(() => null);
  }

  /**
   * msg.response([
   *   "{{user}} what are you doing?",
   *   "Baka! {{user}} stop.",
   *   "...other responses."
   * ], { user: msg.author.username });
   * Normally a response would be used from client.responses
   */
  response(arr, replace = {}) {
    let res = this.client.utils.random(arr);

    for(const [k, v] of Object.entries(replace))
      res = res.replace(new RegExp(`{{${k}}}`, "g"), v);

    return this.send(res);
  }
});
