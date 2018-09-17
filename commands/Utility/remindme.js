const { Command } = require("klasa");

class Reminder extends Command {
  constructor(...args) {
    super(...args, {
      description: "creates a reminder",
      usage: "<when:time> <text:str> [...]",
      usageDelim: ", ",
      aliases: ["remind", "reminder"],
      extendedHelp: "Seperate your reminder time and message with a comma, i.e remindme 5 hours, do something"
    });
  }

  async run(msg, [when, ...text]) {
    const reminder = await this.client.schedule.create("reminder", when, {
      data: {
        user: msg.author.id,
        text: text.join(" ")
      }
    });
    return msg.sendMessage(`Ok, I created you a reminder with the id: \`${reminder.id}\``);
  }
}

module.exports = Reminder;
