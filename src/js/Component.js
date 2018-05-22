
// ×é¼þ
var Component = extend(Observable, {
	
	constructor: function(config) {
		
		this.super(arguments);
		
		this.apply(config);
		
		if(this.listeners) {
			this.on(this.listeners);
		}
		
		this.initComponent();
	},
	
	initComponent: function() {
		console.log('initComponent')
	}
	
})