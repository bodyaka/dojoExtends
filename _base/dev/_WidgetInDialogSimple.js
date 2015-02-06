define([
    "dojo/_base/declare",
    "dojo/Deferred",
    "dojo/when",
    "dojo/dom-style",
    "dojo/aspect",
    "dojox/mobile/SimpleDialog",
    "dijit/focus"/*,
    //"engine/widgets/global/confirmationOkCancel"*/
], function(declare, Deferred, when, domStyle, aspect, SimpleDialog, focusUtil/*, ConfirmationOkCancelWidget*/){

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
					scope.dialog.removeCover();
					scope.dialog.destroyRecursive();
				};
				
				scope.dialog = new SimpleDialog({
					closeButton: true, 
					style: 'width: auto;',
					modal: true,
						
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
				
//					scope.own(handleEventEnterEsc(scope, null, scope.closeWidget)); // handle Esc and Enter keypress
		        }).placeAt(Application.layoutId);
				scope.placeAt(scope.dialog);
			});
			
			aspect.after(this, 'postCreate', function(){
				var promiseShow = scope.dialog.show();
//		        when(promiseShow, function(){ // show and resolve Deferred for action
					focusUtil.focus(scope.dialog.domNode);
		        	scope.promiseShowDialog.resolve();
//		        });
			});
		}
	});
	
});
