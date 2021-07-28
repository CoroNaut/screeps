var listOfActs = ['initHarvester', 'initBuilder', 'initUpgrader', 'lowBuilder', 'lowWaller'];
//StructureSpawn.prototype.startBenchTest =
	//function() {
	//	if(this.memory.BENCHTEST_START==undefined){
	//		this.memory.BENCHTEST_START=Game.time;
	//	}
	//	if(this.memory.BENCHTEST_)
	//}
StructureSpawn.prototype.checkCreepList =
	function() {
		var ret=true;
		var listOfCreeps = this.room.find(FIND_MY_CREEPS);
		var actList=[];
		for(var x=0; x<listOfActs.length; x++){
			actList[x]=0;
		}
		for(var x=0; x<listOfCreeps.length; x++){
			actList[listOfCreeps[x].memory.act]+=1;
		}
		for(var x=0; x<listOfActs.length; x++){
			if(actList[x]!=this.memory.allCreepList[x]){
				ret=false;
				break;
			}
		}
		if(ret==false){
			console.log("Code:"+this.name+"");
			for(var x=0; x<listOfActs.length; x++){
				console.log(actList[x]+":"+this.memory.allCreepList[x]);
			}
		}
		return true;
	}
StructureSpawn.prototype.createInitHarvester =
	function(userNumber) {
		var body=[WORK,CARRY,MOVE];
		return this.createCreep(body, undefined, { user: userNumber, act: 0, busy: false});
	}
StructureSpawn.prototype.createInitBuilder =
	function(userNumber) {
		var body=[WORK,WORK,CARRY];
		return this.createCreep(body, undefined, { user: userNumber, act: 1, busy: false});
	}
StructureSpawn.prototype.createInitUpgrader =
	function(userNumber) {
		var body=[WORK,CARRY,MOVE];
		return this.createCreep(body, undefined, { user: userNumber, act: 2, busy: false});
	}
StructureSpawn.prototype.createLowBuilder =
	function(userNumber) {
		var body=[WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];
		return this.createCreep(body, undefined, { user: userNumber, act: 3, busy: false});
	}
StructureSpawn.prototype.createLowWaller =
	function(userNumber) {
		var body=[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
		return this.createCreep(body, undefined, { user: userNumber, act: 4, busy: false, curTask: 0});
	}
StructureSpawn.prototype.createNextCreep =
	function(actNumber, userNumber) {
		if(actNumber==0){
			return this.createInitHarvester(userNumber);
		}else if(actNumber==1){
			return this.createInitBuilder(userNumber);
		}else if(actNumber==2){
			return this.createInitUpgrader(userNumber);
		}else if(actNumber==3){
			return this.createLowBuilder(userNumber);
		}else if(actNumber==4){
			return this.createLowWaller(userNumber);
		}else{
			return "Error in createNextCreep code";
		}
	}
StructureSpawn.prototype.buildRoadToController =
	function() {
		var left=this.room.getPositionAt(this.pos.x-2, this.pos.y-1);
		var right=this.room.getPositionAt(this.pos.x+2, this.pos.y-1);
		var distToLeft=this.room.controller.pos.findPathTo(left);
		var distToRight=this.room.controller.pos.findPathTo(right);
		var position;
		if(distToLeft.length<=distToRight.length){
			position=left;
			//console.log("left");
		}else{
			position=right;
			//console.log("right");
		}
		this.buildRoadToResource(position,this.room.controller.pos);
	}
StructureSpawn.prototype.buildHub =
	function() {
		var extension=this.room.createConstructionSite(this.pos.x-1, this.pos.y-2, STRUCTURE_EXTENSION);
		this.room.createConstructionSite(this.pos.x, this.pos.y-2, STRUCTURE_EXTENSION);
		this.room.createConstructionSite(this.pos.x+1, this.pos.y-2, STRUCTURE_EXTENSION);
		this.room.createConstructionSite(this.pos.x-1, this.pos.y, STRUCTURE_EXTENSION);
		this.room.createConstructionSite(this.pos.x+1, this.pos.y, STRUCTURE_EXTENSION);
		var road=this.room.createConstructionSite(this.pos.x-2, this.pos.y-1, STRUCTURE_ROAD);
		this.room.createConstructionSite(this.pos.x-1, this.pos.y-1, STRUCTURE_ROAD);
		this.room.createConstructionSite(this.pos.x, this.pos.y-1, STRUCTURE_ROAD);
		this.room.createConstructionSite(this.pos.x+1, this.pos.y-1, STRUCTURE_ROAD);
		this.room.createConstructionSite(this.pos.x+2, this.pos.y-1, STRUCTURE_ROAD);
		if(extension!=0){
			return "Extension error: "+extension;
		}else if(road!=0){
			return "Road error: "+road;
		}
	}
StructureSpawn.prototype.buildContainerAtNode =
	function(NodeNumber) {
		var distToNode=this.pos.findPathTo(this.memory.energyNodes[nodeNumber]);
		var site= this.pos.createConstructionSite(distToNode[distToNode.length-1], distToNode[distToNode.length-1], STRUCTURE_CONTAINER);
		return site.id;
	}
StructureSpawn.prototype.buildRoadsToAllResources =
	function() {
		var left=this.room.getPositionAt(this.pos.x-2, this.pos.y-1);
		var right=this.room.getPositionAt(this.pos.x+2, this.pos.y-1);
		for(var c=0; c<this.memory.energyNodes.length; c++){
			var distToLeft=Game.getObjectById(this.memory.energyNodes[c].id).pos.findPathTo(left);
			var distToRight=Game.getObjectById(this.memory.energyNodes[c].id).pos.findPathTo(right);
			//console.log("dist to left side "+distToLeft.length);
			//console.log("dist to right side "+distToRight.length);
			var position;
			if(distToLeft.length<=distToRight.length){
				position=left;
				//console.log("left");
			}else{
				position=right;
				//console.log("right");
			}
			for(var x=0; x<this.memory.energyNodePositions[c].length;x++){
				var end=this.room.getPositionAt(this.memory.energyNodePositions[c][x][0],
												this.memory.energyNodePositions[c][x][1]);
				this.buildRoadToResource((position), (end));
			}
		}
	}
StructureSpawn.prototype.buildRoadToResource =
	function(start, end) {
		var path=this.room.findPath(start, end);
		for(let loc in path){
			//console.log(path[loc].x+", "+path[loc].y);
			this.room.createConstructionSite(path[loc].x, path[loc].y, STRUCTURE_ROAD);
		}
		//console.log("end");
	}
StructureSpawn.prototype.energyNodeSpotFinder =
	function(energyNode) {
		var counter=0;
		var listPositions=[];
		var xcoord=energyNode.pos.x;
		var ycoord=energyNode.pos.y;
		for(var x=-1; x<=1; x++){
			for(var y=-1; y<=1; y++){
				if(!(x==0&&y==0)){
					if(this.room.lookForAt(LOOK_TERRAIN, xcoord+x, ycoord+y)=="plain"){
						listPositions[counter]=[xcoord+x,ycoord+y];
						counter++;
					}
				}
			}
		}
		return listPositions;
	}
StructureSpawn.prototype.levelOneSpawn =
	function() {
		this.memory.minCreepList[1]=0;//no more initBuilders
		
		if(this.memory.towerRepairTargets==undefined){
			this.memory.towerRepairTargets=null;
		}
		if(this.memory.energyNodeContainers==undefined){
			this.memory.energyNodeContainers=[];
			for(var x=0; x<this.memory.energyNodes.length; x++){
				this.memory.energyNodeContainers[x]=false;
			}
		}
		console.log("here");
		for(var x=0; x<this.memory.energyNodeContainers.length; x++){
			if(this.memory.energyNodeContainers[x]==false){
				var siteId=this.buildContainerAtNode[x];
				console.log("here");
				return siteId;
			}
		}
	}
StructureSpawn.prototype.initializeSpawn =
	function() {
		console.log("Writing new spawn into arena: "+this.name);
		if(this.memory.initCalculated==undefined){
			this.memory.initCalculated=false;
		}
		this.defineMinCreepList();
		this.defineAllCreepList();
		this.defineEnergyCollectionMode();
		this.defineEnergyNodes();
		this.defineEnergyNodePositions();
		if(this.memory.energyCollectionMode==0){
			this.calcInitMinCreepList();
		}
		if(this.memory.energyCollectionMode==1){
			this.calcInitMinCreepList();
		}
		this.buildHub();
		this.buildRoadsToAllResources();
		this.buildRoadToController();
		this.memory.initialized=true;
	}
StructureSpawn.prototype.defineMinCreepList =
	function() {
		if(this.memory.minCreepList==undefined){
			//console.log("min worked");
			this.memory.minCreepList=[];
		}
	}
StructureSpawn.prototype.defineAllCreepList =
	function() {
		if(this.memory.allCreepList==undefined){
			//console.log("all worked");
			this.memory.allCreepList=[];
			for(var x=0; x<listOfActs.length; x++){
				this.memory.allCreepList[x]=0;
			}
			this.memory.initCalculated=false;
		}
	}
StructureSpawn.prototype.defineEnergyCollectionMode =
	function() {
		if(this.memory.energyCollectionMode==undefined){
			this.memory.energyCollectionMode=0;
		}
	}
StructureSpawn.prototype.defineEnergyNodes =
	function() {
		if(this.memory.energyNodes==undefined){//contains data for all nodes in room
			//console.log("Wrote nodes to spawn: "+this.name);
			this.memory.energyNodes=this.room.find(FIND_SOURCES_ACTIVE);
		}
	}
StructureSpawn.prototype.defineEnergyNodePositions =
	function() {
		if(this.memory.energyNodePositions==undefined){//contains points that a creep can stand at next to the nodes for each node
			//console.log("Wrote free space at nodes: "+this.name);
			this.memory.energyNodePositions=[];
			for(var c=0; c<this.memory.energyNodes.length; c++){
				this.memory.energyNodePositions[c]=this.energyNodeSpotFinder(this.memory.energyNodes[c]);
			}
		}
	}
StructureSpawn.prototype.calcInitMinCreepList =
	function() {
		if(!this.memory.initCalculated){//init'ing minimum number of creeps
			this.memory.minCreepList[0]=0;
			for(var a=0; a<this.memory.energyNodePositions.length; a++){
				this.memory.minCreepList[0]+=this.memory.energyNodePositions[a].length;
			}
			this.memory.minCreepList[1]=1;
			this.memory.minCreepList[2]=1;
			this.memory.minCreepList[3]=1;
			
			this.memory.initCalculated=true;
		}
	}