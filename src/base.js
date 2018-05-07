

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
		sub.super = sup.prototype;
		if(sup.prototype.constructor == oc){
			sup.prototype.constructor = sup;
		}
		sub.override = function(o){
			override(sub, o);
		};
		
		/*
		sub.prototype.superclass = sub.prototype.supr = (function(){
			return sup.prototype;
		});
		*/
		// this.super 指向父类	
		sub.prototype.super = sup.prototype;
		debugger
		sub.prototype.callSuper = function() {
			var methodName = arguments.callee.caller.name;
			console.log('methodName:', methodName);
			
			sup.prototype[methodName].call(this);
		};
		
		sub.prototype.override = io;
		override(sub, overrides);
		sub.extend = function(o){
			return extend(sub, o);
		};
		return sub;
	};
}()