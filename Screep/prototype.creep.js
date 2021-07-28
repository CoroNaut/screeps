Creep.prototype.checkLife =
	function() {
		if(this.ticksToLive==1){
			var spawn = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN)
            });
			spawn.memory.allCreepList[this.memory.act]-=1;
		}
	}