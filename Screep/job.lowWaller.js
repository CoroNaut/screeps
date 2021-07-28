module.exports = {
    run: function(creep) {// [user, act, busy, curTask]
		creep.checkLife();
		
		
		if(creep.memory.busy==true&&creep.carry.energy==0){
			creep.memory.busy=false;
			creep.memory.curTask=0;
		}else if(creep.memory.busy==false&&creep.carry.energy==creep.carryCapacity){
			creep.memory.busy=true;
		}
		
		if(creep.memory.busy==true){//offload
			if(creep.memory.curTask==0){
				var wall=creep.room.find(FIND_MY_STRUCTURES, {
					filter: (s) => (s.structureType == STRUCTURE_RAMPART
								&&	s.hits<8000)
				});
				if(wall.length==0){
					wall=creep.room.find(FIND_STRUCTURES, {
					filter: (s) => (s.structureType == STRUCTURE_WALL
								&&	s.hits<s.hitsMax)
					});
				}
				if(wall.length==0){
					wall=creep.room.find(FIND_MY_STRUCTURES, {
					filter: (s) => (s.structureType == STRUCTURE_RAMPART
								&&	s.hits<s.hitsMax)
					});
				}
				var lowestWallHits;
				var lowestWall;
				if(wall!=null){
					lowestWallHits=300000000;
					for(var x=0; x<wall.length; x++){
						if(wall[x].hits<lowestWallHits){
							lowestWallHits=wall[x].hits;
							lowestWall=x;
						}
					}
					creep.memory.curTask=wall[lowestWall].id;
				}
			}else{
				var task=Game.getObjectById(creep.memory.curTask);
				if(creep.repair(task) == ERR_NOT_IN_RANGE){
					creep.moveTo(task);
				}
			}
		}else{//load
			var energy=creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION
							 || s.structureType == STRUCTURE_CONTAINER)
							 && creep.room.energyAvailable>=250
							 && s.energy>1
            });
			if(creep.withdraw(energy, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
				creep.moveTo(energy);
			}
		}
	}
}