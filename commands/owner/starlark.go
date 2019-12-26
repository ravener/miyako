package owner

import (
  "github.com/sapphire-cord/sapphire"
  "go.starlark.net/starlark"
  "github.com/starlight-go/starlight/convert"
  "strings"
)

// Evaluates Arbitrary Python
// Usage: <code:string...>
// Aliases: py, python, sl
func OwnerStarlark(ctx *sapphire.CommandContext) {
  // Hacky way but because strings.Split messes up indents.
  // For other eval backends it wasn't needed due to them not being whitespace sensitive
  // But this one is, so we have to get it exactly as the user entered it.
  code := strings.Trim(ctx.Message.Content[len(ctx.Prefix) + len(ctx.InvokedName):], " ")

  stdout := []string{}

  thread := &starlark.Thread{Name:"eval", Print: func(_ *starlark.Thread, msg string) {
    stdout = append(stdout, msg)
  }}

  dict, err := convert.MakeStringDict(map[string]interface{}{
    "ctx": ctx,
    "bot": ctx.Bot,
    "session": ctx.Session,
  })

  // Should not happen.
  if err != nil {
    ctx.Error(err)
    return
  }

  _, err = starlark.ExecFile(thread, "eval", code, dict)

  if err != nil {
    if trace, ok := err.(*starlark.EvalError); ok {
      ctx.CodeBlock("py", trace.Backtrace())
    } else {
      ctx.CodeBlock("py", err.Error())
    }

    return
  }

  if len(stdout) < 1 {
    ctx.Reply("No output returned.")
    return
  }

  ctx.CodeBlock("py", "%+v", strings.Join(stdout, "\n"))
}
