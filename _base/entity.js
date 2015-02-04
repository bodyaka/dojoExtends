define([
	"dojo/_base/declare",
	"dojo/store/JsonRest",
	
	"dojoExtends/_base/ajax"
], function(declare, JsonRest, ajax){
	
	var entity = {
		constructor: function(args){
			var target = dojo.config.apiUrlPath;
			if(args && args.target) target += '/' + args.target;
			
			entity.rest = new JsonRest({target: target});
	    },
	
		rest: null
	};
	
	return declare(null, entity);
});