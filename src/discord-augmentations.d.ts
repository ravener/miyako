import 'discord.js';

declare module 'discord.js' {
  interface Message<InGuild extends boolean = boolean> {
    lastReply?: Message | null;
  }

  interface ClientEvents {
    miyakoReady: [];
  }
}
