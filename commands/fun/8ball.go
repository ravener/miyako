package fun

import (
  "github.com/sapphire-cord/sapphire"
  "github.com/pollen5/taiga/utils"
)

var responses = []string{
  "It is certain",
  "It is decidedly so",
  "without a doubt",
  "Yes definitely",
  "You may rely on it",
  "As I see it, Yes",
  "Most likely",
  "Outlook good",
  "Yes",
  "Signs point to yes",
  "Reply hazy try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "Concentrate and ask again",
  "Dont count on it",
  "My reply is no",
  "My sources say no",
  "Outlook not so good",
  "Very doubtful",
}

// Ask the magic 8ball a question!
// Usage: <question...>
// Aliases: 8ball
func Eightball(ctx *sapphire.CommandContext) {
  ctx.Reply(responses[utils.RandNumber(len(responses))])
}
