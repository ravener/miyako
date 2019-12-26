package misc

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/bwmarrin/discordgo"
)

// Copy someone and talk as them.
// Usage: <@user> <message:string...>
// Aliases: copycat
// guild only
func Mimic(ctx *sapphire.CommandContext) {
  user := ctx.Arg(0).AsUser()
  name := user.Username
  // Try to find it as a member and use nicknames if available
  member := ctx.Member(user.ID)

  if member != nil && member.Nick != "" {
    name = member.Nick
  }

  w, err := ctx.Session.WebhookCreate(ctx.Channel.ID, name, user.AvatarURL("2048"))

  if err != nil {
    ctx.Reply("Failed to create a webhook, make sure i can **manage webhooks** in this channel.")
    return
  }

  ctx.Session.ChannelMessageDelete(ctx.Channel.ID, ctx.Message.ID)

  _, err = ctx.Session.WebhookExecute(w.ID, w.Token, false, &discordgo.WebhookParams{
    Content:ctx.JoinedArgs(1),
    AvatarURL: user.AvatarURL("2048"),
  })

  if err != nil {
    ctx.Error(err)
    return
  }

  ctx.Session.WebhookDelete(w.ID)
}
