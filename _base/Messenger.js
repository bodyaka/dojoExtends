define([
    "dojo/_base/declare",
	"dojo/ready",
	"dojo/string",
	"dojo/dom-construct",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/messengerPopup.html",
	
	"dojoExtends/_base/_WidgetInPopup",
	"dojoExtends/_base/Utils"
], function(declare, ready, string, domConstruct, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, template, _WidgetInPopup, Utils){
	
	var _popupWidget = declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, _WidgetInPopup], {
		templateString: template,
		
		addMessage: function(message){
			
			// draw page break tag, if messages already present
			if(string.trim(this.containerMessages.innerHTML)){
				var trBreak = domConstruct.create('tr', null, this.containerMessages);
				var tdBreak = domConstruct.create('td', {colspan: 3}, trBreak);
				domConstruct.create('hr', null, tdBreak);
			}
			
			var color = 'grey';
			if(message.type == Messenger.TYPE_OK){
				color = 'green';
			}else if(message.type == Messenger.TYPE_ERROR){
				color = 'red';
			}
			var tr = domConstruct.create('tr', {
				'class': 'message_type_' + message.success,
				style: {
					color: color
				}
			}, this.containerMessages);
			domConstruct.create('td', {
				innerHTML: Utils.convertDatetimeToStrTime(message.timestamp),
				style: {
					width: '50px'
				}
			}, tr);
			domConstruct.create('td', {
				innerHTML: '&nbsp;',
				style: {
					width: '10px',
					textAlign: 'center'
				}
			}, tr);
			domConstruct.create('td', {innerHTML: message.message}, tr);
		},
		
		clear: function(){
			domConstruct.empty(this.containerMessages);
		},
		
		postCreate: function(){
		}
		
	});
	
	/**
	 * Array of all messages
	 */
	var messagesAll = [];
	
	/**
	 * log messages
	 */
	var messageLog = function(message){
		messagesAll.push(message);
	};
	
	/**
	 * Show message
	 */
	var messageShow = function(){
		var timeoutHandler;
		
		return function(options){
			var messageObject = {
				timestamp: new Date(),
				message: options.message,
				type: options.type
			};
			messageLog(messageObject);
			
			Messenger.popup.addMessage(messageObject);
			
			if(timeoutHandler){
				clearTimeout(timeoutHandler);
				Messenger.popup.popupRedraw();
			}else{
				Messenger.popup.popupOpen();
			}
			timeoutHandler = setTimeout(function(){
				Messenger.popup.clear();
				Messenger.popup.popupClose();
				timeoutHandler = null;
			}, options.duration);
		}
	}();
	
	/**
	 * Messenger module
	 */
	var Messenger = {
		TYPE_OK: 1,
		TYPE_ERROR: 2,
		TYPE_MESSAGE: 3,
		
		popup: new _popupWidget(),
		
		/**
		 * Show time of simple message
		 */
		duration: 4000,
		/**
		 * Show time of "Ok" message
		 */
		durationOk: 4000,
		/**
		 * Show time of "Error" message
		 */
		durationError: 4000,
		
		/**
		 * show successful message
		 */
		showOk: function(message, duration)
		{
			duration = duration || Messenger.durationOk;
			messageShow({
				message: message,
				type: Messenger.TYPE_OK,
				duration: duration
			});
		},
		
		/**
		 * show error message
		 */
		showError: function(message, duration)
		{
			duration = duration || Messenger.durationError;
			messageShow({
				message: message,
				type: Messenger.TYPE_ERROR,
				duration: duration
			});
		},
		
		/**
		 * show simple message
		 */
		showMessage: function(message, duration)
		{
			duration = duration || Messenger.duration;
			messageShow({
				message: message,
				type: Messenger.TYPE_MESSAGE,
				duration: duration
			});
		}
	};
	
	ready(function(){
		Messenger.popup.set({
			options: {
				x: 10,
				y: 10
			}
		});
	});
	
	dojo.global.Messenger = Messenger;
});
