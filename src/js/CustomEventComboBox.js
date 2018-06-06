
'use scrict';


var CustomEventComboBox = extend(ComboBox, {
	template: '<button>fdsaf</button>'
});


setTimeout(function() {

	new CustomEventComboBox({
		
		renderTo: 'main',
		data: [
			{
				text: 'sun',
				value: '1'
			}, {
				text: 'sun2',
				value: '2'
			}, {
				text: 'sun3',
				value: '3'
			}
		]
	});

});
