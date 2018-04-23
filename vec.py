
import math

"""
Basic operations
"""

def plus(coord1, coord2):
    return [coord1[0] + coord2[0], coord1[1] + coord2[1]]

def minus(coord1, coord2):
    return plus(coord1, neg(coord2))

def scale(coord, factor):
    return [coord[0] * factor, coord[1] * factor]

def neg(coord):
    return [-coord[0], -coord[1]]

def dot(coord1, coord2):
    return coord1[0] * coord2[0] + coord1[1] * coord2[1]

def dist(coord1, coord2):
    return math.sqrt(dot(coord1, coord2))

"""
Utility functions to get directions
"""

def up(coord, amount=1):
    return [coord[0], coord[1] - amount]

def down(coord, amount=1):
    return [coord[0], coord[1] + amount]

def left(coord, amount=1):
    return [coord[0] - amount, coord[1]]

def right(coord, amount=1):
    return [coord[0] + amount, coord[1]]

