package canvas

import (
  "github.com/sapphire-cord/sapphire"
  "encoding/hex"
  "bytes"
  "image"
  "image/color"
  "image/png"
  "image/draw"
  "strings"
)

// View a color by hex.
// Usage: <hex:string>
// Aliases: colour
// cooldown: 3
func Color(ctx *sapphire.CommandContext) {
  co := strings.TrimPrefix(ctx.Arg(0).AsString(), "#")
  if len(co) != 6 {
    ctx.Reply("Invalid Color, hex must be 6 digits.")
    return
  }
  hx, err := hex.DecodeString(co)
  if err != nil {
    ctx.Reply("Invalid Color Hex.")
    return
  }
  col := color.RGBA{hx[0], hx[1], hx[2], 255}
  img := image.NewRGBA(image.Rect(0, 0, 500, 500))
  draw.Draw(img, img.Bounds(), &image.Uniform{col}, image.ZP, draw.Src)
  b := &bytes.Buffer{}
  png.Encode(b, img)
  ctx.SendFile("color.png", b)
}
