


var data = function () {
	var arr = [];

	for (var i = 0; i < 20; i++) {
		arr.push({
			value : i + 1,
			text : 'sun' + (i + 1),
		});
	}
	return arr;
}();

setTimeout(function() {
		
	var comboBox = new ComboBox({
		
		renderTo: 'main',
		
		//width: 500,
		//height: 300,
		
		
		data2 : data
	});
	
	debugger
	comboBox.load(data)

});
