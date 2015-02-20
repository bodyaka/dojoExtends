define([
	"dojo/_base/declare",
	"dojo/store/JsonRest",
	
	"dojoExtends/_base/ajax"
], function(declare, JsonRest, ajax){
	return declare(null, {
		constructor: function(args){
			var target = dojo.config.apiUrlPath;
			if(args && args.target) target += '/' + args.target;
			
			var options = {
					target: target
			};
			if(AccessToken){
				options.headers = {'Authorization': 'Bearer ' + AccessToken}	
			}
			
			this.rest = new JsonRest(options);
	    },
	
		rest: null
	});
});