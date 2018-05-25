

setTimeout(function() {
		
	var table = new Table({
		
		renderTo: 'main',
		
		width: 500,
		height: 230,
		
		pageSizeKey: 'size',
		pageNoKey: 'no',
		
		data : function () {
			return;
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
				locked : true,
			}, {
				header : '编号',
				dataIndex : 'id',
				sortable : true,
				locked : true,
			}, {
				header : '姓名',
				dataIndex : 'name',
				sortable : true,
				locked : true,
			
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
	
	table.load('data.json')

});
