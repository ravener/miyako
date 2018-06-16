

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

def paginate(text: str):
    """Simple generator that paginates text."""
    last = 0
    pages = []
    for curr in range(0, len(text)):
        if curr % 1980 == 0:
            pages.append(text[last:curr])
            last = curr
            appd_index = curr
    if appd_index != len(text) - 1:
        pages.append(text[last:curr])
    return list(filter(lambda a: a != '', pages))
