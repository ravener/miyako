package fun

import (
  "strings"
  "github.com/sapphire-cord/sapphire"
)

// Reverses a given input
// Usage: <text...>
// Aliases: rev
func Reverse(ctx *sapphire.CommandContext) {

  var chars []string = strings.Split(ctx.JoinedArgs(), "");

  for i, j := 0, len(chars)-1; i < j; i, j = i+1, j-1 {
    chars[i], chars[j] = chars[j], chars[i]
  }

  ctx.Reply(sapphire.Escape(strings.Join(chars, "")))
}
