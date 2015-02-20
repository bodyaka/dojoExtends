define([
	"dojo/_base/xhr",
	"dojo/json",
	"dojo/cookie"
], function(xhr, JSON, cookie, JsonRest){
	return {
			
		/**
		 * Add access token to params
		 */
		accessTokenToParams: function(params)
		{
			params = params || {};
			if(typeof(params['session']) == 'undefined') params['session'] = cookie('auth_session');
			
			return params;
		},
		
		apiRequest: function(restMethod, url, params){
			var _api = '';
			var _url = '';
			
			if(dojo.config.apiUrlPath.substr(-1) == '/'){
				_api = dojo.config.apiUrlPath.substr(0, dojo.config.apiUrlPath.length - 1);
			}else{
				_api = dojo.config.apiUrlPath;
			}
			
			if(url.substring(0,1) != '/'){
				_url = '/' + url;
			}else{
				_url = url;
			}
			
			// add accessToken to xhr header
			var options = {};
			if(AccessToken){
				options.headers = {'Authorization': 'Bearer ' + AccessToken}	
			}
			
			return this._request(restMethod, _api + _url, params, options);
		},
		
		/**
		 * send Ajax request
		 */
		_request: function(restMethod, url, params, options){
			params = params || '';
			
			// add slash at the begining of url string for request to root of domain
			if(url.substring(0,1) != '/') url = '/' + url;
			
			var handlerXhr;
			
			var xhrArgs = {
				url: url,
				handleAs: 'json',
				content: params
			};
			
			// add header to each request
			if(options.headers) xhrArgs.headers = options.headers
			
			switch(restMethod){
				case 'post':
					handlerXhr = xhr.post(xhrArgs);
					break;
				case 'get':
					handlerXhr = xhr.get(xhrArgs);
					break;
				case 'put':
					handlerXhr = xhr.put(xhrArgs);
					break;
				case 'delete':
					// if method delete, set params to another property 
					delete xhrArgs.content;
					xhrArgs.postData = params;
					
					handlerXhr = xhr.del(xhrArgs);
					break;
				default:
					break;
			}
			
			return handlerXhr.promise;
		}
	};
});
