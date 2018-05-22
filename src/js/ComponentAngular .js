

var ComponentAngular = extend(Component, {
	
	html: [],
	
	constructor: function() {
		
		
		console.log('anguler');
		this.html = this.html instanceof Array ? this.html.join('') : this.html;
		
		this.super(arguments);
		
	},
	
	
})