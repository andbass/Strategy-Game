
import attr

import tile
import unit

from db import db, Game

@attr.s
class State:
    tilemap = attr.ib()
    units = attr.ib(default=attr.Factory(list))

    @staticmethod
    def current(game_id):
        game = Game.query.get(game_id)
        return game.state

    @staticmethod
    def update(game_id, new_state):
        game = Game.query.get(game_id)
        game.state = new_state

        db.session.commit()

    @staticmethod
    def sample():
        g = tile.Types.GRASS
        w = tile.Types.WATER
        f = tile.Types.FOREST
        m = tile.Types.MOUNTAIN

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
        state = State(tilemap, units)

        return state

    def __attrs_post_init__(self):
        self.update_units()

    def width(self):
        return len(self.tilemap[0])

    def height(self):
        return len(self.tilemap)

    def next_turn(self):
        for unit in self.units:
            unit.reset(self)

    def in_bounds(self, coord):
        if coord[1] < 0 or coord[1] >= self.height():
            return False

        if coord[0] < 0 or coord[0] >= self.width():
            return False

        return True

    def is_open(self, coord):
        if not self.in_bounds(coord):
            return False

        if self.get_unit(coord) != None:
            return False

        cur_tile = self.get_tile(coord)
        return cur_tile.cost != tile.IMPASSABLE

    def is_passable(self, coord):
        if not self.in_bounds(coord):
            return False

        cur_tile = self.get_tile(coord)
        return cur_tile.cost != tile.IMPASSABLE

    def get_tile(self, coord):
        if not self.in_bounds(coord):
            return None

        return tile.tiles[self.tilemap[coord[1]][coord[0]]]

    def get_unit(self, coord):
        if not self.in_bounds(coord):
            return None

        for unit in self.units:
            if unit.pos == coord:
                return unit

        return None

    def update_units(self):
        for unit in self.units:
            unit.update_moveable_tiles(self)
            unit.update_attackable_tiles(self)

    def json(self):
        jmap_width = len(self.tilemap[0])
        jmap_height = len(self.tilemap)

        jmap = [
            [tile_type.value for tile_type in row]
            for row in self.tilemap
        ]

        junits = [unit.json() for unit in self.units]

        return dict(
            width = jmap_width,
            height = jmap_height,
            map = jmap,
            units = junits,
        )

    def dump(self, moveable_tiles_for=None):
        tile_glyphs = {
            tile.Types.GRASS : '.',
            tile.Types.DIRT : '=',
            tile.Types.FOREST : '%',
            tile.Types.MOUNTAIN : '^',
            tile.Types.WATER : '~',
            tile.Types.WALL : '#',
        }

        unit_glyphs = {
            unit.Team.BLUE : {
                unit.Types.SOLDIER : 'X',
                unit.Types.ARCHER : 'x',
            },

            unit.Team.RED : {
                unit.Types.SOLDIER : 'O',
                unit.Types.ARCHER : 'o',
            },
        }

        print("MAP:")

        for row in self.tilemap:
            row_str = "".join([tile_glyphs[elem] for elem in row])
            print(row_str)

        print("\nWITH UNITS")

        cur_pos = [0, 0]
        for row in self.tilemap:
            row_str = "".join([tile_glyphs[elem] for elem in row])
            for x in range(self.width()):
                cur_pos[0] = x
                cur_unit = self.get_unit(cur_pos)

                if cur_unit is None:
                    continue

                row_str = (row_str[:x] +
                           unit_glyphs[cur_unit.team][cur_unit.type] +
                           row_str[x + 1:])

            cur_pos[0] = 0
            cur_pos[1] += 1

            print(row_str)

        if moveable_tiles_for is None:
            return

        target = moveable_tiles_for
        print("\nMOVABLE TILES FROM {}".format(target.pos))

        cur_pos = [0, 0]

        for row in self.tilemap:
            row_str = "".join([tile_glyphs[elem] for elem in row])
            for x in range(self.width()):
                cur_pos[0] = x
                cur_unit = self.get_unit(cur_pos)

                if cur_unit is not None:
                    row_str = (row_str[:x] + 
                               unit_glyphs[cur_unit.team][cur_unit.type] + 
                               row_str[x + 1:])

                if target.can_move_to(cur_pos):
                    row_str = (row_str[:x] + "M" + row_str[x + 1:])

            cur_pos[0] = 0
            cur_pos[1] += 1

            print(row_str)
