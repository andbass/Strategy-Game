"""
Collections of actions
Usable by units when attacking
"""

import attr
from functools import partial

import vec

@attr.s
class Attack:
    """ Function that returns attackable tiles """
    range = attr.ib(default=range_adjacent)

    """ Base level damage of attack """
    damage = attr.ib(default=3)

    @staticmethod
    def soldier():
        return Attack()

    @staticmethod
    def archer():
        return Attack(
            range=range_projectile,
            damage=5,
        )

"""
Collection of functions usable by `Actions`
"""

def range_adjacent(unit, state):
    return [
        pos
        for pos in [
            vec.up(unit.pos),
            vec.down(unit.pos),
            vec.left(unit.pos),
            vec.right(unit.pos),
        ]
        if state.is_passable(pos)
    ]

def range_projectile(unit, state, deadzone=1, range=2):
    attackable_tiles = set()

    def can_add(pos):
        if pos in attackable_tiles:
            return False

        return deadzone < vec.dist(pos, unit.pos) <= range

    def add(pos):
        if can_add(pos, moves):
            attackable_tiles.add(tuple(pos))
            flood_fill(pos)

    def flood_fill(pos):
        add(vec.up(pos))
        add(vec.left(pos))
        add(vec.right(pos))
        add(vec.down(pos))

    return flood_fill(unit.pos)
