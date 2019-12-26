package social

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/pollen5/taiga/db"
  "github.com/pollen5/taiga/constants"
  "github.com/dustin/go-humanize"
)

// View your balance or someone else's.
// Usage: [@@member]
// Aliases: bal, points
// guild only
func Balance(ctx *sapphire.CommandContext) {
  if ctx.HasArgs() {
    member := ctx.Arg(0).AsMember()
    name := member.User.Username

    if member.Nick != "" {
      name = member.Nick
    }

    ctx.Reply("**%s-san**'s balance: **%s** %s", name,
      humanize.Comma(db.GetBalance(member.User.ID, ctx.Guild.ID)), constants.Currency)
    return
  }

  ctx.Reply("You have **%s** %s", humanize.Comma(db.GetBalance(ctx.Author.ID, ctx.Guild.ID)), constants.Currency)
}
