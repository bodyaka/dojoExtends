define([
    "dojo/_base/declare",
	"dojo/_base/xhr",
	"dojo/json",
	"dojo/cookie"
], function(declare, xhr, JSON, cookie, JsonRest){
	return declare(null, {
			
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
			return this._request(restMethod, dojo.config.apiUrlPath + url, params);
		},
		
		/**
		 * send Ajax request
		 */
		_request: function(restMethod, url, params){
			params = params || '';
			
			// add slash at the begining of url string for request to root of domain
			if(url.substring(0,1) != '/') url = '/' + url;
			
			var handlerXhr;
			
			var xhrArgs = {
				url: url,
				handleAs: 'json',
				content: params,
				load: function(data, evt) {
					if(!data || data.errorCode){
						throw new Error('Some error from API');
					}else{
						if(data.errorCode){
							throw new Error((data.errorDescription)?data.errorDescription:data.errorCode);
						}
					}
				},
				error: function(err) {
					throw new Error((err.message)?err.message:'Ajax request error');
				}
			};
			
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
	});
});
