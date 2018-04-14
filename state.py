
import attr

@attr.s
class State:
    tilemap = attr.ib()
    units = attr.ib(default=attr.Factory(list))
