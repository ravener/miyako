const { Route } = require("klasa-dashboard-hooks");

module.exports = class extends Route {

  constructor(...args) {
    super(...args, { route: "guilds/:guildID/roles" });
  }

  get(request, response) {
    const { guildID } = request.params;
    const guild = this.client.guilds.get(guildID);
    if (!guild) response.end("[]");
    return response.end(JSON.stringify(guild.roles.keyArray()));
  }

};
