
import tile
import unit

from state import State

g = tile.Types.GRASS
w = tile.Types.WATER
f = tile.Types.FOREST
m = tile.Types.MOUNTAIN

def make_basic():
    tilemap = [
        [m, g, g, g, g, g, g, g, g, g],
        [g, g, g, g, g, g, g, w, g, g],
        [g, g, g, w, g, g, g, w, f, g],
        [m, g, g, w, g, g, g, w, f, g],
        [g, g, w, w, w, g, g, g, g, f],
        [g, g, g, w, g, g, m, g, g, g],
        [m, f, g, w, g, f, g, g, g, g],
        [g, g, g, w, f, g, m, g, g, m],
        [g, f, g, g, g, g, g, g, m, g],
        [g, g, g, g, g, g, f, m, g, g],
    ]

    units = [
        unit.soldier(unit.Team.RED, [1, 0]),
        unit.soldier(unit.Team.BLUE, [3, 0]),

        unit.archer(unit.Team.RED, [0, 7]),
        unit.archer(unit.Team.BLUE, [1, 7]),
    ]

    return State(tilemap, units)

def make_big():
    tilemap = [
        [m, m, m, m, m, m, m, m, m, m],
        [m, g, g, g, g, g, g, g, g, m],
        [m, g, f, f, g, g, f, f, g, m],
        [m, g, f, f, g, g, f, f, g, m],
        [m, g, g, g, g, g, g, g, g, m],
        [m, g, g, g, m, m, g, g, g, m],
        [m, g, g, w, w, w, w, g, g, m],
        [m, g, g, w, w, w, w, g, g, m],
        [m, g, g, g, m, m, g, g, g, m],
        [m, g, g, g, m, m, g, g, g, m],
        [m, g, g, g, f, f, g, g, g, m],
        [m, g, g, g, f, f, g, g, g, m],
        [m, g, g, g, m, m, g, g, g, m],
        [m, g, g, g, m, m, g, g, g, m],
        [m, g, g, w, w, w, w, g, g, m],
        [m, g, g, w, w, w, w, g, g, m],
        [m, g, g, g, m, m, g, g, g, m],
        [m, g, f, f, g, g, f, f, g, m],
        [m, g, f, f, g, g, f, f, g, m],
        [m, m, m, m, m, m, m, m, m, m],
    ]

    units = [
        unit.soldier(unit.Team.RED, [1, 4]),
        unit.soldier(unit.Team.RED, [1, 10]),
        unit.soldier(unit.Team.RED, [1, 8]),
        unit.archer(unit.Team.RED, [1, 9]),

        unit.soldier(unit.Team.BLUE, [8, 4]),
        unit.soldier(unit.Team.BLUE, [8, 10]),
        unit.soldier(unit.Team.BLUE, [8, 8]),
        unit.archer(unit.Team.BLUE, [8, 9]),
    ]

    return State(tilemap, units)

collection = {
    "basic": make_basic(),
    "big": make_big(),
}
