
import attr
import enum

@attr.s
class Unit:
    type = attr.ib()
    team = attr.ib()

    max_hp = attr.ib(default=10)
    moves = attr.ib(default=4)
    strength = attr.ib(default=4)
    range = attr.ib(default=1)

    hp = attr.ib(default=attr.Factory(lambda self: self.max_hp, takes_self=True))
    has_acted = attr.ib(default=False)

    pos = attr.ib(default=attr.Factory(lambda: [0, 0]))

class Types(enum.Enum):
    SOLDIER = 0
    ARCHER = 1

def soldier(team):
    return Unit(
        type = Types.SOLDIER,
        team = team,
    )

def archer(team):
    return Unit(
        type = Types.ARCHER,
        team = team,

        range = 3,
    )
