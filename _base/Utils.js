define([
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/topic",
	"dojo/query",
	"dojo/on",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-prop",
	"dojo/dom-class",
	"dojo/dom-style",
    "dojo/date/locale"
], function (lang, win, topic, query, on, dom, domConstruct, domProp, domClass, domStyle, locale) {
	
	on(win.doc, 'keydown', function(e){
		topic.publish('globalEventKeydown', e);
	});
	
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
		 * Parse integer value from end of string
		 */
		parseIntRight: function(s){
			s = s || '';
			var t = '';
			var l = s.length;
			while ((isFinite(parseInt(s.substr(l - 1, 1))) || s.substr(l - 1, 1) == '-') && t.substr(0, 1) != '-') {
				t = s.substr(l - 1, 1) + t;
				s = s.substr(0, l - 1);
				l--;
			}
			if (t == '') t = 0;
			return t;			
		},
		
		/**
		 * Bind Selecting (Ctrl|Shift) functionality to table
		 * 
		 * trsNodeList - type: query.NodeSlect object
		 */
		bindSelectingToTable: function(trsNodeList, callback){
			var lastSelectedRow;
			
			// disable text selection
			if(trsNodeList[0]){
				var parent = trsNodeList[0].parentNode;
				domStyle.set(parent, {
					'-webkit-touch-callout': 'none',
					'-webkit-user-select': 'none',
					'-khtml-user-select': 'none',
					'-moz-user-select': 'none',
					'-ms-user-select': 'none',
					'user-select': 'none'
				});
			}
			
			var clearAll = function(){
				for(var i in trsNodeList){
					domClass.remove(trsNodeList[i], 'selected');
				}
			};
			
			var toggleRow = function(row){
				domClass.toggle(row, 'selected');
			    lastSelectedRow = row;
			};
			
			var selectRowsBetweenIndexes = function(indexes) {
			    indexes.sort(function(a, b) {
			        return a - b;
			    });

			    for(var i = indexes[0]; i <= indexes[1]; i++){
			    	domClass.add(trsNodeList[i-1], 'selected');
			    }
			};
			
			var rowClickHandlers = trsNodeList.on('mousedown', function(evt){
			    if(evt.ctrlKey){
			        toggleRow(this);
			    }

			    if(evt.button === 0){
			        if(!evt.ctrlKey && !evt.shiftKey){
			            clearAll();
			            toggleRow(this);
			        }

			        if(evt.shiftKey){
			            selectRowsBetweenIndexes([lastSelectedRow.rowIndex, this.rowIndex])
			        }
			    }
			    
			    // run callback, if exist
			    if(callback) callback();
			});
			
			return rowClickHandlers;
		},
		
		/**
		 * Filter select options by statuses algorithm 
		 */
		selectOptionsFiltersStatusesByAlgorithm: function(selectWidget, statusId, statusesMap, statusesAlgorithm) {
			var algorithm = statusesAlgorithm[statusId] || [];
			
			selectWidget.set('disabled', false);
			
			var options = [];
			// sort options by source list
			for(var i in statusesMap){
				if(i == statusId || algorithm.indexOf(String(i)) >= 0){
					options.push({
						value: String(i),
						label: statusesMap[i]
					});
				}
			}
			
			selectWidget.set('options', options);
			selectWidget.set('value', String(statusId));
		},
		
		/**
		 * DateTime object to date (yyyy.MM.dd)
		 */
		convertDatetimeToStrDate: function(datetime)
		{
			return locale.format(datetime, {datePattern: "yyyy.MM.dd", selector: "date"});
		},
		
		/**
		 * DateTime object to time (HH:mm:ss)
		 */
		convertDatetimeToStrTime: function(datetime)
		{
			return locale.format(datetime, {timePattern: "HH:mm:ss", selector: "time"});
		},
		
		/**
		 * DateTime object to datetime (yyyy.MM.dd HH:mm)
		 */
		convertDatetimeToStrDatetime: function(datetime)
		{
			return locale.format(datetime, {datePattern: "yyyy.MM.dd", timePattern: "HH:mm:ss"});
		},
		
		/**
		 * Pretty json string and return dom node
		 * 
		 * @json: any type
		 */
		jsonPretty: function(json) {
		    if (typeof json == 'string') { // if string - prevent to object
		         json = JSON.parse(json);
		    }
		    json = JSON.stringify(json, undefined, 2);
		    
		    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		        var cls = 'number';
		        if (/^"/.test(match)) {
		            if (/:$/.test(match)) {
		                cls = 'key';
		            } else {
		                cls = 'string';
		            }
		        } else if (/true|false/.test(match)) {
		            cls = 'boolean';
		        } else if (/null/.test(match)) {
		            cls = 'null';
		        }
		        return '<span class="' + cls + '">' + match + '</span>';
		    });
		    
		    var jsonDom = domConstruct.toDom(json);
		    
		    // style dom
		    query('.key', jsonDom).style({fontWeight: 'bold', fontSize: '90%'});
		    query('.boolean', jsonDom).style({color: 'blue'});
		    query('.number', jsonDom).style({color: 'darkorange'});
		    query('.string', jsonDom).style({color: 'green'});
		    query('.null', jsonDom).style({color: 'magenta'});
		    var pre = domConstruct.create('pre')
		    domConstruct.place(jsonDom, pre);
		    
		    return pre;
		}
	};

});
