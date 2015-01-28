define([
    "dojo/_base/window",
    "dojo/_base/declare",
    "dojo/Deferred",
    "dojo/when",
    "dojo/dom-style",
    "dojo/aspect",
    "dijit/Dialog"/*,
    //"engine/widgets/global/confirmationOkCancel"*/
], function(win, declare, Deferred, when, domStyle, aspect, Dialog/*, ConfirmationOkCancelWidget*/){

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
			aspect.before(this, 'postCreate', function(){
				
				this.own(handleEventEnterEsc(this, null, scope.closeWidget)); // handle Esc and Enter keypress
				
				var destroyDialogWithContent = function(){ // function for close Dialog with destroing
					scope.onCloseWidget();
					scope.dialog.destroyRecursive();
					domStyle.set(win.body(), 'overflow', 'auto'); // unlock content under Dialog
				};
				
				scope.dialog = new Dialog({
					closable: true, 
					style: 'width: auto;',
//					modal: false,
						
//		            content: scope.domNode,
		            hide: function(){ // overwrite "hide" function from dijit\Dialog module
//						if(scope.askForCloseDialog){
//							//ask for closing Dialog
//							new ConfirmationOkCancelWidget({
//								message: 'Вы действительно желаете закрыть окно?',
//								ok: function(){
//									scope.askForCloseDialog = false; // disable asking and repeat trying to close dialog
									destroyDialogWithContent();
//								}
//							});
//						}else{
//							destroyDialogWithContent();
//						}
					}
				
		        }).placeAt(win.body());
				scope.placeAt(scope.dialog);
			});
			
			aspect.after(this, 'postCreate', function(){
				var promiseShow = scope.dialog.show();
		        when(promiseShow, function(){ // show and resolve Deferred for action
//					scope.dialog._underlay.hide();
					scope.dialog.focus();
		        	scope.promiseShowDialog.resolve();
		        	domStyle.set(win.body(), 'overflow', 'hidden'); // lock content under Dialog
		        });
			});
		}
	});
	
});
