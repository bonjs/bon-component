var Column = extend(Component, {

	isLocked : false, // 是否是锁定列
	type : 'data', // [data, checkbox, radio]
	isChecked : true,
	constructor : function () {

		this.super(arguments);

		var me = this;
	}

});

var Table = extend(ComponentAngular, {
	
	isShowRowNo: true,	// 是否显示行号

	constructor : function () {

		this.super(arguments);

		var me = this;

		var app = angular.module("app", []);
		app.controller('main', ['$scope', '$compile', function ($scope, $compile) {

				window.s = me.scope = $scope;
				

				me.scope.data = me.data;

				me.scope.sortClick = me.sortClick.bind(me);

				me.scope.checkItem = me.checkItem.bind(me);
				me.scope.checkAll = me.checkAll.bind(me);
				me.scope.prev = me.prev.bind(me);
				me.scope.next = me.next.bind(me);
				
				me.scope.isShowRowNo = me.isShowRowNo;
				

				//通过$compile动态编译html
				var template = angular.element(me.template);
				var element = $compile(template)($scope);

				var el = me.el = element[0];
				
				angular.element(window).bind('load', function() {
					me.fixSize(el);
				});
				angular.element(document.body).append(element);
				me.initTable();
				
			}
		]);
		
		app.filter('to_trusted', ['$sce', function ($sce) {
				return function (text) {
					return $sce.trustAsHtml(text);
				};
			}
		]);
	},
	initTable : function () {
		var me = this;
		this.columns = this.columns.reduce(function (arr, it) {
			var col = new Column({
				grid : me,
				type : it.type || 'data',
				header : it.header,
				dataIndex : it.dataIndex,
				locked : it.locked,
				sortable : it.sortable,
				scope : me.scope,
				tpl: it.onRender && it.onRender.call()
			});
			arr.push(col);
			return arr;
		}, []);


		this.scope.lockedColumnsTitles = this.columns.filter(function (it) {
			return it.locked === true;
		});

		this.scope.unlockedColumnsTitles = this.columns.filter(function (it) {
			return it.locked !== true;
		});
	},
	fixSize: function(el) {
		
		var borderWidth = +el.style.borderWidth.replace(/px/, '');
		
		el.style.height = this.height - borderWidth * 2;
		el.style.width = this.width - borderWidth * 2;
		
		var lockedColumns = $('.locked-columns');
		var unlockedColumns = $('.unlocked-columns');
		
		var columnsTitle = $('.columns-title');
		var columnsContent = $('.columns-content');
		
		var footer = $('.table-footer');
		
		unlockedColumns.width(this.width - lockedColumns.width() - 1);
		
		columnsContent.height(this.height - columnsTitle.height() - footer.height() + 2);
		
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
		
		this.fireEvent('checkitem', col, rowIndex, dom.checked);
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
			var url = p;
			
			// beforeload事件中可以对url进行更改, 返回新的更新后的url, 如返回false则阻止load
			var beforeLoadResult = me.fireEvent('beforeload', url)
			if(beforeLoadResult === false) {
				return;
			};
			
			url = beforeLoadResult !== undefined ? beforeLoadResult : url;
			$.get(url, { }, function(data) {
				afterLoad.call(me, data);
			});
		} else if(p instanceof Array) {
			afterLoad.call(me, p);
		}
		
		function afterLoad(data) {
			/* 如果接口返回数据不合要求, 可以在load事件中对返回数据进行修改,使之符合table组件的要求
				如果在load事件函数中没有作返回,则不对data做处理, 直接交给table处理
			*/
			var loadResult = this.fireEvent('load', data);
			if(loadResult !== undefined) {
				data = loadResult;
			}
			
			this.fireEvent('afterload', data);
		}
		
	},
	
	prev: function() {
		alert('prev')
	},
	next: function() {
		alert('next')
	}
});

var table = new Table({
	width: 500,
	height: 200,
	template : template.innerHTML,
	data : function () {
		var arr = [];

		for (var i = 0; i < 20; i++) {
			arr.push({
				id : i + 1,
				name : 'sun' + (i + 1),
				chinese : parseInt(Math.random() * 60 + 40),
				math : parseInt(Math.random() * 60 + 40),
				english : parseInt(Math.random() * 60 + 40),
				physics : parseInt(Math.random() * 60 + 40),
				biology : parseInt(Math.random() * 60 + 40),
				chemistry : parseInt(Math.random() * 60 + 40)
			});
		}
		return arr;
	}(),
	listeners : {
		titleclick : function (a) {
			console.log('titleclick', a)
		},
		checkitem : function (row, i, isChecked) {
			debugger;
			console.log(row, i)
		}
	},
	columns : [{
			type : 'checkbox',
			dataIndex : 'id',
			locked : true
		}, {
			header : '编号',
			dataIndex : 'id',
			sortable : true,
			locked : true,
			onRender: function() {
				return '<button>test</button>';
			}
		}, {
			header : '姓名',
			dataIndex : 'name',
			sortable : true,
		}, {
			header : '语文',
			sortable : true,
			dataIndex : 'chinese'
		}, {
			header : '数学',
			sortable : true,
			dataIndex : 'math'
		}, {
			header : '英语',
			sortable : true,
			dataIndex : 'english'
		}, {
			header : '物理',
			sortable : true,
			dataIndex : 'physics'
		}, {
			header : '生物',
			sortable : true,
			dataIndex : 'biology'
		}, {
			header : '化学',
			sortable : true,
			dataIndex : 'chemistry'
		}
	],
});

function divScroll(scrollDiv) {
	var scrollTop = scrollDiv.scrollTop;
	var scrollLeft = scrollDiv.scrollLeft;

	document.getElementById("locked-block").scrollTop = scrollTop;
	document.getElementById("tableDiv_title").scrollLeft = scrollLeft;
}

function wheel(event) {
	var evt = event || window.event;
	var bodyDivY = document.getElementById("tableDiv_y");
	var scrollDivY = document.getElementById("scrollDiv_y");
	scrollDivY.scrollTop = scrollDivY.scrollTop + evt.deltaY * 7;
}
