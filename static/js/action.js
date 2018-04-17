
class Action { // lawsuit
    constructor(name, desc, sub, pre, post, info, harm) {
        this.name = name;
        this.desc = desc;
        this.pre = pre;
        this.damage = function(actor, target) {
            var tmp = sub(actor, target);
            // may need to change to allow for healing and the like
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
var actionSet = [
    new Action("Attack", "basic attack",
        function(actor, target) {
            return actor.str - target.def;
        },
        null, null, null, true),

    new Action("Double Strike", "deal reduced damage twice",
        function(actor, target) {
            var damage = Math.floor(actor.str * 3/4 - target.def);
            if (damage < 1)
                damage = 1;
            return 2 * damage;
        }, 
        null, null, null, true),

    new Action("Power Strike", "deal extra damage",
        function(actor, target) {
            return (actor.str * 5/4 - target.def);
        }, 
        null, null, null, true),

    new Action("Poke", "deal 1 damage",
        function(actor, target) {
            return 1;
        }, 
        null, null, null, true),

    new Action("Heal", "Heal target", 
        function(actor, target) {
            // actor doesn't have a wisdom stat atm
            return -10;
        }, 
        null, null, null, false),

    new Action("Group Heal", "Heal all allies around you, but target slightly more", 
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
        false)
    ];
