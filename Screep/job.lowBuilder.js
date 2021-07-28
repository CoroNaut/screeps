module.exports = {
    run: function(creep) {// [user, act, busy]
		//This builder creates extensions, then containers, then any site.
		creep.checkLife();
		
		
		if(creep.memory.busy==true&&creep.carry.energy==0){
			creep.memory.busy=false;
		}else if(creep.memory.busy==false&&creep.carry.energy==creep.carryCapacity){
			creep.memory.busy=true;
		}
		
		if(creep.memory.busy==true){//offload
			var site=creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
				filter: (s) => (s.structureType == STRUCTURE_EXTENSION)
				});
			if(site=null){
				site=creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
				filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
				});
			}else if(site==null){
				site=creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
			}
			if(site!=null&&creep.build(site) == ERR_NOT_IN_RANGE){
				creep.moveTo(site);
			}
			if(site==null){
				if(site==null){
					site=creep.pos.findClosestByPath(FIND_STRUCTURES, {
					filter: (s) => s.hits < s.hitsMax
								&& s.structureType != STRUCTURE_WALL
								&& s.structureType != STRUCTURE_RAMPART
					});
				}
				
				if(site!=null&&creep.repair(site) == ERR_NOT_IN_RANGE){
					creep.moveTo(site);
				}
			}

		}else{//load
			var energy=creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION)
							 && creep.room.energyAvailable>=250
							 && s.energy>1
            });
			if(creep.withdraw(energy, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
				creep.moveTo(energy);
			}
		}
	}
}