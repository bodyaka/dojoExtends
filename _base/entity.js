define([
	"dojo/_base/declare",
	"dojo/store/JsonRest",
	
	"dojoExtends/_base/ajax"
], function(declare, JsonRest, ajax){
	return declare(null, {
		constructor: function(args){
			var target = dojo.config.apiUrlPath;
			if(args && args.target) target += '/' + args.target;
			
			this.rest = new JsonRest({target: target});
	    },
	
		rest: null
	});
});