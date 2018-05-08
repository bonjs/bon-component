


var User = extend(Component, {
	name: 'User',
	constructor: function() {
		this.super(arguments);
		console.log('user init');
	},
	listeners: {
		update: function() {
			alert('haha')
		}
	},
	method: function() {
		this.super(arguments);
		console.log('user method()');
	}
});

var u = new User();

u.fireEvent('update');
