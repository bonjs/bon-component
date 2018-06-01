


var tmpScope;

var comboBoxComponentDirective = function () {
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
app.directive('comboBoxComponent', comboBoxComponentDirective);


app.directive('comboBoxRowsRepeatFinished', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('comboBoxRowsRepeatFinished');
                });
            }
        }
    };
});






var ComboBox = extend(ComponentAngular, {
	
	valueField: 'value',	// 值字段
	displayField: 'text',	// 显示字段
	
	data: [],
	
	constructor : function () {

		this.super(arguments);

		var me = this;
		
		this.initTemplate();
		
		this.initEvent();
		
		window.s = this.scope;
		
		this.initComboBox();
	},
	
	
	initComboBox : function () {
		var me = this;
		
		this.scope.listData = this.data;
		this.scope.$apply();
	},
	
	initTemplate: function() {
		
		var me = this;
		
		var directiveHTML = '<combo-box-component></combo-box-component>';
		
		//通过$compile动态编译html
		var template = angular.element(directiveHTML);
		
		var element = globalCompile(template)(globalScope);
		
		var el = this.el = element[0];
		
		// 在此无法直接获取到自定义指令中的scope, 只能通过定义外变量的方式来传递
		this.scope = tmpScope;
		tmpScope = undefined;
		
		
		if(this.renderTo instanceof jQuery) {
			this.renderTo = this.renderTo[0];
		} else if(this.renderTo instanceof HTMLElement) {
			this.renderTo = this.renderTo;
		} else if(typeof this.renderTo == 'string') {
			this.renderTo = document.getElementById(this.renderTo);
		}
		
		angular.element(this.renderTo).append(element);
		//$('.table-body', this.el).height(this.height - $('.table-footer', this.el).height());
		
		el.style.height = this.height;
		el.style.width = this.width;
	},
	initEvent: function() {
		
		var me = this;
		
		var scope = this.scope;
		

		scope.clickItem = this.clickItem.bind(this);
		
		scope.expand = this.expand.bind(this);
		scope.clear = this.clear.bind(this);
		scope.isExpand = false;
		
		
		scope.searchField = '';
		scope.$watch('searchField', function(a, b) {
			console.log(a,b);
			if(scope.searchField === '') {
				return;
			}
			scope.listData = me.data.filter(function(it, i) {
				var match = (it.value + '').indexOf(scope.searchField) >= 0;
				if(match) {
					console.log(match)
					//it.value = 1;//(it.value + '').replace(scope.searchField, '<span color=red>$0</span>')
				}
				return match
			});
			
		});
		
		
		scope.search = this.search.bind(this);
		
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
			
			
		});
		
	},
	
	expand: function() {
		console.log('expand')
		this.scope.isExpand = !this.scope.isExpand;
	},
	search: function() {
		console.log('search')
	},
	clear: function() {
		this.scope.currentItem = null;
	},
	
	clickItem: function(item) {
		console.log(item);
		this.scope.isExpand = false;
		this.scope.currentItem = this.currentItem = item;
		
	},
	getValue: function() {
		return this.currentItem.value;
	},
	getText: function() {
		return this.currentItem.text;
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
			//p[this.pageNoKey] = this.pageNo;
			//p[this.pageSizeKey] = this.pageSize;
			
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
			this.scope.data = this.data = this.scope.listData = data;
			this.scope.$apply();
			
			this.fireEvent('afterload', data);
		}
	},
	
});

