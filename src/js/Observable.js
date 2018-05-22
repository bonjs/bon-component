
var Observable = function() {
	
};

Observable.prototype = {
	
	constructor : function(config) {
		var me = this, e = me.events;
		me.events = e || {};
	},

	fireEvent : function() {
		var a = Array.prototype.slice.call(arguments, 0), ename = a[0].toLowerCase(), me = this, ret = true, ce = me.events[ename], cc, q, c;
		if (me.eventsSuspended === true) {
			if ( q = me.eventQueue) {
				q.push(a);
			}
		} else if ( typeof ce == 'object') {
			if (ce.bubble) {
				if (ce.fire.apply(ce, a.slice(1)) === false) {
					return false;
				}
				c = me.getBubbleTarget && me.getBubbleTarget();
				if (c && c.enableBubble) {
					cc = c.events[ename];
					if (!cc || typeof cc != 'object' || !cc.bubble) {
						c.enableBubble(ename);
					}
					return c.fireEvent.apply(c, a);
				}
			} else {
				a.shift();
				ret = ce.fire.apply(ce, a);
			}
		}
		return ret;
	},

	addListener : function(eventName, fn, scope, o) {
		var me = this, e, oe, isF, ce;
		if (typeof eventName == 'object') {
			o = eventName;
			for (e in o) {
				oe = o[e];
				me.addListener(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);
			}
		} else {
			eventName = eventName.toLowerCase();
			ce = me.events[eventName] || true;
			if ( typeof ce == 'boolean') {
				me.events[eventName] = ce = new Event(me, eventName);
			}
			ce.addListener(fn, scope, typeof o == 'object' ? o : {});
		}
	},

	removeListener : function(eventName, fn, scope) {
		var ce = this.events[eventName.toLowerCase()];
		if ( typeof ce == 'object') {
			ce.removeListener(fn, scope);
		}
	},


	hasListener : function(eventName) {
		var e = this.events[eventName.toLowerCase()];
		return typeof e == 'object' && e.listeners.length > 0;
	},

	on : function() {
		this.addListener.apply(this, arguments);
	},
	un : function() {
		this.removeListener.apply(this, arguments);
	}
};



var Event = function(obj, nam) {
	this.name = name;
	this.obj = obj;
	this.listeners = [];
}

Event.prototype = {
	
	addListener : function(fn, scope, options) {
		var me = this, l;
		scope = scope || me.obj;
		if (!me.isListening(fn, scope)) {
			l = me.createListener(fn, scope, options);
			if (me.firing) {// if we are currently firing this event, don't disturb the listener loop
				me.listeners = me.listeners.slice(0);
			}
			me.listeners.push(l);
		}
	},

	createListener : function(fn, scope, o) {
		o = o || {}, scope = scope || this.obj;
		var l = {
			fn : fn,
			scope : scope,
			options : o
		}, h = fn;
		if (o.target) {
			h = createTargeted(h, o, scope);
		}
		if (o.delay) {
			h = createDelayed(h, o, l, scope);
		}
		if (o.single) {
			h = createSingle(h, this, fn, scope);
		}
		if (o.buffer) {
			h = createBuffered(h, o, l, scope);
		}
		l.fireFn = h;
		return l;
	},

	findListener : function(fn, scope) {
		var list = this.listeners, i = list.length, l;

		scope = scope || this.obj;
		while (i--) {
			l = list[i];
			if (l) {
				if (l.fn == fn && l.scope == scope) {
					return i;
				}
			}
		}
		return -1;
	},

	isListening : function(fn, scope) {
		return this.findListener(fn, scope) != -1;
	},

	removeListener : function(fn, scope) {
		var index, l, k, me = this, ret = false;
		if (( index = me.findListener(fn, scope)) != -1) {
			if (me.firing) {
				me.listeners = me.listeners.slice(0);
			}
			l = me.listeners[index];
			if (l.task) {
				l.task.cancel();
				delete l.task;
			}
			k = l.tasks && l.tasks.length;
			if (k) {
				while (k--) {
					l.tasks[k].cancel();
				}
				delete l.tasks;
			}
			me.listeners.splice(index, 1);
			ret = true;
		}
		return ret;
	},

	// Iterate to stop any buffered/delayed events
	clearListeners : function() {
		var me = this, l = me.listeners, i = l.length;
		while (i--) {
			me.removeListener(l[i].fn, l[i].scope);
		}
	},

	fire : function() {
		var me = this, listeners = me.listeners, len = listeners.length, i = 0, l;

		if (len > 0) {
			me.firing = true;
			var args = Array.prototype.slice.call(arguments, 0);
			for (; i < len; i++) {
				l = listeners[i];
				if (l && l.fireFn.apply(l.scope || me.obj || window, args) === false) {
					return (me.firing = false);
				}
			}
		}
		me.firing = false;
		return true;
	}
}
