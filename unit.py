
import attr
import enum

import vec

import attack

@attr.s
class Unit:
    type = attr.ib()
    team = attr.ib()

    max_hp = attr.ib(default=10)
    moves = attr.ib(default=4)
    attack = attr.ib(default=attr.Factory(attack.Attack))

    hp = attr.ib(default=attr.Factory(lambda self: self.max_hp, takes_self=True))

    has_moved = attr.ib(default=False)
    has_attacked = attr.ib(default=False)

    pos = attr.ib(default=attr.Factory(lambda: [0, 0]))

    moveable_tiles = attr.ib(default=attr.Factory(set))
    attackable_tiles = attr.ib(default=attr.Factory(set))

    def move_to(self, pos, state):
        if self.has_moved:
            return False

        if state.is_open(pos) and tuple(pos) in self.moveable_tiles:
            self.pos = pos
            self.has_moved = True

            state.update_units()
            return True

        return False

    def attack_unit(self, target_idx, state):
        target = state.units[target_idx]

        if self.has_attacked:
            return False

        if tuple(target.pos) in self.attackable_tiles:
            tile = state.get_tile(target.pos)

            damage_amount = self.attack.damage
            damage_amount /= tile.defense_bonus

            target.damage(damage_amount)

            if target.hp == 0:
                del state.units[target_idx]

            self.has_attacked = True
            return True

        return False

    def damage(self, amount):
        self.hp -= int(amount)
        self.hp = max(self.hp, 0)

    def reset(self, state):
        self.has_moved = False
        self.has_attacked = False

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

    def update_attackable_tiles(self, state):
        self.attackable_tiles = set(tuple(pos)
                                    for pos in self.attack.range(self, state))

    def can_move_to(self, pos):
        return tuple(pos) in self.moveable_tiles

    def json(self):
        return dict(
            type = self.type.value,
            team = self.team.value,

            max_hp = self.max_hp,
            damage = self.attack.damage,
            moves = self.moves,

            hp = self.hp,

            has_moved = self.has_moved,
            has_attacked = self.has_attacked,

            pos = self.pos,

            moveable_tiles = list(list(pos) for pos in self.moveable_tiles),
            attackable_tiles = list(list(pos) for pos in self.attackable_tiles),
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

        attack = attack.archer(),

        pos = pos,
    )
