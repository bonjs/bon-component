


define(['Component', 'extend'], function(Component, extend) {
	
	app.directive("compileBindExpn", function ($compile) {
		console.log('a')
		return function linkFn(scope, elem, attrs) {
			console.log('test')
			scope.$watch("::" + attrs.compileBindExpn, function (html) {
				console.log(html);
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
			
			this.initTemplate();
			
		},
		
		initTemplate: function() {
			
			//通过$compile动态编译html
			var template = angular.element(this.template);
			
			var scope = this.scope = pt.scope.$new(false);
			
			var element = pt.compile(template)(scope);
			
			var el = this.el = element[0];
			
			if(this.renderTo instanceof jQuery) {
				this.renderTo = this.renderTo[0];
			} else if(this.renderTo instanceof HTMLElement) {
				this.renderTo = this.renderTo;
			} else if(typeof this.renderTo == 'string') {
				this.renderTo = document.getElementById(this.renderTo);
			}
			
			angular.element(this.renderTo).append(element);
			
			$(el).height(this.height); 
			$(el).width(this.width); 
		}
		
		
	});
	
	return ComponentAngular;
});