(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.$AG = factory());
}(this || window, (function () {
    'use strict';

    const noop = function () { };

    const cached = function (fn) {
        const cache = Object.create(null);
        return (function cachedFn(str) {
            let hit = cache[str];
            return hit || (cache[str] = fn(str))
        })
    };

    const indexOf = function (array, value) {
        return array.indexOf(value);
    };

    const indexOfSorted = function (array, value, compareFn) {
        let high, low, mid;

        low = 0;
        high = array.length - 1;

        if (high < 0) {
            return 0
        }

        while (low <= high) {
            mid = ~~((high + low) / 2);

            if (compareFn(array[mid], value)) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return low
    };

    const remove = function (array, val) {
        if (typeof val == 'number') {
            var o = array[val];
            array.splice(val, 1);
            return o;
        } else {
            removeObject(array, val);
            return val;
        }
    };

    const _do = function (array, fn) {
        for (var i = 0; i < array.length; i++) {
            fn.call(array[i]);
        }
    };

    const insert = function (array, item, index) {
        array.splice(index, 0, item);
    };

    const removeObject = function (array, val) {
        var index = indexOf(array, val);
        if (index > -1) {
            remove(array, index);
        }
    };

    const isEmpty = function (array = []) {
        return array.length == 0;
    };

    const last = function (array) {
        return array[array.length - 1];
    };

    const contains = function (array, obj) {
        var i = array.length;
        while (i--) {
            if (array[i] == obj) {
                return true;
            }
        }
        return false;
    };

    const isJson = function (obj) {
        var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
        return isjson;
    };

    const createElement = function (widget, tagName) {
        var e = document.createElementNS("http://www.w3.org/2000/svg", tagName);
        if (widget) {
            widget.style = e.style;
        }
        return e;
    };

    const apply = function (container, a, v) {
        if (a != null && typeof (a) == 'object')
            for (var k in a) {
                container[k] = a[k];
            }
        else if (typeof (a) == 'string') {
            container[a] = v;
        }
    };

    const applyAttr = function (container, a, v) {
        if (a != null && typeof (a) == 'object')
            for (var k in a) {
                if (!(container.getAttribute(k) == a[k]))
                    container.setAttribute(k, a[k]);
            }
        else if (typeof (a) == 'string') {
            if (!(container.getAttribute(a) == v))
                container.setAttribute(a, v);
        }
    };

    /**
     * @param type String 'eventType.nameSpace'
     * @param options {useCapture: true} 捕捉阶段执行，
     *                {default: false} 不阻止默认行为
     *                {stop: false} 不阻止事件传播
     */
    const listenPool = new WeakMap();
    const addListener = function (element, type, handle, options = { stop: false }) {
        let _handle;

        if (options.default !== false && options.stop !== false) {
            _handle = e => {
                handle(e);
                e.stopPropagation();
                e.preventDefault();
            };
        } else if (options.default !== false) {
            _handle = e => {
                handle(e);
                e.preventDefault();
            };
        } else if (options.stop !== false) {
            _handle = e => {
                handle(e);
                e.stopPropagation();
            };
        } else {
            _handle = handle;
        }

        const split = type.split('.');
        const eventType = split[0];
        const namespace = split[1] || '';
        const useCapture = options.useCapture === true;

        element.addEventListener(eventType, _handle, useCapture);

        // for remove
        let cache = listenPool.has(element) ? listenPool.get(element) : new Map();

        if (!cache.has(namespace)) {
            cache.set(namespace, Array.of([eventType, _handle, useCapture]));
        } else {
            cache.get(namespace).push([eventType, _handle, useCapture]);
        }
        listenPool.set(element, cache);
    };

    const removeListener = function (element, type = '*.*') {
        const cache = listenPool.get(element);

        if (cache != null) {
            const split = type.split('.');
            const eventType = split[0];
            const namespace = split[1] || '';

            let entires;

            if (namespace === '*') {
                entires = cache.entries();
            } else {
                if (!cache.has(namespace)) {
                    return
                }

                entires = [[namespace, cache.get(namespace)]];
            }

            const isAll = eventType === '*';
            entires.forEach(([ns, arr]) => {
                let newCache = [];
                if (!isAll) {
                    arr.forEach(args => {
                        if (args[0] === eventType) {
                            Reflect.apply(document.removeEventListener, element, args);
                        } else {
                            newCache.push(args);
                        }
                    });
                } else {
                    arr.forEach(args => {
                        Reflect.apply(document.removeEventListener, element, args);
                    });
                }

                if (newCache.length === 0) {
                    cache.delete(ns);
                }
            });

            if (cache.size === 0) listenPool.delete(element);
        }
    };

    const debounce = function (func, wait, immediate = false) {
        var timeout, args, context, timestamp, result;

        var later = function () {
            var last = new Date().getTime() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function (...res) {
            context = this;
            args = res;
            timestamp = new Date().getTime();
            var callNow = immediate && !timeout;

            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }
            return result;
        };
    };

    const throttle = function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    const def = function (obj, key, value, enumerable) {
        Reflect.defineProperty(obj, key, {
            value,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        });
    };

    const genUUID = function (len = 32, radix = 16) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };

    const toKeyString = cached(function (key = '') {
        return key.toLowerCase().split('+').sort().join('+')
    });

    const toKeyStringByEvent = function (e) {
        const keys = [];

        if (e.altKey)
            keys.push('alt');
        if (e.ctrlKey)
            keys.push('ctrl');
        if (e.shiftKey)
            keys.push('shift');
        keys.push(e.key.toLowerCase());

        return keys.sort().join('+')
    };

    let _textHeight;
    const fontHeight = function (svg) {
        if (_textHeight !== undefined) return _textHeight

        const text = createElement(null, 'text');
        text.innerHTML = 'FLOW';
        applyAttr(text, { x: -100, y: -100 });
        svg.appendChild(text);

        const box = text.getBBox();
        _textHeight = 2 * (-100) - 2 * box.y - box.height;
        svg.removeChild(text);

        return _textHeight
    };

    const isObject = function (value) {
        return !!value && (typeof value === 'object' || typeof value === 'function');
    };

    const construct = function (Class, extendOption, ...args) {
        if (Reflect.has(Class, 'extend') && typeof Class === 'function') {
            let Construct = Class;

            if (typeof extendOption === 'object') {
                if (extendOption instanceof Class) {
                    return extendOption
                }

                Construct = Construct.extend(extendOption);
            }

            return Reflect.construct(Construct, args)
        }
        return false
    };

    const applyFn = function (fn, ctx, args) {
        switch (args.length) {
            case 0: return fn.call(ctx);
            case 1: return fn.call(ctx, args[0]);
            case 2: return fn.call(ctx, args[0], args[1]);
            case 3: return fn.call(ctx, args[0], args[1], args[2]);
        }
        return fn.apply(ctx, args);
    };

    const bindFn = function (fn, ctx) {
        return function bindedFn() {
            return applyFn(fn, ctx, arguments)
        }
    };

    const Util = {
        bindFn,
        applyFn,
        indexOf,
        indexOfSorted,
        remove,
        _do,
        insert,
        removeObject,
        isEmpty,
        last,
        contains,
        isJson,
        createElement,
        apply,
        applyAttr,
        addListener,
        removeListener,
        debounce,
        throttle,
        def,
        genUUID,
        toKeyString,
        toKeyStringByEvent,
        noop,
        fontHeight,
        isObject,
        construct
    };

    var Base = function () { }; Base.extend = function (_instance, _static) { var extend = Base.prototype.extend; Base._prototyping = true; var proto = new this; extend.call(proto, _instance); proto.base = function () { }; delete Base._prototyping; var constructor = proto.constructor; var klass = proto.constructor = function () { if (!Base._prototyping) { if (this._constructing || this.constructor == klass) { this._constructing = true; constructor.apply(this, arguments); delete this._constructing; } else if (arguments[0] != null) { return (arguments[0].extend || extend).call(arguments[0], proto); } } }; klass.ancestor = this; klass.extend = this.extend; klass.forEach = this.forEach; klass.implement = this.implement; klass.prototype = proto; klass.toString = this.toString; klass.valueOf = function (type) { return (type == "object") ? klass : constructor.valueOf(); }; extend.call(klass, _static); if (typeof klass.init == "function") klass.init(); return klass; }; Base.prototype = { extend: function (source, value) { if (arguments.length > 1) { var ancestor = this[source]; if (ancestor && (typeof value == "function") && (!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) && /\bbase\b/.test(value)) { var method = value.valueOf(); value = function () { var previous = this.base || Base.prototype.base; this.base = ancestor; var returnValue = method.apply(this, arguments); this.base = previous; return returnValue; }; value.valueOf = function (type) { return (type == "object") ? value : method; }; value.toString = Base.toString; } this[source] = value; } else if (source) { var extend = Base.prototype.extend; if (!Base._prototyping && typeof this != "function") { extend = this.extend || extend; } var proto = { toSource: null }; var hidden = ["constructor", "toString", "valueOf"]; var i = Base._prototyping ? 0 : 1; while (key = hidden[i++]) { if (source[key] != proto[key]) { extend.call(this, key, source[key]); } } for (var key in source) { if (!proto[key]) extend.call(this, key, source[key]); } } return this; } }; Base = Base.extend({ constructor: function () { this.extend(arguments[0]); } }, { ancestor: Object, version: "1.1", forEach: function (object, block, context) { for (var key in object) { if (this.prototype[key] === undefined) { block.call(context, object[key], key, object); } } }, implement: function () { for (var i = 0; i < arguments.length; i++) { if (typeof arguments[i] == "function") { arguments[i](this.prototype); } else { this.prototype.extend(arguments[i]); } } return this; }, toString: function () { return String(this.valueOf()); } }); var Base_1 = Base;

    function createCommonjsModule(fn, module) {
        return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var taffy = createCommonjsModule(function (module) {
        var TAFFY, T; (function () {
            var typeList, makeTest, idx, typeKey, TC, idpad, cmax, API, protectJSON, each, eachin, isIndexable, returnFilter, runFilters, numcharsplit, orderByCol, run; if (!TAFFY) {
                TC = 1; idpad = "000000"; cmax = 1000; API = {}; protectJSON = function (t) { if (TAFFY.isArray(t) || TAFFY.isObject(t)) { return t } else { return JSON.parse(t) } }; each = function (a, fun, u) { var r, i, x, y; if (a && ((T.isArray(a) && a.length === 1) || (!T.isArray(a)))) { fun((T.isArray(a)) ? a[0] : a, 0); } else { for (x = 0, a = (T.isArray(a)) ? a : [a], y = a.length; x < y; x++) { i = a[x]; if (!T.isUndefined(i) || (u || false)) { r = fun(i, x); if (r === T.EXIT) { break } } } } }; eachin = function (o, fun) { var x = 0, r, i; for (i in o) { if (o.hasOwnProperty(i)) { r = fun(o[i], i, x++); if (r === T.EXIT) { break } } } }; API.extend = function (m, f) { API[m] = function () { return f.apply(this, arguments) }; }; isIndexable = function (f) { var i; if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) { return true } if (T.isObject(f) && f.___id && f.___s) { return true } if (T.isArray(f)) { i = true; each(f, function (r) { if (!isIndexable(r)) { i = false; return TAFFY.EXIT } }); return i } return false }; runFilters = function (r, filter) { var match = true; each(filter, function (mf) { switch (T.typeOf(mf)) { case "function": if (!mf.apply(r)) { match = false; return TAFFY.EXIT } break; case "array": match = (mf.length === 1) ? (runFilters(r, mf[0])) : (mf.length === 2) ? (runFilters(r, mf[0]) || runFilters(r, mf[1])) : (mf.length === 3) ? (runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2])) : (mf.length === 4) ? (runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2]) || runFilters(r, mf[3])) : false; if (mf.length > 4) { each(mf, function (f) { if (runFilters(r, f)) { match = true; } }); } break } }); return match }; returnFilter = function (f) { var nf = []; if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) { f = { ___id: f }; } if (T.isArray(f)) { each(f, function (r) { nf.push(returnFilter(r)); }); f = function () { var that = this, match = false; each(nf, function (f) { if (runFilters(that, f)) { match = true; } }); return match }; return f } if (T.isObject(f)) { if (T.isObject(f) && f.___id && f.___s) { f = { ___id: f.___id }; } eachin(f, function (v, i) { if (!T.isObject(v)) { v = { "is": v }; } eachin(v, function (mtest, s) { var c = [], looper; looper = (s === "hasAll") ? function (mtest, func) { func(mtest); } : each; looper(mtest, function (mtest) { var su = true, matchFunc; matchFunc = function () { var mvalue = this[i], eqeq = "==", bangeq = "!=", eqeqeq = "===", lt = "<", gt = ">", lteq = "<=", gteq = ">=", bangeqeq = "!==", r; if ((s.indexOf("!") === 0) && s !== bangeq && s !== bangeqeq) { su = false; s = s.substring(1, s.length); } r = ((s === "regex") ? (mtest.test(mvalue)) : (s === "lt" || s === lt) ? (mvalue < mtest) : (s === "gt" || s === gt) ? (mvalue > mtest) : (s === "lte" || s === lteq) ? (mvalue <= mtest) : (s === "gte" || s === gteq) ? (mvalue >= mtest) : (s === "left") ? (mvalue.indexOf(mtest) === 0) : (s === "leftnocase") ? (mvalue.toLowerCase().indexOf(mtest.toLowerCase()) === 0) : (s === "right") ? (mvalue.substring((mvalue.length - mtest.length)) === mtest) : (s === "rightnocase") ? (mvalue.toLowerCase().substring((mvalue.length - mtest.length)) === mtest.toLowerCase()) : (s === "like") ? (mvalue.indexOf(mtest) >= 0) : (s === "likenocase") ? (mvalue.toLowerCase().indexOf(mtest.toLowerCase()) >= 0) : (s === eqeqeq || s === "is") ? (mvalue === mtest) : (s === eqeq) ? (mvalue == mtest) : (s === bangeqeq) ? (mvalue !== mtest) : (s === bangeq) ? (mvalue != mtest) : (s === "isnocase") ? (mvalue.toLowerCase ? mvalue.toLowerCase() === mtest.toLowerCase() : mvalue === mtest) : (s === "has") ? (T.has(mvalue, mtest)) : (s === "hasall") ? (T.hasAll(mvalue, mtest)) : (s.indexOf("is") === -1 && !TAFFY.isNull(mvalue) && !TAFFY.isUndefined(mvalue) && !TAFFY.isObject(mtest) && !TAFFY.isArray(mtest)) ? (mtest === mvalue[s]) : (T[s] && T.isFunction(T[s]) && s.indexOf("is") === 0) ? T[s](mvalue) === mtest : (T[s] && T.isFunction(T[s])) ? T[s](mvalue, mtest) : (false)); r = (r && !su) ? false : (!r && !su) ? true : r; return r }; c.push(matchFunc); }); if (c.length === 1) { nf.push(c[0]); } else { nf.push(function () { var that = this, match = false; each(c, function (f) { if (f.apply(that)) { match = true; } }); return match }); } }); }); f = function () { var that = this, match = true; match = (nf.length === 1 && !nf[0].apply(that)) ? false : (nf.length === 2 && (!nf[0].apply(that) || !nf[1].apply(that))) ? false : (nf.length === 3 && (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that))) ? false : (nf.length === 4 && (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that) || !nf[3].apply(that))) ? false : true; if (nf.length > 4) { each(nf, function (f) { if (!runFilters(that, f)) { match = false; } }); } return match }; return f } if (T.isFunction(f)) { return f } }; orderByCol = function (ar, o) {
                    var sortFunc = function (a, b) {
                        var r = 0; T.each(o, function (sd) {
                            var o, col, dir, c, d; o = sd.split(" "); col = o[0]; dir = (o.length === 1) ? "logical" : o[1]; if (dir === "logical") { c = numcharsplit(a[col]); d = numcharsplit(b[col]); T.each((c.length <= d.length) ? c : d, function (x, i) { if (c[i] < d[i]) { r = -1; return TAFFY.EXIT } else { if (c[i] > d[i]) { r = 1; return TAFFY.EXIT } } }); } else { if (dir === "logicaldesc") { c = numcharsplit(a[col]); d = numcharsplit(b[col]); T.each((c.length <= d.length) ? c : d, function (x, i) { if (c[i] > d[i]) { r = -1; return TAFFY.EXIT } else { if (c[i] < d[i]) { r = 1; return TAFFY.EXIT } } }); } else { if (dir === "asec" && a[col] < b[col]) { r = -1; return T.EXIT } else { if (dir === "asec" && a[col] > b[col]) { r = 1; return T.EXIT } else { if (dir === "desc" && a[col] > b[col]) { r = -1; return T.EXIT } else { if (dir === "desc" && a[col] < b[col]) { r = 1; return T.EXIT } } } } } } if (r === 0 && dir === "logical" && c.length < d.length) {
                                r = -1;
                            } else { if (r === 0 && dir === "logical" && c.length > d.length) { r = 1; } else { if (r === 0 && dir === "logicaldesc" && c.length > d.length) { r = -1; } else { if (r === 0 && dir === "logicaldesc" && c.length < d.length) { r = 1; } } } } if (r !== 0) { return T.EXIT }
                        }); return r
                    }; return (ar && ar.push) ? ar.sort(sortFunc) : ar
                }; (function () { var cache = {}, cachcounter = 0; numcharsplit = function (thing) { if (cachcounter > cmax) { cache = {}; cachcounter = 0; } return cache["_" + thing] || (function () { var nthing = String(thing), na = [], rv = "_", rt = "", x, xx, c; for (x = 0, xx = nthing.length; x < xx; x++) { c = nthing.charCodeAt(x); if ((c >= 48 && c <= 57) || c === 46) { if (rt !== "n") { rt = "n"; na.push(rv.toLowerCase()); rv = ""; } rv = rv + nthing.charAt(x); } else { if (rt !== "s") { rt = "s"; na.push(parseFloat(rv)); rv = ""; } rv = rv + nthing.charAt(x); } } na.push((rt === "n") ? parseFloat(rv) : rv.toLowerCase()); na.shift(); cache["_" + thing] = na; cachcounter++; return na }()) }; }()); run = function () { this.context({ results: this.getDBI().query(this.context()) }); }; API.extend("filter", function () { var nc = TAFFY.mergeObj(this.context(), { run: null }), nq = []; each(nc.q, function (v) { nq.push(v); }); nc.q = nq; each(arguments, function (f) { nc.q.push(returnFilter(f)); nc.filterRaw.push(f); }); return this.getroot(nc) }); API.extend("order", function (o) { o = o.split(","); var x = [], nc; each(o, function (r) { x.push(r.replace(/^\s*/, "").replace(/\s*$/, "")); }); nc = TAFFY.mergeObj(this.context(), { sort: null }); nc.order = x; return this.getroot(nc) }); API.extend("limit", function (n) { var nc = TAFFY.mergeObj(this.context(), {}), limitedresults; nc.limit = n; if (nc.run && nc.sort) { limitedresults = []; each(nc.results, function (i, x) { if ((x + 1) > n) { return TAFFY.EXIT } limitedresults.push(i); }); nc.results = limitedresults; } return this.getroot(nc) }); API.extend("start", function (n) { var nc = TAFFY.mergeObj(this.context(), {}), limitedresults; nc.start = n; if (nc.run && nc.sort && !nc.limit) { limitedresults = []; each(nc.results, function (i, x) { if ((x + 1) > n) { limitedresults.push(i); } }); nc.results = limitedresults; } else { nc = TAFFY.mergeObj(this.context(), { run: null, start: n }); } return this.getroot(nc) }); API.extend("update", function (arg0, arg1, arg2) { var runEvent = true, o = {}, args = arguments, that; if (TAFFY.isString(arg0) && (arguments.length === 2 || arguments.length === 3)) { o[arg0] = arg1; if (arguments.length === 3) { runEvent = arg2; } } else { o = arg0; if (args.length === 2) { runEvent = arg1; } } that = this; run.call(this); each(this.context().results, function (r) { var c = o; if (TAFFY.isFunction(c)) { c = c.apply(TAFFY.mergeObj(r, {})); } else { if (T.isFunction(c)) { c = c(TAFFY.mergeObj(r, {})); } } if (TAFFY.isObject(c)) { that.getDBI().update(r.___id, c, runEvent); } }); if (this.context().results.length) { this.context({ run: null }); } return this }); API.extend("remove", function (runEvent) { var that = this, c = 0; run.call(this); each(this.context().results, function (r) { that.getDBI().remove(r.___id); c++; }); if (this.context().results.length) { this.context({ run: null }); that.getDBI().removeCommit(runEvent); } return c }); API.extend("count", function () { run.call(this); return this.context().results.length }); API.extend("callback", function (f, delay) { if (f) { var that = this; setTimeout(function () { run.call(that); f.call(that.getroot(that.context())); }, delay || 0); } return null }); API.extend("get", function () { run.call(this); return this.context().results }); API.extend("stringify", function () { return JSON.stringify(this.get()) }); API.extend("first", function () { run.call(this); return this.context().results[0] || false }); API.extend("last", function () { run.call(this); return this.context().results[this.context().results.length - 1] || false }); API.extend("sum", function () { var total = 0, that = this; run.call(that); each(arguments, function (c) { each(that.context().results, function (r) { total = total + r[c]; }); }); return total }); API.extend("min", function (c) { var lowest = null; run.call(this); each(this.context().results, function (r) { if (lowest === null || r[c] < lowest) { lowest = r[c]; } }); return lowest }); (function () {
                    var innerJoinFunction = (function () {
                        var fnCompareList, fnCombineRow, fnMain; fnCompareList = function (left_row, right_row, arg_list) { var data_lt, data_rt, op_code; if (arg_list.length === 2) { data_lt = left_row[arg_list[0]]; op_code = "==="; data_rt = right_row[arg_list[1]]; } else { data_lt = left_row[arg_list[0]]; op_code = arg_list[1]; data_rt = right_row[arg_list[2]]; } switch (op_code) { case "===": return data_lt === data_rt; case "!==": return data_lt !== data_rt; case "<": return data_lt < data_rt; case ">": return data_lt > data_rt; case "<=": return data_lt <= data_rt; case ">=": return data_lt >= data_rt; case "==": return data_lt == data_rt; case "!=": return data_lt != data_rt; default: throw String(op_code) + " is not supported" } }; fnCombineRow = function (left_row, right_row) { var out_map = {}, i, prefix; for (i in left_row) { if (left_row.hasOwnProperty(i)) { out_map[i] = left_row[i]; } } for (i in right_row) { if (right_row.hasOwnProperty(i) && i !== "___id" && i !== "___s") { prefix = !TAFFY.isUndefined(out_map[i]) ? "right_" : ""; out_map[prefix + String(i)] = right_row[i]; } } return out_map }; fnMain = function (table) {
                            var right_table, i, arg_list = arguments, arg_length = arg_list.length, result_list = []; if (typeof table.filter !== "function") { if (table.TAFFY) { right_table = table(); } else { throw "TAFFY DB or result not supplied" } } else { right_table = table; } this.context({ results: this.getDBI().query(this.context()) }); TAFFY.each(this.context().results, function (left_row) {
                                right_table.each(function (right_row) {
                                    var arg_data, is_ok = true;
                                    CONDITION: for (i = 1; i < arg_length; i++) { arg_data = arg_list[i]; if (typeof arg_data === "function") { is_ok = arg_data(left_row, right_row); } else { if (typeof arg_data === "object" && arg_data.length) { is_ok = fnCompareList(left_row, right_row, arg_data); } else { is_ok = false; } } if (!is_ok) { break CONDITION } } if (is_ok) { result_list.push(fnCombineRow(left_row, right_row)); }
                                });
                            }); return TAFFY(result_list)()
                        }; return fnMain
                    }()); API.extend("join", innerJoinFunction);
                }()); API.extend("max", function (c) { var highest = null; run.call(this); each(this.context().results, function (r) { if (highest === null || r[c] > highest) { highest = r[c]; } }); return highest }); API.extend("select", function () { var ra = [], args = arguments; run.call(this); if (arguments.length === 1) { each(this.context().results, function (r) { ra.push(r[args[0]]); }); } else { each(this.context().results, function (r) { var row = []; each(args, function (c) { row.push(r[c]); }); ra.push(row); }); } return ra }); API.extend("distinct", function () { var ra = [], args = arguments; run.call(this); if (arguments.length === 1) { each(this.context().results, function (r) { var v = r[args[0]], dup = false; each(ra, function (d) { if (v === d) { dup = true; return TAFFY.EXIT } }); if (!dup) { ra.push(v); } }); } else { each(this.context().results, function (r) { var row = [], dup = false; each(args, function (c) { row.push(r[c]); }); each(ra, function (d) { var ldup = true; each(args, function (c, i) { if (row[i] !== d[i]) { ldup = false; return TAFFY.EXIT } }); if (ldup) { dup = true; return TAFFY.EXIT } }); if (!dup) { ra.push(row); } }); } return ra }); API.extend("supplant", function (template, returnarray) { var ra = []; run.call(this); each(this.context().results, function (r) { ra.push(template.replace(/\{([^\{\}]*)\}/g, function (a, b) { var v = r[b]; return typeof v === "string" || typeof v === "number" ? v : a })); }); return (!returnarray) ? ra.join("") : ra }); API.extend("each", function (m) { run.call(this); each(this.context().results, m); return this }); API.extend("map", function (m) { var ra = []; run.call(this); each(this.context().results, function (r) { ra.push(m(r)); }); return ra }); T = function (d) {
                    var TOb = [], ID = {}, RC = 1, settings = { template: false, onInsert: false, onUpdate: false, onRemove: false, onDBChange: false, storageName: false, forcePropertyCase: null, cacheSize: 100, name: "" }, dm = new Date(), CacheCount = 0, CacheClear = 0, Cache = {}, DBI, runIndexes, root; runIndexes = function (indexes) { var records = [], UniqueEnforce = false; if (indexes.length === 0) { return TOb } each(indexes, function (f) { if (T.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f) && TOb[ID[f]]) { records.push(TOb[ID[f]]); UniqueEnforce = true; } if (T.isObject(f) && f.___id && f.___s && TOb[ID[f.___id]]) { records.push(TOb[ID[f.___id]]); UniqueEnforce = true; } if (T.isArray(f)) { each(f, function (r) { each(runIndexes(r), function (rr) { records.push(rr); }); }); } }); if (UniqueEnforce && records.length > 1) { records = []; } return records }; DBI = {
                        dm: function (nd) { if (nd) { dm = nd; Cache = {}; CacheCount = 0; CacheClear = 0; } if (settings.onDBChange) { setTimeout(function () { settings.onDBChange.call(TOb); }, 0); } if (settings.storageName) { setTimeout(function () { localStorage.setItem("taffy_" + settings.storageName, JSON.stringify(TOb)); }); } return dm }, insert: function (i, runEvent) { var columns = [], records = [], input = protectJSON(i); each(input, function (v, i) { var nv, o; if (T.isArray(v) && i === 0) { each(v, function (av) { columns.push((settings.forcePropertyCase === "lower") ? av.toLowerCase() : (settings.forcePropertyCase === "upper") ? av.toUpperCase() : av); }); return true } else { if (T.isArray(v)) { nv = {}; each(v, function (av, ai) { nv[columns[ai]] = av; }); v = nv; } else { if (T.isObject(v) && settings.forcePropertyCase) { o = {}; eachin(v, function (av, ai) { o[(settings.forcePropertyCase === "lower") ? ai.toLowerCase() : (settings.forcePropertyCase === "upper") ? ai.toUpperCase() : ai] = v[ai]; }); v = o; } } } RC++; v.___id = "T" + String(idpad + TC).slice(-6) + "R" + String(idpad + RC).slice(-6); v.___s = true; records.push(v.___id); if (settings.template) { v = T.mergeObj(settings.template, v); } TOb.push(v); ID[v.___id] = TOb.length - 1; if (settings.onInsert && (runEvent || TAFFY.isUndefined(runEvent))) { settings.onInsert.call(v); } DBI.dm(new Date()); }); return root(records) }, sort: function (o) { TOb = orderByCol(TOb, o.split(",")); ID = {}; each(TOb, function (r, i) { ID[r.___id] = i; }); DBI.dm(new Date()); return true }, update: function (id, changes, runEvent) { var nc = {}, or, nr, tc, hasChange; if (settings.forcePropertyCase) { eachin(changes, function (v, p) { nc[(settings.forcePropertyCase === "lower") ? p.toLowerCase() : (settings.forcePropertyCase === "upper") ? p.toUpperCase() : p] = v; }); changes = nc; } or = TOb[ID[id]]; nr = T.mergeObj(or, changes); tc = {}; hasChange = false; eachin(nr, function (v, i) { if (TAFFY.isUndefined(or[i]) || or[i] !== v) { tc[i] = v; hasChange = true; } }); if (hasChange) { if (settings.onUpdate && (runEvent || TAFFY.isUndefined(runEvent))) { settings.onUpdate.call(nr, TOb[ID[id]], tc); } TOb[ID[id]] = nr; DBI.dm(new Date()); } }, remove: function (id) { TOb[ID[id]].___s = false; }, removeCommit: function (runEvent) { var x; for (x = TOb.length - 1; x > -1; x--) { if (!TOb[x].___s) { if (settings.onRemove && (runEvent || TAFFY.isUndefined(runEvent))) { settings.onRemove.call(TOb[x]); } ID[TOb[x].___id] = undefined; TOb.splice(x, 1); } } ID = {}; each(TOb, function (r, i) { ID[r.___id] = i; }); DBI.dm(new Date()); }, query: function (context) {
                            var returnq, cid, results, indexed, limitq, ni; if (settings.cacheSize) {
                                cid = ""; each(context.filterRaw, function (r) {
                                    if (T.isFunction(r)) {
                                        cid = "nocache";
                                        return TAFFY.EXIT
                                    }
                                }); if (cid === "") { cid = JSON.stringify(T.mergeObj(context, { q: false, run: false, sort: false })); }
                            } if (!context.results || !context.run || (context.run && DBI.dm() > context.run)) { results = []; if (settings.cacheSize && Cache[cid]) { Cache[cid].i = CacheCount++; return Cache[cid].results } else { if (context.q.length === 0 && context.index.length === 0) { each(TOb, function (r) { results.push(r); }); returnq = results; } else { indexed = runIndexes(context.index); each(indexed, function (r) { if (context.q.length === 0 || runFilters(r, context.q)) { results.push(r); } }); returnq = results; } } } else { returnq = context.results; } if (context.order.length > 0 && (!context.run || !context.sort)) { returnq = orderByCol(returnq, context.order); } if (returnq.length && ((context.limit && context.limit < returnq.length) || context.start)) { limitq = []; each(returnq, function (r, i) { if (!context.start || (context.start && (i + 1) >= context.start)) { if (context.limit) { ni = (context.start) ? (i + 1) - context.start : i; if (ni < context.limit) { limitq.push(r); } else { if (ni > context.limit) { return TAFFY.EXIT } } } else { limitq.push(r); } } }); returnq = limitq; } if (settings.cacheSize && cid !== "nocache") { CacheClear++; setTimeout(function () { var bCounter, nc; if (CacheClear >= settings.cacheSize * 2) { CacheClear = 0; bCounter = CacheCount - settings.cacheSize; nc = {}; eachin(function (r, k) { if (r.i >= bCounter) { nc[k] = r; } }); Cache = nc; } }, 0); Cache[cid] = { i: CacheCount++, results: returnq }; } return returnq
                        }
                    }; root = function () { var iAPI, context; iAPI = TAFFY.mergeObj(TAFFY.mergeObj(API, { insert: undefined }), { getDBI: function () { return DBI }, getroot: function (c) { return root.call(c) }, context: function (n) { if (n) { context = TAFFY.mergeObj(context, n.hasOwnProperty("results") ? TAFFY.mergeObj(n, { run: new Date(), sort: new Date() }) : n); } return context }, extend: undefined }); context = (this && this.q) ? this : { limit: false, start: false, q: [], filterRaw: [], index: [], order: [], results: false, run: null, sort: null, settings: settings }; each(arguments, function (f) { if (isIndexable(f)) { context.index.push(f); } else { context.q.push(returnFilter(f)); } context.filterRaw.push(f); }); return iAPI }; TC++; if (d) { DBI.insert(d); } root.insert = DBI.insert; root.merge = function (i, key, runEvent) { var search = {}, finalSearch = [], obj = {}; runEvent = runEvent || false; key = key || "id"; each(i, function (o) { var existingObject; search[key] = o[key]; finalSearch.push(o[key]); existingObject = root(search).first(); if (existingObject) { DBI.update(existingObject.___id, o, runEvent); } else { DBI.insert(o, runEvent); } }); obj[key] = finalSearch; return root(obj) }; root.TAFFY = true; root.sort = DBI.sort; root.settings = function (n) { if (n) { settings = TAFFY.mergeObj(settings, n); if (n.template) { root().update(n.template); } } return settings }; root.store = function (n) { var i; if (localStorage) { if (n) { i = localStorage.getItem("taffy_" + n); if (i && i.length > 0) { root.insert(i); } if (TOb.length > 0) { setTimeout(function () { localStorage.setItem("taffy_" + settings.storageName, JSON.stringify(TOb)); }); } } root.settings({ storageName: n }); } return root }; return root
                }; TAFFY = T; T.each = each; T.eachin = eachin; T.extend = API.extend; TAFFY.EXIT = "TAFFYEXIT"; TAFFY.mergeObj = function (ob1, ob2) { var c = {}; eachin(ob1, function (v, n) { c[n] = ob1[n]; }); eachin(ob2, function (v, n) { c[n] = ob2[n]; }); return c }; TAFFY.has = function (var1, var2) { var re = true, n; if ((var1.TAFFY)) { re = var1(var2); if (re.length > 0) { return true } else { return false } } else { switch (T.typeOf(var1)) { case "object": if (T.isObject(var2)) { eachin(var2, function (v, n) { if (re === true && !T.isUndefined(var1[n]) && var1.hasOwnProperty(n)) { re = T.has(var1[n], var2[n]); } else { re = false; return TAFFY.EXIT } }); } else { if (T.isArray(var2)) { each(var2, function (v, n) { re = T.has(var1, var2[n]); if (re) { return TAFFY.EXIT } }); } else { if (T.isString(var2)) { if (!TAFFY.isUndefined(var1[var2])) { return true } else { return false } } } } return re; case "array": if (T.isObject(var2)) { each(var1, function (v, i) { re = T.has(var1[i], var2); if (re === true) { return TAFFY.EXIT } }); } else { if (T.isArray(var2)) { each(var2, function (v2, i2) { each(var1, function (v1, i1) { re = T.has(var1[i1], var2[i2]); if (re === true) { return TAFFY.EXIT } }); if (re === true) { return TAFFY.EXIT } }); } else { if (T.isString(var2) || T.isNumber(var2)) { for (n = 0; n < var1.length; n++) { re = T.has(var1[n], var2); if (re) { return true } } } } } return re; case "string": if (T.isString(var2) && var2 === var1) { return true } break; default: if (T.typeOf(var1) === T.typeOf(var2) && var1 === var2) { return true } break } } return false }; TAFFY.hasAll = function (var1, var2) { var T = TAFFY, ar; if (T.isArray(var2)) { ar = true; each(var2, function (v) { ar = T.has(var1, v); if (ar === false) { return TAFFY.EXIT } }); return ar } else { return T.has(var1, var2) } }; TAFFY.typeOf = function (v) { var s = typeof v; if (s === "object") { if (v) { if (typeof v.length === "number" && !(v.propertyIsEnumerable("length"))) { s = "array"; } } else { s = "null"; } } return s }; TAFFY.getObjectKeys = function (ob) { var kA = []; eachin(ob, function (n, h) { kA.push(h); }); kA.sort(); return kA }; TAFFY.isSameArray = function (ar1, ar2) { return (TAFFY.isArray(ar1) && TAFFY.isArray(ar2) && ar1.join(",") === ar2.join(",")) ? true : false }; TAFFY.isSameObject = function (ob1, ob2) {
                    var T = TAFFY, rv = true; if (T.isObject(ob1) && T.isObject(ob2)) {
                        if (T.isSameArray(T.getObjectKeys(ob1), T.getObjectKeys(ob2))) {
                            eachin(ob1, function (v, n) {
                                if (!((T.isObject(ob1[n]) && T.isObject(ob2[n]) && T.isSameObject(ob1[n], ob2[n])) || (T.isArray(ob1[n]) && T.isArray(ob2[n]) && T.isSameArray(ob1[n], ob2[n])) || (ob1[n] === ob2[n]))) {
                                    rv = false;
                                    return TAFFY.EXIT
                                }
                            });
                        } else { rv = false; }
                    } else { rv = false; } return rv
                }; typeList = ["String", "Number", "Object", "Array", "Boolean", "Null", "Function", "Undefined"]; makeTest = function (thisKey) { return function (data) { return TAFFY.typeOf(data) === thisKey.toLowerCase() ? true : false } }; for (idx = 0; idx < typeList.length; idx++) { typeKey = typeList[idx]; TAFFY["is" + typeKey] = makeTest(typeKey); } module.exports = TAFFY;
            }
        }());
    });

    const SELECTED = 0;
    /**
     * 反选
     * @type {Number}
     */
    const SELECTED_NONE = 1;
    /**
     *
     * @type {Number}
     */
    const SELECTED_PRIMARY = 2;

    const REQ_CONNECTION_START = 'connection start';

    const REQ_CONNECTION_END = 'connection end';

    const REQ_RECONNECT_SOURCE = 'Reconnection source';
    const REQ_CONNECTION_MOD = 'connection mod';

    const REQ_RECONNECT_TARGET = 'Reconnection target';
    const REQ_RESIZE_CHILDREN = 'resize children';
    const REQ_MOVE = 'move';
    const REQ_MOVE_CHILDREN = 'move children';
    const REQ_ORPHAN_CHILDREN = 'orphan children';
    const REQ_CREATE = 'create child';
    const REQ_ADD = 'add children';
    const REQ_CLONE = 'clone';
    const REQ_DELETE_DEPENDANT = 'delete dependant';
    const REQ_SELECTION = 'selection';
    const REQ_DRAG_START = 'REQ_DRAG_START';
    const REQ_MOUSE_UP = 'REQ_MOUSE_UP';

    const PRE_EXECUTE = 1;
    const PRE_REDO = 2;
    const PRE_UNDO = 4;
    const POST_EXECUTE = 3;

    const ACTION_SELECTION = 0;
    const ACTION_STACK = 1;
    const ACTION_EDITOR = 2;

    const PRIMARY_DRAG_ROLE = 'PrimaryDrag Policy';
    const LAYOUT_POLICY = 'Layout Policy';
    const CONNECTION_POLICY = 'Connection Policy';
    const SELECTION_POLICY = 'Selection Policy';

    window.requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.msRequestAnimationFrame;

    /*
     * common name space definition
     *
     *
     */
    const anra = window.anra || {};
    const noop$1 = Util.noop;
    /**
     * 数据库
     * @type {{}}
     */
    anra.Store = {
        _storeMap: {},
        newStore(id) {
            id || (id = Util.genUUID());
            this._storeMap[id] = {
                node: taffy(),
                line: taffy()
            };
            return id;
        },
        get(id, key) {
            return key != null ? this._storeMap[id][key] : this._storeMap[id];
        },
        remove(id) {
            if (id && this._storeMap[id]) {
                this._storeMap[id].node().remove();
                this._storeMap[id].line().remove();
                this._storeMap[id].node = null;
                this._storeMap[id].line = null;
                delete this._storeMap[id];
            }
        }
    };

    /*图片加载器，用于内存管理*/
    const ImageRegistry = Base_1.extend({
        images: new Map(),
        regist(imageURL) {
            var img = this.images.get(imageURL);
            if (img == null) {
                img = new Image();
                img.src = imageURL;
                this.images.set(imageURL, img);
            }
            return img;
        },
        isLoaded(imageURL) {
            var img = this.images.get(imageURL);
            if (img == null)
                img = this.regist(imageURL);
            if (img.complete)
                return true;
            return false;
        },
        get(imageURL) {
            return this.images.get(imageURL);
        },
        clear() {
            this.images.clear();
        }
    });

    anra.ImageRegistry = new ImageRegistry();


    /**
     *全局使用
     */
    anra.Platform = {
        isfocus: true,
        ready: false,
        focus: null,
        regist(element, display) {
            if (!this.ready)
                this.init();

            Util.addListener(element, 'mousedown.Platform', e => {
                anra.Platform.focus = display;
            }, { useCapture: true, default: false, stop: false });
            Util.addListener(element, 'mouseup.Platform', e => {
                anra.Platform.focus = display;
            }, { useCapture: true, default: false, stop: false });
        },
        unregist(element, display) {
            if (display && display == anra.Platform.focus) anra.Platform.focus = null;
            Util.removeListener(element, 'mousedown.Platform');
            Util.removeListener(element, 'mouseup.Platform');
        },
        init() {
            this.ready = true;
        },
        globalKeyDown(event) {
            var d = anra.Platform.focus;
            if (d != null && d.dispatcher != null)
                d.dispatcher.dispatchKeyDown(event);
        },
        globalKeyUp(event) {
            var d = anra.Platform.focus;
            if (d != null && d.dispatcher != null)
                d.dispatcher.dispatchKeyUp(event);
        },
        getDisplay() {
            return this.focus;
        },
        error(e) {
            if (this.focus != null) {
                this.focus.error(e);
            } else {
                throw e
            }
        },
        setMouseTarget(o) {
            if (this.focus != null) {
                this.focus.dispatcher.setMouseTarget(o);
            }
        }
    };

    /**
     *矩形工具类
     * @type {Object}
     */
    anra.Rectangle = {
        contains(rect, x, y) {
            if (rect == null)
                return false;
            return (x > rect.x) && (y > rect.y) && x < (rect.x + rect.width) && y < (rect.y + rect.height);
        },
        containsWithBorder(rect, x, y) {
            if (rect == null)
                return false;
            return (x >= rect.x) && (y >= rect.y) && x <= (rect.x + rect.width) && y <= (rect.y + rect.height);
        },
        observe(r1, r2) {
            return (r1.x < r2.x) && (r1.y < r2.y) && (r1.x + r1.width > r2.x + r2.width) && (r1.y + r1.height > r2.y + r2.height);
        },
        distance(r1, r2) {
            return Math.sqrt((r1[0] - r2[0]) * (r1[0] - r2[0]) + (r1[1] - r2[1]) * (r1[1] - r2[1]));
        }
    };

    anra.Platform.DISPLAY = 0;
    anra.Platform.PAINTER = 1;


    anra._EventTable = {
        on(eventType, listener) {
            if (listener == null) anra.Platform.getDisplay().error("listener can not be null");
            if (this.eventTable == null) this.eventTable = new anra.event.EventTable();
            this.eventTable.hook(eventType, listener);
            if (this.afterAddListener != null) this.afterAddListener();
        },
        off(eventType, listener) {
            if (listener == null) anra.Platform.getDisplay().error("listener can not be null");
            if (this.eventTable == null) return;
            this.eventTable.unhook(eventType, listener);
            if (this.afterRemoveListener != null) this.afterRemoveListener();
        },
        dispose() {
            if (this.eventTable != null)
                this.eventTable.dispose();
        },
        notifyListeners(eventType, event, isGlobalEvent) {
            if (this.parent != null && !isGlobalEvent && Util.contains(anra.BubbleEvent, eventType)) {
                var ls = this.eventTable == null ? null : this.eventTable.filter(eventType);
                if (ls == null || ls.length == 0) {
                    this.parent.notifyListeners(eventType, event, isGlobalEvent);
                    return;
                }
            }
            if (event == null) event = new anra.event.Event();
            event.type = eventType;
            event.widget = this;
            event.display = anra.Platform.getDisplay();
            if (event.time == 0) {
                event.time = new Date().getTime();
            }
            if (isGlobalEvent) {
                anra.Platform.getDisplay().postEvent(event);
            } else {
                if (this.eventTable != null)
                    this.eventTable.sendEvent(event);
            }
        },
        fire(type, ...args) {
            this.fireEach(type, listener => Reflect.apply(listener, null, args));
        },
        fireEach(type, fn) {
            if (this.eventTable != null) {
                this.eventTable.filter(type).forEach(fn);
            }
        }
    };
    /**
     * 显示器
     * @type {*}
     */
    anra._Display = {
        id: "default canvas",
        element: null,
        globalListener: null,
        postEvent(e) {
            if (this.eventTable != null)
                this.eventTable.sendEvent(e);
        },
        notifyListeners() {
        },
        error(msg) {
            throw msg;
        },
        p2x(p) {
            if (this.element == null)
                return -1;
            return this.element.width * p / 100;
        },
        p2y(p) {
            if (this.element == null)
                return -1;
            return this.element.height * p / 100;
        },
        getRelativeLocation(event) {
            var ev = event || window.event, x = 0, y = 0;
            let {top,left}=this.getOffset(this.element);
            if (typeof ev.clientX === 'number') {
                x = ev.clientX - left ;
            }
            if (typeof ev.clientY === 'number') {
                y = ev.clientY - top;
            }

            return [x, y];
        },
        getOffset(elem){
            if ( !elem.getClientRects().length ) {
                return { top: 0, left: 0 };
            }
    
            // Get document-relative position by adding viewport scroll to viewport-relative gBCR
           let rect = elem.getBoundingClientRect();
            let win = elem.ownerDocument.defaultView;
            return {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset
            };
        },

        // getX(obj) {
        //     //        if (this.left != null)
        //     //            return this.left - obj.scrollLeft;
        //     var parObj = obj;
        //     var left = parObj.offsetLeft;
        //     while (parObj = parObj.offsetParent) {
        //         left += parObj.offsetLeft;
        //     }
        //     //        this.left = left;
        //     return left - obj.scrollLeft-document.body.clientLeft;
        // },
        // getY(obj) {
        //     /*在外框发生变化时，top也应该随时变化，当然，可以考虑监听外部元素的位置变化来实现*/
        //     //        if (this.top != null)
        //     //            return this.top - obj.scrollTop;
        //     var parObj = obj;
        //     var top = obj.offsetTop;
        //     while (parObj = parObj.offsetParent) {
        //         top += parObj.offsetTop;
        //     }
        //     //        this.top = top;
        //     /*scrollTop是为了考虑滚动条位置*/
        //     return top - obj.scrollTop-document.body.clientLeft;
        // }
    };
    anra.Display = Base_1.extend(anra._Display).extend(anra._EventTable);

    /**
     * 控件
     * @type {*}
     */
    anra.Widget = Base_1.extend({
        id: "",
        constructor() {
            let PropsOpt = this.defineProperties();
            let opts = new PropsOpt();
            if (Util.isObject(opts)) {
                for (let prop in opts) {
                    if (Util.isObject(opts[prop])) {
                        Reflect.defineProperty(this, prop, opts[prop]);
                    }
                }
            }
        },
        defineProperties() {
            return Base_1.extend({})
        },
        error(msg) {
            this.display.error(this.id + ":" + msg);
        }
    }).extend(anra._EventTable);

    anra.Control = anra.Widget.extend({
        parent: null,
        addMouseListener(listener) {
            if (listener == null) this.error("NullPointException anra.Control#addMouseListener");
            this.on(anra.EVENT.MouseDown, listener);
            this.on(anra.EVENT.MouseUp, listener);
            this.on(anra.EVENT.MouseDoubleClick, listener);
        },
        addKeyListener(listener) {
            if (listener == null) this.error("NullPointException anra.Control#addKeyListener");
            this.on(anra.EVENT.KeyDown, listener);
            this.on(anra.EVENT.KeyUp, listener);
        },
        addTouchListener(listener) {
            if (listener == null) this.error("NullPointException anra.Control#addTouchListener");
            this.on(anra.EVENT.TouchStart, listener);
            this.on(anra.EVENT.TouchMove, listener);
            this.on(anra.EVENT.TouchEnd, listener);
        },
        selected(s) {
        }
    });
    anra.Composite = anra.Control.extend({
        selection: null,
        /*找到指定位置的控件*/
        findWidgetOnXY(x, y) {
        },
        setSelection(o) {
            if (this.selection != null)
                this.selection.setSelected(false);
            this.selection = o;
            this.selection.setSelected(true);
        }
    });


    /**
     * 监听
     * @type {*|void}
     */
    anra.Listener = Base_1.extend({
        func: null,
        constructor(func) {
            this.func = func || noop$1;
        },
        handleEvent(event) {
            this.func(event);
        }
    });
    anra.KeyListener = anra.Listener.extend({
        handleEvent(event) {
            if (event.type == anra.EVENT.KeyDown) {
                this.handleKeyDownEvent(event);
            } else if (event.type == anra.EVENT.KeyUp) {
                this.handleKeyDownUp(event);
            }
        },
        handleKeyDownEvent(event) {
        },
        handleKeyDownUp(event) {
        }
    });

    /**
     * 动作
     * @type {*|Object}
     */
    /*anra.Action = Base.extend({
        _action: null,
        constructor (action) {
            if (action == null) {
                throw new Error(``)
            }
            this._action = action
        }
    });*/

    anra.Menu = Base_1.extend({
        show() {
            if (this.widget == null) {
                this.widget = this.create();
            }
        },
        create: noop$1,
        update: noop$1,
        hide: noop$1
    });

    /**
     *事件定义
     */
    anra.event = anra.event || {};
    anra.EVENT = {
        NONE: 0,
        MouseDown: 'mousedown',
        MouseUp: 'mouseup',
        MouseOver: 'mouseover',
        MouseIn: 'mousein',
        MouseOut: 'mouseout',
        MouseClick: 'click',
        MouseDoubleClick: 'dblclick',
        MouseDrag: 'drag',
        MouseMove: 'mousemove',
        KeyDown: 'keydown',
        KeyUp: 'keyup',
        TouchStart: 'touchstart',
        TouchMove: 'touchmove',
        TouchEnd: 'touchend',
        DragStart: 'dragstart',
        DragEnd: 'dragend',
        Dropped: 'dropped',
        ContextMenu: 'contextmenu'
    };
    var E = anra.EVENT;
    /**
     *以下事件，如果当前元素没有监听，则冒泡到父级
     * @type {Array}
     */
    anra.BubbleEvent = [
        E.MouseDown, E.MouseUp, E.MouseMove, E.MouseDoubleClick, E.MouseDrag, E.DragEnd, E.DragStart
    ];

    anra.event.Event = Base_1.extend({
        widget: null,
        type: 0,
        x: undefined,
        y: undefined,
        prop: null,
        constructor(obj, location, prop) {
            this.type = obj || anra.EVENT.NONE;
            if (location != null && location.length == 2) {
                this.x = location[0];
                this.y = location[1];
            }
            this.prop = prop;
        }
    });

    anra.event.KeyEvent = anra.event.Event.extend({
        key: undefined,
        keyCode: undefined,
        constructor(obj, location, event) {
            if (event != null) {
                //            this.keyCode = event.keyCode;
                for (var k in event) {
                    this[k] = event[k];
                }
            }
            this.type = obj || anra.EVENT.NONE;
            if (location != null && location.length == 2) {
                this.x = location[0];
                this.y = location[1];
            }
        }
    });
    anra.event.TouchEvent = anra.event.Event.extend({
        touches: [],
        constructor(obj, location, event) {
            this.type = obj || anra.EVENT.NONE;
            if (location != null && location.length == 2) {
                this.x = location[0];
                this.y = location[1];
            }
            if (event != null) {
                this.touches = event.touches;
            }
        }
    });
    anra.event.EventTable = Base_1.extend({
        types: null,
        listeners: null,
        level: 0,
        constructor() {
            this.types = [];
            this.listeners = [];
        },
        containsEvent(eventType) {
            return this.types.includes(eventType)
        },
        filter(eventType) {
            var result = [];
            for (var i = 0; i < this.types.length; i++) {
                if (this.types[i] == eventType) {
                    result.push(this.listeners[i]);
                }
            }
            return result;
        },
        hook(eventType, listener) {
            this.types.push(eventType);
            this.listeners.push(listener);
        },
        unhook(eventType, listener) {
            for (var i = 0; i < this.types.length; i++) {
                if (this.types[i] == eventType && this.listeners[i] == listener) {
                    this.remove(i);
                    return;
                }
            }
        },
        dispose() {
            this.types.length = 0;
            this.listeners.length = 0;
        },
        remove(i) {
            Util.remove(this.types, i);
            Util.remove(this.listeners, i);
        },
        sendEvent(event) {
            if (event.type == anra.EVENT.NONE) return;
            for (var i = 0; i < this.types.length; i++) {
                if (this.types[i] == event.type) {
                    var l = this.listeners[i];
                    if (l != null)
                        if (typeof (l) == 'function') {
                            l(event);
                        } else
                            l.handleEvent(event);
                }
            }
        },
        size() {
            return this.types.length;
        }
    });
    /**
     * 命令
     * @type {*}
     */
    anra.Command = Base_1.extend({

        execute() {
        },
        canExecute() {
            return true;
        },
        redo() {
            this.execute();
        },
        undo() {
        },
        canUndo() {
            return true;
        },
        dispose() {
        },
        chain(command) {
            if (command == null)
                return this;

            var result = new anra.ChainedCompoundCommand();
            result.add(this);
            result.add(command);
            return result;
        }
    });
    anra.ChainedCompoundCommand = anra.Command.extend({
        commandList: null,
        constructor() {
            this.commandList = [];
        },
        add(c) {
            if (c != null) this.commandList.push(c);
        },
        canExecute() {
            if (this.commandList.length == 0)
                return false;
            for (var i = 0, len = this.commandList.length; i < len; i++) {
                var cmd = this.commandList[i];
                if (cmd == null)
                    return false;
                if (!cmd.canExecute())
                    return false;
            }
            return true;
        },
        canUndo() {
            if (this.commandList.length == 0)
                return false;
            for (var i = 0, len = this.commandList.length; i < len; i++) {
                var cmd = this.commandList[i];
                if (cmd == null)
                    return false;
                if (!cmd.canUndo())
                    return false;
            }
            return true;
        },
        dispose() {
            for (var i = 0, len = this.commandList.length; i < len; i++) {
                this.commandList[i].dispose();
            }
        },
        execute() {
            for (var i = 0, len = this.commandList.length; i < len; i++) {
                this.commandList[i].execute();
            }
        },
        undo() {
            for (var i = this.commandList.length - 1; i >= 0; i--)
                this.commandList[i].undo();
        },
        getCommands() {
            return this.commandList;
        },
        isEmpty() {
            return this.commandList == null || this.commandList.length == 0;
        },
        size() {
            return this.commandList.length;
        },
        chain(c) {
            if (c != null)
                this.add(c);
            return this;
        }
    });
    /**
     * 命令事件
     * @type {*}
     */
    anra.CommandEvent = Base_1.extend({
        statck: null,
        command: null,
        state: null,
        constructor(stack, cmd, state) {
            this.stack = stack;
            this.command = cmd;
            this.state = state;
        }
    });
    /**
     * 动作注册器
     * @type {*}
     */
    anra.ActionRegistry = Base_1.extend({
        constructor() {
            this.selectionActions = new Map();
            this.cmdStackActions = new Map();
            this.propertyActions = new Map();
        },
        _getMap(type) {
            if (ACTION_SELECTION === type) return this.selectionActions
            if (ACTION_EDITOR === type) return this.propertyActions
            if (ACTION_STACK === type) return this.cmdStackActions
            return false
        },
        _actionCheck(action) {
            return action.check == null || action.check()
        },
        _keyCheck(action, event) {
            return Util.toKeyStringByEvent(event) === Util.toKeyString(action.key)
        },
        _setContext(action, editor) {
            var context = { editor: null, selection: null, stack: null };
            switch (action.type) {
                case ACTION_EDITOR:
                    context.editor = editor;
                    break;
                case ACTION_SELECTION:
                    context.selection = editor.rootEditPart.selection;
                    break;
                case ACTION_STACK:
                    context.stack = editor.cmdStack;
            }
            Object.assign(action, context);
        },
        regist(action) {
            if (action instanceof Array) {
                for (var i = 0; i < action.length; i++) {
                    this.registAction(action[i]);
                }
            } else {
                this.registAction(action);
            }
            return this;
        },
        registAction(action) {
            if (action.id == null) {
                console.log('action id can not be null');
                return
            }

            const actionMap = this._getMap(action.type);
            actionMap && actionMap.set(action.id, action);
        },
        getActions(type, editor, { check = true, event } = {}) {
            let actions = [];

            if (type === '*') {
                [ACTION_EDITOR, ACTION_SELECTION, ACTION_STACK]
                    .forEach(_type => {
                        let _actions = this.getActions(_type, editor, { check, event });
                        if (_actions.length > 0) {
                            actions = actions.concat(_actions);
                        }
                    });
            } else {
                let map = this._getMap(type);
                if (map != null) {
                    for (let action of map.values()) {
                        this._setContext(action, editor);
                        if (event != null && !this._keyCheck(action, event)) {
                            continue
                        }

                        if (check && !this._actionCheck(action)) {
                            continue
                        }

                        actions.push(action);
                    }
                }
            }

            return actions
        },
        dispose() {
            this.selectionActions.clear();
            this.cmdStackActions.clear();
            this.propertyActions.clear();
        }
    });

    /**
     * 命令栈
     * @type {*}
     */
    anra.CommandStack = Base_1.extend({
        redoable: null,
        undoable: null,
        listeners: null,
        saveLocation: 0,
        constructor() {
            this.redoable = [];
            this.undoable = [];
            this.listeners = [];
        },
        addCommandStackEventListener(e) {
            if (e instanceof anra.Listener)
                this.listeners.push(e);
        },
        removeCommandStackEventListener(e) {
            if (e instanceof anra.Listener) {
                Util.removeObject(this.listeners, e);
            }
        },
        clearCommandStackEventListener(e) {
            this.listeners = [];
        },
        canRedo() {
            return this.redoable.length > 0;
        },
        canUndo() {
            return this.undoable.length == 0 ? false : this.undoable[this.undoable.length - 1].canUndo();
        },
        redo() {
            if (!this.canRedo())
                return;
            var command = this.redoable.pop();
            this.notifyListeners(command, PRE_REDO);
            command.redo();
            this.undoable.push(command);
            this.notifyListeners();
        },
        undo() {
            if (!this.canUndo()) return;
            var command = this.undoable.pop();
            this.notifyListeners(command, PRE_UNDO);
            command.undo();
            this.redoable.push(command);
            this.notifyListeners();
        },
        notifyListeners(command, state) {
            for (var i = 0; i < this.listeners.length; i++)
                this.listeners[i].handleEvent({ command, state });
        },
        flush() {
            this.flushRedo();
            this.flushUndo();
            this.saveLocation = 0;
            this.notifyListeners();
        },
        flushRedo() {
            while (!Util.isEmpty(this.redoable))
                this.redoable.pop().dispose();
        },
        flushUndo() {
            while (!Util.isEmpty(this.undoable))
                this.undoable.pop().dispose();
        },
        execute(c) {
            if (c == null || !c.canExecute())
                return;
            this.flushRedo();
            this.notifyListeners(c, PRE_EXECUTE);
            try {
                c.execute();
                if (this.getUndoLimit() > 0)
                    while (this.undoable.length > this.getUndoLimit()) {
                        Util.remove(this.undoable, 0);
                        if (this.saveLocation > -1)
                            this.saveLocation--;
                    }
                if (this.saveLocation > this.undoable.length)
                    this.saveLocation = -1;
                this.undoable.push(c);
            } finally {
                this.notifyListeners(c, POST_EXECUTE);
            }
        },
        getUndoLimit() {
            return 15;
        },
        markSaveLocation() {
            this.saveLocation = this.undoable.length;
        },
        isDirty() {
            return this.undoable.length != this.saveLocation;
        },
        dispose() {
            this.redoable = [];
            this.undoable = [];
            this.listeners = [];
        }
    });

    anra.ListenerSupport = Base_1.extend({
        constructor() {
            this.map = new anra.ArrayMap();
        },
        add(key, listener) {
            if (listener == null) return;
            this.map.put(key != null ? key : listener.key != null ? listener.key : null, listener);
        },
        remove(key, listener) {
            if (listener == null) return;
            this.map.remove(key != null ? key : listener.key != null ? listener.key : null, listener);
        },
        fireAll(key, ...args) {
            const named = this.map.getListeners(key);
            this.fire(named, ...args);
            if (key != null) {
                const common = this.map.getListeners(null);
                this.fire(common, ...args);
            }
        },
        fire(ls, ...args) {
            if (ls != null) {
                for (let listener of ls) {
                    if (typeof listener === 'function') {
                        listener(...args);
                    }
                }
            }
        },
        dispose() {
            this.map.clear();
        }
    });

    anra.PropertyListenerSupport = Base_1.extend({
        constructor() {
            this.map = new anra.ArrayMap();
        },
        addPropertyListener(listener, key) {
            if (listener == null) return;
            this.map.put(key != null ? key : listener.key != null ? listener.key : null, listener);
        },
        removePropertyListener(listener, key) {
            if (listener == null) return;
            this.map.remove(key != null ? key : listener.key != null ? listener.key : null, listener);
        },
        firePropertyChanged(key, oldValue, newValue) {
            var named = this.map.getListeners(key);
            this.fire(named, key, oldValue, newValue);
            if (key != null) {
                var common = this.map.getListeners(null);
                this.fire(common, key, oldValue, newValue);
            }
        },
        fire(ls, key, oldValue, newValue) {
            if (ls != null)
                for (var i = 0, len = ls.length; i < len; i++) {
                    if (typeof ls[i] == 'function')
                        ls[i](key, oldValue, newValue);
                    else if (ls[i].propertyChanged != null)
                        ls[i].propertyChanged(key, oldValue, newValue);
                }
        }
    });

    /*anra.PropertyListenerSupport = anra.ListenerSupport.extend({
      addPropertyListener (listener, key) {
          this.base(key, listener)
      },
      removePropertyListener (listener, key) {
          this.base(key, listener)
      },
      firePropertyChanged (key, oldValue, newValue) {
          this.fireAll(key, key, oldValue, newValue)
      },
      fire(ls, key, oldValue, newValue) {
        if (ls != null)
          for (var i = 0, len = ls.length; i < len; i++) {
            if (typeof ls[i] == 'function')
              ls[i](key, oldValue, newValue);
            else if (ls[i].propertyChanged != null)
              ls[i].propertyChanged(key, oldValue, newValue);
          }
      }
    })*/

    anra.ArrayMap = Base_1.extend({
        map: null,
        constructor() {
            this.map = new Map();
        },
        put(k, v) {
            if (v == null) return;
            var vs = this.map.get(k);
            if (vs == null) {
                vs = [];
                this.map.set(k, vs);
            }
            vs.push(v);
        },
        getListeners(key) {
            return this.map.get(key);
        },
        remove(k, v) {
            if (v == null) return;
            var vs = this.map.get(k);
            if (vs == null)
                return;
            Util.removeObject(vs, v);
        },
        clear() {
            this.map.clear();
        }
    });

    /**
     * Created with JetBrains WebStorm.
     * User: Caiyu
     * Date: 16-7-14
     * Time: 上午9:51
     * To change this template use File | Settings | File Templates.
     */

    //anra.svg.GridLayout.numColumns = 3;
    //anra.svg.GridLayout.makeColumnsEqualWidth=false;
    var Layout = Base_1.extend({
        layout(comp) {
        },
        refreshModel(figure, bounds) {
            if (figure.model) {
                let lastBounds = figure.model.get('bounds');

                //这里希望在调整位置的时候照顾到自己节点
                if (lastBounds[0] != bounds['x'] || lastBounds[1] != bounds['y']) {
                    let refreshChilren = function () {
                        this.applyBounds();

                        if (this.children)
                            for (var i = 0; i < this.children.length; i++) {
                                refreshChilren.call(this.children[i]);
                            }
                    };

                    refreshChilren.call(figure);
                }

                figure.model.set('bounds', [
                    bounds['x'],
                    bounds['y'],
                    bounds['width'],
                    bounds['height']
                ]);
            } else if (figure.owner) {
                console.log('group');
                /*figure.svg.owner.style.width = bounds['width'] + 'px';
                figure.svg.owner.style.height =  bounds['height'] + 'px';*/
            }
        }
    });

    Layout.init = function (cfg) {
        if (cfg == null) return;

        return typeof (cfg) == 'function'
            ? new cfg()
            : new Layout.extend(cfg);
    };

    var FillLayout = Layout.extend({
        layout: function (p) {
            var children = p.children;
            if (children == null) return;
            var w = p.bounds.width;
            var h = p.bounds.height;
            var len = children.length;
            var ch = h / len;
            for (var i = 0; i < len; i++) {
                children[i].setBounds({
                    x: 0, y: ch * i, height: ch, width: w
                });
            }
        }
    });

    var GridLayout = Layout.extend({

        arg: null,

        layout: function (p) {
            if (p.children == null) {
                return;
            }

            var arg = p.layoutManager.arg;

            //清为原始数据
            arg.marginTopUsed = arg.marginTop;
            arg.marginLeftUsed = arg.marginLeft;
            arg.currentColumnNum = 0;
            arg.parent = p;
            arg.pWidth = p.getBounds().width;
            arg.pHeight = p.getBounds().height;
            arg.maxColumnWidth = 0;
            arg.maxColumnHeight = 0;


            //确定max
            for (var i = 0; i < p.children.length; i++) {
                var c = p.children[i];
                if (typeof (c.layoutData.spanCol) == 'undefined' && c.layoutData.width > arg.maxColumnWidth) {
                    arg.maxColumnWidth = c.layoutData.width;
                }

                if (c.layoutData.spanRow > 0) {
                    c.layoutData.height =
                        c.layoutData.spanRow * (arg.pHeight - arg.marginTop - arg.marginBottom) / (1.0 * arg.numRows);
                }

                if (c.layoutData.height > arg.maxColumnHeight) {
                    arg.maxColumnHeight = c.layoutData.height;
                }
            }
            var r, c;
            for (var i = 0; i < p.children.length; i++) {
                c = p.children[i];
                c.layoutData.x = 0;
                c.layoutData.y = 0;
                r = c.layoutData.compute(p.layoutManager.arg);

                c.setBounds({
                    x: r[0][0],
                    y: r[0][1],
                    width: r[1],
                    height: r[2]
                });
            }
        },

        constructor: function (numColumns, makeColumnsEqualWidth) {
            this.arg = {
                "numColumns": 1, //列数目
                "numRows": NaN, //默认undefined
                "makeColumnsEqualWidth": false, //列宽度是否相等，当为false，列宽度与部件的宽度一样
                //"marginWidth":5,
                //"marginHeight":5,
                "marginLeft": 2,
                "marginTop": 2,
                "marginRight": 2,
                "marginBottom": 2,
                "horizontalSpacing": 15,
                "verticalSpacing": 15,

                "marginTopUsed": 0,
                "marginLeftUsed": 0,

                "maxColumnWidth": 0,
                "maxColumnHeight": 0,
                "currentColumnNum": 0,
                "pWidth": 0,
                "pHeight": 0


            };
            var arg = this.arg;

            arg.numColumns = numColumns == null ? 1 : numColumns;
            arg.makeColumnsEqualWidth = makeColumnsEqualWidth;

            arg.marginTopUsed = arg.marginTop;
            arg.marginLeftUsed = arg.marginLeft;

            arg.currentColumnNum = 0;
        },

        setNumRows: function (numRows) {
            var arg = this.arg;
            arg.numRows = numRows;
            //arg.maxColumnHeight = (p.getBounds().height - arg.marginTop - arg.marginBottom)/(1.0*numRows);
        }


    });

    /**
     *提供给Control
     * @type {*}
     */
    var GridData = Base_1.extend({
        width: 0,
        height: 0,

        constructor: function (w, h) {
            this.width = w;
            this.height = h;
        },
        compute: function (parArg) {
            var coord, w, h;
            w = this.width;
            h = this.height;

            var changeLine = false;

            var availableWidth = this.getAvailableWidth(parArg);   //求得本行可用宽度
            var availableHeight = this.getAvailableHeight(parArg);

            if (availableHeight <= 0) {
                w = 0;
                h = 0;
                return;
            }

            if (parArg.makeColumnsEqualWidth) {    //列等宽
                //计算最大宽度和最大高度
                if (this.spanCol > 0) {
                    w = ((parArg.pWidth - parArg.marginRight - parArg.marginLeft) / (1.0 * parArg.numColumns)) * this.spanCol;
                }

                //换行
                if (parArg.currentColumnNum == parArg.numColumns) {   //如果一行达到想要的数目则换行

                    changeLine = true;

                    parArg.marginLeftUsed = parArg.marginLeft;

                    if (parArg.marginTopUsed == parArg.marginTop) {
                        parArg.marginTopUsed += parArg.maxColumnHeight;
                    } else {
                        parArg.marginTopUsed = parArg.marginTopUsed + parArg.verticalSpacing
                            + parArg.maxColumnHeight;
                    }

                }
                availableWidth = this.getAvailableWidth(parArg);
                availableHeight = this.getAvailableHeight(parArg);

                coord = this.setXY(parArg);

                if (parArg.marginLeftUsed == parArg.marginLeft) {
                    if (this.spanCol > 0) {
                        parArg.marginLeftUsed += w;
                    } else {
                        parArg.marginLeftUsed += parArg.maxColumnWidth;
                    }
                } else {
                    if (this.spanCol > 0) {
                        parArg.marginLeftUsed = parArg.marginLeftUsed + parArg.horizontalSpacing + w;
                    } else {
                        parArg.marginLeftUsed = parArg.marginLeftUsed + parArg.horizontalSpacing + parArg.maxColumnWidth;
                    }
                }

                if (changeLine) {    //换行
                    parArg.currentColumnNum = 1;
                } else {
                    if (this.spanCol > 0) {
                        parArg.currentColumnNum += this.spanCol;
                    } else {
                        parArg.currentColumnNum++;
                    }
                }

            } else {

                if (parArg.currentColumnNum == parArg.numColumns) {  //本次换行
                    //设定换行标识
                    changeLine = true;

                    //换行后左已用宽度等于左边缘
                    parArg.marginLeftUsed = parArg.marginLeft;

                    //换行后上已用宽度等于上已用宽度加上最大高度
                    if (parArg.marginTopUsed == parArg.marginTop) {
                        parArg.marginTopUsed = parArg.marginTopUsed + parArg.maxColumnHeight;
                    } else {
                        parArg.marginTopUsed = parArg.marginTopUsed + parArg.maxColumnHeight + parArg.verticalSpacing;
                    }

                }
                //重新计算可用宽度和高度
                availableWidth = this.getAvailableWidth(parArg);
                availableHeight = this.getAvailableHeight(parArg);

                //计算坐标

                coord = this.setXY(parArg);

                if (parArg.marginLeftUsed == parArg.marginLeft) {
                    parArg.marginLeftUsed += w;
                } else {
                    parArg.marginLeftUsed = parArg.marginLeftUsed + parArg.horizontalSpacing + w;
                }

                if (changeLine) {    //换行
                    parArg.currentColumnNum = 1;
                } else {
                    parArg.currentColumnNum++;
                }

            }

            return [coord, w, h];
        },

        //==============
        getMaxColumnWH: function (parArg) {
            if (parArg.maxColumnWidth < this.width) {
                parArg.maxColumnWidth = this.width;
            }
            if (parArg.maxColumnHeight < this.height) {

                parArg.maxColumnHeight = this.height;
            }
        },

        getMaxColumnW: function (parArg) {
            if (parArg.maxColumnWidth < this.width) {
                parArg.maxColumnWidth = this.width;
            }
        },

        getMaxColumnH: function (parArg) {
            if (parArg.maxColumnHeight < this.height) {

                parArg.maxColumnHeight = this.height;
            }
        },

        getAvailableWidth: function (parArg) {
            return parArg.pWidth - parArg.marginRight
                - parArg.marginLeftUsed;   //求得本行可用宽度
        },

        getAvailableHeight: function (parArg) {
            return parArg.pHeight - parArg.marginBottom
                - parArg.marginTopUsed;
        },

        setXY: function (parArg) {
            var x, y;
            if (parArg.marginLeftUsed == parArg.marginLeft &&
                parArg.marginTopUsed == parArg.marginTop) {    //这是第一行第一个

                x = parArg.marginLeftUsed;
                y = parArg.marginTopUsed;

            } else if (parArg.marginLeftUsed == parArg.marginLeft) {           //这是第一列的
                x = parArg.marginLeftUsed;
                y = parArg.marginTopUsed + parArg.verticalSpacing;

            } else if (parArg.marginTopUsed == parArg.marginTop) {             //这是第一行的

                x = parArg.marginLeftUsed + parArg.horizontalSpacing;
                y = parArg.marginTopUsed;

            } else {

                x = parArg.marginLeftUsed + parArg.horizontalSpacing;
                y = parArg.marginTopUsed + parArg.verticalSpacing;

            }

            return [x, y];
        }
        //==============
    });


    var layout = {
        Layout,
        FillLayout,
        GridLayout,
        GridData,
    };

    function callLifeHook(control, hook) {
        let handler = control[hook];
        if (typeof handler === 'function') {
            try {
                handler.call(control);
            } catch (e) {
                anra.Platform.error(e);
            }
        }
    }

    /**
     *SVG操作API
     * @type {Object}
     */
    anra.svg = anra.svg || {};

    const painterQueue = {
        map: new Map(),
        push(context, fn) {
            this.map.set(context, fn);
            window.requestAnimationFrame(this.draw);
        },
        draw() {
            if (painterQueue.map.size) {
                let iter = painterQueue.map[Symbol.iterator]();
                let entry = iter.next();

                let context = entry.value[0];
                let fn = entry.value[1];
                fn.call(context);

                painterQueue.map.delete(context);

                if (!entry.done)
                    window.requestAnimationFrame(painterQueue.draw);
            }
        }

    }
    /**
     *控件基类，生命周期。
     * 构建，
     * @type {*}
     */
    anra.svg.Control = anra.Control.extend({
        svg: null,
        owner: null,
        layoutData: null,
        tagName: 'rect',
        parent: null,
        ready: false,
        class: 'Control',
        defaultEvent: { 'pointer-events': 'visible' },
        constructor() {
            this.base();
            callLifeHook(this, 'init');
        },
        defineProperties() {
            return this.base().extend({
                matrix: {
                    value: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }
                },
                scaleX: {
                    get() {
                        return this.matrix.a
                    },
                    set(val) {
                        if (val >= 0) {
                            this.matrix.a = val;
                            // this.applyMatrix()
                        }
                    }
                },
                scaleY: {
                    get() {
                        return this.matrix.d
                    },
                    set(val) {
                        if (val >= 0) {
                            this.matrix.d = val;
                            // this.applyMatrix()
                        }
                    }
                },
                translateX: {
                    get() {
                        return this.matrix.e
                    },
                    set(val) {
                        this.matrix.e = val;
                    }
                },
                translateY: {
                    get() {
                        return this.matrix.f
                    },
                    set(val) {
                        this.matrix.f = val;
                    }
                },
                attr: {
                    set(val) {
                        this.setAttribute(val);
                    }
                },
                bounds: {
                    get() {
                        return this.bds
                    },
                    set(value) {
                        this.setBounds(value);
                    }
                },
                bds: {
                    value: { 'x': 0, 'y': 0, 'width': 100, 'height': 100 }
                },
                enable: {
                    get() {
                        return this.getStyle('pointer-events') !== 'none'
                    },
                    set(val) {
                        val ? this.setStyle(this.defaultEvent) : this.setStyle('pointer-events', 'none');
                    }
                },
                visible: {
                    set(val) {
                        this.setStyle({
                            visibility: val ? 'visible' : 'hidden'
                        });
                    }
                }
            })
        },
        init() {
            this._style = { 'pointer-events': 'none' };
        },
        initProp() {
            this.setAttribute({});
            this.setStyle({});
        },
        afterRemoveListener: function () {
            if (this.eventTable.size() < 1)
                this.disableEvent();

        },
        setOpacity: function (opa, all) {
            this.setStyle('opacity', opa);
            if (all && this.children) {
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].setOpacity(opa, all);
                }
            }
        },
        afterAddListener: function () {
            if (this.eventTable.size() > 0)
                this.enableEvent();
        },
        disableEvent: function () {
            this.enable = false;
            return this
        },
        enableEvent: function () {
            this.enable = true;
            return this
        },
        applyBounds: function () {
            if (this.bounds == null)
                return;
            var l = this.locArea();
            this.setAttribute('x', this.bounds.x + l[0]);
            this.setAttribute('y', this.bounds.y + l[1]);
            this.setAttribute('width', this.bounds.width);
            this.setAttribute('height', this.bounds.height);
        },
        applyMatrix() {
            let matrixString = `matrix(${this.matrix.a} ${this.matrix.b} ${this.matrix.c} ${this.matrix.d} ${this.matrix.e} ${this.matrix.f})`;
            this.setAttribute('transform', matrixString);
        },
        setVisible(visible) {
            this.visible = visible;
            return this
        },
        /**
         * 绝对位置
         * @return {[x,y,width,height]}
         */
        getClientArea: function () {
            if (this.owner == null)
                return [0, 0, 0, 0];
            return [this.fattr('x'), this.fattr('y'), this.fattr('width'), this.fattr('height')];
        },
        getAttr: function (k, h) {
            if (this.owner == null) return this._attr ? this._attr[k] : null;
            if (h == null || typeof (h) != 'function')
                return this.owner.getAttribute(k);
            var a = this.owner.getAttribute(k);
            return a == null ? null : h(a);
        },
        fattr: function (k) {
            return this.getAttr(k, parseFloat);
        },
        getBounds: function () {
            return this.bounds;
        },
        removeAttribute: function (k) {
            this.owner.removeAttribute(k);
        },
        setAttribute: function (a, v) {
            if (this.owner == null) {
                if (this._attr == null)
                    this._attr = {};
                Util.apply(this._attr, a, v);
                return;
            }
            if (this._attr != null) {
                Util.applyAttr(this.owner, this._attr);
                this._attr = null;
            }
            Util.applyAttr(this.owner, a, v);
            return this;
        },
        getStyle: function (key) {
            if (this.owner == null && this._style != null)
                return this._style[key];
            else if (this.owner != null) {
                return this.owner.style[key];
            }
        },
        setStyle: function (a, v) {
            if (this.owner == null) {
                if (this._style == null)
                    this._style = {};
                Util.apply(this._style, a, v);
                return;
            }
            if (this._style != null) {
                Util.apply(this.owner.style, this._style);
                this._style = null;
            }
            Util.apply(this.owner.style, a, v);
            return this;
        },
        addClass(...classes) {
            if (this.owner != null) {
                for (let className of classes) {
                    this.owner.classList.add(className);
                }
            }
        },
        removeClass(...classes) {
            if (this.owner != null) {
                for (let className of classes) {
                    this.owner.classList.remove(className);
                }
            }
        },
        paint: function () {
            painterQueue.push(this, this.onPaint);
        },
        onPaint: function () {
            this.applyBounds()
        },
        dispose: function () {
            anra.Widget.prototype.dispose.call(this);
        },
        addToolTip(text) { //
            if (this.owner != null) {
                if (this.tooltip != null) {
                    this.tooltip.innerHTML = text;
                } else {
                    this.tooltip = Util.createElement(null, 'title');
                    this.tooltip.innerHTML = text;
                    this.owner.insertBefore(
                        this.tooltip, this.owner.childNodes[0]
                    );
                }
            }
        },
        removeToolTip() {
            if (this.tooltip != null) {
                if (this.tooltip.parentNode != null) {
                    this.tooltip.parentNode.removeChild(this.tooltip);
                }
            }
        }
    });
    var Control = anra.svg.Control;
    //初始化控件
    Control.prototype.create = function () {
        if (this.owner == null) {
            var o = this;
            this.owner = Util.createElement(this, this.tagName);
            this.uuid = Util.genUUID();
            var e = this.owner;
            //因为交由父层分发了，所以不需要再触发
            e.onmousedown = function (event) {
                anra.Platform.setMouseTarget(o);
            };

            e.oncontextmenu = function (event) {
                anra.Platform.setMouseTarget(o);
            };
            e.ondragstart = function (event) {
                return false;
            };
            e.onmouseup = function (event) {
                anra.Platform.setMouseTarget(o);
            };

            e.onmouseout = function (event) {
                event.figure = o;
                if (o.svg != null) {
                    o.svg.dispatcher.dispatchMouseOut(event);
                }
                return false;
            };

            e.onmouseover = function (event) {
                event.figure = o;
                if (o.svg != null) {
                    o.svg.dispatcher.dispatchMouseIn(event);
                }
            };

            e.ondblclick = function (event) {
                anra.Platform.setMouseTarget(o);
                var display = anra.Platform.getDisplay();
                if (display != null)
                    display.dispatcher.dispatchMouseDoubleClick(event);
            };
            this.ready = true;
        }
        this.paint();
    };
    //设置父容器
    Control.prototype.setParent = function (s) {
        if (s != null) {
            if (this.parent != null) {
                this.parent.removeChild(this.owner);
            }
            this.parent = s;
            this.svg = this.parent.svg;
            this.parent.domContainer().appendChild(this.owner);
            this.applyBounds();
            callLifeHook(this, 'createContent');
            this.paint();
        }
    };
    Control.prototype.setBounds = function (b) {
        if (typeof (b) == 'object') {
            for (var k in b) {
                this.bds[k] = b[k];
            }
        }
        if (this.ready)
            this.applyBounds();
    };
    Control.prototype.locArea = function () {
        var xo = 0, yo = 0;
        if (this.parent != null) {
            var loc = this.parent.getClientArea();
            xo = loc[0] == null ? 0 : loc[0];
            yo = loc[1] == null ? 0 : loc[1];
        }
        return [xo, yo];
    };


    /**
     *容器类
     * @type {*}
     */

    var _Composite = {
        children: null,
        layoutManager: null,
        selection: null,
        setSelection: function (o) {
            if (this.selection != null)
                this.selection.setSelected(false);
            this.selection = o;
            this.selection.setSelected(true);
        },
        removeChild: function (c) {
            if (c instanceof anra.svg.Control) {
                callLifeHook(c, 'dispose');
                if (this.children != null)
                    Util.removeObject(this.children, c);

                //this cause bugs, should fix
                if (this.domContainer().contains(c.owner)) this.domContainer().removeChild(c.owner);
                c.parent = null;
            } else {
                anra.Platform.error('can not remove ' + (c == null ? null : c.toString()) + ' from Composite');
            }
        },
        addChild: function (c, norefresh) {
            if (this.children == null) {
                this.children = [];
            }
            if (c instanceof anra.svg.Control) {
                if (!Util.contains(this.children, c)) {
                    this.children.push(c);
                    callLifeHook(c, 'create');
                    callLifeHook(c, 'initProp');
                    c.setParent(this);
                    c.oncreated && c.oncreated();
                    if (!norefresh)
                        this.paint();
                }
            } else {
                anra.Platform.error('can not add [' + c + '] to ' + this.tagName);
            }
        },
        /**
         * DOM容器
         * @return {*}
         */
        domContainer: function () {
            return this.parent == null ? this.owner : this.parent.domContainer();
        },
        onPaint: function () {
            this.applyBounds();
            if (this.layoutManager != null)
                this.layout();

            if (this.children)
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].paint();
                }
        },
        layout: function () {
            this.layoutManager.layout(this);
        },
        removeAllChildren: function () {
            if (this.children != null) {
                var c = this.children.slice(0);
                for (var i = 0; i < c.length; i++) {
                    this.removeChild(c[i]);
                }
            }
        },
        dispose: function () {
            this.removeAllChildren();
            this.children = null;
            this.layoutManager = null;
            Control.prototype.dispose.call(this);
        }
    };
    anra.svg.Composite = Control.extend(_Composite);
    var Composite = anra.svg.Composite;

    /**
     * 组
     * @type {*|void}
     */
    anra.svg.Group = Composite.extend({
        animations: null,
        tagName: 'g',
        domContainer: function () {
            return this.owner;
        },
        init: Util.noop,
        applyBounds: Util.noop,
        on: Util.noop,
        create: function () {
            //重写create方法，使Group不再接收任何事件
            if (this.owner == null) {
                this.owner = Util.createElement(this, this.tagName);
                this.ready = true;
            }
        }
    });

    anra.svg.Symbol = Composite.extend({
        config: null,
        tagName: 'symbol',
        constructor(config = {}) {
            if (config.id == null) {
                throw anra.Platform.error(`missing required config prop: "id"`)
            }
            this.config = config;
            this.base();
        },
        // 空操作覆盖原操作
        init: Util.noop,
        applyBounds: Util.noop,
        domContainer() {
            return this.owner
        },
        create: function () {
            if (this.owner == null) {
                this.owner = Util.createElement(this, this.tagName);
                this.setAttribute({
                    'id': this.config.id,
                    'preserveAspectRatio': 'none'
                });
                this.ready = true;
            }
        },
        initProp() {
            const config = this.config;
            if (Reflect.has(config, 'useHTMLString')) {
                const string = Reflect.get(config, 'useHTMLString');
                if (typeof string === 'string') {
                    this.owner.innerHTML = string;
                } else {
                    // TODO
                    throw ''
                }
            }
            if (this.config.style)
                this.setStyle(this.config.style);
            if (this.config.attr)
                this.setAttribute(this.config.attr);
        }
    });

    anra.svg.Use = {
        tagName: 'use',
        href: null,
        setHerf(id) {
            this.href = id;
            if (this.href != null && this.owner != null) {
                this.owner.setAttributeNS(
                    'http://www.w3.org/1999/xlink',
                    'xlink:href',
                    `#${this.href}`);
            }
        },
        applyConfig(config) {
            this.setHerf(config.type);
        },
        initProp() {
            this.base();
            this.setHerf(this.href);
        }
    };

    anra.svg.DefineArea = Composite.extend({
        tagName: 'defs',
        initProp: Util.noop,
        domContainer: function () {
            return this.owner;
        },
        setAttribute: Util.noop,
        setStyle: Util.noop,
        getChild(id) {
            let child = null;
            if (this.children != null) {
                for (let c of this.children) {
                    if (c.getAttr('id') === id) {
                        child = c;
                        break
                    }
                }
            }

            return child
        }
    });

    anra.svg.Marker = Composite.extend({
        id: null,
        figure: null,
        tagName: 'marker',
        size: 3,
        constructor: function (config) {
            Composite.prototype.constructor.call(this);
            this.setId(Util.genUUID());
            // this.config = config;
            if (config)
                this.size = config.size;
        },
        setId: function (id) {
            this.id = id;
            this.setAttribute('id', id);
        },
        setFigureAttribute: function (attr) {
            this.figureAttr = attr;
            if (this.figure != null)
                this.figure.setAttribute(attr);
        },
        domContainer: function () {
            return this.owner;
        },
        setFigure: function (figure) {
            if (this.figure != null)
                this.removeChild(this.figure);
            this.figure = figure;
            this.addChild(this.figure);
            if (this.figureAttr != null)
                this.figure.setAttribute(this.figureAttr);
        },
        refresh: function (e) {
            if (e) {
                var stroke = e.style.stroke ? e.style.stroke : e.getAttr('stroke');
                this.setStyle({
                    fill: stroke,
                    stroke: stroke
                });
            }
        },
        propertyChanged: function (k, o, v) {
            if (this.propKey != null && this.propKey == k) {
                this.setFigureAttribute({ 'stroke': v });
                this.setFigureAttribute({ 'fill': v });
            }
        },
        initProp: function () {
            this.setAttribute({
                refX: "1",
                refY: "5",
                markerWidth: this.size ? this.size : 5,
                markerHeight: this.size ? this.size : 5,
                orient: "auto",
                viewBox: "-5 0 15 15"
            });
        }
    });


    anra.svg.PointMarker = anra.svg.Marker.extend({
        createContent: function () {
            var p = new anra.svg.Path();
            this.setFigure(p);
            p.setAttribute({
                d: 'M -4 0 C 5 5 L -4 10 z'
            });
        }
    });

    anra.svg.TriangleMarker = anra.svg.Marker.extend({
        createContent: function () {
            var p = new anra.svg.Path();
            this.setFigure(p);
            p.setAttribute({
                d: 'M -4 0 L 5 5 L -4 10 z'
            });
        }
    });

    anra.svg.Path = anra.svg.Control.extend({
        tagName: 'path',
        init: Util.noop,
        afterRemoveListener: function () {
        },
        afterAddListener: function () {
        },
        initProp: Util.noop
    });

    anra.svg.Line = {
        tagName: 'line',
        initProp: function () {
            this.setAttribute({
                stroke: 'black',
                'stroke-width': 1
            });
        },
        getClientArea: function () {
            return [this.fattr('x1') - this.fattr('x2'), this.fattr('y1') - this.fattr('y2')];
        },
        applyBounds: function () {
            this.setAttribute('x1', this.bounds.x);
            this.setAttribute('x2', this.bounds.width);
            this.setAttribute('y1', this.bounds.y);
            this.setAttribute('y2', this.bounds.height);
        }
    };

    anra.svg.LineStrategy = {
        Straight: function (points, l) {
            var result = '';
            for (var i = 0; i < points.length; i++) {
                result += (i == 0 ? 'M' : 'L') + (points[i].x + l[0]) + ',' + (points[i].y + l[1]) + ' ';
            }
            return result;
        },
        Curve: function (points, l) {
            var result = '';
            for (var i = 0; i < points.length; i++) {
                result += (i == 0 ? 'M' : points.length - i - 1 < (points.length - 1) % 3 ? 'L' : i % 3 == 1 ? 'C' : '') + (points[i].x + l[0]) + ',' + (points[i].y + l[1]) + ' ';
            }
            return result;
        },
        x: function (points, l) {
            if (points.length > 2) {
                var p = [], j = 0, slope1, slope2, offx1, offx2;
                p.push(points[0]);
                while (j < points.length - 2) {
                    offx1 = points[j].x - points[j + 1].x;
                    offx2 = points[j].x - points[j + 2].x;

                    if (Math.abs(offx1) + Math.abs(offx2) != 0) {
                        slope1 = (points[j].y - points[j + 1].y) / (offx1);
                        slope2 = (points[j].y - points[j + 2].y) / (offx2);

                        if (slope1 != slope2) {
                            p.push(points[j + 1]);
                        }
                    }
                    j++;
                }
                p.push(Util.last(points));
                return this.Curve(p, l);
            }
        },
        CornerCurve: function (points, l) {
            var result = 'M' + (points[0].x + l[0]) + ',' + (points[0].y + l[1]) + ' ',
                abs = Math.abs,
                min = Math.min,
                max = Math.max,
                x, y, preX, preY, nextX, nextY, gap;

            if (points.length == 2) {
                return result += 'L' + (points[1].x + l[0]) + ',' + (points[1].y + l[1]);
            }

            nextX = points[1].x - points[0].x;
            nextY = points[1].y - points[0].y;

            for (var i = 1; i < points.length; i++) {
                x = points[i].x + l[0];
                y = points[i].y + l[1];

                if (i + 1 < points.length) {
                    //与前驱点的XY差值
                    preX = -nextX;
                    preY = -nextY;

                    //与后驱点的XY差值
                    nextX = (points[i + 1].x + l[0]) - x;
                    nextY = (points[i + 1].y + l[1]) - y;

                    //
                    gap = min(8, min(abs(preX + preY), abs(nextX + nextY)) / 2);
                    result += 'L' + (x + (preX / max(abs(preX), 1)) * gap) + ',' + (y + (preY / max(abs(preY), 1)) * gap) + ' Q' + x + ',' + y + ' ' +
                        (x + (nextX / max(abs(nextX), 1)) * gap) + ',' + (y + (nextY / max(abs(nextY), 1)) * gap) + ' ';
                } else {
                    result += 'L' + x + ',' + y;
                }
            }
            return result;
        },
        //支持所有方向
        CornerCurveProfessional: null,
    };


    anra.svg.Polyline = {


        close: false,
        tagName: 'path',
        defaultEvent: { 'pointer-events': 'stroke' },
        strategy: anra.svg.LineStrategy.Straight,
        applyBounds: function () {
            var d = this.compute();
            if (d != null)
                this.setAttribute('d', d);
        },
        initProp: function () {
            this.setAttribute({
                fill: 'none'
            });
        },
        compute: function () {
            if (this.points == null || this.points.length < 2)
                return null;
            return this.strategy(this.points, this.locArea());
        },
        getStartPoint: function () {
            return this.points == null || this.points.length == 0 ? null : this.points[0];
        },
        getEndPoint: function () {
            return this.points == null || this.points.length == 0 ? null : this.points[this.points.length - 1];
        }
    };


    /**
     * 动画
     * @type {*|void}
     */
    anra.svg.Animation = Control.extend({
        tagName: 'animateTransform'
    });

    anra.SVG = Composite.extend(anra._Display).extend(anra._EventTable).extend({
        dispatcher: null,
        defs: null,
        constructor: function (id) {
            this.element = document.getElementById(id);
            if (this.element != null) {
                callLifeHook(this, 'create');
                callLifeHook(this, 'initProp');
                this.element.appendChild(this.owner);
            } else {
                this.error("SVG parent can not be null");
            }
        },
        create: function () {
            const acceptEventDom = Util.createElement(this, 'svg');
            const dispatcher = new anra.svg.EventDispatcher(this);

            Util.addListener(acceptEventDom, 'contextmenu.svg', e => {
                dispatcher.setMouseTarget(this);
                dispatcher.dispatchContextMenu(e);
            });

            Util.addListener(acceptEventDom, 'mousedown.svg', e => {
                if (acceptEventDom === e.target) this.dispatcher.setMouseTarget(this);
                dispatcher.dispatchMouseDown(e);
            });

            Util.addListener(acceptEventDom, 'dragstart.svg', e => { });

            Util.addListener(acceptEventDom, 'click.svg', e => dispatcher.dispatchMouseClick(e), { stop: false, default: false });

            Util.addListener(acceptEventDom, 'mousemove.svg', e => dispatcher.dispatchMouseMove(e));

            Util.addListener(acceptEventDom, 'mouseover.svg', e => {
                if (acceptEventDom == e.target || acceptEventDom.parentNode == e.target) {
                    e.figure = this;
                    dispatcher.dispatchMouseIn(e);
                }
            });

            Util.addListener(acceptEventDom, 'mouseout.svg', e => { });

            Util.addListener(acceptEventDom, 'mouseup.svg', e => {
                if (this.owner == e.target) this.dispatcher.setMouseTarget(this);
                this.dispatcher.dispatchMouseUp(e);
            });

            this.owner = acceptEventDom;
            this.dispatcher = dispatcher;
            this.svg = this;
            /*this.setStyle({
                position: 'absolute',
                top: 0,
                left: 0,
              'width': '150%',
              'height': '150%'
            });*/
            this.addClass('canvas-default');
            this.setAttribute({
                'version': '1.1'
            });
            this.defs = new anra.svg.DefineArea();
            this.addChild(this.defs);
            anra.Platform.regist(acceptEventDom, this);
        },
        dispose() {
            anra.Platform.unregist(this.owner, this);
            Util.removeListener(this.owner, '*.svg');
            this.base();
        }
    });

    anra.svg.Rect = {};
    anra.svg.Circle = {
        tagName: 'circle',
        getClientArea: function () {
            return [this.fattr('cx'), this.fattr('cy'), this.fattr['r'] * 2, this.fattr['r'] * 2];
        },
        applyBounds: function () {
            var l = this.locArea();
            var r = this.bounds.width / 2;
            this.setAttribute({
                r: r,
                cx: this.bounds.x + l[0],
                'cy': this.bounds.y + l[1]
            });
        },
        calAnchor: function (dir, offset) {
            if (offset == null) offset = 0;
            var b = this.bounds;
            switch (dir) {
                case anra.EAST:
                    return { x: b['x'] + b['width'] / 2, y: b['y'] };
                case anra.SOUTH:
                    return { x: b['x'], y: b['y'] + b['width'] / 2 };
                case anra.WEST:
                    return { x: b['x'] - b['width'] / 2, y: b['y'] };
                case anra.NORTH:
                    return { x: b['x'], y: b['y'] - b['width'] / 2 };
                case anra.CENTER:
                    return { x: b['x'], y: b['y'] };
            }
            return null;
        }
    };
    anra.svg.Image = {
        tagName: 'image',
        url: null,
        applyConfig: function (config) {
            this.setUrl(config.url);
        },
        setUrl: function (url) {
            this.url = url;
            if (this.owner != null) {
                this.owner.setAttributeNS(
                    'http://www.w3.org/1999/xlink',
                    'xlink:href',
                    url);
            }
        },
        initProp: function () {
            this.owner.setAttributeNS(
                'http://www.w3.org/1999/xlink',
                'xlink:href',
                this.url);
            this.owner.setAttribute('preserveAspectRatio', 'none');
        }
    };
    /**
     * 文本
     * @type {*|void}
     */
    anra.svg.Text = {
        tagName: 'text',
        text: null,
        setText(text) {
            this.text = text;
            if (this.owner) this.owner.textContent = text;
        },

        initProp() {
            this.setAttribute({});
            this.setStyle({
                'font-size': 12,
                '-webkit-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none'
            });
            this.setText(this.text);
        },
        create: function () {
            //此处没有注册事件分发，因为文本的事件会和anra的事件冲突
            if (this.owner) return;

            this.owner = Util.createElement(this, this.tagName);
            Util.addListener(this.owner, 'mouseup', () => anra.Platform.setMouseTarget(this));
        },
        dispose() {
            Util.removeListener(this.owner, 'mouseup');
            this.base();
        }
    };

    anra.svg.Ellipse = {
        tagName: 'ellipse',
        getClientArea: function () {
            return [this.fattr('cx') - this.fattr('rx'), this.fattr('cy') - this.fattr('ry')];
        },
        applyBounds: function () {
            var l = this.locArea();
            this.setAttribute('rx', this.bounds.width / 2);
            this.setAttribute('ry', this.bounds.height / 2);
            this.setAttribute('cx', this.bounds.x + this.fattr('rx') + l[0]);
            this.setAttribute('cy', this.bounds.y + this.fattr('ry') + l[1]);
        }
    };

    /**
     * 允许包含外来的XML命名空间，其图形内容是别的用户代理绘制的。这个被包含的外来图形内容服从SVG变形和合成
     * @type {*}
     */
    anra.svg.ForeignObject = {
        tagName: 'foreignObject',
        innerHTML: null,
        setinnerHTML(html) {
            this.innerHTML = html;
            if (this.owner) this.owner.innerHTML = html;
        },
        initProp() {
            this.owner.innerHTML = this.innerHTML;
        },
        create() {
            if (this.owner) return;

            this.owner = Util.createElement(this, this.tagName);
            Util.addListener(this.owner, 'mousedown', e => {
                anra.Platform.setMouseTarget(this);
            });
        },
        dispose() {
            Util.removeListener(this.owner, 'mousedown');
            this.base();
        }
    };


    /**
     * 布局
     * @type {*}
     */
    anra.svg.Layout = layout.Layout;
    anra.svg.FillLayout = layout.FillLayout;
    anra.svg.GridLayout = layout.GridLayout;
    anra.svg.GridData = layout.GridData;

    /**
     * 事件分发器
     * @type {*}
     */
    const _dispatcher = {
        lastLocation: [NaN, NaN],
        scale: [1, 1],
        setMouseTarget(o) {
            if (this.focusTarget != null) {
                this.focusTarget.enableEvent();
            }
            this.focusTarget = o;
        },
        getRelativeLocation(event) {
            let location = this.display.getRelativeLocation(event);

            location[0] = Math.round(10 * location[0] / this.scale[0]) / 10;
            location[1] = Math.round(10 * location[1] / this.scale[1]) / 10;
            return location
        },
        _mousedown(event) {
            this.mouseState = anra.EVENT.MouseDown;
            var location = this.getRelativeLocation(event),
                e = new anra.event.Event(anra.EVENT.MouseDown, location);
            e.button = event.button;
            e.prop = { drag: this.dragTarget, target: this.focusTarget };
            var widget = this.focusTarget;
            widget.notifyListeners(anra.EVENT.MouseDown, e);
        },
        _mouseup(event) {
            var isdrag = this.mouseState == anra.EVENT.MouseDrag;
            var notified = isdrag && this.dragTarget instanceof anra.svg.Control;

            if (isdrag) this._dragend(event);

            this.mouseState = anra.EVENT.MouseUp;

            if (notified) return;

            var e = new anra.event.Event(anra.EVENT.MouseUp, this.getRelativeLocation(event));
            var weight = this.mouseOnTarget ? this.mouseOnTarget : this.focusTarget;

            e.button = event.button;
            weight.notifyListeners(anra.EVENT.MouseUp, e);
        },
        _mouseover(event) { },
        _mousein(event) {
            var location = this.getRelativeLocation(event);
            var e = new anra.event.Event(anra.EVENT.MouseIn, location);

            e.button = event.button;
            this.mouseOnTarget = this.dragTarget != event.figure ? event.figure : this.mouseOnTarget;
            event.figure.notifyListeners(anra.EVENT.MouseIn, e);
        },
        _mouseout(event) {
            var loc = this.getRelativeLocation(event),
                relatedTarget = event.toElement,
                //relatedTarget = event.relatedTarget,
                contains = anra.Rectangle.contains,
                eb = event.figure.bounds,
                b;

            try {
                if (relatedTarget) {
                    switch (relatedTarget.nodeName) {
                        case 'svg':
                            break;
                        case 'DIV':
                            break;
                        case 'image':
                        case 'rect':
                            b = {
                                x: parseFloat(relatedTarget.getAttribute('x')),
                                y: parseFloat(relatedTarget.getAttribute('y')),
                                width: parseFloat(relatedTarget.getAttribute('width')),
                                height: parseFloat(relatedTarget.getAttribute('height'))
                            };

                            if (contains(eb, b.x, b.y) && (b.x + b.width) < (eb.x + eb.width) && (b.y + b.height) < (eb.y + eb.height) &&
                                contains(eb, loc[0], loc[1])) {
                                return;
                            }
                            break;
                        case 'ellipse':
                            b.rx = parseFloat(relatedTarget.getAttribute('rx'));
                            b.ry = parseFloat(relatedTarget.getAttribute('ry'));
                        case 'circle':
                            if (b == null) {
                                b = { rx: null, ry: null, cx: null, cy: null };
                                b.rx = b.ry = relatedTarget['r'].value;
                            }

                            b.cx = parseFloat(relatedTarget.getAttribute('cx'));
                            b.cy = parseFloat(relatedTarget.getAttribute('cy'));

                            if (!contains(eb, b.cx, b.cy) || (b.cx - b.rx) < eb.x || (b.cx + b.rx) > (eb.x + eb.width) ||
                                (b.cy - b.ry) < eb.y || (b.cy + b.ry) > (eb.y + eb.height)) {
                                break;
                            }
                        case 'marker':
                        case 'line':
                        case 'path':
                            if (contains(eb, loc[0], loc[1])) {
                                return;
                            }

                            break;
                        case 'text':
                        default:
                    }
                }
            } catch (e) {
                console.warn(relatedTarget);
            }

            var e = new anra.event.Event(anra.EVENT.MouseOut, loc);
            event.figure.notifyListeners(anra.EVENT.MouseOut, e);
        },
        _click(event) {
            this.mouseState = anra.EVENT.MouseUp;
            var location = this.getRelativeLocation(event),
                e = new anra.event.Event(anra.EVENT.MouseDown, location);

            e.prop = { drag: this.dragTarget, target: this.focusTarget };
            var widget = this.focusTarget;
            widget.notifyListeners(anra.EVENT.MouseClick, e);
        },
        _dblclick(event) {
            var location = this.getRelativeLocation(event);
            var e = new anra.event.Event(anra.EVENT.MouseDoubleClick, location);
            this.focusTarget.notifyListeners(anra.EVENT.MouseDoubleClick, e);
        },
        _drag(event) {
            let e, location = this.getRelativeLocation(event); if (this.dragTarget && (this.mouseState == anra.EVENT.MouseDrag)) {
                e = new anra.event.Event(anra.EVENT.MouseDrag, location, {
                    drag: this.dragTarget,
                    target: this.mouseOnTarget,
                    nativeEvent: event
                });

                // e.prop = {drag: this.dragTarget, target: this.mouseOnTarget};
                this.dragTarget.notifyListeners && this.dragTarget.notifyListeners(anra.EVENT.MouseDrag, e);
                if (this.dragTarget != this.mouseOnTarget && this.mouseOnTarget.notifyListeners)
                    this.mouseOnTarget.notifyListeners(anra.EVENT.MouseDrag, e);
            }
        },
        _mousemove(event) {
            //这玩意儿错误超多，后面考虑个完善方式，主要是拖拽物和鼠标所在容器的矛盾
            if (this.mouseOnTarget == null) this.mouseOnTarget = this.focusTarget;

            // 相同位置触发事件，导致鼠标状态变为MouseDrag
            var location = this.getRelativeLocation(event);
            if (location[0] === this.lastLocation[0] && location[1] === this.lastLocation[1]) {
                return
            }
            // 避免
            this.lastLocation = location;

            //模拟拖拽
            if ((this.mouseState == anra.EVENT.MouseDown) || (this.mouseState == anra.EVENT.MouseDrag)) {

                this.mouseState = anra.EVENT.MouseDrag;

                this._dragstart(event);

                if (this.dragTarget.enable) this.dragTarget.disableEvent();

                this._drag(event);
            } else {
                this.mouseState = anra.EVENT.MouseMove;
                var e = new anra.event.Event(anra.EVENT.MouseMove, location);

                this.mouseOnTarget.notifyListeners(anra.EVENT.MouseMove, e);
            }
        },
        _keydown(event) {
            var e = new anra.event.KeyEvent(anra.EVENT.KeyDown, this.getRelativeLocation(event), event);
            //TODO 此处需要优化，考虑到底是目标还是画布来触发事件
            //        var f = this.focusTarget == null ? this.display : this.focusTarget;
            var f = this.display;
            f.notifyListeners(e.type, e);
        },
        _keyup(event) {
            var e = new anra.event.KeyEvent(anra.EVENT.KeyUp, this.getRelativeLocation(event), event);
            //        var f = this.focusTarget == null ? this.display : this.focusTarget;
            var f = this.display;
            f.notifyListeners(e.type, event);
        },
        _touchstart(event) {
            var location = this.getRelativeLocation(event.touches[0]);
            var e = new anra.event.TouchEvent(anra.EVENT.TouchStart, location, event);
            this.focusTarget.notifyListeners(anra.EVENT.TouchStart, e);
        },
        _touchmove(event) {
            var location = this.getRelativeLocation(event.touches[0]);
            if (location[0] == null)
                return;
            var e = new anra.event.TouchEvent(anra.EVENT.TouchMove, location, event);
            this.focusTarget.notifyListeners(anra.EVENT.TouchMove, e);
        },
        _touchend(event) {
            var location = this.getRelativeLocation(event.touches[0]);
            if (location[0] == null)
                return;
            var e = new anra.event.TouchEvent(anra.EVENT.TouchEnd, location, event);
            this.focusTarget.notifyListeners(anra.EVENT.TouchEnd, e);
        },
        _dragstart(event) {
            let e, location = this.getRelativeLocation(event);
            if (this.dragTarget == null) {
                this.dragTarget = this.focusTarget;
                e = new anra.event.Event(anra.EVENT.DragStart, location, {
                    drag: this.dragTarget,
                    target: this.mouseOnTarget,
                    nativeEvent: event
                });

                // e.prop = {drag: this.dragTarget, target: this.mouseOnTarget};
                this.dragTarget.notifyListeners(anra.EVENT.DragStart, e);
                if (this.dragTarget != this.mouseOnTarget && this.mouseOnTarget.notifyListeners) {
                    this.mouseOnTarget.notifyListeners(anra.EVENT.DragStart, e);
                }
            }
        },
        _dragend(event) {
            var e = new anra.event.Event(anra.EVENT.DragEnd, this.getRelativeLocation(event));
            e.prop = { drag: this.dragTarget, target: this.mouseOnTarget };
            e.button = event.button;

            this._dropped(event);
            this.mouseOnTarget.notifyListeners(anra.EVENT.DragEnd, e);
            this.dragTarget = null;
        },
        _dropped(event) {
            if (this.dragTarget instanceof anra.svg.Control) {
                var e = new anra.event.Event(anra.EVENT.DragEnd, this.getRelativeLocation(event));
                e.prop = { drag: this.dragTarget, target: this.mouseOnTarget };
                e.button = event.button;

                this.dragTarget.notifyListeners(anra.EVENT.Dropped, e);
                this.dragTarget.enableEvent();
            }
            this.dragTarget = null;
        },
        _contextmenu(event) {
            var e = new anra.event.Event();
            var location = this.getRelativeLocation(event);
            e.x = location[0];
            e.y = location[1];
            e.clientX = event.clientX;
            e.clientY = event.clientY;
            e.target = this.mouseOnTarget;
            this.focusTarget.notifyListeners(anra.EVENT.ContextMenu, e);
        },
    };

    anra.svg.EventDispatcher = Base_1.extend({
        display: null,
        focusTarget: null,
        mouseState: 0,
        canDispatcher: true,
        constructor: function (display) {
            this.display = display;
            for (let [key, name] of Object.entries(anra.EVENT)) {
                if (key === 'NONE') continue;
                this[`dispatch${key}`] = (...res) => this._dispatch(name, res);
            }
        },
        _dispatch(type, args) {
            if (this.canDispatcher && this[`_${type}`]) Reflect.apply(this[`_${type}`], this, args);
        },
    }).extend(_dispatcher);

    anra.svg.MenuItem = Composite.extend({
        constructor: function (action) {
            Composite.prototype.constructor.call(this);
            this.action = action;
        },
        createContent: function () {
            if (this.action.image != null) {
                var image = anra.svg.Control.extend(anra.svg.Image);
                image = new image();
                image.setUrl(this.action.image);
                this.addChild(image);
                image.setBounds({ x: 5, y: 5, width: 20, height: 20 });
            }

            var text = anra.svg.Control.extend(anra.svg.Text);
            text = new text();
            text.setText(this.action.name);
            this.addChild(text);
            text.setBounds({ x: 30, y: 20 });

            var item = this;
            this.on(anra.EVENT.MouseIn, function () {
                item.setAttribute({
                    fill: 'green'
                });
            });
            this.on(anra.EVENT.MouseOut, function () {
                item.setAttribute({
                    fill: 'none'
                });
            });
            this.on(anra.EVENT.MouseDown, function (e) {
                if (e.button != 0) return;
                item.action.run();
                item.menu.hide();
            });
        },
        initProp: function () {
            this.setAttribute({
                fill: 'none',
                stroke: 'none'
            });
        }
    });

    anra.svg.DefMenu = Composite.extend({
        constructor: function (host) {
            Composite.prototype.constructor.call(this);
            this.host = host;
        },
        domContainer: function (action) {
            return this.owner.parentNode;
        },
        createContent: function () {
            this.layoutManager = new anra.svg.FillLayout();
        },
        initProp: function () {
            this.setAttribute({
                fill: 'white',
                stroke: 'black'
            });
            this.setStyle('visibility', 'hidden')
        },
        addMenuItem: function (action) {
            var item = new anra.svg.MenuItem(action);
            item.menu = this;
            this.addChild(item);
        },
        clearMenuItems: function () {
            this.removeAllChildren();
        },
        hide: function () {
            this.clearMenuItems();
            this.setStyle('visibility', 'hidden');
        },
        setOpacity: function (opa) {
            this.parent.setOpacity(opa);
        },
        show: function (editor, e) {
            var selection = editor.rootEditPart.selection;
            var cmdStack = editor.cmdStack;
            if (this.selection == selection) {
                return;
            }
            this.clearMenuItems();

            var count = this.addActions(this.host.actionRegistry.selectionActions, selection);
            count += this.addActions(this.host.actionRegistry.cmdStackActions, cmdStack);
            count += this.addActions(this.host.actionRegistry.propertyActions, editor);

            if (count === 0)
                return;

            this.setBounds({ x: e.x, y: e.y });
            this.setStyle('visibility', 'visible');
            this.setBounds({ width: 100, height: 30 * count });
            this.paint();
            this.play(0, 0.05);
        },
        play: function (s, intval) {
            this.setOpacity(s, true);
            if (s >= 1) return;
            var p = this;
            requestAnimationFrame(function () {
                p.play(s + intval, intval);
            });
        },
        addActions: function (actions, _t) {
            var count = 0;
            if (actions != null) {
                actions = [...actions.values()];
                for (var i = 0; i < actions.length; i++) {
                    actions[i].stack = _t;
                    actions[i].selection = _t;
                    actions[i].editor = _t;
                    if (actions[i].name != null && (actions[i].check == null || actions[i].check())) {
                        actions[i].enable = true;
                        count++;
                        this.addMenuItem(actions[i]);
                    } else
                        actions[i].enable = false;
                }
            }
            return count;
        }
    });

    anra.gef = {};

    /**
     * 视图
     * @type {*}
     */
    anra.gef.Figure = anra.svg.Composite.extend({
        class: 'Figure',
        isSelected: SELECTED_NONE,
        init: function () {
        },
        cal: function (id) {
            if (this.anchorMap == null) return null;
            var a = this.anchorMap.get(id);
            if (a != null) {
                a = this.calAnchor(a);
                a.id = id;
                return a;
            }
            return null;
        },
        registAnchor: function (anchor) {
            if (this.anchorMap == null)
                this.anchorMap = new Map();
            this.anchorMap.set(anchor.id, anchor);
            return this;
        },
        unregistAnchor: function (anchorId) {
            if (this.anchorMap.has(anchorId)) {
                this.anchorMap.delete(anchorId);
            }
        },
        registAnchors: function (anchors) {
            if (anchors instanceof Array) {
                for (var i = 0; i < anchors.length; i++) {
                    this.registAnchor(anchors[i]);
                }
            }
        },
        getSourceAnchorByTerminal: function (id) {
            return this.cal(id);
        },
        getTargetAnchorByTerminal: function (id) {
            return this.cal(id);
        },
        getAnchors(filter) {
            if (this.anchorMap == null) return []

            let isFilter = typeof filter === 'function';
            return [...this.anchorMap.values()].reduce((list, item) => {
                let anchor = { ...item, ...this.cal(item.id) };

                isFilter ? (filter(anchor) && list.push(anchor)) : list.push(anchor);
                return list
            }, [])
        },
        getSourceAnchor: function (req, filter) {
            //TODO 现在每次都计算anchor，考虑优化为figure bounds改变后再计算
            var x = req.event.x;
            var y = req.event.y;
            return this.findClosestAnchor(x, y, filter);
        },
        getTargetAnchor: function (req, filter) {
            var x = req.event.x;
            var y = req.event.y;
            return this.findClosestAnchor(x, y, filter);
        },
        findClosestAnchor: function (x, y, filter) {
            var anchors = this.getAnchors(filter);
            var closest, min, b;
            for (var i = 0; i < anchors.length; i++) {
                b = Math.abs(anchors[i].x - x) + Math.abs(anchors[i].y - y);
                if (closest == null || min > b) {
                    closest = anchors[i];
                    min = b;
                }
            }
            return closest;
        },
        calAnchor: function ({ dir, offset = 0, distance = 0 }) {
            var b = this.bounds;
            switch (dir) {
                case anra.EAST:
                    return { x: b['x'] + b['width'] + distance, y: b['y'] + b['height'] / 2 + offset };
                case anra.SOUTH:
                    return { x: b['x'] + b['width'] / 2 + offset, y: b['y'] + b['height'] + distance };
                case anra.WEST:
                    return { x: b['x'] - distance, y: b['y'] + b['height'] / 2 + offset };
                case anra.NORTH:
                    return { x: b['x'] + b['width'] / 2 + offset, y: b['y'] - distance };
                case anra.CENTER:
                    return { x: b['x'] + b['width'] / 2, y: b['y'] + b['height'] / 2 };
            }
        },
        propertyChanged: function (key, ov, nv) {
        },
        selectionChanged: function (value) {
            switch (value) {
                case SELECTED_NONE:
                    this.owner.style.cursor = 'default';
                    break;
                case SELECTED_PRIMARY:
                case SELECTED:
                    this.owner.style.cursor = 'move';
            }

        },
        setModel: function (m) {
            this.unlisten();
            this.model = m;
            this.listen();
        },
        listen: function () {
            if (this.model instanceof anra.gef.BaseModel) {
                this.model.addPropertyListener(this);
            }
        },
        unlisten: function () {
            if (this.model instanceof anra.gef.BaseModel) {
                this.model.removePropertyListener(this);
            }
        },
        onPaint: function () {
            this.applyBounds();
            /*if (this.layoutManager != null)
             this.layout();*/
            this.fireRepaintListener();
            if (this.children)
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].paint();
                }

            if (this.layoutManager != null)
                this.layout();
        },
        //   paint: function () {
        //     // window.fpainter=window.fpainter||1;
        //     // window.fpainter++;
        //   },
        setVisible(visible) {
            anra.svg.Composite.prototype.setVisible.call(this, visible);
            this.fireVisibleListener(visible);
        },
        fireVisibleListener(visible) {
            this.fire('visible', visible);
        },
        addVisibleListener(listener) {
            this.on('visible', listener);
        },
        removeVisibleListener(listener) {
            this.off('visible', listener);
        },
        fireRepaintListener: function () {
            this.fire('repaint', this);
        },
        addRepaintListener: function (listener) {
            this.on('repaint', listener);
        },
        removeRepaintListener: function (listener) {
            this.off('repaint', listener);
        },
        dispose: function () {
            anra.svg.Composite.prototype.dispose.call(this);
            this.unlisten();
        }
    });
    anra.gef.Figure.init = function (config) {
        if (config.type == null)
            throw 'figure config need a type like anra.svg.Circle';
        var f;
        if (typeof (config.type) == 'function')
            f = config.type;
        else if (typeof config.type === 'string') {
            f = anra.gef.Figure.extend(anra.svg.Use);
        }
        else
            f = anra.gef.Figure.extend(config.type);
        f = new f();
        f.applyConfig && f.applyConfig(config);
        return f;
    };
    var FLAG_ACTIVE = 1;
    var FLAG_FOCUS = 2;

    /**
     * 控制器
     * @type {*}
     */
    anra.gef.EditPart = Base_1.extend({
        class: 'EditPart',
        selectable: true,
        model: null,
        parent: null,
        selected: SELECTED_NONE,
        figure: null,
        policies: null,
        children: null,
        flags: 0,
        editor: null,
        eventTable: null,
        constructor: function () {
            this.sConns = [];
            this.tConns = [];
            this.children = [];
            this.policies = new Map();
            this.eventTable = new anra.event.EventTable();
        },
        $on: function (k, f) {
            if (this.__adapters == null) {
                this.__adapters = {};
            }
            this.__adapters[k] = f;
        },
        $emit: function (k, p, callback) {
            if (this.__adapters && this.__adapters[k]) {
                this.__adapters[k].call(this, p, callback);
            }
        },
        $off(key, fn) {
            if (this.__adapters && this.__adapters[key] === fn) {
                Reflect.deleteProperty(this.__adapters, key)
            }
        },
        setLayout: function (layout) {
            this.getLayer(anra.gef.RootEditPart.PrimaryLayer).layoutManager = layout;
            this.getLayer(anra.gef.RootEditPart.PrimaryLayer).paint();
        },
        getRoot: function () {
            return this;
        },
        refreshChildren: function () {
            var i;
            if (this.children != null) {
                var map = new Map();
                //增量修改当前children
                for (i = 0; i < this.children.length; i++)
                    map.set(this.children[i].model, this.children[i]);
                var model, editPart;
                var modelChildren = this.getModelChildren();
                for (i = 0; i < modelChildren.length; i++) {
                    model = modelChildren[i];
                    if (i < this.children.length
                        && this.children[i].model.equals(model)) {
                        continue;
                    }
                    editPart = map.get(model);
                    if (editPart != null)
                        this.reorderChild(editPart, i);
                    else {
                        editPart = this.createChild(model);
                        this.addChild(editPart, i);
                    }
                }

                var size = this.children.length;
                i = this.getModelChildren().length;
                if (i < size) {
                    var trash = [];
                    for (; i < size; i++)
                        trash.push(this.children[i]);
                    for (i = 0; i < trash.length; i++) {
                        var ep = trash[i];
                        this.removeChild(ep);
                    }
                }
            }
        },
        removeChild: function (child) {
            if (child == null)
                throw 'child can not be null';
            var index = Util.indexOf(this.children, child);
            if (index < 0)
                return;
            this.fireRemovingChild(child, index);
            if (this.isActive())
                child.deactivate();
            child.removeNotify();
            this.removeChildVisual(child);
            child.setParent(null);
            Util.remove(this.children, child);
        },
        fireRemovingChild: function (child, index) {
            let name = anra.gef.EditPartListener.prototype.class;
            this.eventTable.filter(name).forEach(listener => listener.removingChild(child, index));
            this.eventTable.filter(`${name}:removingChild`).forEach(listener => listener(child, index));
        },
        createChild: function (model) {
            if (this.editor == null) {
                anra.Platform.error("EditPart的editor不能为空");
                return null;
            }
            var part = this.editor.createEditPart != null ? this.editor.createEditPart(this, model) : model.editPartClass != null ? new model.editPartClass : null;
            if (part == null)
                return null;
            part.model = model;
            part.editor = this.editor;
            return part;
        },
        addChild: function (child, index) {
            if (this.children == null)
                this.children = [];
            if (index == null)
                index = this.children.length;

            Util.insert(this.children, child, index);
            child.setParent(this);
            this.addChildVisual(child, index);
            child.addNotify();
            child.activate();
            this.fireChildAdded(child, index);
        },
        fireChildAdded: function (child, index) {
            let name = anra.gef.EditPartListener.prototype.class;
            this.eventTable.filter(name).forEach(listener => listener.childAdded(child, index));
            this.eventTable.filter(`${name}:childAdded`).forEach(listener => listener(child, index));
        },
        reorderChild: function (editpart, index) {
            //        this.removeChildVisual(editpart);
            Util.removeObject(this.children, editpart);
            Util.insert(this.children, editpart, index);
            //        this.addChildVisual(editpart, index);
        },
        removeChildVisual: function (child) {
            this.getFigure().removeChild(child.getFigure());
        },
        addChildVisual: function (child, index) {
            this.getFigure().addChild(child.getFigure());
        },
        deactivate: function () {
            var i;
            for (i = 0; i < this.children.length; i++) {
                this.children[i].deactivate();
            }
            for (i = 0; i < this.sConns.length; i++) {
                this.sConns[i].deactivate();
            }
            this.deactivePolicies();
            this.setFlag(FLAG_ACTIVE, false);
        },
        activate: function () {
            this.setFlag(FLAG_ACTIVE, true);
            this.doActive();
            this._initFigureListeners();

            this.activePolicies();
            var i;
            for (i = 0; i < this.children.length; i++)
                this.children[i].activate();

            this.fireActivated();

            for (i = 0; i < this.sConns.length; i++) {
                this.sConns[i].activate();
            }
        },
        doActive: function () {
        },
        fireActivated: function () {
            let name = anra.gef.EditPartListener.prototype.class;
            this.eventTable.filter(name).forEach(listener => listener.partActivated(this));
            this.eventTable.filter(`${name}:partActivated`).forEach(listener => listener(this));
        },
        getFigure: function () {
            if (this.figure == null) {
                this.figure = this.createFigure(this.model);
                this.figure.setModel(this.model);
            }
            return this.figure;
        },
        _initFigureListeners: function () {
            if (this.figure != null) {
                var _dt = this.getRoot().editor.getTopDragTracker();
                var _ep = this;
                this.figure.on(anra.EVENT.MouseDown, function (e) {
                    _dt.mouseDown(e, _ep);
                });
                this.figure.on(anra.EVENT.MouseIn, function (e) {
                    _dt.mouseIn(e, _ep);
                });
                this.figure.on(anra.EVENT.MouseOut, function (e) {
                    _dt.mouseOut(e, _ep);
                });
                this.figure.on(anra.EVENT.MouseClick, function (e) {
                    _dt.mouseClick(e, _ep);
                });
                this.figure.on(anra.EVENT.DragStart, function (e) {
                    _dt.dragStart(e, _ep);
                });
                this.figure.on(anra.EVENT.DragEnd, function (e) {
                    _dt.dragEnd(e, _ep);
                });
                this.figure.on(anra.EVENT.MouseDrag, function (e) {
                    _dt.mouseDrag(e, _ep);
                });
                this.figure.on(anra.EVENT.MouseMove, function (e) {
                    _dt.mouseMove(e, _ep);
                });
                this.figure.on(anra.EVENT.MouseUp, function (e) {
                    _dt.mouseUp(e, _ep);
                });
            }
        },
        createFigure: function (model) {
            var f;
            if (this.config && this.config.createFigure)
                f = this.config.createFigure.call(this, model);
            else if (this.config.type)
                f = anra.gef.Figure.init(this.config);
            if (f == null)
                throw ': EditPart of ' + model.props.id + ' should has a figure config or createFigure function';
            if (this.config.style)
                f.setStyle(this.config.style);
            if (this.config.attr)
                f.setAttribute(this.config.attr);
            if (this.config.anchor)
                f.registAnchors(this.config.anchor);
            if (this.config.layout)
                f.layoutManager = anra.svg.Layout.init(this.config.layout);
            this.onCreateFigure && this.onCreateFigure(f);
            return f;
        },
        isActive: function () {
            return this.getFlag(FLAG_ACTIVE);
        },
        getFlag: function (flag) {
            return (this.flags & flag) != 0;
        },
        setFlag: function (f, v) {
            if (v)
                this.flags |= f;
            else
                this.flags &= ~f;
        },
        addEditPartListener(key, listener) {
            let name = anra.gef.EditPartListener.prototype.class;
            if (typeof key === 'string') {
                this.eventTable.hook(`${name}:${key}`, listener);
            } else if (typeof key === 'object') {
                listener = key;
                this.eventTable.hook(name, listener);
            }
        },
        addNotify: function () {
            this.register();
            this.createEditPolicies();
            for (var i = 0; i < this.children.length; i++)
                this.children[i].addNotify();
            this.refresh();
        },
        createEditPolicies: function () {
            var key, p;
            if (this.config && this.config.policies) {
                for (key in this.config.policies) {
                    p = this.config.policies[key];
                    this.installEditPolicy(key, p);
                }
            }
        },
        installPolicies: function (policies) {
            for (var k in policies) {
                this.installEditPolicy(k, policies[k]);
            }
        },
        installEditPolicy: function (key, editPolicy) {
            if (key == null) {
                throw 'installEditPolicy:Edit Policies must be installed with key';
            }
            editPolicy = anra.gef.Policy.init(editPolicy);
            if (this.policies == null) {
                this.policies = new Map();
                this.policies.set(key, editPolicy);
            }
            else {
                var oldEditPolicy = this.policies.get(key);
                if (oldEditPolicy != null && oldEditPolicy.isActive()) {
                    oldEditPolicy.deactivate();
                }
                this.policies.set(key, editPolicy);
            }
            editPolicy.setHost(this);
            if (this.isActive()) {
                editPolicy.activate();
                editPolicy._isActive = true;
            }
        },
        activePolicies: function () {
            [...this.policies.values()].forEach(policy => {
                if (policy._isActive) return;
                policy.activate();
                policy._isActive = true;
            });
        },
        deactivePolicies: function () {
            [...this.policies.values()].forEach(policy => {
                if (!policy._isActive) return;
                policy.deactivate();
                policy._isActive = false;
            });
        },
        validatePolicies: function () {
            this.policies.forEach(function (editPolicy) {
                editPolicy.validatePolicy();
            });
        },
        getEditPolicy: function (key) {
            var policy = this.policies.get(key);
            return policy;
        },
        getLayoutPolicy: function () {
            return this.policies.get(LAYOUT_POLICY);
        },
        getConnectionPolicy: function () {
            return this.policies.get(CONNECTION_POLICY);
        },
        getSelectionPolicy() {
            return this.policies.get(SELECTION_POLICY)
        },
        removeEditPolicy: function (key) {
            this.policies.delete(key);
        },
        unregister: function () {
            this.unregisterAccessable();
            this.unregisterVisuals();
            //        this.deactivate();
        },
        register: function () {
            this.registerAccessable();
            this.registerVisuals();
        },
        registerAccessable: function () {
            this.getRoot().regist(this);
        },
        unregisterAccessable: function () {
            this.getRoot().unregist(this);
        },
        registerVisuals: function () {
        },
        unregisterVisuals: function () {
        },
        eraseSourceFeedback: function (request) {
            if (!this.isActive())
                return;
            if (this.policies != null) {
                this.policies.forEach(function (v, k) {
                    v.eraseSourceFeedback(request);
                });
            }
        },
        eraseTargetFeedback: function (request) {
            if (!this.isActive())
                return;
            if (this.policies != null) {
                this.policies.forEach(function (v, k) {
                    v.eraseTargetFeedback(request);
                });
            }
        },
        showSourceFeedback: function (request) {
            if (!this.isActive())
                return;
            if (this.policies != null) {
                this.policies.forEach(function (v, k) {
                    v.showSourceFeedback(request);
                });
            }
        },
        showTargetFeedback: function (request) {
            if (!this.isActive())
                return;
            if (this.policies != null) {
                this.policies.forEach(function (v, k) {
                    v.showTargetFeedback(request);
                });
            }
        },
        getCommand: function (request) {
            var command = null;
            if (this.policies != null) {
                for (let p of this.policies.values()) {
                    if (command != null)
                        command = command.chain(p.getCommand(request));
                    else
                        command = p.getCommand(request);
                }
            }
            return command;
        },
        getDragTracker: function (request) {
            if (this.dragTracker == null && this.createDragTracker != null) {
                this.dragTracker = this.createDragTracker(request);
            }
            return this.dragTracker;
        },
        getSelected: function () {
            return this.selected;
        },
        getTargetEditPart: function (request) {
            var editPart;
            for (let p of this.policies.values()) {
                if (p.getTargetEditPart != null)
                    editPart = p.getTargetEditPart(request);
                if (editPart != null)
                    return editPart;
            }
            if (REQ_SELECTION == request.type) {
                if (this.isSelectable())
                    return this;
            }
            return null;
        },
        isSelectable: function () {
            return false;
        },
        getScene: function () {
        },
        hasFocus: function () {
            return this.getFlag(FLAG_FOCUS);
        },
        performRequest: function (request) {
            if (!this.isActive())
                return;
            if (this.policies != null) {
                this.policies.forEach(function (v, k) {
                    v.performRequest(request);
                });
            }
        },
        refresh: function () {
            this.refreshChildren();
            this.refreshVisual();
            this.validatePolicies();
            window.count = window.count || 1;
            window.count++;
        },
        /**
         * 调用之后必须应用this.figure.paint();
         */
        refreshVisual: function () {
            if (this.figure != null) {
                this.figure.paint();
            }

        },
        removeEditPartListener: function (key, listener) {
            let name = anra.gef.EditPartListener.prototype.class;
            if (typeof key === 'string') {
                this.eventTable.unhook(`${name}:${key}`, listener);
            } else if (typeof key === 'object') {
                listener = key;
                this.eventTable.unhook(name, listener);
            }
        },
        removeNotify: function () {
            this.unregisterAccessable();
            this.unregisterVisuals();
            this.unregister();
        },
        setFocus: function (f) {
            if (this.hasFocus() == f)
                return;
            this.setFlag(FLAG_FOCUS, f);
            this.fireSelectionChanged();
        },
        fireSelectionChanged: function () {
            let name = anra.gef.EditPartListener.prototype.class;
            this.eventTable.filter(name).forEach(listener => listener.selectedStateChanged(this));
            this.eventTable.filter(`${name}:selectedStateChanged`).forEach(listener => listener(this));
        },
        setModel: function (model) {
            this.model = model;
        },
        getModelChildren: function () {
            if (this.model instanceof anra.gef.NodeModel) {
                return this.model.getAllChildren();
            }
            return [];
        },
        setParent: function (parent) {
            this.parent = parent;
        },
        setSelected: function (value) {
            this.selected = value;
            if (this.figure != null && this.figure.selectionChanged != null)
                this.figure.selectionChanged(value);
            this.fireSelectionChanged();
        },
        understandsRequest: function (req) {
            if (this.policies != null) {
                for (let p of this.policies.values()) {
                    if (p.understandsRequest != null && p.understandsRequest(req)) return true;
                }
            }
            return false;
        }
    });

    anra.gef.NodeEditPart = anra.gef.EditPart.extend({
        sConns: null,
        tConns: null,
        getSourceAnchor: function (req) {
            return this.figure.getSourceAnchor(req);
        },
        getAllSourceAnchors: function () {

        },
        createDragTracker: function () {
            return null;
        },
        getTargetAnchor: function (req) {
            return this.figure.getTargetAnchor(req);
        },
        getAnchors: function () {
            return this.figure.getAnchors();
        },
        // getTargetTerminal: function (id) {
        //     return this.figure.getTargetTerminal(id);
        // },
        // getSourceTerminal: function (id) {
        //     return this.figure.getSourceTerminal(id);
        // },
        getSourceAnchorByTerminal: function (id) {
            return this.figure.getSourceAnchorByTerminal(id);
        },
        getTargetAnchorByTerminal: function (id) {
            return this.figure.getTargetAnchorByTerminal(id);
        },
        constructor: function () {
            anra.gef.EditPart.prototype.constructor.call(this);
            this.sConns = [];
            this.tConns = [];
        },
        refresh: function () {
            this.base();
            this.refreshSourceConnections();
            this.refreshTargetConnections();
        },
        getModelSourceLines: function () {
            return (this.model && this.model.sourceLines)
                ? [...this.model.sourceLines.values()]
                : [];
        },
        getModelTargetLines: function () {
            return (this.model && this.model.targetLines)
                ? [...this.model.targetLines.values()]
                : [];
        },
        getRoot: function () {
            return this.parent.getRoot();
        },
        refreshSourceConnections: function () {
            var i;
            var editPart;
            var model;
            var map = new Map();
            if (this.sConns.length > 0) {
                for (i = 0; i < this.sConns.length; i++) {
                    editPart = this.sConns[i];
                    map.set(editPart.model, editPart);
                }
            }
            var modelObjects = this.getModelSourceLines();
            //        console.log('before: ',this.model.get('name'), this.sConns.length, modelObjects.length);
            for (i = 0; i < modelObjects.length; i++) {
                model = modelObjects[i];
                if (i < this.sConns.length && this.sConns[i].model == model) {
                    this.sConns[i].refresh();
                    continue;
                }
                editPart = map.get(model);
                if (editPart != null)
                    this.reorderSourceConnection(editPart, i);
                else {
                    editPart = this.createOrFindConnection(model);
                    this.addSourceConnection(editPart, i);
                }
            }

            // Remove the remaining EditParts
            var size = this.sConns.length;
            if (i < size) {
                var trash = [];
                for (; i < size; i++)
                    trash.push(this.sConns[i]);
                for (i = 0; i < trash.length; i++) {
                    this.removeSourceConnection(trash[i]);
                }
            }
            //        console.log('after: ',this.model.get('name'), this.sConns.length, modelObjects.length);

        },
        reorderSourceConnection: function (line, index) {
            var o = Util.remove(this.sConns, index);
            Util.insert(this.sConns, o, index + 1);
            line.refresh();
        },
        removeSourceConnection: function (line) {
            this.fireRemovingSourceConnection(line, Util.indexOf(this.sConns, line));
            if (line.source == this) {
                line.deactivate();
                line.source = null;
            }
            Util.removeObject(this.sConns, line);
        },
        addSourceConnection: function (line, index) {
            Util.insert(this.sConns, line, index);
            var source = line.source;
            if (source != null && source != this)
                Util.removeObject(source.sConns, line);
            line.setSource(this);
            if (this.isActive())
                line.activate();
            this.fireSourceConnectionAdded(line, index);
        },

        refreshTargetConnections: function () {
            var i;
            var editPart;
            var model;
            var map = new Map();
            if (this.tConns.length > 0) {
                for (i = 0; i < this.tConns.length; i++) {
                    editPart = this.tConns[i];
                    map.set(editPart.model, editPart);
                }
            }
            var modelObjects = this.getModelTargetLines();
            if (modelObjects != null)
                for (i = 0; i < modelObjects.length; i++) {
                    model = modelObjects[i];
                    if (i < this.tConns.length && this.tConns[i].model == model) {
                        this.tConns[i].refresh();
                        continue;
                    }
                    editPart = map.get(model);
                    if (editPart != null)
                        this.reorderTargetConnection(editPart, i);
                    else {
                        editPart = this.createOrFindConnection(model);
                        this.addTargetConnection(editPart, i);
                    }
                }
            // Remove the remaining EditParts
            var size = this.tConns.length;
            if (i < size) {
                var trash = [];
                for (; i < size; i++)
                    trash.push(this.tConns[i]);
                for (i = 0; i < trash.length; i++)
                    this.removeTargetConnection(trash[i]);
            }
        },
        addTargetConnection: function (line, index) {
            Util.insert(this.tConns, line, index);
            var target = line.source;
            if (target != null && target != this)
                Util.removeObject(target.tConns, line);
            line.setTarget(this);
            this.fireTargetConnectionAdded(line, index);
            line.refresh();
        },
        reorderTargetConnection: function (line, index) {
            var o = Util.remove(this.tConns, index);
            Util.insert(this.tConns, o, index + 1);
            line.refresh();
        },
        removeTargetConnection: function (line, index) {
            this.fireRemovingTargetConnection(line, Util.indexOf(this.tConns, line));
            if (line.target == this)
                line.target = null;
            Util.removeObject(this.tConns, line);
        },
        createLineEditPart: function (model) {
            return new anra.gef.LineEditPart(model);
        },
        findLineEditPart: function (model) {
            return this.getRoot().getEditPart(model);
        },
        createOrFindConnection: function (model) {
            var linepart = this.findLineEditPart(model);
            if (linepart == null) {
                linepart = this.createLineEditPart(model);
                linepart.setModel(model);
            }
            return linepart;
        },
        unregisterVisuals: function () {
            if (this.figure.parent != null)
                this.figure.parent.removeChild(this.figure);
            else
                this.figure.dispose();
        },
        fireSourceConnectionAdded: function (line, i) {
            //TODO 增加连线事件类型
        },
        fireRemovingSourceConnection: function (line, i) {
            //TODO
        },
        fireTargetConnectionAdded: function (line, i) {
        },
        fireRemovingTargetConnection: function (line, i) {

        }
    });

    anra.gef.RootEditPart = anra.gef.EditPart.extend({
        layers: null,
        class: 'RootEditPart',
        constructor: function () {
            anra.gef.EditPart.prototype.constructor.call(this);
            this.editPartMap = new Map();
            this.layers = new Map();
        },
        createDragTracker: function () {
            return new anra.gef.RootDragTracker();
        },
        setSelection: function (o) {
            if (this.editor != null)
                this.editor.hideContextMenu(o);
            if (this.selection instanceof Array && o instanceof Array && this.selection.length == o.length) {
                var f = true;
                for (i = 0; i < o.length; i++) {
                    if (this.selection[i] != o[i]) {
                        f = false;
                        break;
                    }
                }
                if (f) return;
            }
            if (this.selection == o || (this.selection != null && this.selection instanceof Array && Util.contains(this.selection, o))) return;
            /* fire selection改变 */
            const oldSelection = this.selection;
            this.clearSelection();
            this.selection = o;
            this.fireRootSelectionChanged(o, oldSelection);
            if (o instanceof Array) {
                for (var i = 0; i < o.length; i++)
                    o[i].setSelected(SELECTED_PRIMARY);
            } else if (o instanceof anra.gef.EditPart) {
                o.setSelected(SELECTED_PRIMARY);
            }
        },
        clearSelection: function () {
            if (this.selection != null) {
                var o = this.selection;
                if (o instanceof Array) {
                    for (var i = 0; i < o.length; i++)
                        o[i].setSelected(SELECTED_NONE);
                } else if (o instanceof anra.gef.EditPart) {
                    o.setSelected(SELECTED_NONE);
                }
            }
        },
        /* selection change 不是 state change */
        fireRootSelectionChanged: function (newSelection, oldSelection) {
            let name = anra.gef.EditPartListener.prototype.class;
            this.eventTable.filter(`${name}:selectionChanged`).forEach(listener => listener(newSelection, oldSelection, this));
            this.eventTable.filter(name).forEach(listener => {
                if (typeof listener.selectionChanged === 'function') {
                    listener.selectionChanged(newSelection, oldSelection);
                }
            });
        },
        getRoot: function () {
            return this;
        },
        createLayer: function () {
            if (this.figure != null) {
                var painterLayer = new anra.svg.Group();
                var primaryLayer = new anra.svg.Group();
                var lineLayer = new anra.svg.Group();
                var handleLayer = new anra.svg.Group();
                var feedbackLayer = new anra.svg.Group();
                var menuLayer = new anra.svg.Group();
                this.figure.addChild(painterLayer);
                this.figure.addChild(primaryLayer);
                this.figure.addChild(lineLayer);
                this.figure.addChild(handleLayer);
                this.figure.addChild(feedbackLayer);
                this.figure.addChild(menuLayer);
                this.layers.set(anra.gef.RootEditPart.PainterLayer, painterLayer);
                this.layers.set(anra.gef.RootEditPart.PrimaryLayer, primaryLayer);
                this.layers.set(anra.gef.RootEditPart.LineLayer, lineLayer);
                this.layers.set(anra.gef.RootEditPart.HandleLayer, handleLayer);
                this.layers.set(anra.gef.RootEditPart.FeedbackLayer, feedbackLayer);
                this.layers.set(anra.gef.RootEditPart.MenuLayer, menuLayer);
            }
        },
        getMenuLayer: function () {
            return this.getLayer(anra.gef.RootEditPart.MenuLayer);
        },
        getLineLayer: function () {
            return this.getLayer(anra.gef.RootEditPart.LineLayer);
        },
        getPainterLayer: function () {
            return this.getLayer(anra.gef.RootEditPart.PainterLayer);
        },
        getHandleLayer: function () {
            return this.getLayer(anra.gef.RootEditPart.HandleLayer);
        },
        getPrimaryLayer: function () {
            return this.getLayer(anra.gef.RootEditPart.PrimaryLayer);
        },
        getFeedbackLayer: function () {
            return this.getLayer(anra.gef.RootEditPart.FeedbackLayer);
        },
        getLayer: function (key) {
            return this.layers.get(key);
        },
        addChildVisual: function (child, index) {
            this.getPrimaryLayer().addChild(child.getFigure());
        },
        removeChildVisual: function (child) {
            this.getPrimaryLayer().removeChild(child.getFigure());
        },
        regist: function (editPart) {
            this.editPartMap.set(editPart.model, editPart);
        },
        unregist: function (editPart) {
            this.editPartMap.delete(editPart.model);
        },
        getEditPart: function (model) {
            return this.editPartMap.get(model);
        },
        getEditPartById: function (id) {
            if (this.model) {
                function getEditPartById(id) {
                    return this.model.children[id]
                        ? this.getEditPart(this.model.children[id])
                        : null;
                }
                this.getEditPartById = getEditPartById;
                return this.getEditPartById(id);
            } else {
                return null;
            }
        },
        _initFigureListeners: function () {
            anra.gef.EditPart.prototype._initFigureListeners.call(this);
            var root = this;
            this.figure.on(anra.EVENT.ContextMenu, function (e) {
                root.editor.showContextMenu(root.selection, e);
            });
        },
        setLayout: function (layout) {
            let layer = this.getLayer(anra.gef.RootEditPart.PrimaryLayer),
                svg = layer.svg.owner;

            layer.getClientArea = function () {
                return [0, 0, svg["clientWidth"], svg["clientHeight"]];
            };

            layer.layoutManager = layout;
            layer.paint();
        },
        getLayout() {
            return this.getLayer(anra.gef.RootEditPart.PrimaryLayer).layoutManager
        },
        scale(scaleX = 1, scaleY = 1) {
            let dispatcher = this.figure.dispatcher;

            this.layers.forEach(layer => {
                layer.scaleX = scaleX;
                layer.scaleY = scaleY;
                layer.applyMatrix();
            });

            dispatcher.scale = Array.of(scaleX, scaleY);
            return this
        },
        translate(translateX, translateY) {
            this.layers.forEach(layer => {
                layer.translateX = translateX;
                layer.translateY = translateY;
                layer.applyMatrix();
            });
            return this
        },
        dispose() {
            this.base();
            this.eventTable.dispose();
        }
    });

    anra.gef.RootEditPart.PrimaryLayer = "Primary_Layer";
    anra.gef.RootEditPart.HandleLayer = "Handle_Layer";
    anra.gef.RootEditPart.FeedbackLayer = "Feedback_Layer";
    anra.gef.RootEditPart.DefineLayer = "defineLayer";
    anra.gef.RootEditPart.PainterLayer = "painterLayer";
    anra.gef.RootEditPart.LineLayer = "lineLayer";
    anra.gef.RootEditPart.MenuLayer = "MenuLayer";

    anra.gef.LineEditPart = anra.gef.EditPart.extend({
        target: null,
        source: null,
        setTarget: function (t) {
            if (this.target == t)
                return;
            if (this.target != null)
                this.dettachTarget();
            this.target = t;
            if (t != null)
                this.setParent(t.getRoot());
            else if (this.source == null)
                this.setParent(null);
            if (this.source != null && this.target != null)
                this.refresh();
        },
        deactivate: function () {
            var i;
            for (i = 0; i < this.children.length; i++) {
                this.children[i].deactivate();
            }
            this.deactivePolicies();

            if (this.model.targetNode != null) {
                this.model.targetNode.removeTargetLine(this.model);
                this.model.targetNode = null;
            }
            if (this.model.sourceNode != null) {
                this.model.sourceNode.removeSourceLine(this.model);
                this.model.sourceNode = null;
            }
            this.setFlag(FLAG_FOCUS, false);
        },
        setSource: function (t) {
            if (this.source == t)
                return;
            if (this.source != null)
                this.dettachSource();
            this.source = t;
            if (t != null)
                this.setParent(t.getRoot());
            else if (this.target == null)
                this.setParent(null);
            if (this.source != null && this.target != null)
                this.refresh();
        },
        setParent: function (parent) {
            var wasNull = this.parent == null;
            var becomingNull = parent == null;
            if (becomingNull && !wasNull)
                this.removeNotify();
            this.parent = parent;
            if (wasNull && !becomingNull)
                this.addNotify();
        },
        unregisterVisuals: function () {
            this.deactivateFigure();
        },
        deactivateFigure: function () {
            this.getRoot().getLineLayer().removeChild(this.figure);
            this.figure.setSourceAnchor(null);
            this.figure.setTargetAnchor(null);
        },
        registerAccessable: function () {
            this.getRoot().regist(this);
        },
        unregisterAccessable: function () {
            this.getRoot().unregist(this);
        },
        registerVisuals: function () {
            this.activateFigure();
        },
        activateFigure: function () {
            this.getRoot().getLineLayer().addChild(this.getFigure());
        },
        getRoot: function () {
            return this.parent.getRoot();
        },
        refresh: function () {
            if (this.figure == null) {
                this.getRoot().getLineLayer().addChild(this.getFigure());
            }
            this.refreshSourceAnchor();
            this.refreshTargetAnchor();
            this.refreshVisual();
            this.refreshChildren();

            window.linecount = window.linecount || 1;
            window.linecount++;
        },
        refreshSourceAnchor: function () {
            this.figure.setSourceAnchor(this.getSourceAnchor());
        },
        refreshTargetAnchor: function () {
            this.figure.setTargetAnchor(this.getTargetAnchor());
        },
        getSourceAnchor: function () {
            if (this.source != null)
                return this.source.getSourceAnchorByTerminal(this.model.get('exit'));
            return { x: 0, y: 0 };
        },
        getTargetAnchor: function () {
            if (this.target != null)
                return this.target.getTargetAnchorByTerminal(this.model.get('entr'));
            return { x: 100, y: 100 };
        },
        attachSource: function () {
            this.source.model.addSourceLine(this.model);
            this.source.refresh();
        },
        attachTarget: function () {
            this.target.model.addTargetLine(this.model);
            this.target.refresh();
        },
        dettachSource: function (refresh) {
            if (this.source == null) return;
            this.source.model.removeSourceLine(this.model);
            if (refresh)
                this.source.refresh();
        },
        dettachTarget: function (refresh) {
            if (this.target == null) return;
            this.target.model.removeTargetLine(this.model);
            if (refresh)
                this.target.refresh();
        }
    });


    anra.gef.Tool = Base_1.extend({
        activate: function () {
        },
        deactivate: function () {
        },
        getEventDispatcher: function () {
            return this.editor.rootEditPart.getFigure().dispatcher;
        },
        notifyListeners: function (eventType, func) {
            //TODO
        },
        disableEvent: function () {
        },
        enableEvent: function () {
        },
        mouseUp: function (e, p) {
            //        if (this.dragEnd != null)
            //            this.dragEnd(e, p);
            this.editor.setActiveTool(this.editor.getDefaultTool());
        }
    });

    anra.gef.SelectionTool = anra.gef.Tool.extend({
        id: 'selection tool',
        deactivate() {
            this.editor.rootEditPart.setSelection(null);
        },
        mouseDown: function (e, p) {
            if (p.getRoot == null) return;
            p.getRoot().setSelection(p);
        },
        dragStart: function (e, p) {
            if (p instanceof anra.gef.RootEditPart) {
                if (this.marqueeTool == null)
                    this.marqueeTool = new anra.gef.MultiSelectionTool();
                this.editor.setActiveTool(this.marqueeTool);
            }
        }
    });
    anra.gef.MultiSelectionTool = anra.gef.Tool.extend({
        id: 'multi selection tool',
        dragEnd: function (e, p) {
            if (this.marquee != null)
                this.editor.rootEditPart.getFeedbackLayer().removeChild(this.marquee);
            this.marquee = null;
            this.editor.setActiveTool(this.editor.getDefaultTool());
        },
        mouseUp: function (e, p) {
            this.dragEnd(e, p);
        },
        mouseDrag: function (e, p) {
            var marquee = this.getMarqueeVisual(e);
            this.refreshMarquee(marquee, e);
            this.calculateSelection(marquee);
        },
        getMarqueeVisual: function (e) {
            if (this.marquee == null) {
                this.marquee = new anra.svg.Control();
                this.marquee.setOpacity(0.3);
                this.marquee.disableEvent();
                this.marquee.setAttribute({
                    stroke: 'black',
                    fill: 'grey'
                });
                this.marquee.x = e.x;
                this.marquee.y = e.y;
                this.editor.rootEditPart.getFeedbackLayer().addChild(this.marquee);
            }
            return this.marquee;
        },
        calculateSelection: function (marquee) {
            var b = marquee.bounds;
            var children = this.editor.rootEditPart.children;
            var selection = [];
            for (var i = 0; i < children.length; i++) {
                if (anra.Rectangle.observe(b, children[i].figure.bounds))
                    selection.push(children[i]);
            }
            this.editor.rootEditPart.setSelection(selection);
        },
        refreshMarquee: function (f, e) {
            var nx = e.x;
            var ny = e.y;
            var mX = f.x < nx ? f.x : nx;
            var mY = f.y < ny ? f.y : ny;
            f.setBounds({
                x: mX,
                y: mY,
                width: Math.abs(f.x - nx),
                height: Math.abs(f.y - ny)
            }, true);
        }
    });
    /**
     * this doesnot work unless target area has registed a anra.gef.LAYOUT_POLICY（which extends anra.gef.LayoutPolicy）
     * @type {*}
     */
    anra.gef.CreationTool = anra.gef.Tool.extend({
        constructor: function (model) {
            this.model = model;
        },
        activate: function () {
            this.getEventDispatcher().mouseState = anra.EVENT.MouseDrag;
            this.getEventDispatcher().dragTarget = { model: this.model };
        },
        deactivate: function () {
            if (this.policy != null) {
                var v = this;
                var req = {
                    target: v,
                    type: REQ_CREATE
                };
                this.policy.eraseTargetFeedback(req);
            }
        },
        mouseDown: function () {
            this.getEventDispatcher().mouseState = anra.EVENT.MouseDrag;
            return true;
        },
        getEditPart: function (parentEditPart) {
            if (this.virtualEP == null) this.virtualEP = parentEditPart.createChild(this.model);
            return this.virtualEP;
        },
        mouseDrag: function (e, p) {
            var policy = this.getLayoutPolicy(e, p);
            if (this.policy == null) {
                this.policy = policy;
            }
            if (policy == null) return false;
            var req = {
                editPart: p,
                target: this,
                event: e,
                type: REQ_CREATE
            };
            if (this.policy != policy) {
                this.policy.eraseTargetFeedback(req);
                this.policy = policy;
            }
            policy.showTargetFeedback(req);

            //        var c = policy.getCommand(req);
            //        if (c != null && !c.canExecute()) {
            //            return false;
            //        }
            return true;
        },
        getLayoutPolicy: function (e, p) {
            if (p.getLayoutPolicy) {
                var policy = p.getLayoutPolicy();
                var parent = p;
                while (policy == null && parent != null) {
                    policy = parent.getLayoutPolicy();
                    parent = parent.parent;
                }
                return policy;
            }

            return null;
        },
        dragEnd: function (me, editPart) {
            /* TODO */
            if (editPart == null) return false;
            var policy = this.getLayoutPolicy(me, editPart);
            if (policy == null) return false;
            var req = {
                editPart: editPart,
                target: this,
                event: me,
                type: REQ_CREATE
            };
            policy.eraseTargetFeedback(req);

            if (me.button === 0) { // 右键取消
                var cmd = policy.getCommand(req);
                if (cmd != null && cmd.canExecute()) {
                    editPart.getRoot().editor.execute(cmd);
                } else {
                    return this.dragEnd(me, editPart.parent)
                }
            }
            return true;
        },
        getCommand: function (e, p) {
            return new anra.gef.CreateNodeCommand();
        }
    });
    /**
     * 连线工具
     * @type {*}
     */
    anra.gef.LinkLineTool = anra.gef.Tool.extend({
        id: 'link tool',
        type: null,
        constructor: function (m) {
            this.model = m;
            this.type = REQ_CONNECTION_START;
        },
        activate: function () {
            //根控制器激活连线模式，展示UI
            //原先代码
            this.refreshFeedback(this.editor.rootEditPart, 'showSourceFeedback', { type: REQ_CONNECTION_MOD });
        },
        deactivate: function () {
            //清除连线模式的UI
            //原先代码
            this.refreshFeedback(this.editor.rootEditPart, 'eraseSourceFeedback', { type: REQ_CONNECTION_MOD });
            this.refreshFeedback(this.targetEditPart, 'eraseTargetFeedback', { type: REQ_CONNECTION_MOD });
            this.refreshFeedback(this.sourceEditPart, 'eraseSourceFeedback', { type: REQ_CONNECTION_MOD });
            this.sourceGuideAnchor && this.editor.rootEditPart.getFeedbackLayer().removeChild(this.sourceGuideAnchor);
            this.targetGuideAnchor && this.editor.rootEditPart.getFeedbackLayer().removeChild(this.targetGuideAnchor);
            this.reset();
        },
        isDragging() {
            if (this.type === REQ_CONNECTION_START) return false
            if (this.type === REQ_CONNECTION_END) return true
            if (this.type === REQ_RECONNECT_TARGET) return true
            if (this.type === REQ_RECONNECT_SOURCE) return true
            return false
        },
        isReconnnect() {
            if (this.type === REQ_RECONNECT_TARGET) return true
            if (this.type === REQ_RECONNECT_SOURCE) return true
            return false
        },
        isNode(p) {
            return p instanceof anra.gef.NodeEditPart
        },
        isRoot(p) {
            return p instanceof anra.gef.RootEditPart
        },
        mouseMove(e, p) {
            let req = this.createReq(e, p);
            if (this.type == REQ_CONNECTION_END || this.type == REQ_RECONNECT_TARGET) {
                if (p !== this.targetEditPart) {
                    this.refreshFeedback(this.targetEditPart, 'eraseTargetFeedback', req);
                }
                this.targetEditPart = p;
                this.refreshFeedback(this.targetEditPart, 'showTargetFeedback', req);
            } else if (this.type == REQ_RECONNECT_SOURCE || this.type == REQ_CONNECTION_START) {
                if (this.sourceEditPart !== p) {
                    this.refreshFeedback(this.sourceEditPart, 'eraseSourceFeedback', req);
                }
                this.sourceEditPart = p;
                this.refreshFeedback(p, 'showSourceFeedback', req);
            }
            return true;
        },
        removeGuideLine() {
            let isReconnect = this.isReconnnect();
            if (isReconnect) {
                this.linePart.figure.enableEvent();
                this.linePart.refresh();
            } else if (this.isDragging()) {
                let layer = this.editor.rootEditPart.getFeedbackLayer();

                layer.removeChild(this.guideLine);
                if (this.sourceGuideAnchor != null) this.sourceGuideAnchor.setVisible(false);
                if (this.targetGuideAnchor != null) this.targetGuideAnchor.setVisible(false);
                // layer.removeChild(this.sourceGuideAnchor)
                // layer.removeChild(this.targetGuideAnchor)
            }

        },
        refreshFeedback(editPart, name, req) {
            if (editPart != null) {
                let policy = editPart.getConnectionPolicy && editPart.getConnectionPolicy();
                policy && Reflect.apply(policy[name], policy, [req]);
            }
        },
        refreshSourceAnchor(anchor) {
            this.sourceGuideAnchor = this.sourceGuideAnchor || this.createGuideAnchor(anchor);
            this.sourceGuideAnchor.setBounds(anchor);

            this.guideLine = this.getGuideLine();
            if (this.guideLine != null) {
                let isReconnnect = this.isReconnnect();

                this.guideLine.setSourceAnchor(anchor);
                this.sourceGuideAnchor.setVisible(!isReconnnect);
                if (this.guideLine.targetAnchor == null) { // 初始化另一端
                    let targetAnchor = this.targetGuideAnchor != null
                        ? this.targetGuideAnchor.getBounds()
                        : anchor;
                    this.refreshTargetAnchor(targetAnchor);
                } else {
                    this.guideLine.paint();
                }
            } else { // !isDragging
                this.sourceGuideAnchor.setVisible(false);
            }
        },
        refreshTargetAnchor(anchor) {
            this.targetGuideAnchor = this.targetGuideAnchor || this.createGuideAnchor(anchor);
            this.targetGuideAnchor.setBounds(anchor);

            this.guideLine = this.getGuideLine();
            if (this.guideLine != null) {
                let isReconnnect = this.isReconnnect();

                this.guideLine.setTargetAnchor(anchor);
                this.targetGuideAnchor.setVisible(!isReconnnect);
                if (this.guideLine.sourceAnchor == null) {
                    let sourceAnchor = this.sourceGuideAnchor != null
                        ? this.sourceGuideAnchor.getBounds()
                        : anchor;

                    this.refreshSourceAnchor(sourceAnchor);
                } else {
                    this.guideLine.paint();
                }
            } else {
                this.targetGuideAnchor.setVisible(false);
            }
        },
        mouseDown(e, p) {
            if (this.isNode(p)) {
                var policy = p.getConnectionPolicy();
                var req = this.createReq(e, p);

                if (!this.isDragging()) {
                    this.type = REQ_CONNECTION_END;
                    this.sourceEditPart = p;
                    this.mouseMove(e, p);

                    if (policy != null) {
                        let line = this.getGuideLine();
                        if (line != null && line.sourceAnchor != null) {
                            req.anchor = line.sourceAnchor;
                            this.command = policy.getCommand(req);
                        }
                    }
                }

            } else if (this.isRoot(p) && !this.isDragging()) {
                p.getRoot().setSelection(p);
            }

            return true;
        },
        mouseDrag: function (e, p) {
            if (!this.isDragging()) return

            if (this.isReconnnect()) {
                var handles = this.linePart.getSelectionPolicy().handles;
                if (handles) {
                    handles.forEach(item => item.disableEvent());
                }
                this.mouseMove(e, p);
                return true;
            }

            //确保p一定是mouseOntarget
            if (p.figure === e.prop.target) this.mouseMove(e, p);
            return true;
        },
        dragEnd: function (e, p) {
            if (this.isReconnnect()) {
                var handles = this.linePart.getSelectionPolicy().handles;
                if (handles) {
                    handles.forEach(item => item.enableEvent());
                }
            } else if (this.type === REQ_CONNECTION_END) {
                this.refreshFeedback(this.sourceEditPart, 'eraseSourceFeedback', {});
            }

            this.mouseUp(e, p);
            return true;
        },
        mouseUp(e, p) {
            if (this.isNode(p) && this.isDragging()) {
                let policy = p.getConnectionPolicy();
                let line = this.guideLine;
                let anchor;

                if (line != null) {
                    anchor = this.type === REQ_RECONNECT_SOURCE
                        ? this.guideLine.sourceAnchor
                        : this.guideLine.targetAnchor;
                }

                if (policy != null) {
                    let req = this.createReq(e, p, anchor);
                    if (anchor != null) {
                        this.command = policy.getCommand(req);
                    }
                    policy.eraseSourceFeedback(req);
                    policy.eraseTargetFeedback(req);
                }
                if (this.command != null) {
                    p.getRoot().editor.execute(this.command);
                }
            }

            if (this.isReconnnect()) {
                this.editor.setActiveTool(this.editor.getDefaultTool());
            }
            this.reset();
            return true
        },
        dragStart() {
            return true;
        },
        getGuideLine() {
            if (this.guideLine == null && this.isDragging()) {
                let isReconnect = this.isReconnnect();
                this.guideLine = isReconnect ? this.linePart.figure : this.createGuideLine(this.sourceEditPart);
                this.guideLine.disableEvent();
            }
            return this.guideLine
        },
        reset() {
            this.removeGuideLine();
            this.type = REQ_CONNECTION_START;
            this.targetEditPart = null;
            this.sourceEditPart = null;
            this.guideLine = null;
            this.command = null;
        },
        createReq(e, p, anchor) {
            return {
                editPart: p,
                target: this,
                event: e,
                type: this.type,
                anchor: anchor,
                command: this.command,
                line: this.linePart,
                model: this.model
            }
        },
        createGuideLine(editPart) {
            this.model.sourceNode = this.sourceEditPart.model
            this.model.set('exit', this.sourceGuideAnchor.id)

            let line = editPart.createLineEditPart(this.model).createFigure(this.model);
            let layer = this.editor.rootEditPart.getFeedbackLayer();

            layer.addChild(line);
            // 指向实际节点的model，如果修改了会产生问题
            line.model = this.model
            return line
        },
        createGuideAnchor(a) {
            let handle = new (anra.svg.Control.extend(anra.svg.Circle))();
            handle.setAttribute({
                fill: 'white',
                stroke: a ? 'blue' : 'red',
            });
            handle.setBounds({ width: 10 });
            handle.setVisible(false);
            handle.id = a.id
            this.editor.rootEditPart.getFeedbackLayer().addChild(handle);
            return handle
        }
    });

    /**
     * DragTracker总控，如果子DragTracker对应方法不为true，则交由父级处理
     *
     * @type {*}
     */
    anra.gef.TopDragTracker = Base_1.extend({
        constructor: function (editor) {
            this.editor = editor;
        },
        invoke: function (me, editPart, dragTracker, method) {
            return dragTracker && dragTracker[method] != null &&
                dragTracker[method](me, editPart);
        },
        invokeLoop: function (me, editPart, method) {
            var p = editPart;
            while (p != null && (p.getDragTracker == null || !this.invoke(me, p, p.getDragTracker(), method) && p.parent != null)) {
                p = p.parent;
            }
        },
        getActiveTool: function () {
            return this.editor.getActiveTool();
        },
        mouseMove: function (me, editPart) {
            if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseMove'))
                this.invokeLoop(me, editPart, 'mouseMove');
        },
        mouseDown: function (me, editPart) {
            if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseDown'))
                this.invokeLoop(me, editPart, 'mouseDown');
        },
        dragDropped: function (me, editPart) {
            if (!this.invoke(me, editPart, this.getActiveTool(), 'dragDropped'))
                this.invokeLoop(me, editPart, 'dragDropped');
        },
        mouseClick: function (me, editPart) {
            if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseClick'))
                this.invokeLoop(me, editPart, 'mouseClick');
        },
        dragStart: function (me, editPart) {
            if (!this.invoke(me, editPart, this.getActiveTool(), 'dragStart'))
                this.invokeLoop(me, editPart, 'dragStart');
        },
        mouseDrag: function (me, editPart) {
            if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseDrag'))
                this.invokeLoop(me, editPart, 'mouseDrag');
        },
        dragEnd: function (me, editPart) {
            if (!this.invoke(me, editPart, this.getActiveTool(), 'dragEnd'))
                this.invokeLoop(me, editPart, 'dragEnd');
        },
        mouseUp: function (me, editPart) {
            if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseUp'))
                this.invokeLoop(me, editPart, 'mouseUp');
        },
        mouseIn: function (me, editPart) {
            if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseIn'))
                this.invokeLoop(me, editPart, 'mouseIn');
        },
        mouseOut: function (me, editPart) {
            if (!this.invoke(me, editPart, this.getActiveTool(), 'mouseOut'))
                this.invokeLoop(me, editPart, 'mouseOut');
        }
    });

    /**
     * 处理EditPart级别的鼠标事件
     * @type {*}
     */
    anra.gef.RootDragTracker = Base_1.extend({
        dragStart: function (me, editPart) {
            var req = {
                editPart: editPart,
                target: me.prop.drag,
                event: me,
                type: REQ_DRAG_START
            };

            editPart.showTargetFeedback(req);
        },
        mouseDrag: function (me, editPart) {
            var req = {
                editPart: editPart,
                target: me.prop.drag,
                event: me,
                type: REQ_MOVE
            };

            editPart.showTargetFeedback(req);
        },
        dragEnd: function (me, editPart) {
            var req = {
                editPart: editPart,
                target: me.prop.drag,
                event: me,
                type: REQ_MOVE
            };
            var cmd = editPart.getCommand(req);
            if (cmd != null) {
                editPart.getRoot().editor.execute(cmd);
            }
            editPart.eraseTargetFeedback(req);
        },
        mouseUp: function (me, editPart) {
            var req = {
                editPart: editPart,
                event: me,
                type: REQ_MOUSE_UP
            };
            editPart.eraseTargetFeedback(req);
        }
    });


    anra.gef.DragTracker = anra.gef.RootDragTracker.extend({

        mouseDrag: function (me, editPart) {

        },

        dragStart: function (me, editPart) {
            var bounds = editPart.figure.getClientArea();
            me.offsetX = bounds[0] - me.x;
            me.offsetY = bounds[1] - me.y;
            return false;
        },
        dragEnd: function (me, editPart) {
            var req = {
                editPart: editPart,
                target: me.prop.drag,
                event: me,
                type: REQ_MOVE
            };
            if (req.type == null) return false;
            var cmd = editPart.getCommand(req);
            if (cmd != null) {
                editPart.getRoot().editor.execute(cmd);
            }
            editPart.eraseTargetFeedback(req);
            return cmd && cmd.canExecute();
        },
        mouseDown: function (me, editPart) {
            return true;
        }
    });


    anra.gef.RelocalCommand = anra.Command.extend({
        constructor: function (editPart, sp, ep) {
            this.sp = sp;
            this.ep = ep;
            this.model = editPart.model;
            this.editPart = editPart;
        },
        dispose: function () {
            this.editPart = null;
        },
        canExecute: function () {
            return this.model != null && this.sp != null && this.ep != null;
        },
        execute: function () {
            var b = this.editPart.model.get('bounds'), parent = this.editPart.parent;

            if (parent instanceof anra.gef.RootEditPart) {
                this.model.set('bounds', [this.ep.x, this.ep.y, b[2], b[3]]);
            } else {
                var loc = [parent.getFigure().getAttr('x', parseFloat),
                parent.getFigure().getAttr('y', parseFloat)];
                this.model.set('bounds', [this.ep.x - loc[0],
                this.ep.y - loc[1],
                b[2],
                b[3]]);
            }

            this.editPart.refresh();
        },
        undo: function () {
            var b = this.model.get('bounds');
            this.model.set('bounds', [this.sp.x, this.sp.y, b[2], b[3]]);
            this.editPart.refresh();
        }

    });

    anra.gef.DeleteNodeAndLineCommand = anra.ChainedCompoundCommand.extend({
        constructor: function (root, node) {
            this.commandList = [];

            this.nodes = [];
            this.lines = new Map();
            if (node instanceof Array) {
                for (var i = 0; i < node.length; i++) {
                    this.collectCommands(node[i]);
                }
            } else {
                this.collectCommands(node);
            }

            this.lines.forEach(function (v) {
                this.add(new anra.gef.DeleteLineCommand(root, v));
            }, this);

            for (i = 0; i < this.nodes.length; i++) {
                this.add(new anra.gef.DeleteNodeCommand(root, this.nodes[i]));
            }

        },
        collectCommands: function (node) {
            var targetLines = node.tConns;
            var sourceLines = node.sConns;
            if (targetLines != null) {
                for (var i = 0; i < targetLines.length; i++) {
                    this.lines.set(targetLines[i].model, targetLines[i]);
                }
            }
            if (sourceLines != null) {
                for (i = 0; i < sourceLines.length; i++) {
                    this.lines.set(sourceLines[i].model, sourceLines[i]);
                }
            }
            this.nodes.push(node);
        }
    });

    /**
     * 删除节点的command
     * @type {*}
     */
    anra.gef.DeleteNodeCommand = anra.Command.extend({
        constructor: function (root, selection) {
            this.root = root;
            if (selection instanceof anra.gef.EditPart)
                this.node = selection;
            else if (selection instanceof anra.gef.BaseModel) {
                this.node = this.root.getEditPart(selection);
                if (this.node == null)
                    throw 'can not delete model ' + selection.props.id;
            }
        },
        canExecute: function () {
            return this.root != null && this.node != null;
        },
        execute: function () {
            this.root.model.removeChild(this.node.model);
            this.root.refresh();
        },
        undo: function () {
            this.root.model.addChild(this.node.model);
            this.root.addChild(this.node);
            this.root.refresh();
        }
    });

    /**
     * 删除连线的command
     * @type {*}
     */
    anra.gef.DeleteLineCommand = anra.Command.extend({
        constructor: function (root, line) {
            this.root = root;
            this.line = line;
        },
        canExecute: function () {
            return this.root != null && this.line != null;
        },
        execute: function () {
            if (this.root.selection === this.line) {
                this.isSelected = true;
                this.root.setSelection(this.root);
            }

            if (this.snode == null)
                this.snode = this.line.source.model;
            if (this.tnode == null)
                this.tnode = this.line.target.model;

            this.sid = this.line.model.get('exit');
            this.tid = this.line.model.get('entr');

            this.line.dettachSource(true);
            this.line.dettachTarget(true);

            this.line.unregister();
            this.line.deactivate();
        },
        undo: function () {
            var s = this.root.getEditPart(this.snode);
            var t = this.root.getEditPart(this.tnode);

            this.line.setSource(s);
            this.line.setTarget(t);

            this.line.figure.setSourceAnchor(s.getSourceAnchorByTerminal(this.sid));
            this.line.figure.setTargetAnchor(t.getTargetAnchorByTerminal(this.tid));

            //如果不在attach前注册，node会创建一个新的lineEditPart
            this.line.register();

            this.line.attachSource(true);
            this.line.attachTarget(true);
            this.line.activate();

            if (this.isSelected) {
                this.root.setSelection(this.line);
            }
        }
    });

    /**
     * 创建节点Command
     * @param rootEditPart 根EditPart
     * @param node 节点模型
     */
    anra.gef.CreateNodeCommand = anra.Command.extend({
        constructor: function (parentPart, node) {
            this.parentPart = parentPart;
            this.node = node;
        },
        canExecute: function () {
            return this.parentPart != null && this.node != null;
        },
        execute: function () {
            this.parentPart.model.addChild(this.node);
            this.parentPart.refresh();
        },
        undo: function () {
            this.parentPart.model.removeChild(this.node);
            this.parentPart.refresh();
        }
    });


    anra.gef.ReconnectSourceCommand = anra.Command.extend({
        execute: function () {
            this.oldSource = this.line.source;
            if (this.oldSource != this.source) {
                this.line.setSource(this.source);
                this.line.attachSource();
                this.oldSource.removeSourceConnection(this.line);
            }
            this.oldTerminal = this.line.model.get('exit');
            this.line.model.set('exit', this.terminal);
            this.line.model.set('source', this.line.source.model.get('id'));
            this.line.refresh();
        },
        undo: function () {
            if (this.oldSource != this.source) {
                this.line.setSource(this.oldSource);
                this.line.attachSource();
                this.source.removeSourceConnection(this.line);
            }
            this.line.model.set('exit', this.oldTerminal);
            this.line.model.set('source', this.line.source.model.get('id'));
            this.line.refresh();
        }
    });

    anra.gef.ReconnectTargetCommand = anra.Command.extend({
        execute: function () {
            this.oldTarget = this.line.target;
            if (this.oldTarget != this.target) {
                this.line.setTarget(this.target);
                this.line.attachTarget();
                this.oldTarget.removeTargetConnection(this.line);
            }
            this.oldTerminal = this.line.model.get('entr');
            this.line.model.set('entr', this.terminal);
            this.line.model.set('target', this.line.target.model.get('id'));
            this.line.refresh();

            /*        this.oldTarget = this.line.target;
             this.oldTerminal = this.line.model.get('entr');
  
             console.log(this.oldTerminal != this.terminal)
             if (this.oldTarget != this.target || this.oldTerminal != this.terminal) {
             this.line.setTarget(this.target);
             this.line.attachTarget();
             this.oldTarget.removeTargetConnection(this.line);
             }
             this.line.model.set('entr', this.terminal);
             this.line.refresh();*/

        },
        undo: function () {
            if (this.oldTarget != this.target) {
                this.line.setTarget(this.oldTarget);
                this.line.attachTarget();
                this.target.removeTargetConnection(this.line);
            }
            this.line.model.set('entr', this.oldTerminal);
            this.line.model.set('target', this.line.target.model.get('id'));
            this.line.refresh();
        }
    });
    /**
     * 创建连线command
     *
     * @param rootEditPart 根EditPart
     * @param line 连线模型
     * @param sourceId 源节点ID
     * @param targetId 目标节点ID
     */
    anra.gef.CreateLineCommand = anra.Command.extend({

        constructor: function (rootEditPart, line, sourceId, targetId) {
            this.rootEditPart = rootEditPart;
            this.line = line;
            this.targetId = targetId;
            this.sourceId = sourceId;
        },
        canExecute: function () {
            return this.rootEditPart != null && this.line != null && this.sourceId != null && this.targetId != null
        },
        execute: function () {
            this.target = this.rootEditPart.model.getChild(this.targetId);
            this.source = this.rootEditPart.model.getChild(this.sourceId);
            if (this.target == null)
                anra.Platform.error('can not found line target id: ' + this.targetId);
            if (this.source == null)
                anra.Platform.error('can not found line source id: ' + this.sourceId);
            var flag = this.source.addSourceLine(this.line);

            if (!flag) return;
            flag &= this.target.addTargetLine(this.line);
            if (!flag) return;

            var sourcePart = this.sourcePart = this.rootEditPart.getEditPart(this.source);
            if (sourcePart != null)
                sourcePart.refresh();

            var targetPart = this.targetPart = this.rootEditPart.getEditPart(this.target);
            if (targetPart != null)
                targetPart.refresh();
        },
        undo: function () {
            var linePart = this.sourcePart.getRoot().getEditPart(this.line);

            this.source.removeSourceLine(this.line);
            this.target.removeTargetLine(this.line);
            if (this.sourcePart != null)
                this.sourcePart.refresh();
            if (this.targetPart != null)
                this.targetPart.refresh();

            linePart.unregister();
        }
    });


    anra.gef.ConstraintCommand = anra.Command.extend({
        constructor: function (editPart, sp, ep) {
            this.sp = sp;
            this.ep = ep;
            this.editPart = editPart;
        },
        canExecute: function () {
            return this.editPart != null && this.sp != null && this.ep != null;
        },
        execute: function () {
            var bounds = [this.ep.x, this.ep.y, this.ep.width, this.ep.height];
            this.editPart.model.set('bounds', bounds);
            this.editPart.refresh();
        },
        undo: function () {
            var bounds = [this.sp.x, this.sp.y, this.sp.width, this.sp.height];
            this.editPart.model.set('bounds', bounds);
            this.editPart.refresh();
        }
    });

    anra.gef.Policy = Base_1.extend({
        editPart: null,
        setHost: function (editPart) {
            this.editPart = editPart;
        },
        isActive: function () {
        },
        getHostFigure: function () {
            return this.editPart.getFigure();
        },
        getTargetEditPart: function (request) {
            return this.getHost();
        },
        getHost: function () {
            return this.editPart;
        },
        activate: Util.noop,
        deactivate: Util.noop,
        eraseSourceFeedback: Util.noop,
        eraseTargetFeedback: Util.noop,
        showSourceFeedback: Util.noop,
        showTargetFeedback: Util.noop,
        getCommand: Util.noop,
        validatePolicy: function () {
        },
        getLineLayer() {
            return this.getHost().getRoot().getLayer(anra.gef.RootEditPart.LineLayer);
        },
        getHandleLayer: function () {
            return this.getHost().getRoot().getLayer(anra.gef.RootEditPart.HandleLayer);
        },
        getPrimaryLayer: function () {
            return this.getHost().getRoot().getLayer(anra.gef.RootEditPart.PrimaryLayer);
        },
        getFeedbackLayer: function () {
            return this.getHost().getRoot().getLayer(anra.gef.RootEditPart.FeedbackLayer);
        },
        removeHandle: function (figure) {
            this.getHandleLayer().removeChild(figure);
        },
        addHandle: function (figure) {
            this.getHandleLayer().addChild(figure);
        },
        removeFeedback: function (figure) {
            this.getFeedbackLayer().removeChild(figure);
        },
        addFeedback: function (figure) {
            this.getFeedbackLayer().addChild(figure);
        },
        on: function (k, f) {
            this.getHost().getRoot().$on(k, f);
        },
        emit: function (k, p, callback) {
            this.getHost().getRoot().$emit(k, p, callback);
        },
        off(key, fn) {
            this.getHost().getRoot().$off(key, fn)
        }
    });
    anra.gef.Policy.init = function (config) {
        let instance = typeof config === 'function' ? Reflect.construct(config, []) : Util.construct(anra.gef.Policy, config);
        if (!instance) {
            throw 'can not init policy :' + config
        }

        // bind context from config
        let bindConfig = instance.config;
        if (typeof bindConfig === 'object') {
            for (let [name, fn] of Object.entries(bindConfig)) {
                if (typeof fn === 'function') {
                    let bindFn = Util.bindFn(fn, instance);
                    Util.def(instance, name, bindFn, true);
                }
            }
        }

        return instance
    };

    anra.gef.Palette = anra.gef.Figure.extend({});

    anra.gef.Request = Base_1.extend({});
    anra.gef.Editor = Base_1.extend({
        listenerSupport: null,
        canvas: null,
        input: null,
        palette: null,
        element: null,
        rootEditPart: null,
        cmdStack: null,
        background: '#FFFFFF',
        setInput: function (input) {
            this.storeId = anra.Store.newStore(input.uuid);
            this.store = anra.Store.get(this.storeId);
            this.rootModel = this.createRootModel(input);
            this.rootModel.storeId = this.storeId;
            this.input2model(input, this.rootModel);
            console.log('editor created : ' + this.storeId);
        },
        createRootModel: function () {
            return new anra.gef.ContentModel();
        },
        input2model: function (input) {
            return input;
        },
        showContextMenu: function (selection, e) {
            if (this.menu == null) {
                this.menu = this.createContextMenu();
                this.rootEditPart.getMenuLayer().addChild(this.menu);
            }
            this.menu.show(this, e);
        },
        createContextMenu: function () {
            var menu = new anra.svg.DefMenu(this);
            return menu;
        },
        hideContextMenu: function () {
            if (this.menu != null)
                this.menu.hide();
        },
        createContent: function (parentId) {
            this.listenerSupport = new anra.ListenerSupport();
            this.setActiveTool(this.getDefaultTool());

            this.element = document.getElementById(parentId);
            this.actionRegistry = new anra.ActionRegistry();
            this.registActions();
            if (this.element == null) {
                anra.Platform.error('GEF的父级元素不能为空');
                return;
            }
            //this.palette = this.createPalette(parentId);
            this.canvas = this.createCanvas(parentId);

            this._initCanvasListeners(this.canvas);

            this.rootEditPart = this.createRootEditPart();
            this.initRootEditPart(this.rootEditPart);
            //        this.rootEditPart._initFigureListeners();
            this.cmdStack = new anra.CommandStack();
            this.rootEditPart.refresh();
        },
        _initCanvasListeners: function () {
            var editor = this;
            this.canvas.on(anra.EVENT.KeyDown, function (e) {
                var actions = editor.actionRegistry.getActions('*', editor, { event: e });

                if (actions.length > 0) {
                    actions[0].run();
                }
            });
        },
        registActions: function () {

        },
        execute: function (c) {
            if (this.cmdStack != null)
                this.cmdStack.execute(c);
        },
        createRootEditPart: function () {
            return new anra.gef.RootEditPart()
        },
        initRootEditPart() {
            let root = this.rootEditPart;
            root.editor = this;
            root.figure = this.canvas;
            root.createLayer();
            root.setModel(this.rootModel);
            root.addNotify();
            root.activate();
        },
        _save: function () {
            this.doSave(()=>{
                this.cmdStack.markSaveLocation();
            });
        },
        doSave: function (done) {
            //执行保存
            console.log('please override a doSave function', this.isDirty());
            // this.cmdStack.markSaveLocation();
            done&&done();
        },
        isDirty: function () {
            return this.cmdStack.isDirty();
        },
        //    getDefaultTool:function () {
        //        if (this.tool == null)
        //            this.tool = new anra.gef.SelectionTool();
        //        return this.tool;
        //    },
        createPalette: function (id) {
            var i = id + 'Plt';
            var div = document.createElement('div');
            div.setAttribute('id', id + 'Plt');
            div.style.position = 'relative';
            div.style.width = '10%';
            div.style.height = '100%';
            div.style.float = 'left';
            div.style.backgroundColor = '#CCCCCC';
            this.element.appendChild(div);
            return new anra.gef.Palette(i);
        },
        createCanvas: function (id) {
            var i = id + 'Cav';
            var div = document.createElement('div');
            div.setAttribute('id', i);
            div.style.position = 'relative';
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.float = 'left';
            div.style.overflow = 'hidden';
            div.style.background = this.background;
            this.element.appendChild(div);
            return new anra.SVG(i);
        },
        setActiveTool: function (tool) {
            if (this.activeTool == tool) return;

            let old = null;
            if (this.activeTool != null) {
                this.activeTool.deactivate();
                this.activeTool.editor = null;
            }

            old = this.activeTool;
            this.activeTool = tool;
            if (this.activeTool != null) {
                this.activeTool.editor = this;
                this.activeTool.activate();
            }
            this.listenerSupport.fireAll('tool-changed', tool, old);
        },
        getActiveTool: function () {
            return this.activeTool;
        },
        getDefaultTool: function () {
            if (this.defaultTool == null) {
                this.defaultTool = new anra.gef.SelectionTool();
                this.defaultTool.editor = this;
            }
            return this.defaultTool;
        },
        getTopDragTracker: function () {
            if (this.topDragTracker == null)
                this.topDragTracker = this.createTopDragTracker();
            return this.topDragTracker;
        },
        createTopDragTracker: function () {
            return new anra.gef.TopDragTracker(this);
        },
        dispose() {
            anra.Store.remove(this.storeId);
            if (this.element) {
                if (this.canvas.element.parentNode === this.element) {
                    this.element.removeChild(this.canvas.element);
                }
                this.element = null;
            }

            if (this.cmdStack) this.cmdStack.dispose();

            this.rootEditPart.dispose();
            this.rootEditPart.deactivate();
            this.actionRegistry.dispose();
            this.listenerSupport.dispose();
        }
    });


    /**
     * 连线
     * @type {*}
     */
    anra.gef.Line = anra.gef.Figure.extend(anra.svg.Polyline).extend({
        sourceAnchor: null,
        targetAnchor: null,
        router: null,
        _markListener: null,
        setStartMarker: function (marker) {
            this._setMarker('marker-start', marker);
        },
        setEndMarker: function (marker) {
            this._setMarker('marker-end', marker);
        },
        getStartMarker: function () {
            return this['marker-start'];
        },
        getEndMarker: function () {
            return this['marker-end'];
        },
        _setMarker: function (key, marker) {
            var m = this[key];
            if (m == marker) return;
            if (m != null) {
                this.svg.defs.removeChild(m);
                this.removeAttribute(key);
                this.removeRepaintListener(m.repaintListener);
            }
            this[key] = marker;
            if (marker) {
                // if (marker.propertyChanged != null && this.model != null)
                //     this.model.addPropertyListener(marker, marker.propKey);
                this.svg.defs.addChild(marker);
                this.setAttribute(key, 'url(#' + marker.id + ')');
                marker.repaintListener = function (e) {
                    marker.refresh(e);
                };
                this.addRepaintListener(marker.repaintListener);
            }
        },
        dispose: function () {
            this.setStartMarker(null);
            this.setEndMarker(null);
            anra.gef.Figure.prototype.dispose.call(this);
        },
        onPaint: function () {
            
            window.lpainter = window.lpainter || 1;
            window.lpainter++;
            if (this.router != null) this.points = this.router(this);
            var f = this;
            if (this.sourceAnchor != null && this.targetAnchor != null)
                this.setAttribute({
                    d: f.compute()
                });
            this.fireRepaintListener();
        },
        setSourceAnchor: function (anchor) {
            this.sourceAnchor = { ...anchor };
            if (anchor == null)
                return;
            if (this.points == null)
                this.points = [];
            this.points[0] = anchor;
            if (this.points.length > 1)
                this.points[0] = ({
                    x: anchor.x,
                    y: anchor.y
                });
            else
                Util.insert(this.points, {
                    x: anchor.x,
                    y: anchor.y
                });
        },
        setTargetAnchor: function (anchor) {
            this.targetAnchor = { ...anchor };
            if (anchor == null)
                return;
            if (this.points == null)
                this.points = [];
            if (this.points.length > 1)
                this.points[this.points.length - 1] = ({
                    x: anchor.x,
                    y: anchor.y
                });
            else
                this.points.push({
                    x: anchor.x,
                    y: anchor.y
                });
        },
        getStartPoint: function () {
            //return this.sourceAnchor;
            return this.points == null || this.points.length == 0 ? null : this.points[0];
        },
        getEndPoint: function () {
            //return this.targetAnchor;
            return this.points == null || this.points.length == 0 ? null : this.points[this.points.length - 1];
        }
    });
    /**
     * 曲线
     * @type {*|void}
     */
    anra.gef.CurveLine = anra.gef.Line.extend({
        strategy: anra.svg.LineStrategy.CornerCurve
    });

    /**
     * 路径线
     * @type {*|void}
     */
    anra.gef.PathLine = anra.gef.Line.extend({
        points: null,
        tagName: 'path'

    });


    anra.gef.BaseModel = Base_1.extend({
        pls: null,
        props: null,
        _findProps(keys = []) {
            let val = this.props;

            for (let key of keys) {
                if (val == null) throw Error(`${key} value is null or undefine`);
                val = Reflect.get(val, key);
            }

            return val;
        },
        constructor: function () {
            this.props = {};
        },
        /**
         * 输入应当为json
         * @param p
         * @param fire
         */
        setValues: function (p, unfire) {
            for (var key in p) {
                this.set(key, p[key], unfire);
            }
        },
        set(key, value, unfire) {
            if (typeof key === 'string' && key !== '') {
                let key_list = key.split('.'),
                    val = this._findProps(key_list);

                if (this.store) {
                    this.props = this.store.update(
                        key_list.reduceRight(
                            (_tj, key) => ({ [key]: _tj }), value
                        ))
                        .first() || this.props;
                } else {
                    let obj = this.props, i = 0;
                    for (; i < key_list.length - 1; i++) obj = obj[key_list[i]];

                    obj[key_list[i]] = value;
                }

                if (this.pls && !unfire)
                    this.pls.firePropertyChanged(key, val, value);
            }
        },
        /*set: function (key, value, unfire) {
            var o = this.props[key];
  
            if (this.store) {
                var _tj = {};
                _tj[key] = value;
                this.props = this.store.update(_tj).first();
            } else
                this.props[key] = value;
  
            if (this.pls && !unfire)
                this.pls.firePropertyChanged(key, o, value);
        },*/
        get: function (key) {
            return this._findProps(key.split('.'));
        },
        addPropertyListener: function (l, k) {
            if (this.pls == null)
                this.pls = new anra.PropertyListenerSupport();
            this.pls.addPropertyListener(l, k);
        },
        removePropertyListener: function (l, k) {
            if (this.pls != null)
                this.pls.removePropertyListener(l, k);
        },
        hashCode: function () {
            if (this.uuid == null)
                this.uuid = Util.genUUID();
            return this.uuid;
        }
    });

    anra.gef.NodeModel = anra.gef.BaseModel.extend({
        sourceLines: null,
        targetLines: null,
        children: null,
        constructor: function () {
            anra.gef.BaseModel.prototype.constructor.call(this);
            this.sourceLines = new Map();
            this.targetLines = new Map();
            this.children = {};
        },
        hasSourceLine: function (line) {
            if (line instanceof anra.gef.LineModel) {
                return this.sourceLines.has(this.lineId(line.props.id))
            } else {
                return this.sourceLines.has(line);
            }
        },
        hasTargetLine: function (line) {
            if (line instanceof anra.gef.LineModel) {
                return this.targetLines.has(this.lineId(line.get('id')));
            } else {
                return this.targetLines.has(line);
            }
        },
        addSourceLine: function (line) {
            var nId = this.lineId(line.get('id'));
            line.sourceNode = this;
            if (!this.sourceLines.has(nId)) {
                this.sourceLines.set(nId, line);
                if (this.storeId) {
                    if (line.store) {
                        line.store.update(line.props);
                    } else {
                        line.store = anra.Store.get(this.storeId).line.insert(line.props);
                    }
                }

                return true;
            }
            console.log('duplicate line id: ' + line.props.id);
            return false;
        },
        addTargetLine: function (line) {
            var nId = this.lineId(line.get('id'));
            line.targetNode = this;
            if (!this.targetLines.has(nId)) {
                this.targetLines.set(nId, line);
                if (this.storeId) {
                    if (line.store) {
                        line.store.update(line.props);
                    } else {
                        line.store = anra.Store.get(this.storeId).line.insert(line.props);
                    }
                }

                return true;
            }
            console.log('duplicate line id: ' + line.props.id);
            return false;
        },
        getSourceLine: function (id) {
            return this.sourceLines.get(this.lineId(id));
        },
        getTargetLine: function (id) {
            return this.targetLines.get(this.lineId(id));
        },
        lineId: function (id) {
            return this.props.id + '_' + id;
        },
        removeSourceLine: function (line) {
            var l, lk;
            if (line instanceof anra.gef.LineModel)
                lk = this.lineId(line.props.id);
            else
                lk = this.lineId(line);
            l = this.sourceLines.get(lk);
            this.sourceLines.delete(lk);
            if (l != null)
                l.sourceNode = null;
            if (line.store) {
                line.store.update({ source: null });
            }
        },
        removeTargetLine: function (line) {
            var l, lk;
            if (line instanceof anra.gef.LineModel)
                lk = this.lineId(line.get('id'));
            else
                lk = this.lineId(line);
            l = this.targetLines.get(lk);
            this.targetLines.delete(lk);
            if (l != null)
                l.targetNode = null;

            if (line.store) {
                line.store.update({ target: null });
            }
        },
        addChild: function (model, callback) {
            this.children[model.get('id')] = model;
            model.storeId = this.storeId;

            var oldStore = anra.Store.get(this.storeId).node({ id: model.get('id') });
            if (oldStore.first()) {
                console.error('duplicate model : ' + model.get('id'));
                model.store = oldStore.update(model.props);
            } else {
                model.store = anra.Store.get(this.storeId).node.insert(model.props);
            }
            callback && callback(model);
        },
        removeChild: function (model, callback) {
            delete this.children[model.get('id')];
            anra.Store.get(this.storeId, 'node')({ id: model.get('id') }).remove();
            callback && callback(model);
        },
        removeAllChildren: function () {
            for(let model of this.getAllChildren()){
                anra.Store.get(this.storeId, 'node')({ id: model.get('id') }).remove();
            }
            this.children={};
        },
        getChild: function (id) {
            return this.children[id];
        },
        getAllChildren: function () {
            var c = [];
            for (var key in this.children) {
                c.push(this.children[key]);
            }
            return c;
        },
        equals: function (o) {
            return this == o || this.props.id == o.props.id;
        }
    });

    anra.gef.ContentModel = anra.gef.NodeModel.extend({});

    anra.gef.LineModel = anra.gef.BaseModel.extend({
        equals: function (o) {
            return this == o || this.props.id == o.props.id;
        }
    });

    anra.gef.EditPartListener = Base_1.extend({
        class: 'anra.gef.EditPartListener',
        childAdded: function (child, index) {
        },
        partActivated: function (editPart) {
        },
        partDeactivated: function (editpart) {
        },
        removingChild: function (child, index) {
        },
        selectedStateChanged: function (editPart) {
        }
    });

    anra.FigureUtil = {
        createGhostFigure: function (editPart) {
            var ghost = editPart.createFigure();
            function oncreated() {
                editPart.refreshVisual.call({
                    figure: ghost,
                    model: editPart.model
                });
            }

            if (ghost.oncreated != null) {
                var oldHook = ghost.oncreated;
                ghost.oncreated = function () {
                    oldHook.call(this);
                    oncreated();
                };
            } else {
                ghost.oncreated = oncreated;
            }

            /*ghost.oncreated = function () {
                editPart.refreshVisual.call({
                    figure: ghost,
                    model: editPart.model
                });
            };*/

            if (editPart instanceof anra.gef.LineEditPart) {
                ghost.setSourceAnchor(editPart.figure.sourceAnchor);
                ghost.setTargetAnchor(editPart.figure.targetAnchor);
                if (editPart.figure.points != null) {
                    ghost.points = editPart.figure.points.map(({ x, y }) => ({ x, y }));
                }
            }

            ghost.setOpacity(0.5);
            ghost.disableEvent();
            return ghost;
        },
        createGhostFigureWithLine(editPart) {
            const isNode = editPart instanceof anra.gef.NodeEditPart;

            if (!isNode) return null;

            let nodeGhost = anra.FigureUtil.createGhostFigure(editPart);

            //No Lines
            if (editPart.getModelSourceLines().length + editPart.getModelTargetLines().length === 0) {
                return {
                    node: nodeGhost,
                    sourceLines: [],
                    targetLines: [],
                };
            }

            let sourceLineGhost = editPart.sConns.map(linePart => {
                let ghost = anra.FigureUtil.createGhostFigure(linePart);
                //实际
                ghost.model = linePart.model;
                return ghost;
            }),
                targetLineGhost = editPart.tConns.map(linePart => {
                    let ghost = anra.FigureUtil.createGhostFigure(linePart);
                    ghost.model = linePart.model;
                    return ghost;
                });

            return {
                node: nodeGhost,
                sourceLines: sourceLineGhost,
                targetLines: targetLineGhost,
            }
        }
    };

    const handleExtend = {
        editPart: null,
        // replacedByHostOnEvnet: false, // 触发事件是否被host代替
        constructor: function (editPart) {
            this.base();
            this.editPart = editPart;
            this.ready = true;
        },

        createContent: function (s) {
            let figure = this.editPart.getFigure();

            this.listeners = {
                repaint: f => this.refreshLocation(f),
                visible: v => this.refreshVisible(v),
                handler: fn => fn(this)
            };

            figure.addRepaintListener(this.listeners.repaint);
            figure.addVisibleListener(this.listeners.visible);
            figure.on('handler', this.listeners.handler)

            this.refreshLocation(figure);
            this.refreshVisible(figure.visible);
            this.initListeners();
        },
        dispose: function () {
            let figure = this.editPart.getFigure();

            figure.removeRepaintListener(this.listeners.repaint);
            figure.removeVisibleListener(this.listeners.visible);
            figure.off('handler', this.listeners.handler)
            anra.svg.Control.prototype.dispose.call(this);
        },
        getDragTracker: function () {
            return this;
        },
        initListeners: function () {
            var _dt = this.editPart.getRoot().editor.getTopDragTracker();
            var self = this;
            self.evetHost = self.evetHost || self;
            /*function eventHost() {
                return self.replacedByHostOnEvnet ? self.editPart : self
            }*/
            this.on(anra.EVENT.MouseDown, function (e) {
                _dt.mouseDown(e, self.evetHost);
            });
            this.on(anra.EVENT.MouseIn, function (e) {
                _dt.mouseIn(e, self.evetHost);
            });
            this.on(anra.EVENT.MouseOut, function (e) {
                _dt.mouseOut(e, self.evetHost);
            });
            this.on(anra.EVENT.MouseClick, function (e) {
                _dt.mouseClick(e, self.evetHost);
            });
            this.on(anra.EVENT.DragStart, function (e) {
                _dt.dragStart(e, self.evetHost);
            });
            this.on(anra.EVENT.DragEnd, function (e) {
                _dt.dragEnd(e, self.evetHost);
            });
            this.on(anra.EVENT.MouseDrag, function (e) {
                _dt.mouseDrag(e, self.evetHost);
            });
            this.on(anra.EVENT.MouseMove, function (e) {
                _dt.mouseMove(e, self.evetHost);
            });
            this.on(anra.EVENT.MouseUp, function (e) {
                _dt.mouseUp(e, self.evetHost);
            });
            this.on(anra.EVENT.Dropped, function (e) {
                _dt.dragDropped(e, self.evetHost);
            });
        },
        refreshLocation: function (figure) {

        },
        refreshVisible: Util.noop
    };
    anra.Handle = anra.svg.Control.extend(handleExtend);
    anra.Handle.getExtend = function () {
        return handleExtend
    };

    anra.NORTH = "n";
    anra.SOUTH = "s";
    anra.EAST = "e";
    anra.WEST = "w";
    anra.CENTER = "c";
    anra.NORTH_EAST = "ne";
    anra.NORTH_WEST = "nw";
    anra.SOUTH_EAST = "se";
    anra.SOUTH_WEST = "sw";

    /**
     * Created by weiyajun on 2016/8/9 0009.
     */

    var Control$1 = anra.svg.Control;

    const LineHandle = anra.Handle.extend(anra.svg.Circle).extend({
        constructor: function (editPart, type, style) {
            Control$1.prototype.constructor.call(this);
            this.type = type;
            this.editPart = editPart;

            if (style) {
                this.setStyle(style);
            }
        },
        initProp: function () {
            var anchor;
            if (this.type == REQ_RECONNECT_SOURCE) {
                anchor = this.editPart.getSourceAnchor();
            } else if (this.type == REQ_RECONNECT_TARGET) {
                anchor = this.editPart.getTargetAnchor();
            } else {
                throw 'error type';
            }

            this.setOpacity(1);

            this.setAttribute({
                fill: 'white',
                stroke: 'blue',

            });
            this.setStyle({ 'cursor': 'move' });

            this.setBounds({
                x: anchor.x,
                y: anchor.y,
                width: 10
            }, true);

        },
        refreshLocation: function (figure) {
            var points = figure.points;
            var p;
            if (this.type == REQ_RECONNECT_SOURCE) {
                p = points[0];
            } else if (this.type == REQ_RECONNECT_TARGET) {
                p = points[points.length - 1];
            }
            var w = 10;

            this.setBounds({ x: p.x, y: p.y, width: w, height: w }, true);
        },
        dragStart: function (e) {
            if (e.prop.drag == this) {
                var tool = new anra.gef.LinkLineTool();
                tool.linePart = this.editPart;
                tool.type = this.type;
                this.editPart.getRoot().editor.setActiveTool(tool);
                this.editPart.getRoot().setSelection(this.editPart);
                return true;
            }
        }
    });

    const ResizeHandle = Control$1.extend({
        //const
        defaultWidth: 4,
        defaultHeight: 4,
        offset: 2,
        //data
        editPart: null,
        direction: null,
        constructor: function (editPart, direction) {
            Control$1.prototype.constructor.call(this);
            this.editPart = editPart;
            this.direction = direction;
            var model = editPart.model;
            if (model != null) {
                var figure = editPart.getFigure();
                this.setLocator({
                    x: figure.getAttr('x', parseFloat),
                    y: figure.getAttr('y', parseFloat),
                    width: figure.getAttr('width', parseFloat),
                    height: figure.getAttr('height', parseFloat)
                });
                this.setStyle({
                    'stroke': '#000000',
                    'fill': '#FFFFFF'
                });
            }

        },

        setLocator: function (bounds) {
            var width = bounds.width;
            var height = bounds.height;
            var x = bounds.x - this.offset;
            var y = bounds.y - this.offset;

            var cursorStyle;
            cursorStyle = this.direction + '-resize';
            if (this.direction.search('e') != -1) {
                x += width;
            }
            if (this.direction.search('(w|e)') == -1) {
                x += width / 2;
            }
            if (this.direction.search('s') != -1) {
                y += height;
            }
            if (this.direction.search('(n|s)') == -1) {
                y += height / 2;
            }
            this.setBounds({
                x: x,
                y: y,
                width: this.defaultWidth,
                height: this.defaultHeight
            }, true);
            this.setStyle({
                'cursor': cursorStyle
            });
        },
        refreshLocation: function (f) {
            this.setLocator({
                x: f.getAttr('x', parseFloat),
                y: f.getAttr('y', parseFloat),
                width: f.getAttr('width', parseFloat),
                height: f.getAttr('height', parseFloat)
            }, true);
        },
        getResizeTracker: function (direction) {
            return anra.gef.ResizeTracker.getInstance(direction);
        }
    });

    const ResizeTracker = Base_1.extend({
        status: null,
        xStart: 0,
        yStart: 0,
        oldConstraint: null,
        mouseDown: function (me, editPart) {
            this.status = me.type;
        },
        dragStart: function (me, editPart) {
            this.ondrag = true;
            this.status = me.type;
            this.xStart = me.x;
            this.yStart = me.y;
            this.oldConstraint = {
                x: editPart.model.get('bounds')[0],
                y: editPart.model.get('bounds')[1],
                width: editPart.model.get('bounds')[2],
                height: editPart.model.get('bounds')[3]
            };

        },
        dragEnd: function (me, editPart) {
            if (!this.ondrag) return;
            this.status = me.type;
            editPart.editor.execute(new anra.gef.RelocalCommand(editPart, this.oldConstraint, {
                x: editPart.model.get('bounds')[0],
                y: editPart.model.get('bounds')[1],
                width: editPart.model.get('bounds')[2],
                height: editPart.model.get('bounds')[3]
            }));
            anra.gef.DragTracker.prototype.dragEnd.call({ host: editPart }, me, editPart);
            this.ondrag = false;
        },
        mouseUp: function (me, editPart) {
            this.status = me.type;
        }
    });

    ResizeTracker.getInstance = function (direction) {
        var tracker = trackPool.get(direction);
        if (tracker == null)
            return new anra.gef.ResizeTracker();
        return tracker;
    };


    const NorthWestTracker = ResizeTracker.extend({
        mouseDrag: function (me, editPart) {
            this.status = me.type;
            editPart.model.get('bounds')[0] = this.oldConstraint.x + (me.x - this.xStart);
            editPart.model.get('bounds')[1] = this.oldConstraint.y + (me.y - this.yStart);
            editPart.model.get('bounds')[2] = this.oldConstraint.width - (me.x - this.xStart);
            editPart.model.get('bounds')[3] = this.oldConstraint.height - (me.y - this.yStart);
            editPart.refresh();
        }
    });
    const NorthTracker = ResizeTracker.extend({
        mouseDrag: function (me, editPart) {
            this.status = me.type;
            editPart.model.get('bounds')[1] = this.oldConstraint.y + (me.y - this.yStart);
            editPart.model.get('bounds')[3] = this.oldConstraint.height - (me.y - this.yStart);
            editPart.refresh();
        }
    });
    const NorthEastTracker = ResizeTracker.extend({
        mouseDrag: function (me, editPart) {
            this.status = me.type;
            editPart.model.get('bounds')[1] = this.oldConstraint.y + (me.y - this.yStart);
            editPart.model.get('bounds')[2] = this.oldConstraint.width + (me.x - this.xStart);
            editPart.model.get('bounds')[3] = this.oldConstraint.height - (me.y - this.yStart);
            editPart.refresh();
        }
    });

    const WestTracker = ResizeTracker.extend({
        mouseDrag: function (me, editPart) {
            this.status = me.type;
            editPart.model.get('bounds')[0] = this.oldConstraint.x + (me.x - this.xStart);
            editPart.model.get('bounds')[2] = this.oldConstraint.width - (me.x - this.xStart);
            editPart.refresh();
        }
    });
    const EastTracker = ResizeTracker.extend({
        mouseDrag: function (me, editPart) {
            this.status = me.type;
            editPart.model.get('bounds')[2] = this.oldConstraint.width + (me.x - this.xStart);
            editPart.refresh();
        }
    });

    const SouthWestTracker = ResizeTracker.extend({
        mouseDrag: function (me, editPart) {
            this.status = me.type;
            editPart.model.get('bounds')[0] = this.oldConstraint.x + (me.x - this.xStart);
            editPart.model.get('bounds')[2] = this.oldConstraint.width - (me.x - this.xStart);
            editPart.model.get('bounds')[3] = this.oldConstraint.height + (me.y - this.yStart);
            editPart.refresh();
        }
    });
    const SouthTracker = ResizeTracker.extend({
        mouseDrag: function (me, editPart) {
            this.status = me.type;
            editPart.model.get('bounds')[3] = this.oldConstraint.height + (me.y - this.yStart);
            editPart.refresh();
        }
    });
    const SouthEastTracker = ResizeTracker.extend({
        mouseDrag: function (me, editPart) {
            this.status = me.type;
            editPart.model.get('bounds')[2] = this.oldConstraint.width + (me.x - this.xStart);
            editPart.model.get('bounds')[3] = this.oldConstraint.height + (me.y - this.yStart);
            editPart.refresh();
        }
    });


    const trackPool = new Map();
    trackPool.set(anra.NORTH, new NorthTracker());
    trackPool.set(anra.SOUTH, new SouthTracker());
    trackPool.set(anra.SOUTH_EAST, new SouthEastTracker());
    trackPool.set(anra.SOUTH_WEST, new SouthWestTracker());
    trackPool.set(anra.NORTH_WEST, new NorthWestTracker());
    trackPool.set(anra.NORTH_EAST, new NorthEastTracker());
    trackPool.set(anra.EAST, new EastTracker());
    trackPool.set(anra.WEST, new WestTracker());

    const TextHandle = anra.Handle.extend(anra.svg.Text).extend({
        refreshLocation: function (figure) {
            this.bounds = { x: figure.bounds.x, y: figure.bounds.y + figure.bounds.width };
        }
    });

    const TextConstructor = anra.svg.Control.extend(anra.svg.Text);
    const TextArea = anra.svg.Group.extend(anra.Handle.getExtend()).extend({
        _textAnchor: null,
        _baseline: null,
        lineSpacing: 3,
        setText(...texts) {
            if (this.owner != null) {
                let children = this.owner.childNodes;
                children.forEach(child => this.owner.removeChild(child));

                if (texts[0] instanceof Array) {
                    texts = texts[0];
                }

                texts.forEach((text, index) => {
                    let child = this.children[index];
                    if (child != null) {
                        if (child.text !== text) {
                            child.setText(text);
                        }
                    } else {
                        this.addNewRow(text);
                    }
                });

                // 移除原来多余的
                if (texts.length < this.children.length) {
                    for (let i = texts.length; i < this.children.length; i++) {
                        this.removeChild(this.children[i]);
                    }
                }
            }
        },
        setTextAttribute(a, v) {
            Util.apply(this._textAttr, a, v);
            this.children.forEach(child => {
                child.setAttribute(a, v);
            });
        },
        initCommon: anra.svg.Control.prototype.initCommon,
        init() {
            this.children = [];
            this._textAttr = {};
        },
        applyBounds() {
            let dy = Util.fontHeight(this.svg) + this.lineSpacing;

            this.children.forEach((child, index) => {
                child.setBounds(this.bounds);
                child.setAttribute('dy', index * dy);
            });
        },
        refreshLocation(figure) {
            this.bounds = { x: figure.bounds.x, y: figure.bounds.y + figure.bounds.width };
        },
        addNewRow(text) {
            let newText = new TextConstructor();

            newText.setText(text);
            newText.ready = true;
            newText.setAttribute(this._textAttr);

            this.addChild(newText);
        }
    });

    var Handles = {
        LineHandle,
        ResizeHandle,
        ResizeTracker,
        NorthEastTracker,
        NorthTracker,
        NorthWestTracker,
        WestTracker,
        SouthEastTracker,
        SouthTracker,
        SouthWestTracker,
        EastTracker,
        TextHandle,
        TextArea
    };

    /**
     * Created with JetBrains WebStorm.
     * User: Caiyu
     * Date: 16-7-20
     * Time: 上午9:45
     */

    /**
     * 连线模式策略，展示选中线的可拖拽点，展示所有节点的可连接点，只能安装在RootEditPart上
     * @type {*}
     */
    const LinkMod = {

        /**
         * 激活连线模式，展示相关UI
         */
        showSourceFeedback(req) {
            if (REQ_CONNECTION_MOD == req.type) {
                /* 遍历所有子EditPart，展示可连接点UI，由于每个节点的性质不一样，可连接点的样式由各个节点自己负责 */
                var editParts = this.getHost().children;
                var childPolicy;
                if (editParts != null) {
                    for (var i = 0; i < editParts.length; i++) {
                        childPolicy = editParts[i].getConnectionPolicy();
                        childPolicy && childPolicy.showSourceFeedback(req);
                    }
                }
            }
        },
        /**
         * 反激活连线模式，消除相关UI
         */
        eraseSourceFeedback(req) {
            if (REQ_CONNECTION_MOD == req.type) {
                var editParts = this.getHost().children;
                var childPolicy;
                if (editParts != null) {
                    for (var i = 0; i < editParts.length; i++) {
                        childPolicy = editParts[i].getConnectionPolicy();
                        childPolicy && childPolicy.eraseSourceFeedback(req);
                    }
                }
            }
        }

    };

    /**
     * 布局策略，决定了拖拽节点的样式和结果，只能安装在RootEditPart上
     * @type {*}
     */
    const Layout$1 = {
        sizeOnDropFeedback: null,
        ID: 'layoutPolicy',
        listener: null,
        feedbackMap: null,
        constructor() {
            this.feedbackMap = new Map();
        },
        refreshFeedback(feedback, request, offsetX = 0, offsetY = 0) {
            if (feedback != null) {
                feedback.setBounds({
                    x: request.event.x + offsetX,
                    y: request.event.y + offsetY
                });
            }
        },
        activate() {
            this.setListener(this.createListener());
            this.decorateChildren();
        },
        createChildEditPolicy(child) {
            // TODO
        },
        eraseLayoutTargetFeedback(request) {
            this.editParts = null;
            for (let f of this.feedbackMap.values()) {
                this.removeFeedback(f);
            }

            this.feedbackMap.clear();
        },
        getAddCommand(request) {
            return null
        },
        getCloneCommand(request) {
            return null
        },
        showLayoutTargetFeedback(request) {
            let feedback;
            let editParts = this.editParts = this.getLayoutEditParts(request);
            if (editParts instanceof Array) {
                let ox = request.target.bounds.x;
                let oy = request.target.bounds.y;
                // node
                this.editParts.forEach(ep => {
                    feedback = this.getFeedback(ep);
                    if (feedback != null) {
                        this.refreshFeedback(feedback, request, ep.figure.bounds.x - ox, ep.figure.bounds.y - oy);
                    }
                });

            } else if (editParts instanceof anra.gef.NodeEditPart && (editParts.dragTracker || request.type === REQ_CREATE)) {
                feedback = this.getFeedback(editParts);
                feedback.offsetX = request.event.offsetX || feedback.offsetX;
                feedback.offsetY = request.event.offsetY || feedback.offsetY;
                this.refreshFeedback(feedback, request, feedback.offsetX, feedback.offsetY);
            }
        },
        getLayoutEditParts(request) {
            if (REQ_CREATE === request.type) {
                var creationTool = request.target;
                return creationTool.getEditPart(this.getHost())
            } else if (REQ_MOVE === request.type || REQ_DRAG_START === request.type) {
                var selection = this.getHost().getRoot().selection;
                if (selection == null) return null
                if (selection.figure === request.target) { return selection }
                /* 验证已选节点里包含拖拽目标节点 */
                if (selection instanceof Array) {
                    var s = [];
                    var valid;
                    for (var i = 0, len = selection.length; i < len; i++) {
                        if (selection[i].figure === request.target) {
                            Util.insert(s, selection[i]);
                            valid = true;
                        } else {
                            s.push(selection[i]);
                        }
                    }
                    if (valid) return s
                }
                //            }
            }
            return null
        },
        getFeedback(ep) {
            if (!this.feedbackMap.has(ep.model)) {
                let ghost = this.createFeedback(ep);
                this.addFeedback(ghost);
                this.feedbackMap.set(ep.model, ghost);

                return ghost
            }
            return this.feedbackMap.get(ep.model)
        },
        createFeedback(ep) {
            return anra.FigureUtil.createGhostFigure(ep);
        },
        getMoveChildrenCommand(request) {
            // TODO
        },
        getOrphanChildrenCommand(request) {
            return null
        },
        getDeleteDependantCommand(request) {
            return null
        },
        getMoveCommand(request) {
            var target = this.editParts;
            if (target instanceof anra.gef.NodeEditPart && target.dragTracker) {
                var feedback = this.getFeedback(target);
                return this.movecmd(target, request, feedback.offsetX, feedback.offsetY)
            } else if (target instanceof Array) {
                var cmd, offx, offy, ox, oy;
                if (request.target.bounds == null) {
                    ox = 0;
                    oy = 0;
                } else {
                    ox = request.target.bounds.x;
                    oy = request.target.bounds.y;
                }
                for (var i = 0; i < target.length; i++) {
                    if (target[i].dragTracker == null) return null
                    offx = target[i].figure.bounds.x - ox;
                    offy = target[i].figure.bounds.y - oy;
                    cmd = cmd == null
                        ? this.movecmd(target[i], request, offx, offy)
                        : cmd.chain(this.movecmd(target[i], request, offx, offy));
                }
                return cmd
            }
        },
        movecmd(target, request, offx, offy) {
            return new anra.gef.RelocalCommand(target, {
                x: target.getFigure().getBounds().x,
                y: target.getFigure().getBounds().y
            },
                {
                    x: request.event.x + (offx || 0),
                    y: request.event.y + (offy || 0)
                })
        },
        getCreateCommand(request) {
            var model = request.event.prop.drag.model,
                type = model.get('type'),
                b = model.get('bounds'), parent = request.editPart;

            while (parent && (parent.config.children == null || parent.config.children[type] == null)) {
                parent = parent.parent;
            }

            if (parent == null) {
                return null
            }

            var pb = parent instanceof anra.gef.RootEditPart ? [0, 0] : parent.model.get('bounds');

            model.set('bounds', [request.event.x - pb[0], request.event.y - pb[1], b[2], b[3]]);
            return new anra.gef.CreateNodeCommand(parent, model)
        },
        createListener() {
            var listener = new anra.gef.EditPartListener();
            var f = this;
            listener.childAdded = function (child, index) {
                f.decorateChild(child);
            };
            return listener
        },
        deactivate() {
            if (this.sizeOnDropFeedback != null) {
                this.removeFeedback(this.sizeOnDropFeedback);
                this.sizeOnDropFeedback = null;
            }
            this.setListener(null);
        },
        decorateChild(child) {
            var policy = this.createChildEditPolicy(child);
            if (policy != null) { child.installEditPolicy(PRIMARY_DRAG_ROLE, policy); }
        },
        decorateChildren() {
            var children = this.getHost().children;
            for (var i = 0, len = children.length; i < len; i++) { this.decorateChild(children[i]); }
        },
        eraseTargetFeedback(request) {
            if (REQ_ADD == request.type ||
                REQ_MOVE == request.type ||
                REQ_RESIZE_CHILDREN == request.type ||
                REQ_CREATE == request.type ||
                REQ_CLONE == request.type) { this.eraseLayoutTargetFeedback(request); }

            if (REQ_CREATE == request.type) { this.eraseSizeOnDropFeedback(request); }
        },
        getCommand(request) {
            if (REQ_DELETE_DEPENDANT == request.type) { return this.getDeleteDependantCommand(request) }
            if (REQ_ADD == request.type) { return this.getAddCommand(request) }
            if (REQ_ORPHAN_CHILDREN == request.type) { return this.getOrphanChildrenCommand(request) }
            if (REQ_MOVE_CHILDREN == request.type) { return this.getMoveChildrenCommand(request) }
            if (REQ_MOVE == request.type) { return this.getMoveCommand(request) }
            if (REQ_CLONE == request.type) { return this.getCloneCommand(request) }
            if (REQ_CREATE == request.type) { return this.getCreateCommand(request) }
            return null
        },
        getLayoutContainer() {
            return this.getHostFigure()
        },
        showSizeOnDropFeedback(request) {
        },
        eraseSizeOnDropFeedback(request) {
            if (this.sizeOnDropFeedback != null) {
                this.removeFeedback(this.sizeOnDropFeedback);
                this.sizeOnDropFeedback = null;
            }
        },
        createSizeOnDropFeedback(createRequest) {
            //        var shadow = anra.FigureUtil.createGhostFigure(this.getHost());
            //        this.addFeedback(shadow);
            return null
        },
        getSizeOnDropFeedback(createRequest) {
            if (createRequest != null) {
                if (this.sizeOnDropFeedback == null) { this.sizeOnDropFeedback = this.createSizeOnDropFeedback(createRequest); }
                return this.sizeOnDropFeedback
            }
        },
        getTargetEditPart(request) {
            if (REQ_ADD == request.type ||
                REQ_MOVE == request.type ||
                REQ_CREATE == request.type ||
                REQ_CLONE == request.type) { return this.getHost() }
            return null
        },
        setListener(listener) {
            if (this.listener != null) { this.getHost().removeEditPartListener(this.listener); }
            this.listener = listener;
            if (this.listener != null) { this.getHost().addEditPartListener(this.listener); }
        },
        showTargetFeedback(request) {
            if (REQ_ADD == request.type ||
                REQ_CLONE == request.type ||
                REQ_MOVE == request.type ||
                REQ_RESIZE_CHILDREN == request.type ||
                REQ_CREATE == request.type ||
                REQ_DRAG_START == request.type) { this.showLayoutTargetFeedback(request); }

            if (REQ_CREATE == request.type) {
                //            if (request.getSize() != null) {
                this.showSizeOnDropFeedback(request);
                //            }
            }
        },
        undecorateChild(child) {
            child.removeEditPolicy(PRIMARY_DRAG_ROLE);
        },
        undecorateChildren() {
            var children = this.getHost().children;
            for (var i = 0; i < children.length; i++) { this.undecorateChild(children[i]); }
        }
    };

    const Conection = {
        deactivate() {
            if (this.sourceAnchor != null) {
                this.getFeedbackLayer().removeChild(this.sourceAnchor);
                this.sourceAnchor = null;
            }

            if (anra.gef.ConnectionPolicy.targetAnchorFeedback != null) {
                this.removeFeedback(anra.gef.ConnectionPolicy.targetAnchorFeedback);
                anra.gef.ConnectionPolicy.targetAnchorFeedback = null;
            }
        },
        showAnchors() {
            if (this.anchorHandles == null) { this.anchorHandles = []; }
            var anchors = this.getHost().getAnchors();
            if (anchors != null) {
                for (var i = 0; i < anchors.length; i++) {
                    var h = this.createAttarchHandle(anchors[i]);
                    this.anchorHandles.push(h);
                    this.addHandle(h);
                }
            }
        },
        eraseAnchors() {
            if (this.anchorHandles != null) {
                for (var i = 0; i < this.anchorHandles.length; i++) {
                    this.removeHandle(this.anchorHandles[i]);
                }
                this.anchorHandles = null;
            }
        },
        createAttarchHandle(anchor) {
            if (anchor == null) return null
            var handle = anra.Handle.extend(anra.svg.Circle);
            handle = new handle(this.getHost());
            handle.setBounds({
                x: anchor.x,
                y: anchor.y,
                width: 5
            }, true);
            handle.setAttribute({
                fill: 'blue'
            });
            handle.setOpacity(0.5);
            return handle
        },
        showSourceFeedback(req) {
            if (REQ_CONNECTION_START == req.type || REQ_RECONNECT_SOURCE == req.type) {
                var anchor = this.getHost().getSourceAnchor(req);
                this.refreshSourceAnchorFeedback(anchor);
            } else if (REQ_CONNECTION_MOD == req.type) {
                this.showAnchors(req);
            }
        },
        eraseSourceFeedback(req) {
            if (REQ_CONNECTION_MOD == req.type) {
                this.eraseAnchors(req);
            }
            if (this.sourceAnchor != null) {
                this.getFeedbackLayer().removeChild(this.sourceAnchor);
                this.sourceAnchor = null;
            }
        },
        showTargetFeedback(req) {
            if (REQ_RECONNECT_TARGET == req.type || REQ_CONNECTION_END == req.type) {
                var anchor = this.getHost().getTargetAnchor(req);
                this.refreshTargetAnchorFeedback(anchor);
            }
        },
        eraseTargetFeedback(req) {
            if (anra.gef.ConnectionPolicy.targetAnchorFeedback != null) {
                this.removeFeedback(anra.gef.ConnectionPolicy.targetAnchorFeedback);
                anra.gef.ConnectionPolicy.targetAnchorFeedback = null;
            }
        },
        refreshTargetAnchorFeedback(anchor) {
            if (anra.gef.ConnectionPolicy.targetAnchorFeedback == null) {
                anra.gef.ConnectionPolicy.targetAnchorFeedback = this.createTargetAnchorFeedback();
                this.addFeedback(anra.gef.ConnectionPolicy.targetAnchorFeedback);
            }
            anra.gef.ConnectionPolicy.targetAnchorFeedback.setBounds({ x: anchor.x, y: anchor.y, width: 10, height: 10 });
        },
        refreshSourceAnchorFeedback(anchor) {
            if (this.sourceAnchor == null) {
                this.sourceAnchor = this.createSourceAnchorFeedback();
                this.getFeedbackLayer().addChild(this.sourceAnchor);
            }

            if (anchor) {
                this.sourceAnchor.setBounds({ x: anchor.x, y: anchor.y, width: 15, height: 15 });
            }
        },
        createSourceAnchorFeedback() {
            var Circle = anra.svg.Control.extend(anra.svg.Circle);
            Circle = new Circle();
            Circle.setAttribute({
                'fill-opacity': 0,
                'stroke-opacity': 0.8,
                'stroke': 'green',
                'stroke-width': 5
            });
            return Circle
        },
        createTargetAnchorFeedback() {
            var Rect = anra.svg.Control.extend(anra.svg.Circle);
            Rect = new Rect();
            Rect.setAttribute({
                fill: 'yellow'
            });
            Rect.setOpacity(0.5);
            return Rect
        },
        getCommand(req) {
            if (req.type == REQ_RECONNECT_TARGET) {
                return this.getReconnectTargetCommand(req)
            } else if (req.type == REQ_RECONNECT_SOURCE) {
                return this.getReconnectSourceCommand(req)
            } else if (req.type == REQ_CONNECTION_START) {
                return this.getCreateConnectionCommand(req)
            } else if (req.type == REQ_CONNECTION_END) {
                return this.getConnectionCompleteCommand(req)
            }
        },
        getReconnectTargetCommand(req) {
            var cmd = new anra.gef.ReconnectTargetCommand();
            cmd.line = req.line;
            cmd.terminal = req.anchor.id;
            cmd.target = this.getHost();
            return cmd
        },
        getReconnectSourceCommand(req) {
            var cmd = new anra.gef.ReconnectSourceCommand();
            cmd.line = req.line;
            cmd.terminal = req.anchor.id;
            cmd.source = this.getHost();
            return cmd
        },
        getCreateConnectionCommand(req) {
            var cmd = new anra.gef.CreateLineCommand();
            cmd.line = new anra.gef.LineModel();
            if (req.model) { cmd.line.setValues(req.model.props); }
            cmd.line.set('id', Util.genUUID());
            cmd.line.set('exit', req.anchor.id);
            cmd.rootEditPart = this.getHost().getRoot();
            cmd.sourceId = this.getHost().model.get('id');
            cmd.line.set('source', cmd.sourceId);
            return cmd
        },
        getConnectionCompleteCommand(req) {
            var cmd = req.command;
            if (cmd == null) return null
            cmd.targetId = this.getHost().model.get('id');
            cmd.line.set('target', cmd.targetId);
            cmd.line.set('entr', req.anchor.id);
            return cmd
        }
    };

    /**
     * 选中节点策略
     * @type {*}
     */
    const Selection = {
        _selected: false,
        handles: [],
        class: 'selection policy',
        selectionListener: null,
        activate() {
            this.addSelectionListener();
        },
        deactivate() {
            this.removeSelectionHandles();
            this.removeSelectionListener();
        },
        validatePolicy() {
            if (this.handles.length > 0) {
                for (var i = 0; i < this.handles.length; i++) {
                    this.handles[i].refreshLocation(this.getHostFigure());
                }
            }
        },
        addSelectionListener() {
            var policy = this;
            var SelectionEditPartListener = anra.gef.EditPartListener.extend({
                selectedStateChanged(editPart) {
                    switch (editPart.getSelected()) {
                        case SELECTED_NONE:
                            if (policy._selected) {
                                policy.hideSelection();
                                policy.unselected(editPart);
                                policy._selected = false;
                            }
                            break
                        case SELECTED:
                        case SELECTED_PRIMARY:
                            if (!policy._selected) {
                                policy.showPrimarySelection();
                                policy.selected(editPart);
                                policy._selected = true;
                            }
                            break
                        default:
                    }
                }
            });
            this.selectionListener = new SelectionEditPartListener();
            this.getHost().addEditPartListener(this.selectionListener);
        },
        unselected(editPart) {
        },
        selected(editPart) {
        },
        removeSelectionListener() {
            this.getHost().removeEditPartListener(this.selectionListener);
        },
        showPrimarySelection() {
            if (this.handles == null || Util.isEmpty(this.handles)) { this.addSelectionHandles(); } else {
                for (var i = 0; i < this.handles.length; i++) {
                    this.handles[i].refreshLocation(this.getHost().figure);
                    this.handles[i].setVisible(true);
                }
            }
        },
        hideSelection() {
            if (this.handles == null || Util.isEmpty(this.handles)) {
                return
            }
            for (var i = 0; i < this.handles.length; i++) {
                this.handles[i].setVisible(false);
            }
        },
        addSelectionHandles() {
            this.removeSelectionHandles();
            this.handles = this.createSelectionHandles();
            if (this.handles != null) {
                for (var i = 0; i < this.handles.length; i++) {
                    this.getHandleLayer().addChild(this.handles[i]);
                }
            }
        },
        removeSelectionHandles() {
            if (Util.isEmpty(this.handles)) {
                return
            }
            if (this.handles != null) {
                for (var i = 0; i < this.handles.length; i++) {
                    this.getHandleLayer().removeChild(this.handles[i]);
                }
            }
            this.handles = [];
        },
        createSelectionHandles(selection) {
            return []
        }
    };

    const LineSelection = {
        /* 保证selected与unselected成对出现 */
        style: { stroke: 'red' },
        selected() {
            if (this.color == null) {
                this.color = {};
                Object.keys(this.style)
                    .forEach(key => this.color[key] = this.getHostFigure().getStyle(key));

                this.selected = () => this.getHostFigure().setStyle(this.style);
            }
            this.getHostFigure().setStyle(this.style);
            this.getHostFigure().paint();
        },
        unselected() {
            this.getHostFigure().setStyle(this.color);
            this.getHostFigure().paint();
        },
        createSelectionHandles() {
            var handle = Handles.LineHandle;
            return [new handle(this.getHost(), REQ_RECONNECT_SOURCE), new handle(this.getHost(), REQ_RECONNECT_TARGET)]
        }
    };

    const ResizableEdit = {
        class: 'resize policy',
        createSelectionHandles() {
            var handles = [];
            var editPart = this.getHost();
            handles.push(new Handles.ResizeHandle(editPart, anra.NORTH));
            handles.push(new Handles.ResizeHandle(editPart, anra.SOUTH));
            handles.push(new Handles.ResizeHandle(editPart, anra.EAST));
            handles.push(new Handles.ResizeHandle(editPart, anra.WEST));
            handles.push(new Handles.ResizeHandle(editPart, anra.NORTH_EAST));
            handles.push(new Handles.ResizeHandle(editPart, anra.NORTH_WEST));
            handles.push(new Handles.ResizeHandle(editPart, anra.SOUTH_EAST));
            handles.push(new Handles.ResizeHandle(editPart, anra.SOUTH_WEST));
            return handles
        }

    };

    const Transition = {
        HOOKS: [
            'enterOfSelected',
            'enterOfnoSelected',
            'moveOfSelected',
            'moveOfnoSelected',
            'leaveOfSelected',
            'leaveOfnoSelected',
            'changeOfSelected',
            'changeOfnoSelected'
        ],
        isTransition: false,
        activate() {
            this.inlistener = () => this._mouseIn();
            this.outlistener = () => this._mouseOut();
            this.movelistener = () => this._mouseMove();
            this.getHostFigure().on('mousein', this.inlistener);
            this.getHostFigure().on('mouseout', this.outlistener);
            this.getHostFigure().on('mousemove', this.movelistener);
            this.addSelectionListener();
        },
        deactivate() {
            this.getHostFigure().off('mousein', this.inlistener);
            this.getHostFigure().off('mouseout', this.outlistener);
            this.getHostFigure().off('mousemove', this.movelistener);
            this.removeSelectionListener();
        },
        addSelectionListener() {
            this.selectionListener = new anra.gef.EditPartListener();
            this.selectionListener.selectedStateChanged = editPart => this._stateChange(editPart);
            this.getHost().addEditPartListener(this.selectionListener);
        },
        removeSelectionListener() {
            this.getHost().removeEditPartListener(this.selectionListener);
        },
        isDrag() {
            return this.getHostFigure().svg.dispatcher.mouseState === 'mousedrag'
        },
        isSelected() {
            return !(this.getHost().getSelected() === SELECTED_NONE)
        },
        binding() {
            return {
                tool: this.getHost().getRoot().editor.getActiveTool().id
            }
        },
        _hook(name) {
            this[name] && this[name](this.binding());
        },
        _mouseIn() {
            this.isTransition = !this.isDrag();
            if (!this.isTransition) return
            this._hook(this.isSelected() ? this.HOOKS[0] : this.HOOKS[1]);
        },
        _mouseOut() {
            if (!this.isTransition) return
            this._hook(this.isSelected() ? this.HOOKS[4] : this.HOOKS[5]);
            this.isTransition = false;
        },
        _mouseMove() {
            if (!this.isTransition) return
            this._hook(this.isSelected() ? this.HOOKS[2] : this.HOOKS[3]);
        },
        _stateChange() {
            this._hook(this.isSelected() ? this.HOOKS[6] : this.HOOKS[7]);
        }
    };

    var policies = {
        LinkModPolicy: anra.gef.Policy.extend(LinkMod),
        LayoutPolicy: anra.gef.Policy.extend(Layout$1),
        ConnectionPolicy: anra.gef.Policy.extend(Conection),
        SelectionPolicy: anra.gef.Policy.extend(Selection),
        LineSelectionPolicy: anra.gef.Policy.extend(Selection).extend(LineSelection),
        ResizableEditPolicy: anra.gef.Policy.extend(Selection).extend(ResizableEdit),
        TransitionPolicy: anra.gef.Policy.extend(Transition)
    };

    Object.entries(policies).forEach(([name, policy]) => {
        anra.gef[name] = policy;
    });

    Object.entries(Handles).forEach(([name, handle]) => {
        anra.gef[name] = handle;
    });

    const types = {
        CIRCLE: anra.svg.Circle,
        RECT: anra.svg.Rect,
        IMAGE: anra.svg.Image,
        TEXT: anra.svg.Text,
        TRIANGLE: anra.svg.TriangleMarker,
        FOREIGN: anra.svg.ForeignObject,
    };

    const Node = new Proxy(anra.gef.NodeModel, {
        get(target, key) {
            return api[key] || types[key] || target[key];
        }
    });

    const api = {
        types: Object.keys(types),
        create(data) {
            var n = new Node();
            n.props = data;
            n.uuid = data.UUID;
            return n;
        },
        addChildren(parentModel, data = [], config) {
            if (config == null) {
                data.forEach((item) => {
                    parentModel.addChild(Node.create(item));
                });
                return;
            }

            data.forEach((item) => {
                parentModel.addChild(Node.create(item), (model) => {
                    let childConfig;

                    try {
                        childConfig = config[model.get("type")];
                    } catch (e) {
                        return;
                    }

                    if (childConfig["size"] && model.props.bounds == null) {
                        model.set("bounds", [
                            0,
                            0,
                            childConfig["size"][0],
                            childConfig["size"][1]
                        ]);
                    }

                    if (item["children"] && childConfig["children"]) {
                        Node.addChildren(model, item["children"], childConfig["children"]);
                    }
                });
            });
        }
    };

    const types$1 = {
        LINE: anra.gef.Line,
        CURVE_LINE: anra.gef.CurveLine,
        POLY_LINE: anra.svg.Polyline,
    };

    const Line = new Proxy(anra.gef.LineModel, {
        get(target, key) {
            return api$1[key] || types$1[key] || target[key];
        }
    });

    const api$1 = {
        types: Object.keys(types$1),
        create(data) {
            var l = new Line();
            l.props = data;
            return l;
        },
        addChildren(parentModel, data = [], config) {
            let model, source, target;
            data.forEach(line => {
                model = Line.create(line);
                source = parentModel.getChild(line.source);
                if (source == null)
                    throw 'source of line[' + line.id + '] does not exist';
                target = parentModel.getChild(line.target);
                if (target == null)
                    throw 'target of line[' + line.id + '] does not exist';

                source.addSourceLine(model);
                target.addTargetLine(model);
            });
        }

    };

    let natives = [
        'CreationTool',
        'LinkLineTool',
        'SelectionTool',
        'MultiSelectionTool',
    ];

    let types$2 = {
        CreateTool: anra.gef.CreationTool.extend({
            constructor(props) {
                this.props = props;
            },
            activate() {
                this.model = new anra.gef.NodeModel();
                for (let [key, handle] of Object.entries(this.props)) {
                    this.model.props[key] = handle instanceof Function ? handle(this.editor) : handle;
                }
                anra.gef.CreationTool.prototype.activate.call(this);
            }
        }),
        scrollByDragTool: anra.gef.Tool.extend({
            id: 'selection tool',
            activate() {
                /*Util.addListener(document, 'mouseup.scrollByDragTool', () => {
                  if (this.isDrag) {
                    this.editor.canvas.setAttribute('cursor', 'default')
                    this.isDrag = false
                  }
                })*/
            },
            deactivate() {
                // Util.removeListener('mouseup.scrollByDragTool')
            },
            mouseDown(e, p) {
                if (!this.isRoot(p) && p instanceof anra.gef.NodeEditPart) {
                    p.getRoot().setSelection(p);
                }

                return true
            },
            /* 禁止拖拽 */
            dragStart(e, p) {
                if (this.isRoot(p)) {
                    let canvas = this.editor.canvas;
                    let wrap = this.editor.element;
                    let event = e.prop.nativeEvent;

                    this.isDrag = true;
                    this.location = {
                        x: event.pageX,
                        y: event.pageY,
                        left: wrap.scrollLeft,
                        top: wrap.scrollTop
                    };
                    canvas.setAttribute('cursor', 'move');
                }

                return true
            },
            mouseDrag(e, p) {
                if (this.isDrag) {
                    let wrap = this.editor.element;
                    let event = e.prop.nativeEvent;
                    let offx, offy;

                    offx = event.pageX - this.location.x;
                    offy = event.pageY - this.location.y;

                    wrap.scrollLeft = this.scroll(this.location.left, offx, wrap.scrollWidth - wrap.clientWidth);
                    wrap.scrollTop = this.scroll(this.location.top, offy, wrap.scrollHeight - wrap.clientHeight);
                }

                return true
            },
            dragEnd(e, p) {
                if (this.isDrag) {
                    this.editor.canvas.setAttribute('cursor', 'default');
                    this.isDrag = false;
                }
                return true
            },
            mouseUp() { return true },
            /* util fn */
            isRoot(p) {
                return p === p.getRoot()
            },
            scroll(current, offset, max) {
                let val = current - offset;
                return offset > 0 ? Math.max(val, 0) : Math.min(val, max)
            }
        }),
        tttt: anra.gef.Tool.extend({
            id: 'selection tool',
            createPopper() {
                if (this.el == null) {
                    this.el = document.createElement('div');
                }

                Util.apply(this.el.style, {
                    display: 'none',
                    background: 'black',
                    'z-index': 2000,
                    position: 'absolute'
                });
                document.body.appendChild(this.el);
            },
            destroyPopper() {
                if (this.el != null) {
                    document.body.removeChild(this.el);
                }
            },
            activate() {
                this.createPopper();

                let canvas = this.editor.canvas;
                this.keyDown = (e) => {
                    if (Util.toKeyStringByEvent(e) === 'a') {
                        this.show();
                    }
                };
                this.keyUp = (e) => {
                    if (Util.toKeyStringByEvent(e) === 'a') {
                        this.hidden();
                    }
                };
                canvas.on(anra.EVENT.KeyDown, this.keyDown);

                canvas.on(anra.EVENT.KeyUp, this.keyUp);
            },
            deactivate() {
                this.destroyPopper();
                let canvas = this.editor.canvas;
                canvas.off(anra.EVENT.KeyDown, this.keyDown);

                canvas.off(anra.EVENT.KeyUp, this.keyUp);
            },
            show() {
                let wrap = this.editor.element;
                let canvas = this.editor.canvas;


                // Util.apply(this.el.style, {
                //     top: canvas.getY(wrap),
                //     left: canvas.getX(wrap),
                //     width: wrap.clientWidth,
                //     height: wrap.clientHeight,
                //     display: 'block'
                // });

                Util.apply(this.el.style, {
                    ...canvas.getOffset(wrap),
                    width: wrap.clientWidth,
                    height: wrap.clientHeight,
                    display: 'block'
                });
                this.el.appendChild(this.editor.canvas.owner);
            },
            hidden() {
                this.editor.element.appendChild(this.editor.canvas.owner);
                let wrap = this.editor.element;

                Util.apply(this.el.style, {
                    top: '',
                    left: '',
                    width: '',
                    height: '',
                    display: 'none',
                });
            },
            mouseUp(e, p) {
                return true
            },
            mouseDown(e, p) {
                if (!this.isRoot(p) && p instanceof anra.gef.NodeEditPart) {
                    p.getRoot().setSelection(p);
                }

                return true
            },
            isRoot(p) {
                return p === p.getRoot()
            },
        }),
    };

    const Tool = new Proxy(anra.gef.Tool, {
        get(target, key) {
            let result = api$2[key] || types$2[key] || target[key];

            return result || (
                natives.find(name => name === key)
                    ? anra.gef[key]
                    : null
            );
        }
    });

    const api$2 = {
        types: natives.concat(Object.keys(types$2)),
    };

    let types$3 = Object.keys(policies);

    const _policy = {
        TextPolicy(key, loc, options = {}) {
            return {
                activate: function () {
                    this.handle = options.handle
                        ? options.handle(this.getHost())
                        : new anra.gef.TextHandle(this.getHost());
                    if (options.style)
                        this.handle.setStyle(options.style);
                    if (options.attribute)
                        this.handle.setAttribute(options.attribute);
                    if (loc)
                        this.handle.refreshLocation = loc;
                    this.formatter = options.formatter
                        ? text => options.formatter(text)
                        : text => text;

                    this.getHandleLayer().addChild(this.handle);
                    this.handle.setText(this.formatter(this.getHost().model.get(key)));
                    this.handle.disableEvent();

                    //添加一个监听数据的改变
                    if (options.isListen) {
                        this.listener = () => {
                            this.handle.setText(this.formatter(this.getHost().model.get(key)));
                            this.handle.refreshLocation(this.getHost().figure);
                        };
                        this.getHost().model.addPropertyListener(this.listener, key);

                    }
                },
                deactivate() {
                    if (options.isListen) this.getHost().model.removePropertyListener(this.listener, key);
                    this.getHandleLayer().removeChild(this.handle);
                }
            }
        },
        ContainerLayoutPolicy: anra.gef.LayoutPolicy.extend({
            createFeedback(ep) {
                var f = anra.FigureUtil.createGhostFigure(ep);
                var b = f.bounds;
                f.bounds = { width: b.width / 2, height: b.height / 2 };
                return f;
            },
            getCreateCommand(request) {
                var model = request.event.prop.drag.model,
                    type = model.get('type'),
                    b = model.get('bounds'), parent = request.editPart;

                while (parent && (parent.config.children == null || parent.config.children[type] == null)) {
                    parent = parent.parent;
                }

                if (parent == null) {
                    return null;
                }

                var pb = parent instanceof anra.gef.RootEditPart ? [0, 0] : parent.model.get('bounds');

                model.set('bounds', [request.event.x - pb[0], request.event.y - pb[1], b[2], b[3]]);
                return new anra.gef.CreateNodeCommand(this.getHost(), model);
            },
        }),
        ValidatorConnection: {
            validators: new Map().
                set('type', (value, { type }) => {
                    if (value == 'out') {
                        return REQ_RECONNECT_SOURCE === type || type === REQ_CONNECTION_START;
                    }

                    if (value == 'in') {
                        return REQ_RECONNECT_TARGET === type || type === REQ_CONNECTION_END;
                    }

                    //TODO
                    throw "";
                }).
                set('max', (value, { sourceLines, targetLines, type, source, target, current }) => {

                    if (type == REQ_RECONNECT_TARGET &&
                        target.editPart == current.editPart &&
                        target.anchor.id == current.anchor.id) {
                        return true;
                    }

                    if (type == REQ_RECONNECT_SOURCE &&
                        source.editPart == current.editPart &&
                        source.anchor.id == current.anchor.id) {
                        return true;
                    }


                    if (sourceLines.length + targetLines.length < value) return true;

                    if (sourceLines.length + targetLines.length > value) return false;

                    sourceLines.forEach(({ target, source }) => {
                        if (target == source) return true;
                    });
                }).
                set('linkmyself', (value, condition) => {
                    if (value === true || REQ_CONNECTION_START === condition.type) return true;

                    if (REQ_CONNECTION_END == condition.type || REQ_RECONNECT_TARGET == condition.type) {
                        return condition.current.editPart !== condition.source.editPart;
                    }

                    if (REQ_RECONNECT_SOURCE == condition.type) {
                        return condition.current.editPart !== condition.target.editPart;
                    }
                }).
                set('validator', (value, host) => {
                    if (value instanceof Function) {
                        return value(host) === true;
                    }

                    //TODO
                    throw "";
                })
                .set('invalid', () => {
                    return false
                }),
            showSourceFeedback(req) {
                let type = req.type;
                if (REQ_CONNECTION_MOD == type) {
                    return this.showAnchors(req)
                }

                if (REQ_CONNECTION_START === type || REQ_RECONNECT_SOURCE === type) {
                    let anchor = this.getHostFigure().getSourceAnchor(req, an => this.validatorAnchor(an, req, ['type', 'linkmyself']));
                    return this.refreshSourceAnchorFeedback(anchor, req)
                }
            },
            showTargetFeedback(req) {
                if (REQ_RECONNECT_TARGET == req.type || REQ_CONNECTION_END == req.type) {
                    let anchor = this.getHostFigure().getTargetAnchor(req, an => this.validatorAnchor(an, req, ['type', 'linkmyself']));
                    this.refreshTargetAnchorFeedback(anchor, req);
                }
            },
            refreshSourceAnchorFeedback(anchor, req) {
                /*if (this.sourceAnchor == null) {
                    this.sourceAnchor = this.createSourceAnchorFeedback();
                    this.addFeedback(this.sourceAnchor)
                }*/

                // this.validatorAnchor(anchor, req) ? this.setFeedbackAvailable(this.sourceAnchor) : this.setFeedbackInvalid(this.sourceAnchor);

                if (anchor != null) {
                    // this.sourceAnchor.setBounds({x: anchor.x, y: anchor.y, width: 15, height: 15})
                    req.target.refreshSourceAnchor(anchor);
                } else {
                    req.target.refreshSourceAnchor({ x: req.event.x, y: req.event.y, invalid: true });
                }
            },
            refreshTargetAnchorFeedback(anchor, req) {
                /*if (this.targetAnchorFeedback == null) {
                    this.targetAnchorFeedback = this.createTargetAnchorFeedback();
                    this.addFeedback(this.targetAnchorFeedback);
                }*/

                // this.validatorAnchor(anchor, req) ? this.setFeedbackAvailable(this.targetAnchorFeedback) : this.setFeedbackInvalid(this.targetAnchorFeedback);

                if (anchor != null) {
                    // this.targetAnchorFeedback.setBounds({x: anchor.x, y: anchor.y, width: 15, height: 15}) // host handle
                    req.target.refreshTargetAnchor(anchor); // guide handle
                } else {
                    req.target.refreshTargetAnchor({ x: req.event.x, y: req.event.y, invalid: true });
                }
            },
            eraseTargetFeedback(req) {
                if (this.targetAnchorFeedback) {
                    this.getHost().getFigure().selectionChanged(SELECTED_NONE);
                    this.removeFeedback(this.targetAnchorFeedback);
                    this.targetAnchorFeedback = null;

                }
            },
            _createCondition(anchor, req) {
                let host = this.getHost();

                return new Proxy({ type: req.type }, {
                    get(target, property) {
                        if (target[property] != null) return target[property]

                        if (property === 'sourceLines') {
                            target[property] = host.getModelSourceLines().map(model => model.props).filter(({ exit }) => exit == anchor.id);
                            return target[property]
                        }

                        if (property === 'targetLines') {
                            target[property] = host.getModelTargetLines().map(model => model.props).filter(({ entr }) => entr == anchor.id);
                            return target[property]
                        }

                        if (property === 'current') {
                            target[property] = { editPart: host, anchor: anchor };
                            return target[property]
                        }

                        if (property === 'source') {
                            if (target.type === REQ_CONNECTION_END) {
                                target[property] = {
                                    editPart: req.target.sourceEditPart,
                                    anchor: req.target.sourceGuideAnchor.getBounds()
                                };
                            } else if (REQ_RECONNECT_SOURCE == target.type || REQ_RECONNECT_TARGET == target.type) {
                                target[property] = {
                                    editPart: req.target.linePart.source,
                                    anchor: req.target.linePart.getSourceAnchor(),
                                };
                            } else {
                                target[property] = {};
                            }

                            return target[property]
                        }

                        if (property === 'target') {
                            if (REQ_RECONNECT_SOURCE == target.type || REQ_RECONNECT_TARGET == target.type) {
                                target[property] = {
                                    editPart: req.target.linePart.target,
                                    anchor: req.target.linePart.getTargetAnchor(),
                                };
                            } else {
                                target[property] = {};
                            }
                        }

                        return target[property]
                    }
                })
            },
            _createCommand(cmd) {
                if (cmd == null) return cmd

                let root = this.getHost().getRoot();
                let SelectionCmd = anra.Command.extend({
                    execute() {
                        this.old = root.selection;
                        this.linePart = cmd.line;
                        root.setSelection(this.linePart);
                    },
                    undo() {
                        root.setSelection(this.old);
                    }
                });

                return cmd.chain(new SelectionCmd())
            },
            validatorAnchor(anchor, req, include) {
                let enable = true, condition = this._createCondition(anchor, req);

                if (include instanceof Array) {
                    for (let key of include) {
                        if (this.validators.has(key) && anchor[key] != null) {
                            enable &= this.validators.get(key)(anchor[key], condition);
                        }
                    }
                } else {
                    for (let [key, value] of Object.entries(anchor)) {
                        if (this.validators.has(key)) {
                            enable &= this.validators.get(key)(value, condition);
                        }
                    }
                }
                return enable;
            },
            setFeedbackAvailable(feedback) {
                feedback.setAttribute({
                    'stroke': 'green',
                });
                this.getHost().getFigure().owner.style.cursor = 'pointer';
                feedback._isInvalid = false;
            },
            setFeedbackInvalid(feedback) {
                feedback.setAttribute({
                    'stroke': 'red',
                });
                this.getHost().getFigure().owner.style.cursor = 'not-allowed';
                feedback._isInvalid = true;
            },
            eraseSourceFeedback: function (req) {
                if (REQ_CONNECTION_MOD == req.type) {
                    this.eraseAnchors(req);
                }
                if (this.sourceAnchor) {
                    this.getHost().getFigure().selectionChanged(SELECTED_NONE);
                    this.getFeedbackLayer().removeChild(this.sourceAnchor);
                    this.sourceAnchor = null;
                }
            },
            getCreateConnectionCommand: function (req) {
                if (this.sourceAnchor != null && this.sourceAnchor._isInvalid) return null

                if (this.validatorAnchor(req.anchor, req)) return this.base(req)
            },
            createTargetAnchorFeedback() {
                var Circle = anra.svg.Control.extend(anra.svg.Circle),
                    rect = new Circle();
                rect.setAttribute({
                    'fill-opacity': 0,
                    'stroke-opacity': 0.8,
                    'stroke': 'green',
                    'stroke-width': 5,
                });
                return rect;
            },
            getConnectionCompleteCommand(req) {
                if (this.targetAnchorFeedback != null && this.targetAnchorFeedback._isInvalid) return null;

                if (this.validatorAnchor(req.anchor, req)) return this.base(req)
            },
            getReconnectTargetCommand(req) {
                if (this.targetAnchorFeedback != null && this.targetAnchorFeedback._isInvalid) return null;

                if (this.validatorAnchor(req.anchor, req)) return this._createCommand(this.base(req))
            },
            getReconnectSourceCommand(req) {
                if (this.sourceAnchor != null && this.sourceAnchor._isInvalid) return null;

                if (this.validatorAnchor(req.anchor, req)) return this._createCommand(this.base(req))
            }
        },
        FocusingLayout: {
            config: {
                activate() {
                    let host = this.getHost();

                    host.addEditPartListener('selectionChanged', this.selectionChanged);
                },
                deactivate() {
                    this.getHost().removeEditPartListener('selectionChanged', this.selectionChanged);
                }
            }
        }
    };

    const Policy = new Proxy(anra.gef.Policy, {
        get(target, key) {
            return api$3[key]
                || _policy[key]
                || policies[key]
                || target[key];
        }
    });

    const api$3 = {
        types: types$3.concat(Object.keys(_policy))
    };

    const baseRulers = {
        refresh(cfg, e) {
            if (cfg != null) {
                e.refreshVisual = cfg;
            }
        },
        on(cfg, e) {
            if (cfg != null) {
                e.installEditPolicy('on create figure', anra.gef.Policy.init({
                    activate: function () {
                        var key;
                        for (key in cfg) {
                            this.getHostFigure().on(key, cfg[key]);
                        }
                    },
                    deactivate: function () {
                        var key;
                        for (key in cfg) {
                            this.getHostFigure().off(key, cfg[key]);
                        }
                    }
                }));
            }
        },
        onProps(cfg, e) {
            if (cfg != null) {
                e.installEditPolicy('on props create figure', anra.gef.Policy.init({
                    activate() {
                        let host = this.getHost();
                        this.map = new Map();
                        Object.entries(cfg).forEach(([key, listener]) => {
                            if (typeof listener === 'function') {
                                /* 包装上下文 */

                                this.map.set(key, (...res) => Reflect.apply(listener, host, res));
                                host.model.addPropertyListener(this.map.get(key), key);
                            } else {
                                throw `${key} not function`
                            }
                        });
                    },
                    deactivate() {
                        this.map.forEach((listener, key) => this.getHost().model.removePropertyListener(listener, key));
                        this.map.clear();
                    }
                }));
            }
        },
        onHooks(cfg, e) {
            if (cfg != null) {
                e.installEditPolicy('on Hooks', anra.gef.Policy.init({
                    activate() {
                        let host = this.getHost();
                        let options = [].concat(cfg);
                        this.listeners = [];
                        for (let option of options) {
                            let listener = Util.construct(anra.gef.EditPartListener, option);
                            if (listener != null) {
                                this.listeners.push(listener);
                                host.addEditPartListener(listener);
                            }
                        }
                    },
                    deactivate() {
                        let host = this.getHost();
                        for (let listener of this.listeners) {
                            host.removeEditPartListener(listener);
                        }
                    }
                }));
            }
        }
    };

    const rootRulers = Object.assign({
        layoutable(cfg, e) {
            if (cfg === false) return
            let policy = cfg == null
                ? anra.gef.LayoutPolicy
                : cfg;
            e.installEditPolicy(LAYOUT_POLICY, policy);
        },
        linkable(cfg, e) {
            if (cfg === false) return
            if (cfg == null || cfg === true) {
                e.installEditPolicy(CONNECTION_POLICY, {
                    showSourceFeedback(req) {
                        let tool = req.target;
                        if (tool != null && tool.id === 'link tool') {
                            tool.refreshSourceAnchor(req.event);
                        }
                    },
                    showTargetFeedback(req) {
                        let tool = req.target;
                        if (tool != null && tool.id === 'link tool') {
                            tool.refreshTargetAnchor(req.event);
                        }
                    }
                });
            } else {
                e.installEditPolicy(CONNECTION_POLICY, cfg);
            }
        }
    }, baseRulers);

    const nodeRulers = Object.assign({
        linkable(cfg, e) {
            if (cfg === false || cfg == null) return
            let policy = cfg === true ? Policy.ConnectionPolicy : Policy.ConnectionPolicy.extend(cfg);
            e.installEditPolicy(CONNECTION_POLICY, policy);
        },
        selectable(cfg, e) {
            if (cfg === false || cfg == null) return
            let policy;
            if (typeof cfg === 'function') {
                policy = new cfg();
            } else if (typeof cfg === 'object') {
                policy = new Policy.SelectionPolicy.extend(cfg);
            } else {
                policy = new Policy.ResizableEditPolicy();
            }
            e.installEditPolicy(SELECTION_POLICY, policy);
            cfg.onselect && e.addSelectionListener(cfg.onselect);
        },
        canDrag(cfg, e) {
            if (cfg === true) e.dragTracker = new anra.gef.DragTracker();
        }
    }, baseRulers);

    const lineRulers = Object.assign({
        selectable(cfg, e) {
            if (cfg === null || cfg === false) return

            let p = new anra.gef.LineSelectionPolicy();
            if (cfg === true) {
                e.installEditPolicy(SELECTION_POLICY, p);
                return
            }

            p.style = cfg.selected || p.style;
            if (cfg.unselected) p.color = cfg.unselected;

            if (cfg.handles) {
                p.createSelectionHandles = function () {
                    return cfg.handles.map(h => new h(p.getHost()))
                };
            }

            e.installEditPolicy(SELECTION_POLICY, p);
        }
    }, baseRulers);

    const EditPart = new Proxy(anra.gef.EditPart, {
        get(target, key) {
            if (key === 'NodeEditPart') return anra.gef.NodeEditPart
            if (key === 'LineEditPart') return anra.gef.LineEditPart
            if (key === 'RootEditPart') return anra.gef.RootEditPart

            return api$4[key] || target[key]
        },
        getPrototypeOf(target) {
            return target
        }
    });

    function applyRulers(editPart, config, rulers) {
        config = config || {};
        for (let key in rulers) {
            rulers[key](config[key], editPart);
        }
    }

    const api$4 = {
        types: [
            'NodeEditPart',
            'LineEditPart',
            'RootEditPart'
        ],
        createNode(config, model) {
            var nodeConfig = config.children[model.props.type];
            if (nodeConfig == null) throw 'can not found EditPart config on node [' + model.props.type + ']'
            var e = new anra.gef.NodeEditPart();
            e.config = nodeConfig;

            applyRulers(e, nodeConfig, nodeRulers);

            e.onCreateFigure = function (figure) {
                // Use 标签
                if (typeof nodeConfig.type === 'string' && config.types != null) {
                    // check config types
                    const symbolConfig = config.types[nodeConfig.type];
                    if (symbolConfig == null) {
                        throw 'can not found EditPart config on node figure [' + config.type + ']'
                    }

                    figure.oncreated = function () {
                        // check defs 层
                        if (this.svg.defs.getChild(nodeConfig.type) == null) {
                            // add symbol
                            this.svg.defs.addChild(new anra.svg.Symbol(symbolConfig));
                        }
                    };
                }
            };

            return e
        },
        createLine(config, model) {
            var l = new anra.gef.LineEditPart(model);
            l.config = config[model.get('type')];

            if (l.config == null) throw 'can not found EditPart config on Line [' + model.props.type + ']'

            applyRulers(l, l.config, lineRulers);

            l.onCreateFigure = function (figure) {
                figure.router = l.config.router;

                figure.oncreated = function () {
                    if (l.config.startMarker) {
                        figure.setStartMarker(new l.config.startMarker.type(l.config.startMarker));
                    }
                    if (l.config.endMarker) {
                        figure.setEndMarker(new l.config.endMarker.type(l.config.endMarker));
                    }
                };
            };

            return l
        },
        createRoot(config, model) {
            let root = new anra.gef.RootEditPart();

            root.config = config;
            applyRulers(root, config, rootRulers);
            return root
        },
        isNode(editPart) {
            return editPart instanceof anra.gef.NodeEditPart
        },
        isLine(editPart) {
            return editPart instanceof anra.gef.LineEditPart
        }
    };

    /**
     * 从json生成NodeModel，目前只考虑了一层，以后可以改为递归
     * @param data
     * @param parentModel
     * @param config
     */
    var doInit = function (input, parentModel, config) {
        // 节点处理
        Node.addChildren(parentModel, input.data, config['children']);
        // 连线处理
        Line.addChildren(parentModel, input.line, config['lines']);

        if (typeof input.model === 'object') {
            Object.keys(input.model).forEach(key => parentModel.set(key, input.model[key]));
        }
    };

    const api$5 = {
        config: null,
        constructor: function (config) {
            this.config = config;
            this.setInput(config);
            this.createContent(config.id);
        },
        input2model: function (data, rootModel) {
            doInit.call(this, data, rootModel, this.config);
        },
        registActions: function () {
            this.config.operations && this.actionRegistry.regist(this.config.operations);
        },
        addNode: function (data) {
            this.exec(new anra.gef.CreateNodeCommand(this.rootEditPart, Node.create(data)));
        },
        removeNode: function (node) {
            if (!(node instanceof anra.gef.NodeModel)) { node = this.find(node); }
            if (node == null) { throw 'can not find node' }
            this.exec(new anra.gef.DeleteNodeAndLineCommand(this.rootEditPart, node));
        },
        addLine: function (data) {
            this.exec(new anra.gef.CreateLineCommand(this.rootEditPart, Line.create(data), data.source, data.target));
        },
        removeLine: function (line) {
            this.exec(new anra.gef.DeleteLineCommand(this.rootEditPart, line));
        },
        find: function (id) {
            var model = this.rootEditPart.model.getChild(id);
            return this.rootEditPart.getEditPart(model)
        },
        exec: function (cmd) {
            if (this.cmdStack) { this.cmdStack.execute(cmd); }
        },
        undo: function () {
            if (this.cmdStack) { this.cmdStack.undo(); }
        },
        redo: function () {
            if (this.cmdStack) { this.cmdStack.redo(); }
        },
        canUndo: function (cmd) {
            if (this.cmdStack) { this.cmdStack.canUndo(); }
        },
        canRedo: function (cmd) {
            if (this.cmdStack) { this.cmdStack.canRedo(cmd); }
        },
        createEditPart: function (parentControl, model) {
            let editPart = EditPart.createNode(parentControl.config, model);

            if (parentControl.config.lines) {
                editPart.createLineEditPart = function (model) {
                    return EditPart.createLine(parentControl.config.lines, model)
                };
            }

            return editPart
        },
        createRootEditPart() {
            return EditPart.createRoot(this.config, this.rootModel)
        },
        setTool: function (toolConfig) {
            this.setActiveTool(anra.gef.Tool.init(toolConfig));
        }
    };

    var Editor = anra.gef.Editor.extend(api$5);

    var FillLayout$1 = anra.svg.Layout.extend({
        horizontal: true,
        marginWidth: 0,
        marginHeight: 0,
        spacing: 0,
        layout(comp) {
            var children = comp.children, bounds = comp.getClientArea(), count;

            if (children == null || children.length == 0) {
                return
            }
            count = children.length;

            var width = bounds[2] - 2 * this.marginWidth,
                height = bounds[3] - 2 * this.marginHeight,
                x = this.marginWidth,
                y = this.marginHeight,
                spacing = this.spacing;

            if (this.horizontal) {
                width -= (count - 1) * spacing;

                var extra = width % count, cellWidth = ~~(width / count),
                    childWidth;

                /* 每个子节点bounds设置 */
                children.forEach((item, index) => {
                    /* 宽度取整, 多余的分至左右两侧 */
                    childWidth = cellWidth;
                    childWidth += index == 0 ? ~~(extra / 2) : index == count - 1 ? ~~(extra + 1) / 2 : 0;

                    item.setBounds({
                        x: x,
                        y: y,
                        width: childWidth,
                        height: height
                    });
                    this.refreshModel(item, item.getBounds());

                    x += childWidth + spacing;
                });
            } else {
                var extra = width % count, cellHeight = width / count,
                    childHeight;

                children.forEach((item, index) => {
                    /* 高度取整， 多余的分至上下两侧 */
                    childHeight = cellHeight;
                    childHeight += index == 0 ? extra / 2 : index == count - 1 ? (extra + 1) / 2 : 0;

                    item.setBounds({
                        x: x,
                        y: y,
                        width: width,
                        height: childHeight
                    });
                    this.refreshModel(item, item.getBounds());

                    y += childHeight + spacing;
                });
            }
        }
    });

    let types$4 = {
        FillLayout: FillLayout$1
    };

    const Layout$2 = new Proxy(anra.svg.Layout, {
        get(target, key) {
            return api$6[key] || types$4[key] || target[key]
        }
    });

    const api$6 = {
        types: Object.keys(types$4),
        refreshModel(figure, bounds) {
            if (figure.model) {
                let lastBounds = figure.model.get('bounds');

                // 这里希望在调整位置的时候照顾到自己节点
                /* if (lastBounds[0] != bounds['x'] || lastBounds[1] != bounds['y']) {
                    let refreshChilren = function () {
                        this.applyBounds();
  
                        if (this.children)
                            for (var i = 0; i < this.children.length; i++) {
                                refreshChilren.call(this.children[i]);
                            }
                    }
  
                    refreshChilren.call(figure);
                } */

                figure.model.set('bounds', [
                    bounds['x'],
                    bounds['y'],
                    bounds['width'],
                    bounds['height']
                ]);
            }
        }
    };

    let types$5 = Object.keys(Handles);


    const Handle = new Proxy(anra.Handle, {
        get(target, key) {
            return api$7[key] || Handles[key] || target[key];
        }
    });

    const api$7 = {
        types: types$5,
    };

    const natives$1 = [
        'RelocalCommand',
        'DeleteNodeAndLineCommand',
        'DeleteNodeCommand',
        'DeleteLineCommand',
        'CreateNodeCommand',
        'ReconnectSourceCommand',
        'ReconnectTargetCommand',
        'CreateLineCommand',
        'ConstraintCommand',
        'ChainedCompoundCommand'
    ];

    const noop$2 = function () { };
    const types$6 = {
        'SetPropsCommand': anra.Command.extend({
            constructor(key, value, model) {
                this.model = model;
                this.key = key;
                this.value = value;
            },
            canExecute() {
                return this.model && this.key
            },
            execute() {
                this.modification = this.model.get(this.key);
                this.model.set(this.key, this.value);
            },
            undo() {
                this.model.set(this.key, this.modification);
            }
        })
    };

    const Command = new Proxy(anra.Command, {
        get(target, key) {
            let result = api$8[key] || types$6[key] || target[key];

            return result || (
                natives$1.find(name => name === key)
                    ? (anra.gef[key] || anra[key])
                    : null
            )
        }
    });

    const api$8 = {
        types: natives$1.concat(Object.keys(types$6)),
        hooks(command, { beforeExecute = noop$2, afterExecute = noop$2, beforeUndo = noop$2, afterUndo = noop$2 } = {}) {
            if (command instanceof anra.Command) {
                return command.extend({
                    beforeExecute,
                    afterExecute,
                    afterUndo,
                    beforeUndo,
                    execute() {
                        this.beforeExecute();
                        command.prototype.execute.call(this);
                        this.afterExecute();
                    },
                    undo() {
                        this.beforeUndo();
                        command.prototype.undo.call(this);
                        this.afterUndo();
                    }
                })
            }
        }
    };

    const types$7 = {
        EditPartListener: anra.gef.EditPartListener,
    };

    const Listener = new Proxy(anra.Listener, {
        get(target, key) {
            return types$7[key] || api$9[key] || target[key];
        },
        construct(target, args) {
            return new target(...args);
        }
    });

    const api$9 = {
        types: Object.keys(types$7),
    };

    const api$a = {
        extend(ext) {
            return Editor.extend(ext)
        },
        isEditor(editor = {}) {
            return editor instanceof anra.gef.Editor
        },
        Figure: anra.gef.Figure,
        Control: anra.svg.Control,
    };

    const main = {
        Util,
        Node,
        Line,
        Tool,
        Layout: Layout$2,
        Handle,
        Policy,
        Command,
        EditPart,
        Listener,
        Platform: anra.Platform,
        FigureUtil: anra.FigureUtil
    };

    let types$8 = {};
    [Node, Line, Tool, Layout$2, Handle, Policy, Command, EditPart, Listener].forEach(part => {
        part.types.forEach(type => { types$8[type] = part; });
    });

    const $AG = new Proxy(function () { }, {
        get(target, key, receiver) {
            if (main[key] != null) return main[key]
            if (api$a[key] != null) return api$a[key]
            if (types$8[key] != null && types$8[key][key]) return types$8[key][key]

            return anra[key]
        },
        construct(target, args) {
            return new Editor(...args)
        }
    });

    // export * as constants from './src/core/anra.constants';

    window.$AG = $AG;
    return $AG;
})));
