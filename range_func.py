
"""
Collection of functions usable by `Actions`
"""

import vec

def adjacent(unit, state):
    return [
        vec.up(unit.pos),
        vec.down(unit.pos),
        vec.left(unit.pos),
        vec.right(unit.pos),
    ]

def projectile(unit, state, deadzone=1, range=2):
    attackable_tiles = set()

    def can_add(pos):
        if tuple(pos) in attackable_tiles:
            return False

        return deadzone < vec.dist(pos, unit.pos) <= range

    def add(pos):
        if can_add(pos):
            attackable_tiles.add(tuple(pos))
            flood_fill(pos)

    def flood_fill(pos):
        add(vec.up(pos))
        add(vec.left(pos))
        add(vec.right(pos))
        add(vec.down(pos))

    flood_fill(unit.pos)
    return attackable_tiles
