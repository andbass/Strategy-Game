
def up(coord, amount=1):
    return [coord[0], coord[1] - amount]

def down(coord, amount=1):
    return [coord[0], coord[1] + amount]

def left(coord, amount=1):
    return [coord[0] - amount, coord[1]]

def right(coord, amount=1):
    return [coord[0] + amount, coord[1]]

