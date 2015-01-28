define([
	"dojo/_base/window",
	"dojo/_base/lang",
	"dojo/ready",
	"dojo/dom",
	"dojo/dom-construct",
	
	"dojox/mobile/Button",
	"dojox/mobile/SimpleDialog"
], function(win, lang, ready, dom, domConstruct, Button, SimpleDialog){
	
	/**
	 * Notification module
	 */
	dojo.global.Notification = {
		TYPE_OK: 1,
		TYPE_ERROR: 2,
		TYPE_MESSAGE: 3,
			
		messageDialog: null,
		messageDialogContent: null,
		messageDialogConfirmButton: null,
		
		messageHistory: [],
		
		_show: function(message, duration, type){
			var className = '';
			Notification.messageDialogContent.innerHTML = '';
			
			if(type == Notification.TYPE_OK){
				className = 'color_green';
			}else if(type == Notification.TYPE_ERROR){
				className = 'color_red';
			}
			
			Notification.messageDialog.show();
			
			domConstruct.create('div', {innerHTML: message, 'class': className}, Notification.messageDialogContent);
		},
		
		/**
		 * show successful message
		 */
		showOk: function(message, duration)
		{
			duration = duration || 3000;
			Notification._log(message, Notification.TYPE_OK);
			Notification._show(message, duration, Notification.TYPE_OK);
			
		},
		
		/**
		 * show error message
		 */
		showError: function(message, duration)
		{
			duration = duration || 3000;
			Notification._log(message, Notification.TYPE_ERROR);
			Notification._show(message, duration, Notification.TYPE_ERROR);
		},
		
		/**
		 * show simple message
		 */
		showMessage: function(message, duration)
		{
			duration = duration || 3000;
			Notification._log(message, Notification.TYPE_MESSAGE);
			Notification._show(message, duration, Notification.TYPE_MESSAGE);
		},
		
		/**
		 * log messages
		 */
		_log: function(message, type){
			
			var _message = {
				timestamp: new Date(),
				message: message,
				success: type
			};
			
			Notification.messageHistory.push(_message);
		}
	};
	
	ready(function(){
		Notification.messageDialog = new SimpleDialog({style: 'z-index: 999;', modal: false}).placeAt(win.body());
		Notification.messageDialogContent = domConstruct.create('div', null, Notification.messageDialog.domNode);
		Notification.messageDialogConfirmButton = new Button({
			'class': 'mblSimpleDialogButton mblRedButton', 
			innerHTML: 'Ok',
			onClick: lang.hitch(Notification.messageDialog, 'hide')
		}).placeAt(Notification.messageDialog.domNode);
	});
	
	return dojo.global.Notification;
});
