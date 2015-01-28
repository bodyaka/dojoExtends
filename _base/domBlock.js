define([
	"dojo/query",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style", 
	"dojo/dom-attr",
	"dojo/dom-geometry"
], function(query, domConstruct, domClass, domStyle, domAttr, domGeom){

	var cls; // exports object

	cls = {
		
		_imageFreeze: '/images/design/ajax_loader_grey.gif',
		_imageBlock: '/images/design/block_32.png',
		_classNameBlocked: 'dom_block_blocked',
		_classNameShield: 'dom_block_shield',
		_classNameNodeWrapper: 'dom_block_node_wrapper',
		
		/**
		 * Freeze node (uses for waitng when ajax request is return response)
		 */
		freezeNode: function(node){
			if(domClass.contains(node, cls._classNameBlocked)){
				// just set image on shield
				cls._setShieldImage(query('> .' + cls._classNameShield, node)[0], cls._imageFreeze);
			}else{
				cls._block(node, cls._imageFreeze);
			}
			
			domClass.add(node, cls._classNameBlocked); // mark that node is blocked
		},

		/**
		 * Block node (uses for block content until user make special action)
		 */
		blockNode: function(node){
			if(domClass.contains(node, cls._classNameBlocked)){
				// just set image on shield
				cls._setShieldImage(query('> .' + cls._classNameShield, node)[0], cls._imageBlock);
			}else{
				cls._block(node, cls._imageBlock);
			}
			
			domClass.add(node, cls._classNameBlocked); // mark that node is blocked
		},
		
		/**
		 * unfreeze request-initial node
		 */
		unFreezeNode: function(node){
			if(!domClass.contains(node, cls._classNameBlocked)) return false; // node already unblocked
			
			cls._unBlock(node);
			
			domClass.remove(node, cls._classNameBlocked); // unmark that node is blocked
		},
		
		
		
		
		
		
		
		
		_block: function(node, image)
		{
			var nodeStyle = domStyle.getComputedStyle(node);
			if(nodeStyle.display == 'inline') domStyle.set(node,'display','inline-block');
			
			node.style.minHeight = '12px';
			node.style.minWidth = '12px';
			
			var nodeSize = domGeom.position(node);
			var bgSize = parseInt(nodeSize.w < nodeSize.h ? nodeSize.w : nodeSize.h);
			bgSize = (bgSize > 32 || bgSize <= 0)? 32 : bgSize * 0.8; // make Ajax Loader somewhat smaller if necessary. If bgSize <= 0, then Node is not showed, than draw big Loader
			
			var _shield = this._generateShield(bgSize, image);
			
			switch(nodeStyle.display){
				case 'table':
					var container = domConstruct.create('div', {style: {display: 'inline-block', position: 'relative'}}, node, 'after');
					domConstruct.place(node, container, 'only');
					domConstruct.place(_shield, node, 'after');
					
					cls._wrapperPrepearePre(node);
					break;
				case 'table-header-group':
				case 'table-footer-group':
				case 'table-row-group':
				case 'table-row':
					var containerTr = domConstruct.create('tr', null, node, 'after');
					container = domConstruct.create('td', {colspan: 1000, style: 'position: relative;'}, containerTr, 'only');
					container = domConstruct.create('table',{className: 'nostyle', style: 'width:100%;'}, container, 'only');
					domConstruct.place(_shield, container, 'after');
					domConstruct.place(node, container, 'first');
					
					cls._wrapperPrepearePre(node);
					break;
//				case 'inline':
//					
//				case 'flex':
//				case 'block':
//				case 'inline-block':
//				case 'inline-flex':
//				case 'inline-table':
//				case 'list-item':
//				case 'table-caption':
//				case 'table-cell':
				default:
					if(nodeStyle.position == 'static') domStyle.set(node,'position','relative');
					
					// move all child nodes to new continer
					var container = domConstruct.create('div');
					if(node.children && node.children.length){
						for(var i = node.children.length - 1; i >= 0; i--){
							domConstruct.place(node.children[i], container, 'first');
						}
					}
					
					// move new container and ajax loader to Node
					domConstruct.place(container, node, 'only');
					domConstruct.place(_shield, node, 'last');
					
					// style container
					cls._wrapperPrepearePre(container);	
				break;
			}
		},
		
		_unBlock: function(node){
			switch(domStyle.get(node, 'display')){
				case 'table':
					domConstruct.place(node, query(node).parent()[0], 'replace');
					cls._wrapperPrepearePost(node);
					break;
				case 'table-header-group':
				case 'table-footer-group':
				case 'table-row-group':
				case 'table-row':
					domConstruct.place(node, query(node).parent().parent().parent()[0], 'replace');
					cls._wrapperPrepearePost(node);
					break;
				case 'inline':
				case 'flex':
				case 'block':
				case 'inline-block':
				case 'inline-flex':
				case 'inline-table':
				case 'list-item':
				case 'table-caption':
				case 'table-cell':
				default:
					
					var container = query('> .' + cls._classNameNodeWrapper, node)[0];
					if(container.children && container.children.length){
						for(var i = container.children.length - 1; i >= 0; i--){
							domConstruct.place(container.children[i], node, 'first');
						}
					}
					domConstruct.destroy(query('> .' + cls._classNameShield, node)[0]);
					domConstruct.destroy(container);
					
					break;
			}
		},
		
		/**
		 * Prepare node for freeze
		 */
		_wrapperPrepearePre: function(node){
			domAttr.set(node, 'opacity_origin', domStyle.get(node, 'opacity'));
			domStyle.set(node, 'opacity', 0.2);
			domClass.add(node, cls._classNameNodeWrapper);
		},
		
		/**
		 * Prepare node after freeze
		 */
		_wrapperPrepearePost: function(node){
			if(domAttr.has(node, 'opacity_origin')){
				domStyle.set(node, 'opacity', domAttr.get(node, 'opacity_origin'));
				domAttr.remove(node, 'opacity_origin');
			}
			domClass.remove(node, cls._classNameNodeWrapper);
		},
		
		_setShieldImage: function(shieldNode, image){
			if(shieldNode && !domClass.contains(shieldNode, cls._classNameShield)) return false;
			
			domStyle.set(shieldNode, 'background-image', 'url("' + image + '")');
		},
		
		/**
		 * generate shield layout
		 */
		_generateShield: function(size, image){
			var _shieldStyle = {
					backgroundSize: size + 'px ' + size + 'px',
					backgroundPosition: 'center center',
					backgroundColor: 'transparent',
					backgroundRepeat: 'no-repeat',
					position: 'absolute',
					top: '0px',
					left: '0px',
					width: '100%',
					height: '100%',
					zIndex: '999'
			};
			
			var _shield = domConstruct.create('div', {className: cls._classNameShield, style: _shieldStyle});
			cls._setShieldImage(_shield, image);
			
			return _shield;
		}
	};

	return cls;
});
