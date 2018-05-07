


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
		// this.superclass 指向父类	
		//sub.prototype.superclass = sup.prototype;
		
		
		
		sub.prototype.callParent = function() {
			var method = arguments.callee.caller;
			return method.$owner && method.$owner.$baseType.prototype[method.$name] && method.$owner.$baseType.prototype[method.$name].apply(this, arguments);
		};
		
		sub.prototype.super = function() {
			var method, 
				superMethod = (method = this.super.caller) &&
                        ((method = method.$owner ? method : method.caller) &&
                          method.$owner.superclass);
						  
			return superMethod;
		
		}
		sub.prototype.super2 = function() {
			var method = arguments.callee.caller;
			console.log('super:' + method.$owner.prototype.name)
			return method.$owner.$baseType.prototype;
		};
		
		
		
		
		sub.$baseType = sup;
		
		
		
		for(var k in sub.prototype) {
			//if(typeof sub.prototype[k] == 'function') {
				defineMethod.call(sub, k, sub.prototype[k]);
			//}
		}
		
		/*
		sub.extend = function(o){
			return extend(sub, o);
		};
		*/
		
		
		return sub;
	};
}()