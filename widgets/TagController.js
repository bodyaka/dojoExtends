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
	
	/**
	 * Draw tag on page
	 */
	var tagDraw = function(tagObject){
		
		var nodeTag = domConstruct.create('div', {
			innerHTML: tagObject[this.labelAttr],
			'class': 'tag',
			style: {
				float: 'left',
				fontWeight: 'bold',
				marginRight: '2px'
			}
		}, this.nodeTags);
		
		var buttonTagRemove = domConstruct.create('div', {
			'class': 'dijitDialogCloseIcon',
			style: {
				position: 'relative',
				float: 'right',
				marginLeft: '2px'
			}
		}, nodeTag, 'last');
		
		var scope = this;
		var clickHandler = on(buttonTagRemove, 'click', function(evt){
			clickHandler.remove();
			domConstruct.destroy(nodeTag);
			scope.removeTag(tagObject);
		});
		this.own(clickHandler);
	};

	return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
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
		tags: [],
		_setTagsAttr: function(tags){
			for(var i in tags){
				this.addTag(tags[i], true);
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
		 * Available tags list
		 */
		tagsStore: null,
		_setTagsStoreAttr: function(tagsStore){
			this.selectTagsStore.set({store: tagsStore});
		},
		
		/**
		 * Add tag to widget
		 */
		addTag: function(tagObject, quiet){
			quiet = quiet || false;
			
			if(this.tags.indexOf(tagObject.id) >= 0) return;
			
			this.tags.push(tagObject.id);
			lang.hitch(this, tagDraw)(tagObject);
			
			if(!quiet) this.cbTagAdded(tagObject);
		},
		
		/**
		 * Remove tag from widget
		 */
		removeTag: function(tagObject, quiet){
			quiet = quiet || false;
			
			this.tags.splice(this.tags.indexOf(tagObject.id), 1);
			
			if(!quiet) this.cbTagRemoved(tagObject);
		},
		
		postCreate: function(){
			var scope = this;
			this.own(on(this.selectTagsStore, 'change', function(tagName){
				if(!tagName) return;
				
				var tagObject = scope.selectTagsStore.get('item');
				if(!tagObject){
					
					
					scope.cbTagNew(tagName);
					alert('"tag add" functionality not implemented yet!')
					return;
				}
				
				scope.addTag(tagObject);
				scope.selectTagsStore.reset();
			}));
		}
	});
});
