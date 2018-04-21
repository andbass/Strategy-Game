
import attr
import enum

import vec

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
    moveable_tiles = attr.ib(default=attr.Factory(set))

    def move_to(self, pos, state):
        pass

    def attack(self, target, state):
        pass

    def update_moveable_tiles(self, state):
        self.moveable_tiles.clear()

        def can_add(pos, moves):
            if not state.is_open(pos):
                return False

            return moves - state.get_tile(pos).cost >= 0

        def add(pos, moves):
            if can_add(pos, moves):
                self.moveable_tiles.add(tuple(pos))
                flood_fill(pos, moves - state.get_tile(pos).cost)

        def flood_fill(pos, moves):
            add(vec.up(pos), moves)
            add(vec.left(pos), moves)
            add(vec.right(pos), moves)
            add(vec.down(pos), moves)
            
        flood_fill(self.pos, self.moves)

    def can_move_to(self, pos):
        return tuple(pos) in self.moveable_tiles

    def json(self):
        return dict(
            type = self.type.value,
            team = self.team.value,

            max_hp = self.max_hp,
            range = self.range,
            strength = self.strength,
            moves = self.moves,

            hp = self.hp,

            has_moved = self.has_moved,
            has_attacked = self.has_attacked,

            pos = self.pos,
            moveable_tiles = list(moveable_tiles),
        )

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
