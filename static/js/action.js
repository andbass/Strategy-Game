
class Action { // lawsuit
    constructor(name, sub, pre, post, harm) {
        this.name = name;
        this.pre = pre;
        this.damage = function(actor, target) {
            var tmp = sub(actor, target);
            // may need to change to allow for healing and the like
            if (harm && tmp < 1)
                tmp = 1;
            return Math.floor(tmp);
        };
        this.post = post;
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
    new Action("Attack", function(actor, target) {
            return actor.str - target.def;
        }, null, null, true),
    new Action("Double Strike", function(actor, target) {
            var damage = Math.floor(actor.str * 3/4 - target.def);
            if (damage < 1)
                damage = 1;
            return 2 * damage;
        }, null, null, true),
    new Action("Power Strike", function(actor, target) {
            return (actor.str * 5/4 - target.def);
        }, null, null, true),
    new Action("Poke", function(actor, target) {
            return 1;
        }, null, null, true),
    new Action("Heal", function(actor, target) {
            return -10;
        }, null, null, false)
    ]
