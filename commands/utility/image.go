package utility

import (
  "net/http"
  "net/url"
  "github.com/PuerkitoBio/goquery"
  "fmt"
  "strings"
  "github.com/pollen5/taiga/utils"
  "github.com/sapphire-cord/sapphire"
  "strconv"
)

// Get an image from Bing.
// Usage: <query:string...>
// Aliases: imgsearch, imagesearch, searchimage, searchimg, img
// Cooldown: 5
func Image(ctx *sapphire.CommandContext) {
  type Image struct {
    URL string
    Width string
    Height string
    Format string
    Size string
  }
  var safe string = "strict"
  if ctx.Channel.NSFW { safe = "off" }
  uri := url.Values{}
  uri.Add("q", ctx.JoinedArgs())
  uri.Add("view", "detailv2")
  uri.Add("safeSearch", safe)
  req, _ := http.NewRequest(http.MethodGet, "https://www.bing.com/images/search?" + uri.Encode(), nil)
  req.Header.Set("User-Agent", "Lynx/2.8.8rel.2 libwww-FM/2.14 SSL-MM/1.4.1 OpenSSL/1.0.2l")
  res, err := http.DefaultClient.Do(req)
  if err != nil {
    ctx.Reply("Error: %s\n", err)
    return
  }
  defer res.Body.Close()
  if res.StatusCode != 200 {
    ctx.Reply("Bing responded with non-200: %d %s", res.StatusCode, res.Status)
    return
  }
  doc, err := goquery.NewDocumentFromReader(res.Body)
  if err != nil {
    ctx.Reply("Error parsing HTML: %s", err)
    return
  }
  results := []*Image{}
  doc.Find(".item a[class=\"thumb\"]").Each(func(_ int, s *goquery.Selection) {
    details := strings.Split(s.Parent().Find(".fileInfo").Text(), " ")
    url, _ := s.Attr("href")
    results = append(results, &Image{
      URL: url,
      Width: details[0],
      Height: details[2],
      Format: details[3],
      Size: details[4],
    })
  })
  if len(results) < 1 {
    ctx.Reply("No Results Found.")
    return
  }
  flag, ok := ctx.Flags["index"]
  var index int = 0
  if ok {
    num, err := strconv.Atoi(flag)
    if err != nil {
      ctx.Reply("--index Provided but not a number.")
      return
    }
    index = num - 1
    if num > len(results) || num < 0 {
      ctx.Reply("Invalid range for --index, there is only %d entries.", len(results))
      return
    }
  } else {
    index = utils.RandNumber(len(results))
  }
  img := results[index]
  ctx.BuildEmbed(sapphire.NewEmbed().SetColor(0xDFAC7C).
    SetTitle("Image Results").
    SetImage(img.URL).
    SetFooter(fmt.Sprintf("Size: %s, Resolution: %sx%s, Format: %s",
      img.Size, img.Width, img.Height, img.Format)))
}
