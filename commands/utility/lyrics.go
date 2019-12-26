package utility

import (
  "net/http"
  "net/url"
  "io/ioutil"
  "github.com/sapphire-cord/sapphire"
  "github.com/PuerkitoBio/goquery"
  "encoding/json"
  "github.com/pollen5/taiga/utils"
  "strings"
)

// Search song lyrics
// Usage: <query:string...>
// Cooldown: 5
func Lyrics(ctx *sapphire.CommandContext) {
  query := url.Values{}
  query.Set("q", ctx.JoinedArgs())
  req, _ := http.NewRequest("GET", "https://api.genius.com/search?" + query.Encode(), nil)
  req.Header.Set("Authorization", "Bearer " + utils.GetConfig("genius"))
  res, err := http.DefaultClient.Do(req)
  if err != nil {
    ctx.Error(err)
    return
  }
  defer res.Body.Close()
  if res.StatusCode != 200 {
    ctx.Error("Non-200 status from genius: %d", res.Status)
    return
  }
  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    ctx.Error(err)
    return
  }
  var data struct {
    Response struct {
      Hits []struct {
        Result struct {
          URL string `json:"url"`
          Image string `json:"song_art_image_thumbnail_url"`
          Title string `json:"full_title"`
        } `json:"result"`
      } `json:"hits"`
    } `json:"response"`
  }
  err = json.Unmarshal(body, &data)
  if err != nil {
    ctx.Error(err)
    return
  }
  if len(data.Response.Hits) < 1 {
    ctx.Reply("No Results Found.")
    return
  }
  lr, err := http.Get(data.Response.Hits[0].Result.URL)
  if err != nil {
    ctx.Error(err)
    return
  }
  defer lr.Body.Close()
  if lr.StatusCode != 200 {
    ctx.Error("Non-200 status code from genius: %d", lr.Status)
    return
  }
  doc, err := goquery.NewDocumentFromReader(lr.Body)
  if err != nil {
    ctx.Error(err)
    return
  }
  lyrics := strings.Trim(doc.Find("div.lyrics").First().Text(), " ")
  if len(lyrics) > 2048 {
    lyrics = lyrics[:2048]
  }
  ctx.BuildEmbed(sapphire.NewEmbed().
    SetTitle(data.Response.Hits[0].Result.Title).
    SetDescription(lyrics).
    SetURL(data.Response.Hits[0].Result.URL).
    SetThumbnail(data.Response.Hits[0].Result.Image).
    SetColor(0xDFAC7C).
    SetAuthor(ctx.Author.Username + "#" + ctx.Author.Discriminator, ctx.Author.AvatarURL("256")))
}
