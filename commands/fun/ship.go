package fun

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/pollen5/taiga/utils"
  "fmt"
)

// Ship someone.
// Aliases: love, lovecalc, lovecalculator
// Usage: <@@one> [@@two]
// guild only
func Ship(ctx *sapphire.CommandContext) {
  one := ctx.Arg(0).AsMember()
  two := ctx.Member(ctx.Author.ID)

  if ctx.Arg(1).IsProvided() {
    two = ctx.Arg(1).AsMember()
  }

  name1 := one.User.Username
  name2 := two.User.Username

  // Use nicknames if available.
  if one.Nick != "" {
    name1 = one.Nick
  }

  if two.Nick != "" {
    name2 = two.Nick
  }

  ctx.BuildEmbed(sapphire.NewEmbed().
    SetTitle("Love Calculator.").
    SetColor(0xDFAC7C).
    SetAuthor(ctx.Author.Username, ctx.Author.AvatarURL("256")).
    SetDescription(fmt.Sprintf("**%s** + **%s**\n:heart: **%d%%**",
      name1, name2, utils.RandNumber(101))).
    AddField("Ship Name", name1[:len(name1) / 2] + name2[len(name2) / 2:]))
}
