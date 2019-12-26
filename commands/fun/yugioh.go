package fun

import (
  "github.com/sapphire-cord/sapphire"
  "net/http"
  "net/url"
  "io/ioutil"
  "encoding/json"
)

// Get information about a Yu-Gi-Oh! card.
// Usage: <name:string...>
// Aliases: ygo, yugi
func Yugioh(ctx *sapphire.CommandContext) {
  params := url.Values{}
  params.Add("name", ctx.JoinedArgs())
  req, _ := http.NewRequest("GET", "https://db.ygoprodeck.com/api/v5/cardinfo.php?" + params.Encode(), nil)
  res, err := http.DefaultClient.Do(req)
  if err != nil {
    ctx.Error(err)
    return
  }
  defer res.Body.Close()
  if res.StatusCode != 200 {
    ctx.Reply("No card found with that name. Please make sure you enter the exact card name.")
  }
  var data []struct {
    Name string `json:"name"`
    Images []struct {
      URL string `json:"image_url"`
    } `json:"card_images"`
  }
  buf, err := ioutil.ReadAll(res.Body)
  if err != nil {
    ctx.Error(err)
    return
  }
  err = json.Unmarshal(buf, &data)
  if err != nil {
    ctx.Error(err)
    return
  }

  if len(data) == 0 {
    ctx.Reply("No card found with that name. Please make sure you enter the exact card name.")
    return
  }
  ctx.BuildEmbed(sapphire.NewEmbed().
    SetTitle(data[0].Name).
    SetImage(data[0].Images[0].URL).
    SetColor(0xDFAC7C))
}
