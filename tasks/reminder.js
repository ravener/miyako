const { Task } = require("klasa");

class Reminder extends Task {

  async run({ user, text }) {
    const _user = await this.client.users.fetch(user);
    if(!_user) return;
    return _user.send(`You wanted me to remind you: **${text}**`);
  }
}

module.exports = Reminder;
