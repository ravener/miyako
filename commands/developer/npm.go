package developer

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/dustin/go-humanize"
  "net/http"
  "io/ioutil"
  "encoding/json"
  "strings"
  "fmt"
  "time"
)

// Search the NPM registry for information about a package.
// Usage: <package:string>
// Aliases: npmpackage, npmpkg, nodepackagemanager
// Cooldown: 5
func NPM(ctx *sapphire.CommandContext) {
  res, err := http.Get("https://registry.npmjs.com/" + ctx.Arg(0).AsString())
  if err != nil {
    ctx.Error(err)
    return
  }

  defer res.Body.Close()

  if res.StatusCode != 200 {
    ctx.Reply("No results found.")
    return
  }

  buf, err := ioutil.ReadAll(res.Body)
  if err != nil {
    ctx.Error(err)
    return
  }

  var data struct {
    License string `json:"license"`
    Description string `json:"description"`
    Tags struct {
      Latest string `json:"string"`
    } `json:"dist-tags"`
    Versions map[string]struct {
      Dependencies map[string]interface{} `json:"dependencies"`
    } `json:"versions"`
    Maintainers []struct {
      Name string `json:"name"`
    } `json:"maintainers"`
    Author struct {
      Name string `json:"name"`
    } `json:"author"`
    Time struct {
      Modified time.Time `json:"modified"`
    } `json:"time"`
  }

  err = json.Unmarshal(buf, &data)
  if err != nil {
    ctx.Error(err)
    return
  }

  version := data.Versions[data.Tags.Latest]

  description := "No Description."

  if data.Description != "" {
    description = data.Description
  }

  author := "Unknown"

  if data.Author.Name != "" {
    author = data.Author.Name
  }

  maintainers := make([]string, 0)
  deps := make([]string, 0)

  for k, _ := range version.Dependencies {
    deps = append(deps, k)
  }

  for _, v := range data.Maintainers {
    maintainers = append(maintainers, v.Name)
  }

  if len(maintainers) > 10 {
    length := len(maintainers) - 10
    maintainers = maintainers[:10]
    maintainers = append(maintainers, fmt.Sprintf("...%d more.", length))
  }

  if len(deps) > 10 {
    length := len(deps) - 10
    deps = deps[:10]
    deps = append(deps, fmt.Sprintf("...%d more.", length))
  }

  if len(deps) == 0 {
    deps = append(deps, "None")
  }

  ctx.BuildEmbed(sapphire.NewEmbed().
    SetTitle("NPM - " + ctx.Arg(0).AsString()).
    SetColor(0xDFAC7C).
    SetURL("https://npmjs.com/package/" + ctx.Arg(0).AsString()).
    SetAuthor(ctx.Author.Username, ctx.Author.AvatarURL("256")).
    SetDescription(fmt.Sprintf("%s\n\n❯ **Version:** %s\n❯ **License:** %s\n❯ **Author:** %s\n❯ **Modified:** %s\n❯ **Dependencies:** %s\n❯ **Maintainers:** %s",
      description,
      data.Tags.Latest,
      data.License,
      author,
      humanize.Time(data.Time.Modified),
      strings.Join(deps, ", "),
      strings.Join(maintainers, ", "),
  )))
}
