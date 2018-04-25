
var Sio;

var ActiveTeam;
var PlayerTeam;

var Modes = {
    NORMAL: 0,
    MOVING: 1,
    ATTACKING: 2,
}
var Mode = Modes.NORMAL;

var SelectedUnit = null;

var Teams = {
    RED: 0,
    BLUE: 1,
};

var UnitTypes = {
    SOLDIER: 0,
    ARCHER: 1,
}

var TileTypes = {
    GRASS: 0,
    DIRT: 1,
    FOREST: 2,
    MOUNTAIN: 3,
    WALL:  4,
    WATER: 5,
}

var MoveTypes = {
    CHANGE_POS: 0,
    ATTACK: 1,
}

var StatsFontSize = 12;
var TileSize = 32;

var TileColors = {
    [TileTypes.GRASS]: "#0f0",
    [TileTypes.DIRT]: "#000",
    [TileTypes.FOREST]: "#050",
    [TileTypes.MOUNTAIN]: "#cc0",
    [TileTypes.WATER]: "#00f",
};

// Will be set by `loadImages`
var UnitImages = {
    [UnitTypes.SOLDIER]: {
        DONE: null,
        CAN_BOTH: null,
        CAN_MOVE: null,
        CAN_ATTACK: null,
    },

    [UnitTypes.ARCHER]: {
        DONE: null,
        CAN_BOTH: null,
        CAN_MOVE: null,
        CAN_ATTACK: null,
    }
}

var TeamColors = {
    [Teams.RED]: [255, 0, 0],
    [Teams.BLUE]: [0, 0, 255],
}
