define([
	"dojo/_base/declare",
	"dojo/store/JsonRest",
	"dojo/store/Memory",
	"dojo/store/Cache",
	"dojo/store/Observable",
	
	"dojoExtends/_base/ajax"
], function(declare, JsonRest, Memory, Cache, Observable, ajax){
	return declare(null, {
		constructor: function(args){
			var target = dojo.config.apiUrlPath;
			if(args && args.target) target += '/' + args.target;
			
			var options = {
					target: target
			};
			if(typeof(AccessToken) != "undefined" && AccessToken){
				options.headers = {'Authorization': 'Bearer ' + AccessToken}	
			}
			
			this.rest = new JsonRest(options);
			this.memory = new Observable(new Memory());
			this.cache = new Cache(this.rest, this.memory);
	    },
	
		rest: null,
		memory: null,
		cache: null
		
	});
});