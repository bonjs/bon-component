

define(['Observable', 'extend'], function(Observable, extend) {
	// ���
	var Component = extend(Observable, {
		
		constructor: function(config) {
			
			this.super(arguments);
				
			//this.apply.call(config.listeners, this.listeners);
			
			
			if(this.listeners) {
				this.on(this.listeners);
			}
			if(config.listeners) {
				this.on(config.listeners);
			}
			
			this.apply(config);
			
			
			this.initComponent();
		},
		
		initComponent: function() {
			//console.log('initComponent')
		}
		
	});
	
	return Component;

});