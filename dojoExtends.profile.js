var profile = (function(){
	var copyOnly = function(filename, mid){
		var cantCopy = false;
		var list = [
			"dojoExtends/_base/dev"
		];
		
		for(var i in list){
			if(mid.indexOf(list[i]) == 0){
				cantCopy = true;
				break;
			}
		}
		
		return cantCopy;
	};

	return {
		resourceTags:{
			copyOnly: function(filename, mid){
				return copyOnly(filename, mid);
			},

			amd: function(filename, mid){
				return !copyOnly(filename, mid) && /\.js$/.test(filename);
			},

			miniExclude: function(filename, mid){
				return copyOnly(filename, mid);
			}
		}
	};
})();



