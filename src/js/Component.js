
// ×é¼þ
var Component = extend(Observable, {
	
	constructor: function() {
		
		this.super(arguments);
		
		if(this.listeners) {
			this.on(this.listeners);
		}
		
		this.initComponent();
		
		console.log('component init')
	},
	
	initComponent: function() {
		console.log('initComponent')
	}
	
})