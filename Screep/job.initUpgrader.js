module.exports = {
    run: function(creep) {// [user, act, busy]
		creep.checkLife();
		
		if(creep.memory.busy==true&&creep.carry.energy==0){
			creep.memory.busy=false;
		}else if(creep.memory.busy==false&&creep.carry.energy==creep.carryCapacity){
			creep.memory.busy=true;
		}
		
		if(creep.memory.busy==true){//offload
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
				creep.moveTo(creep.room.controller);
			}
		}else{//load
			var node=creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
			if(creep.harvest(node)==ERR_NOT_IN_RANGE){
				creep.moveTo(node);
			}
		}
	}
}