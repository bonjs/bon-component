

var Base = function() {
	console.log('Base init');
};

debugger
var Observable = extend(Base, {
	constructor: function() {
		this.callSuper();
		console.log('Observable init');
	},
	name: 'observable'
	
});


var User = extend(Observable, {
	
	name: 'User',
	constructor: function() {
		debugger
		this.callSuper();
		console.log('user init');
	},
	method: function() {
		console.log('user method')
	}
});

var u = new User();

u.method();
