
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

    has_moved = attr.ib(default=False)
    has_attacked = attr.ib(default=False)

    pos = attr.ib(default=attr.Factory(lambda: [0, 0]))

    def move_to(self, pos):
        pass

    def attack(self, target):

        pass

class Types(enum.Enum):
    SOLDIER = 0
    ARCHER = 1

class Team(enum.Enum):
    RED = 0
    BLUE = 1

def soldier(team, pos):
    return Unit(
        type = Types.SOLDIER,
        team = team,

        pos = pos,
    )

def archer(team, pos):
    return Unit(
        type = Types.ARCHER,
        team = team,

        range = 3,

        pos = pos,
    )
