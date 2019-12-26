package owner

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/yuin/gopher-lua"
  "layeh.com/gopher-luar"
  "bytes"
  "fmt"
)

// Evaluates arbitrary lua.
// Usage: <code:string...>
func OwnerLua(ctx *sapphire.CommandContext) {
  L := lua.NewState()
  defer L.Close()
  L.SetGlobal("ctx", luar.New(L, ctx))
  L.SetGlobal("bot", luar.New(L, ctx.Bot))
  L.SetGlobal("session", luar.New(L, ctx.Session))

  stdout := &bytes.Buffer{}
  // Redirect prints to our stdout. Modified from gopher-lua's baselib.go
  L.SetGlobal("print", L.NewFunction(func(L *lua.LState) int {
    top := L.GetTop()
    for i := 1; i <= top; i++ {
      stdout.WriteString(fmt.Sprint(L.ToStringMeta(L.Get(i)).String()))
      if i != top {
        stdout.WriteString(fmt.Sprint("\t"))
      }
    }
    stdout.WriteString(fmt.Sprintln(""))
    return 0
  }))

  if err := L.DoString(ctx.JoinedArgs()); err != nil {
    ctx.CodeBlock("lua", "%s", err)
    return
  }
  lv := L.Get(-1)
  ctx.CodeBlock("lua", "%s%s", stdout.String(), lv.String())
}
