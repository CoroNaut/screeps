require('prototype.spawn');

module.exports.loop = function () {
    if(Game.time%100==0){
        console.log("Cleared creep memory");
        for (let name in Memory.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }
        }
    }
    for(let x in Game.spawns){//singular room maintenance
		Game.spawns[x].runSpawner();
    }
}