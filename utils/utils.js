const { util: { toTitleCase, codeBlock } } = require("klasa");

class Util {
  constructor() {
    throw new Error("Utils is a static class and may not be constructed.");
  }

  // some_text => Some Text
  static capitalize(str) {
    return str.split("_").map(toTitleCase).join(" ");
  }
  
  static embedContains(embed, str) {
    if(embed.title && embed.title.toLowerCase().includes(str.toLowerCase())) return true;
    if(embed.description && embed.description.toLowerCase().includes(str.toLowerCase())) return true;
    if(embed.footer && embed.footer.text && embed.footer.text.toLowerCase().includes(str.toLowerCase())) return true;
    if(embed.author && embed.author.name && embed.author.name.toLowerCase().includes(str.toLowerCase())) return true;
    if(embed.fields && embed.fields.length) {
      for(const field of embed.fields) {
        if(field.name && field.name.toLowerCase().includes(str.toLowerCase())) return true;
        if(field.value && field.value.toLowerCase().includes(str.toLowerCase())) return true;
      }
    }
    return false;
  }
  
  // https://j11y.io/snippets/wordwrap-for-javascript/
  /* static wordwrap(str, width = 75, brk = "\n", cut = false) {
    if (!str) { return str; }
    if(str.length <= width) return str;
    const regex = ".{1," + width + "}(\\s|$)" + (cut ? "|.{" + width + "}|.+$" : "|\\S+?(\\s|$)");
    return str.match(RegExp(regex, "g")).join(brk);
  }*/
  
  static wordwrap(str, limit, brk = "\n") {
    if(str.length <= limit) return str;
    const regex = new RegExp(`(.{1,${limit}})`, "g");
    return str.match(regex).join(brk);
  }
  
  static slice(str, limit, suffix = "...") {
    if(str.length < limit) return str;
    if(suffix && suffix.length > limit) throw new Error("Suffix shouldn't be longer than limit.");
    if(!suffix) return str.slice(0, limit);
    return str.substring(0, limit - suffix.length) + suffix;
  }

  static random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  // Taken from discord.js's Message#cleanContent
  // Since not every input we wanna clean is a message object
  // this makes it easier to clean any piece of string.
  static clean(msg, content) {
    return content
      .replace(/@(everyone|here)/g, "@\u200b$1")
      .replace(/<@!?[0-9]+>/g, input => {
        const id = input.replace(/<|!|>|@/g, "");
        if (msg.channel.type === "dm" || msg.channel.type === "group") {
          return msg.client.users.has(id) ? `@${msg.client.users.get(id).username}` : input;
        }

        const member = msg.channel.guild.members.get(id);
        if (member) {
          if (member.nickname) return `@${member.nickname}`;
          return `@${member.user.username}`;
        } else {
          const user = msg.client.users.get(id);
          if (user) return `@${user.username}`;
          return input;
        }
      })
      .replace(/<#[0-9]+>/g, input => {
        const channel = msg.client.channels.get(input.replace(/<|#|>/g, ""));
        if (channel) return `#${channel.name}`;
        return input;
      })
      .replace(/<@&[0-9]+>/g, input => {
        if (msg.channel.type === "dm" || msg.channel.type === "group") return input;
        const role = msg.guild.roles.get(input.replace(/<|@|>|&/g, ""));
        if (role) return `@${role.name}`;
        return input;
      });
  }

  static mix(str, str2) {
    return str.slice(0, str.length / 2) + str2.slice(str2.length / 2);
  }

  static async promptArgument(msg, args, propOrFn = "name") {
    let counter = 1;
    const m = await msg.prompt(`Found multiple matches:${codeBlock("", args.map((x) => `${counter++}: ${typeof propOrFn === "function" ? propOrFn(x) : x[propOrFn]}`).join("\n"))}\nType the number to choose an option or **CANCEL** to stop.`);
    // Throw here because we wanna stop the execution
    // as if this returned a result it ends up being the result of the argument
    // we wanna throw to point out that it failed to resolve the arg.
    if(m.content.toLowerCase() === "cancel") throw "Cancelled.";
    const num = parseInt(m.content);
    if(isNaN(num)) throw "Invalid input, Not a Number, cancelled";
    // Since arrays are 0 indexed but we wanna be user friendly here.
    const res = args[num - 1];
    if(!res) throw "Invalid number range.";
    return res;
  }

  // The usage string types are kind of not really user friendly
  // this turns them to just the name
  // <name:string> [reason:string] => <name> [reason]
  static formatUsage(usageString) {
    return usageString.replace(/(<|\[)(\w+):.+?(>|\])/gi, "$1$2$3");
  }

  static getAttachment(msg) {
    const attach = msg.attachments.filter((x) => x.url && x.width && x.height);
    if(attach.size) return attach.first().url;
    const imageEmbeds = msg.embeds.filter((x) => x.image && x.image.url);
    if(imageEmbeds.length) return imageEmbeds[0].image.url;
    const urlEmbeds = msg.embeds.filter((x) => x.type === "image" && x.url);
    if(urlEmbeds.length) return urlEmbeds[0].url;
    return null;
  }

  // Something based on python's range()
  static* range(start, stop, incr = 1) {
    if(!stop) {
      stop = start;
      start = 0;
    }

    for(; start < stop; start += incr) {
      yield start;
    }
  }
}

module.exports = Util;
