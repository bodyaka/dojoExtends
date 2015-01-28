define([
	"dojo/_base/xhr",
	"dojo/json",
	"dojo/cookie"
], function(xhr, JSON, cookie){
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
		
		requestToPoker: function( url, params, debug){
			
			// set accessToken param for all ajax request
			params = this.accessTokenToParams(params);
			
			var newParams = encodeURI(JSON.stringify(params));
			
			var promise = this._request('get', dojo.config.apiUrlPath + url + '/' + newParams, null);
			
			var _time = timeToStrClient(new Date());
			
			if(debug){
				promise.then(function(data){
					var message = '' + _time + ' :: ' + url + ' = ' + JSON.stringify(data);
					Application.note(message);
//					console.log(message);
				});
				promise.otherwise(function(data){
					var message = '' + _time + ' :: ' + url + ' = ' + data;
					Application.note(message);
//					console.log(message);
				});
			}

			return promise;
		},
		
		/**
		 * send Ajax request
		 */
		_request: function(restMethod, url, params)
		{
			params = params || '';
			
			// add slash at the begining of url string for request to root of domain
			if(url.substring(0,1) != '/') url = '/' + url;
			
			var handlerXhr;
			
			var xhrArgs = {
				url: url,
				handleAs: 'json',
				content: params,
				load: function(data, evt) {
					if(data.errorCode){
						throw new Error((data.errorDescription)?data.errorDescription:'Some error from API');
					}
				}
//				error: function(data, evt) {
//					if(!handlerXhr.canceled){ // if request canceled, then cancel notification
//						Ajax.handleErrorResponse(data);
//					}
//					
//					Ajax.responseError(funcError, data, options);
//				}
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
		
//		/**
//		 * success response handler
//		 */
//		responseOk: function(func, data, options){
//			options = options || {};
//			if(options['freezeNode']){
//				domBlock.unFreezeNode(options['freezeNode']);
//			}
//			func(data, options);
//		},
//		
//		/**
//		 * error response handler
//		 */
//		responseError: function(funcError, data, options){
//			options = options || {};
//			if(options['freezeNode']){
//				domBlock.unFreezeNode(options['freezeNode']);
//			}
//			
//			// set error code to options
//			if(responseObject = Ajax.responseErrorGetObject(data)){
//				options.apiErrorCode = responseObject.status;
//			}
//			
//			funcError(Ajax.responseErrorGetMessage(data), options);
//		},
//		
//		/**
//		 * Object from API server error response
//		 */
//		responseErrorGetObject: function(response){
//			var responseObject = false;
//			
//			if(response.response && response.response.text){
//				try{
//					responseObject = dojo.fromJson(response.response.text);
//				}catch(e){
//				}
//			}
//			
//			return responseObject;
//		},
//		
//		/**
//		 * Message from API server error response
//		 */
//		responseErrorGetMessage: function(response){
//			var data = 'ajax error';
//			
//			if(responseObject = Ajax.responseErrorGetObject(response)){
//				data = responseObject.data;
//			}
//			
//			return data;
//		},
//		
//		/**
//		 * Status from API server error response
//		 */
//		responseErrorGetStatus: function(data){
//			var status = null;
//			
//			if(responseObject = Ajax.responseErrorGetObject(response)){
//				status = responseObject.status;
//			}
//			
//			return status;
//		},
//		
//		/**
//		 * Handle error response from API
//		 */
//		handleErrorResponse: function(response){
//			var responseObject = Ajax.responseErrorGetObject(response);
//			
//			if(responseObject && responseObject.status === 1){ // Check for Error Authorization from API response
//				if(!Ajax.automaticLogoutWidget || Ajax.automaticLogoutWidget._destroyed){
//					Ajax.automaticLogoutWidget = new AutomaticLogout();
//				}
//			}else{
//				Notification.showError(responseObject.data);
//			}
//		}
	};
});
