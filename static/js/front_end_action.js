
class Action { // lawsuit
    constructor(name, desc, range, sub, pre, post, info, harm) {
        this.name = name;
        this.desc = desc;
        this.range = range;
        this.pre = pre;
        this.damage = function(actor, target) {
            var tmp = sub(actor, target);
            if (harm && tmp < 1)
                tmp = 1;
            return Math.floor(tmp);
        };
        this.post = post;
        this.info = info;
        if (this.info == null) {
            this.info = function(actor, target) {
                var tmp = this.damage(actor, target);
                if (tmp < 0) {   
                    tmp *= -1;
                    return "  Restore: " + tmp;
                } else if (tmp > 0) {
                    return "  Damage: " + tmp;
                }
            }
        }
    }
}

/*
    Action.damage should return a double
    This is done so that battle prediction can use this value to determine a basic outcome

    Action.pre occurs before the attack
    This function should contain things like preattack buffs, or just left null

    Action.post occurs after the attack
    This function should contain things like status ailments or splash damage, or just left null
*/
var adjacent = function(actor) { return [[0,1,0],[1,0,1],[0,1,0]] };
var close = function(actor) { return [[1,1,1],[1,0,1],[1,1,1]] };
var range = function(actor) {
    if (map[actor.y][actor.x] == 3) {
        return [[0,0,0,1,0,0,0],[0,0,1,1,1,0,0],[0,1,1,0,1,1,0],
        [1,1,0,0,0,1,1],[0,1,1,0,1,1,0],[0,0,1,1,1,0,0],[0,0,0,1,0,0,0]];
    }
    console.log("here");
    return [[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0]]; 
}
var auto = function(actor) { return [[0,0,0],[0,1,0],[0,0,0]]};

var actionSet = [
    new Action("Attack", "basic attack", adjacent,
        function(actor, target) {
            return actor.str - target.def;
        },
        null, null, null, true),

    new Action("Double Strike", "deal reduced damage twice", adjacent,
        function(actor, target) {
            var damage = Math.floor(actor.str * 3/4 - target.def);
            if (damage < 1)
                damage = 1;
            return 2 * damage;
        }, 
        null, null, null, true),

    new Action("Power Strike", "deal extra damage",adjacent,
        function(actor, target) {
            return (actor.str * 5/4 - target.def);
        }, 
        null, null, null, true),

    new Action("Bow", "deal damage at range", range,
        function(actor, target) {
            return (actor.str - target.def);
        }, 
        null, null, null, true),

    new Action("Heal", "Heal target", auto,
        function(actor, target) {
            // actor doesn't have a wisdom stat atm
            return -10;
        }, 
        null, null, null, false),

    new Action("Group Heal", "Heal all allies around you, but target slightly more", auto,
        function(actor, target) {
            return -2;
        }, 
        null, 
        function(actor, target) {
            for (var i = 0; i < units.length; i++) {
                var u = units[i];
                if (Math.abs(actor.y - u.y) > 1 || Math.abs(actor.x - u.x) > 1)
                    continue;
                u.hp += 5;
                if (u.hp > u.maxhp)
                    u.hp = u.maxhp;
            }
        },
        function(actor, target) {
            return "  Area Heal: " + 5;
        }, 
        false),
    new Action("Knight's Strike", "Attack with an odd range", 
            function(actor) { return [[0,1,0,1,0],[1,0,0,0,1],[0,0,0,0,0],[1,0,0,0,1],[0,1,0,1,0]]},
            function(actor, target) {
                return actor.str - target.def;
            },
            null, null, null, true),
    new Action("Rook's Strike", "Attack and approach along an axis",
            function(actor) {
                var tmp = new Array(9);
                var c = Math.floor(tmp.length/2);
                for (var i = 0; i < tmp.length; i++) {
                    tmp[i] = [0,0,0,0,0,0,0,0,0];
                }
                if (!actor.canMove)
                    return tmp;
                var xShift = actor.x - c;
                var yShift = actor.y - c;
                for (var x = c; x >= 0; x--) {
                    if (xShift + x < 0)
                        break;
                    if (map[yShift + c][xShift + x] == 2 || map[yShift + c][xShift + x] == 0)
                        break;
                    tmp[c][x] = 1;
                }
                for (var x = c; x < tmp.length; x++) {
                    if (xShift + x >= map[0].length)
                        break;
                    if (map[yShift + c][xShift + x] == 2 || map[yShift + c][xShift + x] == 0)
                        break;
                    tmp[c][x] = 1;
                }
                for (var y = c; y >= 0; y--) {
                    if (yShift + y < 0)
                        break;
                    if (map[yShift + y][xShift + c] == 2 || map[yShift + y][xShift + c] == 0)
                        break;
                    tmp[y][c] = 1;
                }
                for (var y = c; y < tmp.length; y++) {
                    if (yShift + y >= map.length)
                        break;
                    if (map[yShift + y][xShift + c] == 2 || map[yShift + y][xShift + c] == 0)
                        break;
                    tmp[y][c] = 1;
                }
                tmp[c][c] = 0;
                return tmp;
            }, 
            function(actor, target) {
                return actor.str - target.def;
            },
            function(actor, target) {
                if (actor.x < target.x)
                    actor.x = target.x - 1;
                else if (actor.x > target.x)
                    actor.x = target.x + 1;
                if (actor.y < target.y)
                    actor.y = target.y - 1;
                else if (actor.y > target.y)
                    actor.y = target.y + 1;
                actor.canMove = 0;
            }, null, null, true),
    new Action("Bishop's Strike", "Attack and approach along a diagonal",
            function(actor) {
                var tmp = new Array(9);
                var c = Math.floor(tmp.length/2);
                for (var i = 0; i < tmp.length; i++) {
                    tmp[i] = [0,0,0,0,0,0,0,0,0];
                }
                if (!actor.canMove)
                    return tmp;
                var xShift = actor.x - c;
                var yShift = actor.y - c;
                for (var i = c; i >= 0; i--) {
                    if (xShift + i < 0 || yShift + i < 0)
                        break;
                    if (map[yShift + i][xShift + i] == 2 || map[yShift + i][xShift + i] == 0)
                        break;
                    tmp[i][i] = 1;
                }
                for (var i = c; i < tmp.length; i++) {
                    if (xShift + i > map[0].length || yShift + i > map.length)
                        break;
                    if (map[yShift + i][xShift + i] == 2 || map[yShift + i][xShift + i] == 0)
                        break;
                    tmp[i][i] = 1;
                }
                for (var i = 0; i <= c; i++) {
                    if (actor.x + i > map[0].length || actor.y - i < 0)
                        break;
                    if (map[actor.y - i][actor.x + i] == 2 || map[actor.y - i][actor.x + i] == 0)
                        break;
                    tmp[c-i][c+i] = 1;
                }
                for (var i = 0; i <= c; i++) {
                    if (actor.x - i < 0 || actor.y + i > map.length)
                        break;
                    if (map[actor.y + i][actor.x -i] == 2 || map[actor.y + i][actor.x - i] == 0)
                        break;
                    tmp[c+i][c-i] = 1;
                }
                tmp[c][c] = 0;
                return tmp;
            },
            function(actor, target) {
                return actor.str - target.def;
            },
            function(actor, target) {
                if (actor.x > target.x) {
                    actor.x = target.x + 1;
                    if (actor.y > target.y)
                        actor.y = target.y + 1;
                    else
                        actor.y = target.y - 1;
                } else {
                    actor.x = target.x - 1;
                    if (actor.y > target.y)
                        actor.y = target.y + 1;
                    else
                        actor.y = target.y - 1;
                }
                actor.canMove = 0;
            }, null, null, true)
    ];

