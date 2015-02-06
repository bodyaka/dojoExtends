define([
    "dojo/_base/declare",
	"dojo/on",
	"dijit/popup"
], function(declare, on, popup){

	return declare("_WidgetInPopup", null, {		
		/**
		 * Options for open popup
		 */
		options: {},
		_setOptionsAttr: function(options){
			this._set('options', options);
			
			var scope = this;
			
			if(options.around){ //Node around which popup is opened
				on(options.around, 'click', function(){
					scope.popupOpen();
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
			this._opened = true;
			
			this.options.popup = this; // set Widget which we must open (inherited of the _WidgetInPopup)
			
			popup.open(this.options);
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
