

var ComponentAngular = extend(Component, {
	
	template: [],
	
	constructor: function() {
		
		this.super(arguments);
		
		console.log('anguler');
		this.template = this.template instanceof Array ? this.template.join('') : this.template;
		
		
	},
	
	
})