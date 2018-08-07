const { Event } = require("klasa");

class RoleCreate extends Event {
  
  run(role) {
    this.client.emit("modlogs", role.guild, "roleCreate", { role, name: "roles" });
  }
}

module.exports = RoleCreate;