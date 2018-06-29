from functools import partial

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
    
# This is taken from https://github.com/Rapptz/RoboDanny/blob/rewrite/cogs/utils/paginator.py#L303
# which is just a slightly modified version of the library
# one, the reason being it looks ugly when aliases are
# shown, like [name|aliase] <arg>, i prefer the normal
# name being shown and extra aliases in an extended help.
def _command_signature(cmd):
    # this is modified from discord.py source

    result = [cmd.qualified_name]
    if cmd.usage:
        result.append(cmd.usage)
        return ' '.join(result)

    params = cmd.clean_params
    if not params:
        return ' '.join(result)

    for name, param in params.items():
        if param.default is not param.empty:
            # We don't want None or '' to trigger the [name=value] case and instead it should
            # do [name] since [name=None] or [name=] are not exactly useful for the user.
            should_print = param.default if isinstance(param.default, str) else param.default is not None
            if should_print:
                result.append(f'[{name}={param.default!r}]')
            else:
                result.append(f'[{name}]')
        elif param.kind == param.VAR_POSITIONAL:
            result.append(f'[{name}...]')
        else:
            result.append(f'<{name}>')

    return ' '.join(result)

async def run_async(loop, func, *args, **kwargs):
    use_kwargs = False
    try:
        use_kwargs = kwargs.pop("kwargs")
    except KeyError:
        pass
    if use_kwargs:
        func = partial(func, *args, **kwargs)
    return await loop.run_in_executor(None, func, *args)