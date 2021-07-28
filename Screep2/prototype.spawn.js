/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('prototype.spawn');
 * mod.thing == 'a thing'; // true
 */
const sHarvester=[WORK, CARRY, MOVE];
StructureSpawn.prototype.runSpawner=function() {
    //this.TESTFUNCTION();
    if(this.memory.init==undefined||this.memory.init==0){
        this.initSpawner();
        this.memory.init=1;
    }
    ///*
    if(this.memory.spawnTime!=undefined&&Game.time>=this.memory.spawnTime){
        for(var x=-1; x<=1; x++){
            for(var y=-1; y<=1; y++){
                var position=new RoomPosition(this.pos.x+x,this.pos.y+y,this.pos.roomName);
                const cre=position.lookFor(LOOK_CREEPS);
                console.log(cre.ticksToLive);
                if(cre!=null&&cre.ticksToLive>=1495){
                    console.log(cre.ticksToLive);
                    this.addCreepToList(cre);
                }
            }
        }
        this.memory.spawnTime=undefined;
    }
    if(this.memory.eCreepList==undefined){
        this.memory.eCreepList=[];
    }else{
        for(let x in this.memory.eCreepList){
            Game.getObjectByID(this.memory.eCreepList[x]).runEnergyCreep();
        }
        if(this.spawning==null){
            if(this.memory.eCreepList.length<this.memory.nodePositions[0]){
                if(this.spawnCreep(sHarvester,"",{dryrun:true})){
                    var ret=this.helperFindKthInJaggedArray(this.memory.nodePositions,this.memory.eCreepList.length);
                    ret=this.room.getPositionAt(ret.x,ret.y,ret.roomName);
                    var name=ret.roomName+"/"+ret.x+"/"+ret.y;
                    this.spawnCreep(sHarvester, name,{memory:[point=ret,sID=ret.findClosestByRange(FIND_SOURCES),father=this, job=1]});
                    console.log("Spawning: "+name);
                }
            }
        }else{
            if(this.memory.spawnTime==undefined){
                this.memory.spawnTime=Game.time+this.spawning.remainingTime+1;
            }
        }
    }
    //*/
}
StructureSpawn.prototype.TESTFUNCTION=function(field) {
    var ret=this.helperFindKthInJaggedArray(this.memory.nodePositions,4);
    console.log(ret);
}
StructureSpawn.prototype.helperFindKthInJaggedArray=function(array, k) {
    var c=this.memory.nodePositions[0];
    if(k>c){
        console.log("Problem in helperFindKthInJaggedArray");
    }
    for(var x=1; x<this.memory.nodePositions.length; x++){
        //console.log(c+"  "+this.memory.nodePositions[x].length);
        if(c>this.memory.nodePositions[x].length){
            c-=this.memory.nodePositions[x].length
        }else{
            return this.memory.nodePositions[x][c-x+1];
        }
    }
}
StructureSpawn.prototype.initSpawner=function() {
    this.defineNodePositions();
    this.defineStructures();
}
StructureSpawn.prototype.addStructures=function(struct){
    this.memory.structures+=struct;
}
StructureSpawn.prototype.defineStructures=function() {
    if(this.memory.structures==undefined){
        this.memory.structures=[];
        this.memory.structures[this.memory.structures.length]=this;
    }
}

StructureSpawn.prototype.addCreepToList=function(cre) {
    console.log("here");
    this.memory.eCreepList[this.memory.eCreepList.length]=cre.id;
}
StructureSpawn.prototype.addNodePositions=function(field) {
    
}
StructureSpawn.prototype.defineNodePositions=function() {
	if(this.memory.nodePositions==undefined||this.memory.init==1){
	    this.memory.nodePositions=[];
		this.memory.nodePositions[0]=0;
		var sources=this.room.find(FIND_SOURCES);
		for(var c=1; c<sources.length+1; c++){
			this.memory.nodePositions[c]=this.NodeSpotFinder(sources[c-1]);
			this.memory.nodePositions[0]+=this.memory.nodePositions[c].length;
		}
	}
}
StructureSpawn.prototype.NodeSpotFinder=function(energyNode) {
	var counter=0;
	var listPositions=[];
	var xcoord=energyNode.pos.x;
	var ycoord=energyNode.pos.y;
	for(var x=-1; x<=1; x++){
		for(var y=-1; y<=1; y++){
			if(this.room.lookForAt(LOOK_TERRAIN, xcoord+x, ycoord+y)=="plain"){
				listPositions[counter]=energyNode.room.getPositionAt(xcoord+x,ycoord+y);
				counter++;
			}
		}
	}
	return listPositions;
}