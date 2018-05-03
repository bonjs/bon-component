

var Base = function() {
	alert('base');
};

var User = extend(Base, {
	constructor: function() {
		//this.superclass.constructor.call(this);
		this.callParent();
		alert('init');
	}
});

var u = new User();
