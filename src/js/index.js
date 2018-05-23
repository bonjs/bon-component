var Column = extend(Component, {

	isLocked : false, // 是否是锁定列
	type : 'data', // [data, checkbox, radio]
	isChecked : true,
	constructor : function () {

		this.super(arguments);

		var me = this;

		this.renderHTML = '<div>aaa</div>'

	},

});

var Table = extend(ComponentAngular, {

	constructor : function () {

		this.super(arguments);

		var me = this;

		var app = angular.module("app", []);
		app.controller('main', ['$scope', '$compile', function ($scope, $compile) {

				window.s = me.scope = $scope;

				me.scope.data = me.data;

				me.scope.sortClick = me.sortClick.bind(me);

				me.scope.checkItem = me.checkItem.bind(me);

				//通过$compile动态编译html
				var template = angular.element(me.template);
				var el = $compile(template)($scope);

				angular.element(document.body).append(el);
				me.initTable();
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
					scope : me.scope
				});
			arr.push(col);
			return arr;
		}, []);

		this.data.forEach(function (it, i) {});

		this.scope.lockedColumnsTitles = this.columns.filter(function (it) {
			return it.locked === true;
		});

		this.scope.unlockedColumnsTitles = this.columns.filter(function (it) {
			return it.locked !== true;
		});
	},
	
	checkItem : function (col, index) {
		this.fireEvent('checkitem', col, index);
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
		this.fireEvent('titleclick', col)
	}
});

var table = new Table({
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
		checkitem : function (row, i) {
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
			locked : true
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
