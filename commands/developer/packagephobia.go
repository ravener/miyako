package developer

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/dustin/go-humanize"
  "fmt"
  "net/http"
  "net/url"
  "io/ioutil"
  "encoding/json"
)

// Shows the install/publish size of a npm package.
// Usage: <package:string>
// Aliases: npmsize
func PackagePhobia(ctx *sapphire.CommandContext) {
  res, err := http.Get("https://packagephobia.now.sh/api.json?p=" + url.QueryEscape(ctx.Arg(0).AsString()))

  if err != nil {
    ctx.Error(err)
    return
  }

  defer res.Body.Close()

  if res.StatusCode != 200 {
    ctx.Reply("That package doesn't exist.")
    return
  }

  buf, err := ioutil.ReadAll(res.Body)

  if err != nil {
    ctx.Error(err)
    return
  }

  var data struct {
    InstallSize int `json:"installSize"`
    PublishSize int `json:"publishSize"`
  }

  err = json.Unmarshal(buf, &data)

  if err != nil {
    ctx.Error(err)
    return
  }

  if data.InstallSize == 0 || data.PublishSize == 0 {
    ctx.Reply("That package doesn't exist.")
    return
  }

  ctx.BuildEmbed(sapphire.NewEmbed().
    SetColor(0xDFAC7C).
    SetTitle("Package Phobia - " + ctx.Arg(0).AsString()).
    SetURL("https://npmjs.com/package/" + ctx.Arg(0).AsString()).
    SetDescription(fmt.Sprintf("❯ **Publish Size:** %s\n❯ **Install Size:** %s",
      humanize.Bytes(uint64(data.PublishSize)), humanize.Bytes(uint64(data.InstallSize)))))
}
