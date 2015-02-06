define([
	"dojo/hash",
	"dojo/io-query"
], function(hash, ioQuery){
	
	/**
	 * Url module
	 */
	var url = {
		
		/**
		 * Return "test_param=234" from http://cloud/test?test_param=234
		 */
		getQueryString: function(){
			var uri = document.location.search;
			return uri.substring(uri.indexOf("?") + 1, uri.length);
		},
		
		/**
		 * generate url Query from object
		 */
		generateQueryString: function(obj){
			obj = obj || {};
			var query = ioQuery.objectToQuery(obj);
			if(query){
				query = '?' + query;
			}
			return query;
		},
		
		/**
		 * Return {test_param:234} from http://cloud/test?test_param=234
		 */
		getQueryObject: function(){
			return ioQuery.queryToObject(this.getQueryString());
		},
		
		/**
		 * Return "test" from http://cloud/test?test_param=234
		 */
		getPath: function(){
			return document.location.pathname;
		},
		
		/**
		 * Go to page with hash params
		 */
		goWithHash: function(path, params){
			var oldPath = this.getPath();
			document.location.href = path + '#' + ioQuery.objectToQuery(params);
			
			// if user location on same path, then reload page manualy
			if(oldPath.indexOf(path) >= 0){
				document.location.reload()
			}
		},

		/**
		 * Get hash params from browser url
		 */
		getHashParams: function(){
			var _hash = hash();
			return (_hash)?ioQuery.queryToObject(_hash):{};
		},
		
	};
	
	return url;
});
