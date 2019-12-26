package fun

import (
  "github.com/sapphire-cord/sapphire"
  "net/url"
)

// Let me google it for you!
// Aliases: letmegoogleitforyou
// Usage: <query:string...>
func Lmgtfy(ctx *sapphire.CommandContext) {
  ctx.Reply("http://lmgtfy.com/?q=%s", url.QueryEscape(ctx.JoinedArgs()))
}
