import os

def channel_count(bot):
    res = []
    for guild in bot.guilds:
        for channel in guild.channels:
            res.append(channel)
    return len(res)
   
def capitialize(msg: str):
    res = []
    snakes = msg.split("_")
    for x in snakes:
        res.append(x.title())
    return " ".join(res)