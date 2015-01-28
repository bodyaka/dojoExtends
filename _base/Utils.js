define([
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/on",
	"dojo/dom",
	"dojo/dom-prop",
	"dojo/dom-style",
    "dojo/date/locale"
], function (lang, topic, on, dom, domProp, domStyle, locale) {
	
	return {
		
		/**
		 * hide html element
		 */
		hideElement: function(el) {
			el = dom.byId(el);
			if (!el) return false;
			domStyle.set(el, 'display', 'none');
			return true;
		},
		
		/**
		 * show html element
		 */
		showElement: function(el, displayType) {
			displayType = displayType || 'block';
			
			el = dom.byId(el);
			if (!el) return false;
			var tagName = domProp.get(el, 'tagName');
			if(tagName == 'TR'){
				displayType = 'table-row';
			}else if(tagName == 'TD'){
				displayType = 'table-cell';
			}else if(tagName == 'SPAN' || tagName == 'A'){
				displayType = 'inline';
			}
			domStyle.set(el, 'display', displayType);
			return true;
		},
		
		/**
		 * toggle html element
		 */
		toggleElement: function(el) {
			el = dom.byId(el);
			if (!el) return false;
			if(domStyle.get(el, 'display') == 'none'){
				showElement(el);
			}else{
				hideElement(el);
			}
			return true;
		},
		
		/**
		 * Prepare entity for widget. Rename id property to entity_id (dojo widget compability)
		 */
		prepareEntityForWidget: function(entity)
		{
			if(entity.id != undefined){
				entity = lang.clone(entity);
				entity.entityId = entity.id;
				delete entity.id;
			}
			return entity;
		},
		
		/**
		 * Prepare entity after widget. Rename entity_id property to id (dojo widget compability)
		 */
		prepareEntityAfterWidget: function(entity)
		{
			if(entity.entityId != undefined){
				entity.entityId = Number(entity.entityId);
				if(entity.entityId){
					entity.id = entity.entityId;
				}
				delete entity.entityId;
			}
			return entity;
		},
		
		/**
		 * Handler for key press on widget
		 */
		handleEventEnterEsc: function(scope, funcEnter, funcEsc){
			funcEnter = funcEnter || function(){};
			funcEsc = funcEsc || function(){};
			
			return topic.subscribe('globalEventKeydown', function(e){
				if(!scope.focused) return; // if widget not in focus, then return
				
				switch(e.keyCode){
					//enter
					case 13 : lang.hitch(scope, funcEnter)(); break;
					//escape
					case 27 : lang.hitch(scope, funcEsc)(); break;
					//anything else
					default : break;
				}
			});
		},
		
		/**
		 * DateTime object to time (HH:mm)
		 */
		timeToStrClient: function(time)
		{
			return locale.format(time, {timePattern: "HH:mm:ss", selector: "time"});
		}
	};

});
