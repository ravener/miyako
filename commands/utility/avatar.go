package utility

import (
  "github.com/sapphire-cord/sapphire"
  "fmt"
)

// View someone's avatar.
// Usage: [@user]
// Aliases: av, pfp
func Avatar(ctx *sapphire.CommandContext) {
  user := ctx.Author

  if ctx.HasArgs() {
    user = ctx.Arg(0).AsUser()
  }

  ctx.BuildEmbed(sapphire.NewEmbed().
    SetTitle(fmt.Sprintf("%s's Avatar", user.Username)).
    SetColor(0xDFAC7C).
    SetImage(user.AvatarURL("2048")).
    SetAuthor(ctx.Author.Username, ctx.Author.AvatarURL("256")))
}
