var apply = function(o, c, defaults){
    // no "this" reference for friendly out of scope calls
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



var define = function (className, body, createdFn) {
	var override = body.override,
		cls, extend, name;

	if (override) {
		delete body.override;
		cls = Ext.getClassByName(override);
		override(cls, body);
	} else {
		

		cls = function ctor () {
			this.constructor.apply(this, arguments);
		}

		if (className) {
			cls.displayName = className;
		}
		cls.$isClass = true;
		cls.callParent = Ext.Base.callParent;

		if (typeof body == 'function') {
			body = body(cls);
		}

		extend = body.extend;
		if (extend) {
			delete body.extend;
			if (typeof extend == 'string') {
				extend = Ext.getClassByName(extend);
			}
		} else {
			extend = Base;
		}

		extend(cls, extend, body);
		if (cls.prototype.constructor === cls) {
			delete cls.prototype.constructor;
		}

		// Not extending a class which derives from Base...
		if (!cls.prototype.$isClass) {
			Ext.applyIf(cls.prototype, Base.prototype);
		}
		cls.prototype.self = cls;
		
		if (body.xtype) {
			Ext.reg(body.xtype, cls);
		}
		cls = body.singleton ? new cls() : cls;
		
	}

	if (createdFn) {
		createdFn.call(cls);
	}

	return cls;
}

var addMembers = function (cls, target, members, handleNonEnumerables) {
		var i, name, member;

		for (name in members) {
			if (members.hasOwnProperty(name)) {
				member = members[name];
				if (typeof member == 'function') {
					member.$owner = cls;
					member.$name = name;
				}

				target[name] = member;
			}
		}

		if (handleNonEnumerables && nonEnumerables) {
			for (i = nonEnumerables.length; i-- > 0; ) {
				name = nonEnumerables[i];
				if (members.hasOwnProperty(name)) {
					member = members[name];
					if (typeof member == 'function') {
						member.$owner = cls;
						member.$name = name;
					}

					target[name] = member;
				}
			}
		}
	}

var override = function(target, overrides) {
	var proto, statics;

	if (overrides) {
		if (target.$isClass) {
			
			addMembers(target, target.prototype, overrides, true);
			
		} else if (typeof target == 'function') {
			proto = target.prototype;
			apply(proto, overrides);
			
		} else {
			var owner = target.self,
				name, value;

			if (owner && owner.$isClass) {
				for (name in overrides) {
					if (overrides.hasOwnProperty(name)) {
						value = overrides[name];

						if (typeof value == 'function') {
							//<debug>
							if (owner.$className) {
								value.displayName = owner.$className + '#' + name;
							}
							//</debug>

							value.$name = name;
							value.$owner = owner;
							value.$previous = target.hasOwnProperty(name)
								? target[name] // already hooked, so call previous hook
								: callOverrideParent; // calls by name on prototype
						}

						target[name] = value;
					}
				}
			} else {
				apply(target, overrides);

				if (!target.constructor.$isClass) {
					target.constructor.prototype.callParent = Base.prototype.callParent;
					target.constructor.callParent = Base.callParent;
				}
			}
		}
	}
	
}

var extend = function(){
	// inline overrides
	var io = function(o){
		for(var m in o){
			this[m] = o[m];
		}
	};
	var oc = Object.prototype.constructor;

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
		sub.override = function(o){
			override(sub, o);
		};
		
		/*
		sub.prototype.superclass = sub.prototype.supr = (function(){
			return sup.prototype;
		});
		*/
		// this.superclass 指向父类
		sub.prototype.superclass = sup.prototype;
		
		
		sub.prototype.override = io;
		override(sub, overrides);
		sub.extend = function(o){
			return extend(sub, o);
		};
		return sub;
	};
}()