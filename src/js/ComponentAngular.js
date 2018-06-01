



app.directive("compileBindExpn", function ($compile) {
	return function linkFn(scope, elem, attrs) {
		scope.$watch("::" + attrs.compileBindExpn, function (html) {
			if (html && html.indexOf("<") != -1 && html.indexOf(">") != -1) {
				var expnLinker = $compile(html);
				expnLinker(scope, function transclude(clone) {
					elem.empty();
					elem.append(clone);
				});
			} else {
				elem.empty();
				elem.append(html);
			}
		})
	}
});
		

var ComponentAngular = extend(Component, {
	
	template: [],
	
	constructor: function() {
		
		this.super(arguments);
		
		this.template = this.template instanceof Array ? this.template.join('') : this.template;
		
		
	},
	
	
})