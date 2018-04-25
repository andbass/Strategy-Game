
import attr
import enum

@attr.s
class Tile:
    type = attr.ib()
    cost = attr.ib(default=1)

    range_bonus = attr.ib(default=0)
    defense_bonus = attr.ib(default=1)

    def is_passable(self):
        return self.cost >= 0

class Types(enum.Enum):
    GRASS = 0
    DIRT = 1
    FOREST = 2
    MOUNTAIN = 3
    WALL = 4
    WATER = 5

IMPASSABLE = -1

def grass():
    return Tile(
        type = Types.GRASS,
        cost = 1,

        range_bonus = 0,
        defense_bonus = 1,
    )

def forest():
    return Tile(
        type = Types.FOREST,
        cost = 2,

        range_bonus = 0,
        defense_bonus = 1.15,
    )

def mountain():
    return Tile(
        type = Types.MOUNTAIN,
        cost = 4,

        range_bonus = 2,
        defense_bonus = 1.4,
    )

def wall():
    return Tile(
        type = Types.WALL,
        cost = IMPASSABLE,
    )

def water():
    return Tile(
        type = Types.WATER,
        cost = IMPASSABLE,
    )

tiles = {
    Types.GRASS : grass(),
    Types.FOREST : forest(),
    Types.MOUNTAIN : mountain(),
    Types.WATER: water(),
}
