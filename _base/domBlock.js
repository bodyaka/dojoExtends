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
		
		_imageFreeze: 'data:image/gif;base64,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',
		_imageBlock: 'data:image/gif;base64,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',
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
