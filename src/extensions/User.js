const { Structures } = require("discord.js");
const constants = require("@utils/constants");

module.exports = Structures.extend("User", (User) => class MiyakoUser extends User {
  get settings() {
    return this.client.settings[this.id === this.client.user.id ? "client" : "users"].getDefaults(this.id);
  }

  /**
   * Check if this user is the bot owner.
   * @returns {Boolean}
   */
  get owner() {
    return this.id === constants.ownerID;
  }

  /**
   * Check if this user is blacklisted.
   * @returns {Boolean}
   */
  get blacklisted() {
    return this.client.user.settings.blacklist.includes(this.id);
  }

  update(obj) {
    return this.client.settings[this.id === this.client.user.id ? "client" : "users"].update(this.id, obj);
  }

  syncSettings() {
    return this.client.settings[this.id === this.client.user.id ? "client" : "users"].sync(this.id);
  }

  /**
   * Sync only if the entry is not cached.
   */
  syncSettingsCache() {
    if(!this.client.settings[this.id === this.client.user.id ? "client" : "users"].cache.has(this.id)) {
      return this.syncSettings();
    }
  }
});
