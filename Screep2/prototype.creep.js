/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.creep');
 * mod.thing == 'a thing'; // true
 */
    //this.memory.point=nodePos;
    //this.memory.sID=source;
    //this.memory.father=spawner;
    
    //this.memory.loopTicks
    
Creep.prototype.runEnergyCreep=function(){
    if(this.pos==this.memory.point&&this.carry!=this.carryCapacity){// (at point) and (not full)
        this.harvest(Game.getObjectById(this.memory.sID));
    }else{// (not at point) and (full or not full)
        if(this.carry.energy>0){
            if(this.memory.unloadBool==true&&this.memory.unload==undefined){
                this.memory.unload=this.pos.findClosestByPath(this.memory.father.memory.structures,{algorithm:dijkstra});
            }
            if(this.memory.unload==undefined){
                this.memory.unload=this.pos.findClosestByPath(this.memory.father.memory.structures,{algorithm:astar});
                this.memory.unloadBool=true;
            }
            if(this.transfer(this.memory.unload, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(this.memory.unload);
            }
            if(this.carry.energy==0){
                this.memory.unload=undefined;
                this.memory.unloadBool=undefined;
            }
        }else{
            this.moveTo(this.memory.point.x, this.memory.point.y);
        }
    }
}
Creep.prototype.initCreep=function(point,sourceID,spawner){
    this.memory.point=point;
    this.memory.sID=sourceID;
    this.memory.father=spawner;
}