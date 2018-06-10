import discord
from discord.ext import commands
import random

class Fun:
    """Some fun commands."""
    def __init__(self, bot):
        self.bot = bot
    
    @commands.command(aliases=["8ball"])
    async def eightball(self, ctx, *, question: str):
        """Ask the magic 8ball anything."""
        responses = [
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
          "Very doubtful"
        ]
        await ctx.send(f"**Question**```{question}```\n**8ball**```{random.choice(responses)}```")

def setup(bot):
    bot.add_cog(Fun(bot))