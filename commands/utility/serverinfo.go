package utility

import (
  "github.com/sapphire-cord/sapphire"
  "fmt"
  "github.com/bwmarrin/discordgo"
  "strconv"
)

// Gets information about the current server.
// Aliases: si, gi, guildinfo, guild, server
// guild only
func Serverinfo(ctx *sapphire.CommandContext) {
  ownerMember, err := ctx.Session.State.Member(ctx.Guild.ID, ctx.Guild.OwnerID)
  if err != nil {
    ctx.Reply("Failed to fetch owner details: %s", err)
    return
  }
  owner := ownerMember.User
  ctx.BuildEmbed(sapphire.NewEmbed().
    SetTitle("Server Info.").
    SetDescription(fmt.Sprintf("%s (%s)", ctx.Guild.Name, ctx.Guild.ID)).
    AddField("Members", strconv.Itoa(ctx.Guild.MemberCount)).
    AddField("Roles", strconv.Itoa(len(ctx.Guild.Roles))).
    AddField("Emojis", strconv.Itoa(len(ctx.Guild.Emojis))).
    AddField("Channels", strconv.Itoa(len(ctx.Guild.Channels))).
    AddField("Owner", fmt.Sprintf("%s#%s (%s)", owner.Username, owner.Discriminator, owner.ID)).
    SetColor(0xDFAC7C).
    SetAuthor(ctx.Author.Username, ctx.Author.AvatarURL("256")).
    SetThumbnail(discordgo.EndpointGuildIcon(ctx.Guild.ID, ctx.Guild.Icon)))
}
