

var ComponentAngular = extend(Component, {
	
	html: [],
	
	constructor: function() {
		
		this.super(arguments);
		
		console.log('anguler');
		this.html = this.html instanceof Array ? this.html.join('') : this.html;
		
		
	},
	
	
})