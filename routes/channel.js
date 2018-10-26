const { Route } = require("klasa-dashboard-hooks");

module.exports = class extends Route {

  constructor(...args) {
    super(...args, { route: "guilds/:guildID/channels/:channelID" });
  }

  get(request, response) {
    const { guildID, channelID } = request.params;
    const guild = this.client.guilds.get(guildID);
    if (!guild) return response.end("{}");
    const channel = guild.members.get(channelID);
    if (!channel) return response.end("{}");
    return response.end(JSON.stringify(channel));
  }

};
