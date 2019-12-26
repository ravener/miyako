package fun

import (
  "github.com/sapphire-cord/sapphire"
  "net/http"
  "io/ioutil"
  "encoding/json"
)

// Get a random yo momma joke.
// Usage: [@user]
// Aliases: urmom
func Yomomma(ctx *sapphire.CommandContext) {
  res, err := http.Get("http://api.yomomma.info")

  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }

  body, err := ioutil.ReadAll(res.Body)

  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }

  var j struct {
    Joke string `json:"joke"`
  }

  err = json.Unmarshal(body, &j)

  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }

  if ctx.HasArgs() {
    ctx.Reply(ctx.Arg(0).AsUser().Mention() + ", " + j.Joke)
  } else {
    ctx.Reply(j.Joke)
  }
}
