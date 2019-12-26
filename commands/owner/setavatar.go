package owner

import (
  "github.com/sapphire-cord/sapphire"
  "fmt"
  "net/http"
  "io/ioutil"
  "encoding/base64"
)

// Sets the bot's avatar.
// Usage: <avatar:string>
// Aliases: setav, changeavatar, changeav
func OwnerSetAvatar(ctx *sapphire.CommandContext) {
  res, err := http.Get(ctx.Arg(0).AsString())

  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }

  defer res.Body.Close()

  if res.StatusCode != 200 {
    ctx.Reply("URL returned non-200 response: %d (%s)", res.StatusCode, res.Status)
  }

  buf, err := ioutil.ReadAll(res.Body);

  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }

  contentType := http.DetectContentType(buf)
  base64img := base64.StdEncoding.EncodeToString(buf)

  _, err = ctx.Session.UserUpdate("", "", "", fmt.Sprintf("data:%s;base64,%s", contentType, base64img), "")

  if err != nil {
    ctx.Reply("Error: %s", err)
    return
  }

  ctx.Reply("Done! Changed my avatar.")
}
