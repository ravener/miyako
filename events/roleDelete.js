const { Event } = require("klasa");

class RoleDelete extends Event {
  
  run(role) {
    this.client.emit("modlogs", role.guild, "roleDelete", { role, name: "roles" });
  }
}

module.exports = RoleDelete;