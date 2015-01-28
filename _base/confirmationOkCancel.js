define([
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/dom-construct",
	"dijit/Dialog",
	"dijit/form/TextBox",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/confirmationOkCancel.html",
	
	"dijit/form/Form"
], function(declare, event, lang, on, domConstruct, Dialog, TextBox, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, template){
		return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
			templateString: template,
			
			dialog: null,
			closeWidget: function(){
				if(this.dialog){
					this.dialog.destroyRecursive();
				}
			},
			
			/**
			 * Callbacks
			 */
			ok: function(){},
			cancel: function(){},
			
			/**
			 * Button click handlers
			 */
			actionOk: function(){
				var params = null;
				if(this.inputParams.length){
					params = this.formAdditionalParams.get('value');
				}
				this.closeWidget();
				this.ok(params);
			},
			actionCancel: function(){
				this.closeWidget();
				this.cancel();
			},
			
			message: '',
			_setMessageAttr: function(message){
				if(message){
					this.nodeMessage.innerHTML = message;
				}
			},
			
			content: '',
			_setContentAttr: function(content){
				if(content){
					this.nodeContent.innerHTML = content;
					showElement(this.nodeContent);
				}
			},
			
			/**
			 * Array of information about inputs
			 * 
			 * [{label:'Stamp label', name: 'stamp'}]
			 */
			inputParams: [],
			_setInputParamsAttr: function(inputParams){
				// create new TR nodes for inputs on template
				for(var i in inputParams){
					var tr = domConstruct.create('tr');
					var td1 = domConstruct.create('td', {innerHTML: inputParams[i].label}, tr);
					var td2 = domConstruct.create('td', null, tr);
					
					var input = new TextBox({
						name: inputParams[i].name
					}).placeAt(td2);
					
					domConstruct.place(tr, this.nodeListAnchor, 'before');
				}
			},
			
			dialogTitle: 'Внимание',
			message: '',
			
			/**
			 * submit by press Enter must be canceled. Only by press submit button
			 */
			submit: function(e){
				event.stop(e);
			},
			
			postCreate: function(){
				this.dialog = new Dialog({
					title: this.dialogTitle,
		            content: this.domNode,
		            closable: false
		        });
		        
		        this.own(handleEventEnterEsc(this, this.actionOk, this.actionCancel)); // handle Esc and Enter keypress
		        
		        this.dialog.show();
			}
		});
	});
