package developer

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/dustin/go-humanize"
  "strings"
  "net/http"
  "io/ioutil"
  "encoding/json"
  "fmt"
)

// View a GitHub repository details.
// cooldown: 3
// aliases: gh
// usage: <repo:string>
func Github(ctx *sapphire.CommandContext) {
  repo := strings.Split(ctx.Arg(0).AsString(), "/")

  if len(repo) < 2 {
    ctx.Reply("Invalid repository. it must be in the format `username/repository`")
    return
  }

  res, err := http.Get("https://api.github.com/repos/" + repo[0] + "/" + repo[1])

  if err != nil {
    ctx.Error(err)
    return
  }

  defer res.Body.Close()

  if res.StatusCode != 200 {
    ctx.Reply("Could not fetch that repository, are you sure it exists?")
    return
  }

  buf, err := ioutil.ReadAll(res.Body)

  if err != nil {
    ctx.Error(err)
    return
  }

  var data struct {
    Name string `json:"full_name"`
    Language string `json:"language"`
    URL string `json:"html_url"`
    Description string `json:"description"`
    Size int `json:"size"`
    Watchers int `json:"subscribers_count"`
    Forks int `json:"forks_count"`
    Stargazers int `json:"stargazers_count"`
    OpenIssues int `json:"open_issues"`
    Owner struct {
      AvatarURL string `json:"avatar_url"`
    } `json:"owner"`
    License struct {
      Name string `json:"name"`
      URL string `json:"url"`
    } `json:"license"`
    Fork bool `json:"fork"`
    Archived bool `json:"archived"`
    Parent struct {
      Name string `json:"full_nane"`
      URL string `json:"html_url"`
    } `json:"parent"`
  }

  err = json.Unmarshal(buf, &data)

  if err != nil {
    ctx.Error(err)
    return
  }

  license := "None"
  if data.License.Name != "" {
    if data.License.URL != "" {
      license = fmt.Sprintf("[%s](%s)", data.License.Name, data.License.URL)
    } else {
      license = data.License.Name
    }
  }

  description := "No Description"

  if data.Description != "" {
    description = data.Description
  }

  footer := make([]string, 0)

  if data.Fork {
    footer = append(footer, fmt.Sprintf("❯ **Forked** from [%s](%s)", data.Parent.Name, data.Parent.URL))
  }

  if data.Archived {
    footer = append(footer, "❯ This repository is **Archived**")
  }

  footerText := ""

  if len(footer) > 0 {
    footerText = strings.Join(footer, "\n")
  }

  ctx.BuildEmbed(sapphire.NewEmbed().
    SetColor(0xDFAC7C).
    SetTitle(data.Name).
    SetAuthor("GitHub", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png").
    SetURL(data.URL).
    SetThumbnail(data.Owner.AvatarURL).
    SetDescription(fmt.Sprintf("%s\n\n❯ **Language:** %s\n❯ **Forks:** %s\n❯ **License:** %s\n❯ **Open Issues:** %s\n❯ **Watchers:** %s\n❯ **Stars:** %s\n❯ **Clone Size:** %s\n%s",
      description,
      data.Language,
      humanize.Comma(int64(data.Forks)),
      license,
      humanize.Comma(int64(data.OpenIssues)),
      humanize.Comma(int64(data.Watchers)),
      humanize.Comma(int64(data.Stargazers)),
      humanize.Bytes(uint64(data.Size * 1024)),
      footerText,
    )))
}
