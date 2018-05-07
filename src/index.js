

var Base = function() {
	console.log('Base init');
};

Base.prototype.method = function() {
	console.log('base method')
}



var Observable = extend(Base, {
	constructor: function() {
		console.log('observable init')
		this.callParent();
	},
	method: function() {
		this.callParent();
		console.log('observable method')
	}
})


var User = extend(Observable, {
	constructor: function() {
		this.callParent()
		console.log('user init');
	},
	method: function() {
		this.callParent();
		console.log('user method')
	}
});

var u = new User();

u.method();
