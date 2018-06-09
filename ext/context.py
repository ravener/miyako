import discord
from discord.ext import commands

class Context(commands.Context):
    def __init__(*args, **kwargs):
        super().__init__(*args, **kwargs)
    
    # TODO