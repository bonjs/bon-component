

define(function() {
		
	var extend = function(){
		var io = function(o){
			for(var m in o){
				this[m] = o[m];
			}
		};
		var oc = Object.prototype.constructor;
		
		var apply = function(o, c, defaults){
			if(defaults){
				apply(o, defaults);
			}
			if(o && c && typeof c == 'object'){
				for(var p in c){
					o[p] = c[p];
				}
			}
			return o;
		};

		var override = function(target, overrides) {
			var proto;

			if (overrides) {
				if (typeof target == 'function') {
					proto = target.prototype;
					apply(proto, overrides);
				}
			}
		}
		
		var defineMethod = function (methodName, methodBody) {
			//this.prototype[methodName] = methodBody;
			methodBody.$name = methodName;
			methodBody.$owner = this;
		};

		return function(sub, sup, overrides){
			if(typeof sup == 'object'){
				overrides = sup;
				sup = sub;
				sub = overrides.constructor != oc ? overrides.constructor : function(){
					sup.apply(this, arguments);
				};
			}
			var F = function(){}

			F.prototype = sup.prototype;
			
			sub.prototype = new F();
			
			sub.prototype.constructor = sub;
			
			sub.superclass = sup.prototype;
			
			if(sup.prototype.constructor == oc){
				sup.prototype.constructor = sup;
			}
			
			override(sub, overrides);
			/*
			sub.prototype.superclass = sub.prototype.supr = (function(){
				return sup.prototype;
			});
			*/
			
			sub.prototype.apply = function(defaults) {
				apply(this, null, defaults)
			};
			
			sub.prototype.super = function() {
				var method = this.super.caller;
				
				if(method) {
					if(!method.$owner) {
						method = method.caller;
					}
					return method.$owner.superclass[method.$name].apply(this, arguments[0]);
				}
			}
			
			
			for(var k in sub.prototype) {
				if(typeof sub.prototype[k] == 'function') {
					defineMethod.call(sub, k, sub.prototype[k]);
				}
			}
			
			
			return sub;
		};
	}();
	
	return extend;
});
