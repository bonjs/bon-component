


define(['app', 'Component', 'ComponentAngular', 'extend'], function(app, Component, ComponentAngular, extend) {
		

	
	app.directive('tableRowsRepeatFinished', function ($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				if (scope.$last === true) {
					$timeout(function() {
						scope.$emit('tableRowsRepeatFinished');
					});
				}
			}
		};
	});

	app.directive('tableColsRepeatFinished', function ($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				if (scope.$last === true) {
					$timeout(function() {
						console.log('cols')
						scope.$emit('tableColsRepeatFinished');
					});
				}
			}
		};
	});





	var Grid = extend(ComponentAngular, {
		
		data: [],
		
		template: `
		
			<div class="component-grid">
				<div class="table-body">
					<div class="locked-columns">
						<table class="columns-title" border="0" cellspacing="0" cellpadding="0">
						  <!-- 锁定列的表头 -->
						  <tr ng-repeat="row in lockedMultiTitles">
							<td ng-if="isShowRowNo" class="row-no"><div class="table-cell"></div></td>
							<td ng-repeat="col in row" colspan="{{col.allLeafLength}}" rowspan="{{col.rowspan}}">
								<div class="table-cell">
									{{col.header}}
									<span class="sortable-icon" ng-if="col.sortable === true" ng-class="col.sort" ng-click="sortClick(col)"></span>
									<input ng-if="col.type == 'checkbox'" type="checkbox"  ng-checked="col.isCheckAll" ng-click="checkAll($event, col)" />
								</div>
							</td>
						  </tr>
						</table>
						<table class="columns-content" border="0" cellspacing="0" cellpadding="0">
						  <tr ng-repeat="(rowIndex, row) in data" table-rows-repeat-finished>
							<td ng-if="isShowRowNo" class="row-no"><div class="table-cell">{{rowIndex + 1}}</td>
							<td ng-repeat="(colIndex, col) in lockedMultiTitlesLeaf " col-type="{{col.type}}" compile-bind-expn="renderTpl(row[col.dataIndex], row, col, rowIndex, colIndex)">
								<!--
								{{col.type == 'data' ? row[col.dataIndex] : ""}}
								<input ng-if="col.type != 'data'" type="{{col.type}}" ng-checked="row.isChecked" ng-click="checkItem($event, row, rowIndex, col)"/>
								-->
							</td>
						  </tr> 
						</table>
					</div>

					<div class="unlocked-columns">
						<table class="columns-title" border="0" cellspacing="0" cellpadding="0">
						  <!-- 非锁定列的表头 -->
						  <tr ng-repeat="row in unlockedMultiTitles">
							<td ng-repeat="col in row" colspan="{{col.allLeafLength}}" rowspan="{{col.rowspan}}">
								<div class="table-cell">
									{{col.header}}
									<span class="sortable-icon" ng-if="col.sortable === true" ng-class="col.sort" ng-click="sortClick(col)"></span>
								</div>
							</td>
						  </tr>
						</table>
						<table class="columns-content" border="0" cellspacing="0" cellpadding="0">
						  <tr ng-repeat="(rowIndex, row) in data">
							<td ng-repeat="(colIndex, col) in unlockedMultiTitlesLeaf" compile-bind-expn="renderTpl(row[col.dataIndex], row, col, rowIndex, colIndex)">
								<!--
								{{row[col.dataIndex]}}
								-->
							</td>
						  </tr>      
						</table>
						<div class="scroll-bar-y">
							<div></div>
						</div>
						<div class="scroll-bar-x">
							<div></div>
						</div>
					</div>
					<div style="clear:both;"></div>
				</div>
				<div class="table-footer">
					<li class="prev page-button" ng-click="prev()"></li>
					<li ng-repeat="no in pageNos" class="page-no {{pageNo == no ? 'current-page' : ''}}" ng-click="pageGo(no)">{{no}}</li>
					
					<li class="next page-button" ng-click="next()"></li>
				</div>
			</div>
		
		`,
		
		isShowRowNo: true,	// 是否显示行号
		
		pageNo: 1,
		pageSize: 10,
		
		pageNoKey: 'pageNo',	// 指定当前分页页码的key,默认是pageNo
		pageSizeKey: 'pageSize',	// 指定分页一页大小的key, 默认是pageSize

		constructor : function () {

			this.super(arguments);

			var me = this;
			
			
			$('.table-body', this.el).height(this.height - $('.table-footer', this.el).height());
			
			this.initEvent();
			
			this.render();
			
			window.s = this.scope;
		},
		
		render: function() {
			this.initTitle();
			this.initTable();
		},
		
		
		initTitle: function() {
			
			var me = this;
			var lockedMultiTitles = [];		// 多级表头(包括多级表头关系)
			var lockedMultiTitlesLeaf = [];	// 多级表头实际的列(真正显示数据的列,为多级表头的叶子节点)
			
			var unlockedMultiTitles = [];		// 多级表头(包括多级表头关系)
			var unlockedMultiTitlesLeaf = [];	// 多级表头实际的列(真正显示数据的列,为多级表头的叶子节点)
			
			
			// 获取多级表头层级数
			var maxDepth = function() {
				var maxDepth = 0;
				function getDepth(col, depath) {
					if(col.columns) {
						maxDepth ++;
						col.columns.forEach(function(c) {
							getDepth(c);
						});
					}
				}
				me.columns.forEach(function(col) {
					getDepth(col, maxDepth);
				});
				
				return maxDepth;
			}();
			
			
		
			this.columns.forEach(function(col) {
				
				initCol(col, 1);
			});
			
			// 设置节点的depth, parent操作
			function initCol(col, level) {
			
				col.allLeafLength = Column.prototype.getAllLeafLength.call(col);
				col.depth = level;
				
				if(col.locked == true) {
					if(!lockedMultiTitles[level - 1]) {
						lockedMultiTitles[level - 1] = [];
					}
				
					lockedMultiTitles[level - 1].push(col);
				} else if(col.locked != true) {
					if(!unlockedMultiTitles[level - 1]) {
						unlockedMultiTitles[level - 1] = [];
					}
				
					unlockedMultiTitles[level - 1].push(col);
				}
			
				level ++;
				
				if(col.columns) {
					col.columns.forEach(function(it) {
						it.parent = col;
						initCol(it, level);
					});
					
				} else {
					(col.locked == true ? lockedMultiTitlesLeaf : unlockedMultiTitlesLeaf).push({
						grid : me,
						type : col.type || 'data',
						header : col.header,
						dataIndex : col.dataIndex,
						locked : col.locked,
						sortable : col.sortable,
						scope : me.scope,
						onRender: col.onRender

					});
					/**
						叶子节点的rowspan = maxDepth - depth;
						叶子节点的所有父节点rowspan都为1
					*/
					col.rowspan = maxDepth - col.depth;
					Column.prototype.setParentRowspan.call(col);
				}
			}
			
			//console.log(arr);
			//this.columns 原始列配置
			
			this.lockedMultiTitles = this.scope.lockedMultiTitles = lockedMultiTitles;
			this.lockedMultiTitlesLeaf = this.scope.lockedMultiTitlesLeaf = lockedMultiTitlesLeaf;
			
			this.unlockedMultiTitles = this.scope.unlockedMultiTitles = unlockedMultiTitles;
			this.unlockedMultiTitlesLeaf = this.scope.unlockedMultiTitlesLeaf = unlockedMultiTitlesLeaf;
			
			
		},
		
		initTable : function () {
			var me = this;
			
			this.scope.data = this.data;
			this.scope.pageNo = this.pageNo;
			
			/*
			this.columns = this.columns.reduce(function (arr, it) {
				var col = new Column({
					grid : me,
					type : it.type || 'data',
					header : it.header,
					dataIndex : it.dataIndex,
					locked : it.locked,
					sortable : it.sortable,
					scope : me.scope,
					onRender: it.onRender
				});
				arr.push(col);
				return arr;
			}, []);
			*/
			
			
			
			this.scope.$apply();
			
			
			
			this.scope.pageNos = function() {
				var arr = [];
				
				if(me.pageNo <= 3) {
					arr.push.apply(arr, [1, 2, 3, 4, 5]);
				} else {
					arr.push(me.pageNo - 2);
					arr.push(me.pageNo - 1);
					arr.push(me.pageNo);
					arr.push(me.pageNo + 1);
					arr.push(me.pageNo + 2);
				}
				return arr;
			}();
			
			
			this.initSize();
		},
		
		
		initEvent: function() {
			
			var me = this;
			
			var scope = this.scope;
			
			scope.sortClick = this.sortClick.bind(this);

			scope.checkItem = this.checkItem.bind(this);
			scope.checkAll = this.checkAll.bind(this);
			scope.prev = this.prev.bind(this);
			scope.next = this.next.bind(this);
			scope.pageGo = this.pageGo.bind(this);
			
			
			/*
			 * v	: 当前值
			 * row	: 当前行数据
			 * col	: 当前列模型
			 * rowIndex: 当前行下标
			 * colIndex: 当前列下标
			 */
			 
			scope.renderTpl = function(v, row, col, rowIndex, colIndex) {
				var defaultColHtml = [
					//'{{col.type == "data" ? row[col.dataIndex] : ""}}',
					col.type == "data" ? row[col.dataIndex] : "",
					'<input ng-if="col.type != \'data\'" type="{{col.type}}" ng-checked="row.isChecked" ng-click="checkItem($event, row, rowIndex, col)"/>',
				].join('');
				
				
				return '<div class="table-cell">' + (col.onRender ? col.onRender.apply(me, arguments) : defaultColHtml) + '</div>';
			}
			
			scope.isShowRowNo = this.isShowRowNo;
			
			// 数据渲染完毕后设置Y滚动条的高度
			this.scope.$on('tableRowsRepeatFinished', function (ngRepeatFinishedEvent) {
				
				// 垂直滚动条
				me.dragV = new ScrollBar({
					el: $('.scroll-bar-y', me.el),
					dependEl: $('.columns-content tbody', me.el),
					listeners: {
						drag: function(barLeft, barTop) {
							var contentTop = barTop / this.rateHeight;
							$('.columns-content', me.el).scrollTop(contentTop);
						}
					}
					
				});
				
				// 水平滚动条
				me.dragH = window.drag = new ScrollBar({
					el: $('.scroll-bar-x', me.el),
					dependEl: $('.unlocked-columns .columns-title tbody', me.el),
					type: 'h',
					listeners: {
						drag: function(barLeft, barTop) {
							var contentLeft = barLeft / this.rateWidth;
							$(".unlocked-columns .columns-title, .unlocked-columns .columns-content", me.el).scrollLeft(contentLeft);
						}
					}
					
				});
			});
			
			// 处理滚动条
			$('.table-body', this.el).on('wheel', function(e){
				
				var barTop = +me.dragV.bar.css('top').replace('px', '');
				
				barTop = barTop - e.originalEvent.wheelDeltaY * me.dragV.rateHeight;
			
				me.dragV.dragBar(null, barTop);
				
				return false;
			});
			
			$('.scrfdafdsaoll-bar-y,fdasfd .scroll-bar-x', this.el).on('scroll', function() {
				
				var scrollTop = $('.scroll-bar-y', me.el).scrollTop();
				var scrollLeft = $('.scroll-bar-x', me.el).scrollLeft();

				$(".unlocked-columns .columns-title, .unlocked-columns .columns-content", me.el).scrollLeft(scrollLeft);
				
				$('.columns-content', me.el).scrollTop(scrollTop);
				return false;
			});
		},
		
		
		// 初始化size(加载数据前)
		/**
		 * 中间区域的高度(非内容)
		 * 
		 */
		initSize: function() {
			
			var el = this.el;
			
			var columnsTitle = $('.columns-title', el);
			var columnsContent = $('.columns-content', el);
			
			var lockedColumns = $('.locked-columns', el);
			var unlockedColumns = $('.unlocked-columns', el);
			
			var tableBody = $('.table-body', el);
			var footer = $('.table-footer', el);
			
			var borderWidth = +el.style.borderWidth.replace(/px/, '');
			
			tableBody.height(this.height - footer.height());
			
			
			columnsContent.height(this.height - columnsTitle.height() - footer.height());
			
			
			/**
			 * 处理y滚动条
			 * scroll-bar-y height = columns-content的高度 - 滚动条宽度
			 */
			
			$('.scroll-bar-y', el).css({
				top: columnsTitle.height(),
				height: columnsContent.height() - $('.scroll-bar-x', el).height()
			});
			
			
			if(this.dragH) {
				this.dragH.fixSize();
				this.dragH.dragBar(0, 0);
			}
			if(this.dragV) {
				this.dragV.fixSize();
				this.dragV.dragBar(0, 0);
			}
			
		},
		
		// 点击一列的单复选时
		checkItem : function (e, row, rowIndex, col) {
			var dom = e.srcElement;
			
			row.isChecked = dom.checked;
			
			var hasUnChecked = this.data.some(function(it) {
				return it.isChecked != true;
			});
			
			var checkedCol = this.scope.lockedColumnsTitles.filter(function(it, i) {
				return col.dataIndex == it.dataIndex;
			})[0];
			
			checkedCol.isCheckAll = !hasUnChecked;
			
			this.fireEvent('checkitem', dom.checked, row, rowIndex);
		},
		
		// 全选时
		checkAll: function(e, col) {
			var dom = e.srcElement;
			
			this.data.forEach(function(it, i) {
				it.isChecked = dom.checked;
			});
			
			var checkedCol = this.scope.lockedColumnsTitles.filter(function(it, i) {
				return col.dataIndex == it.dataIndex;
			})[0];
			
			checkedCol.isCheckAll = dom.checked;
			
			this.fireEvent('checkall', dom.checked);
		},
		sortClick : function (col) {
			col.sort = (col.sort == 'desc' || col.sort == undefined) ? 'asc' : 'desc';
			var dataIndex = col.dataIndex;
			this.scope.data.sort(function (a, b) {
				if (typeof a[dataIndex] == 'number' && typeof b[dataIndex] == 'number') {
					if (col.sort == 'asc') {
						return a[dataIndex] - b[dataIndex];
					} else {
						return b[dataIndex] - a[dataIndex];
					}
				} else {
					if (col.sort == 'asc') {
						return (a[dataIndex] + '').localeCompare(b[dataIndex])
					} else {
						return (b[dataIndex] + '').localeCompare(a[dataIndex])
					}
				}
			});
			this.fireEvent('titleclick', col);
		},
		
		
		
		/**
			params [string, array]
		*/
		load: function(p) {
			
			var me = this;
			
			if(typeof p == 'string') {
				var url = this.url = p;
				
				// beforeload事件中可以对url进行更改, 返回新的更新后的url, 如返回false则阻止load
				var beforeLoadResult = me.fireEvent('beforeload', url)
				if(beforeLoadResult === false) {
					return;
				};
				
				if(typeof beforeLoadResult == 'string') {
					url = beforeLoadResult;
				}
				
				
				var p = {};
				p[this.pageNoKey] = this.pageNo;
				p[this.pageSizeKey] = this.pageSize;
				
				$.get(url, p, function(data) {
					afterLoad.call(me, data);
				});
			} else if(p instanceof Array) {
				afterLoad.call(me, p);
			}
			
			function afterLoad(data) {
				/**
				 * 如果接口返回数据不合要求, 可以在load事件中对返回数据进行修改,使之符合table组件的要求
				 * 如果在load事件函数中没有作返回,则不对data做处理, 直接交给table处理
				 */
				var loadResult = this.fireEvent('load', data);
				if(typeof loadResult == 'object') {
					data = beforeLoadResult;
				}
				this.scope.data = this.data = data;
				this.scope.$apply();
				
				this.fireEvent('afterload', data);
			}
		},
		
		prev: function() {
			this.pageNo > 1 && (this.scope.pageNo = this.pageNo --);
			this.pageGo(this.pageNo);
			this.load(this.url);
			
		},
		next: function() {
			this.scope.pageNo = this.pageNo ++;
			this.pageGo(this.pageNo);
			this.load(this.url);
		},
		pageGo: function(no) {
			var me = this;
			this.pageNo = this.scope.pageNo = no;
			
			this.scope.pageNos = function() {
				var arr = [];
				
				if(me.pageNo <= 3) {
					arr.push.apply(arr, [1, 2, 3, 4, 5]);
				} else {
					arr.push(me.pageNo - 2);
					arr.push(me.pageNo - 1);
					arr.push(me.pageNo);
					arr.push(me.pageNo + 1);
					arr.push(me.pageNo + 2);
				}
				return arr;
			}();
			this.load(this.url);
		}
	});

	var Column = extend(Component, {

		isLocked : false, // 是否是锁定列
		type : 'data', // [data, checkbox, radio]
		isChecked : true,
		constructor : function () {

			this.super(arguments);

			var me = this;
		},
		
		getAllLeafLength : function() {
			var meFn = arguments.callee;
			var me = this;
			//this.allLeafLength = this.allLeafLength || 0;
			this.allLeafLength = 0;
			if(this.columns) {
				this.columns.forEach(function(c, i) {
					me.allLeafLength += meFn.call(c);
				});
				return this.allLeafLength;
			} else {
				return this.allLeafLength = 1;
			}
		},
		
		setParentRowspan : function() {
			
			var c = this;
			
			if(!c.columns) {
				while(c = c.parent) {
					c.rowspan = 1;
				}
			}
		}
		

	});

	var ScrollBar = extend(Component, {
		
		el: null,
		type: 'v',
		constructor : function () {

			this.super(arguments);

			var me = this;
			
			
			var isDrag = false;
			var x, y;// 拖动位置
			
			var el = this.el;
			var bar = this.bar = $('div', this.el);
			
			
			this.fixSize();
			
			bar.on('mousedown', function(e) {
				isDrag = true;
				x = e.clientX - bar[0].offsetLeft;
				y = e.clientY - bar[0].offsetTop;
			});
			
			$(document).on('mousemove', function(e) {
				if(isDrag) {
					
					var barLeft = e.clientX - x;
					var barTop = e.clientY - y;
					
					//var contentLeft = barLeft / rateWidth;
					//var contentTop = barTop / rateHeight;
					
					//me.fireEvent('drag', barLeft, barTop);
					
					me.dragBar(barLeft, barTop)
					
					return false;
				}
			});
			
			$(document).on('mouseup', function(e) {
				isDrag = false;
			});
			
			$(document).on('mouseout', function(e) {
				if(!me.isParent(e.target, this.body) && e.target != this.body) {
					isDrag = false;	
				}
			});
		},
		
		fixSize: function() {
			
			var contentWidth = this.dependEl.width();
			var contentHeight = this.dependEl.height();
			
			var elHeight = this.el.height();
			var elWidth = this.el.width();
			
			var rateHeight = this.rateHeight = (elHeight - elHeight * elHeight / contentHeight) / (contentHeight - elHeight);
			var rateWidth = this.rateWidth = (elWidth - elWidth * elWidth / contentWidth) / (contentWidth - elWidth);
			
			
			if(this.type == 'v') {
				this.bar.height(this.el.height() * this.el.height() / contentHeight);
			} else if(this.type == 'h') {
				this.bar.width(this.el.width() * this.el.width() / contentWidth);
			}
		},
		dragBar: function(barLeft, barTop) {
			var me = this;
			
			if(barLeft != undefined && me.type == 'h') {
				if(barLeft < 0) {
					barLeft = 0;
				}
				if(barLeft > me.el.width() - me.bar.width()) {
					barLeft = me.el.width() - me.bar.width()
				}
				
				me.bar[0].style.left = barLeft;
			}
			
			if(barTop != undefined && me.type == 'v') {
				if(barTop < 0) {
					barTop = 0;
				}
				if(barTop > me.el.height() - me.bar.height()) {
					barTop = me.el.height() - me.bar.height()
				}
				
				me.bar[0].style.top = barTop;
			}
			
			this.fireEvent('drag', barLeft, barTop);
		},
		scrollTop: function(top) {
			this.drag(undefined, top);
		},
		scrollLeft: function(left) {
			this.drag(left);
		},
		isParent: function(a, b) {
			while((a = a.parentNode) && a.nodeName != 'HTML') {
				if(a == b) {
					return true
				}
			}
			return false;
		}

	});

	return Grid;
	
});
