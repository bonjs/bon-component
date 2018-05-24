

var app = angular.module("app", []);

app.controller('main', ['$scope', '$compile', function ($scope, $compile) {
	
		window.s = window.globalScope = $scope;
		window.c = window.globalCompile = $compile;
	}
]);




var tmpScope;

var tableComponentDirective = function () {
	return {
		require : '?ngModel',
		restrict : 'E',
		transclude : true,
		replace : true,
		scope : true,
		template : template.innerHTML,
		link : function (scope, element, attrs, controller, i) {
			tmpScope = scope;
		}
	};
};
app.directive('tableComponent', tableComponentDirective);

app.directive('repeatFinished',function(){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
                scope.$emit('repeatFinished');
            }
        }
    }
});

app.directive("compileBindExpn", function ($compile) {
	return function linkFn(scope, elem, attrs) {
		scope.$watch("::" + attrs.compileBindExpn, function (html) {
			if (html && html.indexOf("<") != -1 && html.indexOf(">") != -1) {
				var expnLinker = $compile(html);
				expnLinker(scope, function transclude(clone) {
					elem.empty();
					elem.append(clone);
				});
			} else {
				elem.empty();
				elem.append(html);
			}
		})
	}
});
		





var Table = extend(ComponentAngular, {
	
	isShowRowNo: true,	// 是否显示行号

	constructor : function () {

		this.super(arguments);

		var me = this;
		
		this.initTemplate();
		
		this.initScopeEvent();
		
		this.initTable();
	
	},
	initTemplate: function() {
		
		var me = this;
		
		var directiveHTML = '<table-component></table-component>';
		
		//通过$compile动态编译html
		var template = angular.element(directiveHTML);
		
		var element = globalCompile(template)(globalScope);
		
		var el = this.el = element[0];
		
		// 在此无法直接获取到自定义指令中的scope, 只能通过定义外变量的方式来传递
		this.scope = tmpScope;
		tmpScope = undefined;
		
		
		
		// 左侧locked列加载完毕,以便获取size计算unlocked列的size
		this.scope.$on('repeatFinished', function (ngRepeatFinishedEvent) {
			me.fixSize(el);
		});
		
		
		angular.element(document.body).append(element);
	},
	initScopeEvent: function() {
		
		var me = this;
		
		var scope = this.scope;
		
		scope.sortClick = this.sortClick.bind(this);

		scope.checkItem = this.checkItem.bind(this);
		scope.checkAll = this.checkAll.bind(this);
		scope.prev = this.prev.bind(this);
		scope.next = this.next.bind(this);
		
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
	},
	initTable : function () {
		var me = this;
		
		this.scope.data = this.data;
		
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

		
		this.scope.lockedColumnsTitles = this.columns.filter(function (it) {
			return it.locked === true;
		});

		this.scope.unlockedColumnsTitles = this.columns.filter(function (it) {
			return it.locked !== true;
		});
		
		this.scope.$apply();
		
	},
	fixSize: function(el) {
		var borderWidth = +el.style.borderWidth.replace(/px/, '');
		
		el.style.height = this.height - borderWidth * 2;
		el.style.width = this.width - borderWidth * 2;
		
		var lockedColumns = $('.locked-columns', this.el);
		var unlockedColumns = $('.unlocked-columns', this.el);
		
		var columnsTitle = $('.columns-title', this.el);
		var columnsContent = $('.columns-content', this.el);
		
		var footer = $('.table-footer', this.el);
		
		unlockedColumns.width(this.width - lockedColumns.width() - 1);
		
		columnsContent.height(this.height - columnsTitle.height() - footer.height() + 2);
		
		unlockedColumns.show();
		
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
			/**
			 * 如果接口返回数据不合要求, 可以在load事件中对返回数据进行修改,使之符合table组件的要求
			 * 如果在load事件函数中没有作返回,则不对data做处理, 直接交给table处理
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

var Column = extend(Component, {

	isLocked : false, // 是否是锁定列
	type : 'data', // [data, checkbox, radio]
	isChecked : true,
	constructor : function () {

		this.super(arguments);

		var me = this;
	}

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

app.filter('to_trusted', ['$sce', function ($sce) {
		return function (text) {
			return $sce.trustAsHtml(text);
		};
	}
]);

