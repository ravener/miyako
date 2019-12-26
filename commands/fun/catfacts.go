package fun

import (
  "net/http"
  "encoding/json"
  "io/ioutil"
  "github.com/sapphire-cord/sapphire"
)

// Let me tell you a misterious cat fact.
// Aliases: catfact, kittenfact
// Cooldown: 3
func Catfacts(ctx *sapphire.CommandContext) {
  res, err := http.Get("https://catfact.ninja/fact")
  defer res.Body.Close()
  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }
  var data map[string]interface{}
  buf, err := ioutil.ReadAll(res.Body)
  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }
  err = json.Unmarshal(buf, &data)
  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }
  ctx.Reply("📢 **Catfact:** *%s*", data["fact"])
}
