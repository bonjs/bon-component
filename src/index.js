

var Base = function() {
	console.log('Base init');
	this.name = 'base';
};



Base.prototype.method = function() {
	console.log('base method()')
}
Base.name = 'Base';
Base.prototype.name = 'Base';

var Observable = extend(Base, {
	constructor: function() {
		console.log('observable init')
		this.callParent();
	},
	name: 'observable',
	method: function() {
		console.log('observable method()')
	},
	test: function() {
		
		var a = this.super();
		console.log('observable test()')
		this.super().method();
	}
})
Observable.name = 'Observable';


var User = extend(Observable, {
	name: 'User',
	constructor: function() {
		this.callParent()
		console.log('user init');
	},
	method: function() {
		console.log('user method()')
		this.super().test();
	}
});

var u = new User();

u.method();
