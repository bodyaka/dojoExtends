define([
    "dojo/_base/declare",
	"dojo/on",
	"dijit/popup"
], function(declare, on, popup){

	return declare("_WidgetInPopup", null, {
		/**
		 * Node around which popup is opened
		 */
		around: null,
		_setAroundAttr: function(around){
			var scope = this;
			if(around){
				on(around, 'click', function(){
					scope.popupOpen();
					scope._opened = true;
				});
			}
		},
		
		/**
		 * Flag which means that popup is already opened for redraw with right position
		 */
		_opened: false,
		
		/**
		 * Close popup
		 */
		popupClose: function(){
			popup.close(this);
			this._opened = false;
		},
		
		/**
		 * Open popup
		 */
		popupOpen: function(){
			popup.open({
				around: this.around,
				popup: this,
				orient: ['above-alt']
			});
		},
		
		/**
		 * Redraw popup if it already opened
		 */
		popupRedraw: function(){
			if(this._opened){
				this.popupOpen();
			}
		}
	});
	
});
