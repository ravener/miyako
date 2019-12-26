package general

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/bwmarrin/discordgo"
)

// Get the link to our Discord server.
// Aliases: discord, server
func Support(ctx *sapphire.CommandContext) {
  // If this command is used in DMs already just reply.
  if ctx.Channel.Type == discordgo.ChannelTypeDM {
    ctx.Reply("Here is the invite to our server: https://discord.gg/mDkMbEh")
    return
  }

  // Otherwise we have to open a channel.

  channel, err := ctx.Session.UserChannelCreate(ctx.Author.ID)

  // I'm not sure if this happens during the channel creation or the sending process.
  // discord.js sure hid a lot of details behind my back.
  if err != nil {
    ctx.Reply("Couldn't DM invite, make sure you didn't block DMs from this server.")
    return
  }

  _, err = ctx.Session.ChannelMessageSend(channel.ID, "Here is the invite to our server: https://discord.gg/mDkMbEh")

  if err != nil {
    ctx.Reply("Couldn't DM invite, make sure you didn't block DMs from this server.")
  }
}
