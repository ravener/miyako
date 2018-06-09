import os

def channel_count(bot):
    res = []
    for guild in bot.guilds:
        for channel in guild:
            res.append(channel)
    return len(res)
    
