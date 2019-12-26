package utility

import (
  "github.com/sapphire-cord/sapphire"
  "net/http"
  "net/url"
  "io/ioutil"
  "encoding/json"
)

// Finds a Wikipedia Article by title.
// Usage: <article:string...>
// Aliases: wiki
func Wikipedia(ctx *sapphire.CommandContext) {
  res, err := http.Get("https://en.wikipedia.org/api/rest_v1/page/summary/" + url.PathEscape(ctx.JoinedArgs()))

  if err != nil {
    ctx.Error(err)
    return
  }

  defer res.Body.Close()

  if res.StatusCode != 200 {
    ctx.Reply("I couldn't find a wikipedia article with that title!")
    return
  }

  buf, err := ioutil.ReadAll(res.Body)

  if err != nil {
    ctx.Error(err)
    return
  }

  var data struct {
    Title string `json:"title"`
    Extract string `json:"extract"`
    ContentURLs struct {
      Desktop struct {
        Page string `json:"page"`
      } `json:"desktop"`
    } `json:"content_urls"`
  }

  err = json.Unmarshal(buf, &data)

  if err != nil {
    ctx.Error(err)
    return
  }

  if data.ContentURLs.Desktop.Page == "" {
    ctx.Reply("I couldn't find a wikipedia article with that title!")
    return
  }

  ctx.BuildEmbed(sapphire.NewEmbed().
    SetColor(0xDFAC7C).
    SetTitle(data.Title).
    SetURL(data.ContentURLs.Desktop.Page).
    SetThumbnail("https://i.imgur.com/fnhlGh5.png").
    SetDescription(data.Extract))
}
