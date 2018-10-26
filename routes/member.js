const { Route } = require("klasa-dashboard-hooks");

module.exports = class extends Route {

  constructor(...args) {
    super(...args, { route: "guilds/:guildID/members/:memberID" });
  }

  get(request, response) {
    const { guildID, memberID } = request.params;
    const guild = this.client.guilds.get(guildID);
    if (!guild) return response.end("{}");
    const member = guild.members.get(memberID);
    if (!member) return response.end("{}");
    return response.end(JSON.stringify(member));
  }

};
