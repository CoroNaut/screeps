
require('prototype.spawn');
var jobInitHarvester = require('job.initHarvester');
var jobInitBuilder = require('job.initBuilder');
var jobInitUpgrader = require('job.initUpgrader');
var jobLowBuilder = require('job.lowBuilder');
var jobLowWaller = require('job.lowWaller');

var listOfActs = ['initHarvester', 'initBuilder', 'initUpgrader', 'lowBuilder', 'lowWaller'];

module.exports.loop = function () {
	for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }
	
	for(let c in Game.creeps){//move all creeps
		var creep=Game.creeps[c];
		if(creep.memory.act==0){
			jobInitHarvester.run(creep);
		}else if(creep.memory.act==1){
			jobInitBuilder.run(creep);
		}else if(creep.memory.act==2){
			jobInitUpgrader.run(creep);
		}else if(creep.memory.act==3){
			jobLowBuilder.run(creep);
		}else if(creep.memory.act==4){
			jobLowWaller.run(creep);
		}
	}
	
	
	for(let x in Game.spawns){//singular room maintenance
		var spawn=Game.spawns[x];
		if(spawn.memory.initialized==undefined){
			spawn.initializeSpawn();
		}
		if(spawn.memory.energyCollectionMode==0&&spawn.room.energyCapacityAvailable>=550){
			console.log(spawn.name+" Has upgraded in their resource collection to the beginnings of container mining");
			spawn.memory.energyCollectionMode=1;
			if(spawn.memory.curContainerTask==undefined){
				spawn.memory.curContainerTask=0;
			}
		}
		if(spawn.memory.energyCollectionMode==1&&spawn.memory.curContainerTask==0){
			spawn.memory.curContainerTask=spawn.levelOneSpawn();
		}
		
		//spawn.memory.minCreepList.minInitHarvesters=0;
		if(spawn.spawning==null){
			for(var act=0; act<listOfActs.length; act++){
				if(spawn.memory.allCreepList[act]<spawn.memory.minCreepList[act]){
					var name=spawn.createNextCreep(act, spawn.memory.allCreepList[act]+1);
					if(!(name<0)){
						if(spawn.checkCreepList()==false){
							console.log(spawn.name+" has detected a discrepency in spawning");
						}
						spawn.memory.allCreepList[act]+=1;
						console.log("Spawned new creep: \""+name+"\"\t with act: \""+listOfActs[act]+"\"\t at time: \""+Game.time+"\"");
					}
				}
				if(spawn.spawning!=null){
					break;
				}
			}
		}
		
		var towers = Game.rooms[spawn.room.name].find(FIND_STRUCTURES, {
			filter: (s) => s.structureType == STRUCTURE_TOWER
		});
		for (let tower of towers) {
			var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (target != undefined) {
				tower.attack(target);
			}
		}
	}
}