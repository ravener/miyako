import discord
from discord.ext import commands
import asyncio

class Context(commands.Context):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    async def prompt(self, msg: str, timeout=20, yesorno=False):
        check = lambda x: x.author.id == self.author.id
        try:
            await self.send(msg)
            message = await self.bot.wait_for("message", check=check, timeout=timeout)
            if yesorno:
                if message.content.lower() in ("yes", "y"):
                    return True
                else:
                    return False
            return message.content
        except asyncio.TimeoutError:
            await self.send("Took too long.")
            if yesorno:
                return False
            return ""

    async def reply(self, msg: str):
        return await self.send(f"{self.author.mention}, {msg}")