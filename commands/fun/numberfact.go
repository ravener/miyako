package fun

import (
  "net/http"
  "github.com/sapphire-cord/sapphire"
  "io/ioutil"
  "strconv"
)

// Get a fact about a number.
// Usage: [number:int]
// Aliases: numfact, numfacts, numbefacts
func Numberfact(ctx *sapphire.CommandContext) {
  num := "random"

  if ctx.HasArgs() {
    num = strconv.Itoa(ctx.Arg(0).AsInt())
  }

  res, err := http.Get("http://numbersapi.com/" + num)
  if err != nil {
    ctx.Reply("%s", err)
    return
  }
  defer res.Body.Close()
  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    ctx.Reply("%s", err)
    return
  }
  ctx.Reply("**%s**", string(body))
}
