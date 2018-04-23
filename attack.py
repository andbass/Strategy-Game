"""
Collections of actions
Usable by units when attacking
"""

import attr
from functools import partial

import range_func

@attr.s
class Attack:
    """ Function that returns attackable tiles """
    range = attr.ib(default=range_func.adjacent)

    """ Base level damage of attack """
    damage = attr.ib(default=3)

    @staticmethod
    def soldier():
        return Attack()

    @staticmethod
    def archer():
        return Attack(
            range=range_func.projectile,
            damage=5,
        )

