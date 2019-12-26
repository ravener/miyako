package utility

import (
  "github.com/sapphire-cord/sapphire"
  "encoding/base64"
)

// Encode/Decode Base64 strings.
// Usage: <action:string> <args:string...>
func Base64(ctx *sapphire.CommandContext) {
  if ctx.Arg(0).AsString() != "encode" && ctx.Arg(0).AsString() != "decode" {
    ctx.Reply("action must be either encode or decode.")
    return
  }

  if ctx.Arg(0).AsString() == "encode" {
    enc := base64.StdEncoding.EncodeToString([]byte(ctx.JoinedArgs(1)))
    if len(enc) > 2040 {
      ctx.Reply("Results too long.")
      return
    }
    ctx.CodeBlock("", enc)
    return
  }

  if ctx.Arg(0).AsString() == "decode" {
    dec, err := base64.StdEncoding.DecodeString(ctx.JoinedArgs(1))
    if err != nil {
      ctx.Reply("Invalid Base64 Input.")
      return
    }
    str := string(dec)
    if len(str) > 2040 {
      ctx.Reply("Results too long.")
      return
    }
    ctx.CodeBlock("", str)
    return
  }
}
