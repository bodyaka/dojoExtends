define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/topic",
    "dojo/store/Memory",
    "dojo/store/Observable"
], function(declare, lang, topic, Memory, Observable){
	
	var entityName = '';
	
	var memory = new Observable(new Memory());
	
	var observeHandler = function(entity, removedFrom, insertedInto){
		if(insertedInto > -1){ // new or updated entity
			if(entity.id){
				topic.publish(this.getTopicNameUpdate() + entity.id, entity);
			}
		}
	};
	
	return declare("_EntityManager", null, {
		constructor: function(eName){
			entityName = eName;
			
			var memoryObserve = memory.query();
			memoryObserve.observe(lang.hitch(this, observeHandler), true);
		},
		
		get: function(id){
			return memory.get(id);
		},
		
		put: function(entity){
			return memory.put(entity);
		},
		
		remove: function(entityId){
			return memory.remove(entityId);
		},
		
		getTopicNameUpdate: function(){
			return 'Entity' + entityName + 'Update';
		}
	});
	
});
