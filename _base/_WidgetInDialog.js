define([
    "dojo/_base/window",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/when",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/aspect",
    "dijit/Dialog",
    "./Utils"/*,
    //"engine/widgets/global/confirmationOkCancel"*/
], function(win, declare, lang, Deferred, when, domConstruct, domStyle, aspect, Dialog, Utils/*, ConfirmationOkCancelWidget*/){

	return declare("_WidgetInDialog", null, {
//		// summary:
//		//		Mixin to render widget in dialog
//		
//		askForCloseDialog: false,
		
		/**
		 * Promise will be resolved when dialog is showing. Example: when(this.promiseShowDialog, function(){alert("dialog is showed");})
		 */
		promiseShowDialog: null,
		
		/**
		 * Callback function on dialog close
		 */
		onCloseWidget: function(){},
		
		/**
		 * dialog for widget instance
		 */
		dialog: null,
		
		closeWidget: function(){
			// call Dialog.hide() becouse it overwrited by own function
			this.dialog.hide();
		},
		
		constructor: function(){
			this.promiseShowDialog = new Deferred(); // init Deferred for external widget that wiat for dialog showing
			
			var scope = this;
			
			var destroyDialogWithContent = function(){ // function for close Dialog with destroing
				scope.onCloseWidget();
				scope.dialog.destroyRecursive();
				domStyle.set(win.body(), 'overflow', 'auto'); // unlock content under Dialog
			};
			
			this.dialog = new Dialog({
				closable: true, 
				style: 'width: auto; min-width: 50px;',
//				modal: false,
					
//	            content: 'test',
	            hide: function(){ // overwrite "hide" function from dijit\Dialog module
//					if(scope.askForCloseDialog){
//						//ask for closing Dialog
//						new ConfirmationOkCancelWidget({
//							message: 'Вы действительно желаете закрыть окно?',
//							ok: function(){
//								scope.askForCloseDialog = false; // disable asking and repeat trying to close dialog
								destroyDialogWithContent();
//							}
//						});
//					}else{
//						destroyDialogWithContent();
//					}
				}
			
	        }).placeAt(win.body());
			
			this.own(Utils.handleEventEnterEsc(this, null, this.closeWidget)); // handle Esc and Enter keypress
			
			
			var promiseShow = scope.dialog.show();
			
			aspect.around(this, 'create', function(_create){
				return function(params, srcNodeRef){
		        	_create.call(scope, params, srcNodeRef);
		        	scope.placeAt(scope.dialog);
		        	
					scope.dialog.resize();
					scope.dialog._position();
				}
				
				
				var test = _create;
				
			});
			
	        when(promiseShow, function(){ // show and resolve Deferred for action
				scope.dialog.focus();
	        	scope.promiseShowDialog.resolve();
	        	domStyle.set(win.body(), 'overflow', 'hidden'); // lock content under Dialog
	        });
		}
	});
	
});
