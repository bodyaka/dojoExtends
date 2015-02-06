define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/dom-construct",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/TagController.html",
	
	"dijit/form/ComboBox"
], function(declare, lang, on, domConstruct, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, template){

	return declare('TagController', [WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
		
		constructor: function(){
			this.tags = [];
		},
		
		templateString: template,
		
		/**
		 * Callback fired when user attach tag on the form
		 */
		cbTagAdded: function(tagObject){},
		/**
		 * Callback fired when user remove tag from the form
		 */
		cbTagRemoved: function(tagObject){},
		/**
		 * Callback fired when user add new tag
		 */
		cbTagNew: function(tagName){},
		
		/**
		 * Array of attached tags
		 */
		tags: null,
		_setTagsAttr: function(tags){
			this._set('tags', tags);
			if(Array.isArray(tags) && tags.length){
				if(!this.tagsStore){
					// if attached list already loaded, but store not yet, then set flag to "true", and run this function again 
					this.storeLate = true;
					return;
				}
			}else{
				return;
			}
			
			for(var i in tags){
				var tagObject = this.tagsStore.get(tags[i]);
				if(tagObject) this._tagDraw(tagObject);
			}
		},
		
		/**
		 * Available tags list
		 */
		tagsStore: null,
		_setTagsStoreAttr: function(tagsStore){
			this._set('tagsStore', tagsStore);
			this.selectTagsStore.set({store: tagsStore});
			
			if(this.storeLate){
				this.storeLate = false;
				this._setTagsAttr(this.tags);
			}
		},
		
		/**
		 * Name of the field where label is stored
		 */
		labelAttr: 'name',
		_setLabelAttrAttr: function(labelAttr){
			this.selectTagsStore.set({
				labelAttr: labelAttr,
				searchAttr: labelAttr,
			});
		},
		
		/**
		 * Additional static query for storage
		 */
		query: null,
		_setQueryAttr: function(query){
			this.selectTagsStore.set({
				query: query
			});
		},
		
		/**
		 * Add tag to widget
		 */
		tagAdd: function(tagObject){
			if(this.tags.indexOf(tagObject.id) >= 0) return;
			
			this.tags.push(tagObject.id);
			this._tagDraw(tagObject);
			
			this.cbTagAdded(tagObject);
		},
		
		/**
		 * Remove tag from widget
		 */
		tagRemove: function(tagObject, quiet){
			this.tags.splice(this.tags.indexOf(tagObject.id), 1);
			
			if(!quiet) this.cbTagRemoved(tagObject);
		},
		
		/**
		 * Draw tag on page
		 */
		_tagDraw: function(tagObject){
			
			var nodeTag = domConstruct.create('div', {
				innerHTML: tagObject[this.labelAttr],
				'class': 'tag',
				style: {
					'float': 'left',
					fontWeight: 'bold',
					marginRight: '2px'
				}
			}, this.nodeTags);
			
			var buttonTagRemove = domConstruct.create('div', {
				'class': 'dijitDialogCloseIcon',
				style: {
					'float': 'right',
					position: 'relative',
					marginLeft: '2px'
				}
			}, nodeTag, 'last');
			
			var scope = this;
			var clickHandler = on(buttonTagRemove, 'click', function(evt){
				clickHandler.remove();
				domConstruct.destroy(nodeTag);
				scope.tagRemove(tagObject);
			});
			this.own(clickHandler);
		},
		
		postCreate: function(){
			var scope = this;
			this.own(on(this.selectTagsStore, 'keydown', function(evt){
				if(evt.keyCode == 13){ //enter
					scope.cbTagNew(this.get('value'));
				}
			}));
			this.own(on(this.selectTagsStore, 'change', function(tagName){
				if(!tagName) return;
				
				var tagObject = scope.selectTagsStore.get('item');
				if(!tagObject){
					// tag must be saved in handler "keydown"
					return;
				}
				
				scope.tagAdd(tagObject);
				scope.selectTagsStore.reset();
			}));
		}
	});
});
