var Uglify={};


!function (n, e) {
	"use strict";

	function t(n) {
		for (var e = Object.create(null), t = 0; t < n.length; ++t) e[n[t]] = !0;
		return e
	}

	function r(n) {
		return n.split("")
	}

	function i(n, e) {
		for (var t = e.length; --t >= 0;) if (e[t] == n) return !0;
		return !1
	}

	function o(n, e) {
		for (var t = 0, r = e.length; r > t; ++t) if (n(e[t])) return e[t]
	}

	function a(n, e) {
		if (0 >= e) return "";
		if (1 == e) return n;
		var t = a(n, e >> 1);
		return t += t, 1 & e && (t += n), t
	}

	function u(n, e) {
		Error.call(this, n), this.msg = n, this.defs = e
	}

	function s(n, e, t) {
		n === !0 && (n = {});
		var r = n || {};
		if (t) for (var i in r) r.hasOwnProperty(i) && !e.hasOwnProperty(i) && u.croak("`" + i + "` is not a supported option", e);
		for (var i in e) e.hasOwnProperty(i) && (r[i] = n && n.hasOwnProperty(i) ? n[i] : e[i]);
		return r
	}

	function c(n, e) {
		var t = 0;
		for (var r in e) e.hasOwnProperty(r) && (n[r] = e[r], t++);
		return t
	}

	function f() {
	}

	function l(n, e) {
		n.indexOf(e) < 0 && n.push(e)
	}

	function p(n, e) {
		return n.replace(/\{(.+?)\}/g, function (n, t) {
			return e[t]
		})
	}

	function d(n, e) {
		for (var t = n.length; --t >= 0;) n[t] === e && n.splice(t, 1)
	}

	function h(n, e) {
		function t(n, t) {
			for (var r = [], i = 0, o = 0, a = 0; i < n.length && o < t.length;) e(n[i], t[o]) <= 0 ? r[a++] = n[i++] : r[a++] = t[o++];
			return i < n.length && r.push.apply(r, n.slice(i)), o < t.length && r.push.apply(r, t.slice(o)), r
		}

		function r(n) {
			if (n.length <= 1) return n;
			var e = Math.floor(n.length / 2), i = n.slice(0, e), o = n.slice(e);
			return i = r(i), o = r(o), t(i, o)
		}

		return n.length < 2 ? n.slice() : r(n)
	}

	function m(n) {
		function e(n) {
			if (1 == n.length) return t += "return str === " + JSON.stringify(n[0]) + ";";
			t += "switch(str){";
			for (var e = 0; e < n.length; ++e) t += "case " + JSON.stringify(n[e]) + ":";
			t += "return true}return false;"
		}

		n instanceof Array || (n = n.split(" "));
		var t = "", r = [];
		n:for (var i = 0; i < n.length; ++i) {
			for (var o = 0; o < r.length; ++o) if (r[o][0].length == n[i].length) {
				r[o].push(n[i]);
				continue n
			}
			r.push([n[i]])
		}
		if (r.length > 3) {
			r.sort(function (n, e) {
				return e.length - n.length
			}), t += "switch(str.length){";
			for (var i = 0; i < r.length; ++i) {
				var a = r[i];
				t += "case " + a[0].length + ":", e(a)
			}
			t += "}"
		} else e(n);
		return new Function("str", t)
	}

	function v(n, e) {
		for (var t = n.length; --t >= 0;) if (!e(n[t])) return !1;
		return !0
	}

	function _() {
		this._values = Object.create(null), this._size = 0
	}

	function g(e, t, r, i) {
		arguments.length < 4 && (i = Y), t = t ? t.split(/\s+/) : [];
		var o = t;
		i && i.PROPS && (t = t.concat(i.PROPS));
		for (var a = "return function AST_" + e + "(props){ if (props) { ", u = t.length; --u >= 0;) a += "this." + t[u] + " = props." + t[u] + ";";
		var s = i && new i;
		(s && s.initialize || r && r.initialize) && (a += "this.initialize();"), a += "}}";
		var c = new Function(a)();
		if (s && (c.prototype = s, c.BASE = i), i && i.SUBCLASSES.push(c), c.prototype.CTOR = c, c.PROPS = t || null, c.SELF_PROPS = o, c.SUBCLASSES = [], e && (c.prototype.TYPE = c.TYPE = e), r) for (u in r) r.hasOwnProperty(u) && (/^\$/.test(u) ? c[u.substr(1)] = r[u] : c.prototype[u] = r[u]);
		return c.DEFMETHOD = function (n, e) {
			this.prototype[n] = e
		}, n["AST_" + e] = c, c
	}

	function b(n, e) {
		n.body instanceof W ? n.body._walk(e) : n.body.forEach(function (n) {
			n._walk(e)
		})
	}

	function y(n) {
		this.visit = n, this.stack = [], this.directives = Object.create(null)
	}

	function A(n) {
		return n >= 97 && 122 >= n || n >= 65 && 90 >= n || n >= 170 && ze.letter.test(String.fromCharCode(n))
	}

	function w(n) {
		return n >= 48 && 57 >= n
	}

	function E(n) {
		return w(n) || A(n)
	}

	function D(n) {
		return ze.digit.test(String.fromCharCode(n))
	}

	function F(n) {
		return ze.non_spacing_mark.test(n) || ze.space_combining_mark.test(n)
	}

	function C(n) {
		return ze.connector_punctuation.test(n)
	}

	function k(n) {
		return !ke(n) && /^[a-z_$][a-z0-9_$]*$/i.test(n)
	}

	function x(n) {
		return 36 == n || 95 == n || A(n)
	}

	function B(n) {
		var e = n.charCodeAt(0);
		return x(e) || w(e) || 8204 == e || 8205 == e || F(n) || C(n) || D(e)
	}

	function S(n) {
		return /^[a-z_$][a-z0-9_$]*$/i.test(n)
	}

	function T(n) {
		if (Se.test(n)) return parseInt(n.substr(2), 16);
		if (Te.test(n)) return parseInt(n.substr(1), 8);
		var e = parseFloat(n);
		return e == n ? e : void 0
	}

	function $(n, e, t, r, i) {
		this.message = n, this.filename = e, this.line = t, this.col = r, this.pos = i, this.stack = (new Error).stack
	}

	function O(n, e, t, r, i) {
		throw new $(n, e, t, r, i)
	}

	function q(n, e, t) {
		return n.type == e && (null == t || n.value == t)
	}

	function M(n, e, t, r) {
		function i() {
			return k.text.charAt(k.pos)
		}

		function o(n, e) {
			var t = k.text.charAt(k.pos++);
			if (n && !t) throw He;
			return "\r\n\u2028\u2029".indexOf(t) >= 0 ? (k.newline_before = k.newline_before || !e, ++k.line, k.col = 0, e || "\r" != t || "\n" != i() || (++k.pos, t = "\n")) : ++k.col, t
		}

		function a(n) {
			for (; n-- > 0;) o()
		}

		function u(n) {
			return k.text.substr(k.pos, n.length) == n
		}

		function s(n, e) {
			var t = k.text.indexOf(n, k.pos);
			if (e && -1 == t) throw He;
			return t
		}

		function c() {
			k.tokline = k.line, k.tokcol = k.col, k.tokpos = k.pos
		}

		function f(t, r, i) {
			k.regex_allowed = "operator" == t && !je(r) || "keyword" == t && xe(r) || "punc" == t && qe(r), S = "punc" == t && "." == r;
			var o = {
				type: t,
				value: r,
				line: k.tokline,
				col: k.tokcol,
				pos: k.tokpos,
				endline: k.line,
				endcol: k.col,
				endpos: k.pos,
				nlb: k.newline_before,
				file: e
			};
			if (/^(?:num|string|regexp)$/i.test(t) && (o.raw = n.substring(o.pos, o.endpos)), !i) {
				o.comments_before = k.comments_before, k.comments_before = [];
				for (var a = 0, u = o.comments_before.length; u > a; a++) o.nlb = o.nlb || o.comments_before[a].nlb
			}
			return k.newline_before = !1, new V(o)
		}

		function l() {
			for (var n; Oe(n = i()) || "\u2028" == n || "\u2029" == n;) o()
		}

		function p(n) {
			for (var e, t = "", r = 0; (e = i()) && n(e, r++);) t += o();
			return t
		}

		function d(n) {
			O(n, e, k.tokline, k.tokcol, k.tokpos)
		}

		function h(n) {
			var e = !1, t = !1, r = !1, i = "." == n, o = p(function (o, a) {
				var u = o.charCodeAt(0);
				switch (u) {
					case 120:
					case 88:
						return r ? !1 : r = !0;
					case 101:
					case 69:
						return r ? !0 : e ? !1 : e = t = !0;
					case 45:
						return t || 0 == a && !n;
					case 43:
						return t;
					case t = !1, 46:
						return i || r || e ? !1 : i = !0
				}
				return E(u)
			});
			n && (o = n + o);
			var a = T(o);
			return isNaN(a) ? void d("Invalid syntax: " + o) : f("num", a)
		}

		function m(n) {
			var e = o(!0, n);
			switch (e.charCodeAt(0)) {
				case 110:
					return "\n";
				case 114:
					return "\r";
				case 116:
					return "	";
				case 98:
					return "\b";
				case 118:
					return "\x0B";
				case 102:
					return "\f";
				case 48:
					return "\x00";
				case 120:
					return String.fromCharCode(v(2));
				case 117:
					return String.fromCharCode(v(4));
				case 10:
					return "";
				case 13:
					if ("\n" == i()) return o(!0, n), ""
			}
			return e
		}

		function v(n) {
			for (var e = 0; n > 0; --n) {
				var t = parseInt(o(!0), 16);
				isNaN(t) && d("Invalid hex-character pattern in string"), e = e << 4 | t
			}
			return e
		}

		function _(n) {
			var e, t = k.regex_allowed, r = s("\n");
			return -1 == r ? (e = k.text.substr(k.pos), k.pos = k.text.length) : (e = k.text.substring(k.pos, r), k.pos = r), k.col = k.tokcol + (k.pos - k.tokpos), k.comments_before.push(f(n, e, !0)), k.regex_allowed = t, C()
		}

		function g() {
			for (var n, e, t = !1, r = "", a = !1; null != (n = i());) if (t) "u" != n && d("Expecting UnicodeEscapeSequence -- uXXXX"), n = m(), B(n) || d("Unicode char: " + n.charCodeAt(0) + " is not valid in identifier"), r += n, t = !1; else if ("\\" == n) a = t = !0, o(); else {
				if (!B(n)) break;
				r += o()
			}
			return Fe(r) && a && (e = r.charCodeAt(0).toString(16).toUpperCase(), r = "\\u" + "0000".substr(e.length) + e + r.slice(1)), r
		}

		function b(n) {
			function e(n) {
				if (!i()) return n;
				var t = n + i();
				return $e(t) ? (o(), e(t)) : n
			}

			return f("operator", e(n || o()))
		}

		function y() {
			switch (o(), i()) {
				case"/":
					return o(), _("comment1");
				case"*":
					return o(), q()
			}
			return k.regex_allowed ? M("") : b("/")
		}

		function A() {
			return o(), w(i().charCodeAt(0)) ? h(".") : f("punc", ".")
		}

		function D() {
			var n = g();
			return S ? f("name", n) : Ce(n) ? f("atom", n) : Fe(n) ? $e(n) ? f("operator", n) : f("keyword", n) : f("name", n)
		}

		function F(n, e) {
			return function (t) {
				try {
					return e(t)
				} catch (r) {
					if (r !== He) throw r;
					d(n)
				}
			}
		}

		function C(n) {
			if (null != n) return M(n);
			if (l(), c(), t) {
				if (u("<!--")) return a(4), _("comment3");
				if (u("-->") && k.newline_before) return a(3), _("comment4")
			}
			var e = i();
			if (!e) return f("eof");
			var s = e.charCodeAt(0);
			switch (s) {
				case 34:
				case 39:
					return $(e);
				case 46:
					return A();
				case 47:
					return y()
			}
			return w(s) ? h() : Me(e) ? f("punc", o()) : Be(e) ? b() : 92 == s || x(s) ? D() : r && 0 == k.pos && u("#!") ? (a(2), _("comment5")) : void d("Unexpected character '" + e + "'")
		}

		var k = {
			text: n,
			filename: e,
			pos: 0,
			tokpos: 0,
			line: 1,
			tokline: 0,
			col: 0,
			tokcol: 0,
			newline_before: !1,
			regex_allowed: !1,
			comments_before: []
		}, S = !1, $ = F("Unterminated string constant", function (n) {
			for (var e = o(), t = ""; ;) {
				var r = o(!0, !0);
				if ("\\" == r) {
					var i = 0, a = null;
					r = p(function (n) {
						if (n >= "0" && "7" >= n) {
							if (!a) return a = n, ++i;
							if ("3" >= a && 2 >= i) return ++i;
							if (a >= "4" && 1 >= i) return ++i
						}
						return !1
					}), r = i > 0 ? String.fromCharCode(parseInt(r, 8)) : m(!0)
				} else if (r == e) break;
				t += r
			}
			var u = f("string", t);
			return u.quote = n, u
		}), q = F("Unterminated multiline comment", function () {
			var n = k.regex_allowed, e = s("*/", !0), t = k.text.substring(k.pos, e), r = t.split("\n"), i = r.length;
			k.pos = e + 2, k.line += i - 1, i > 1 ? k.col = r[i - 1].length : k.col += r[i - 1].length, k.col += 2;
			var o = k.newline_before = k.newline_before || t.indexOf("\n") >= 0;
			return k.comments_before.push(f("comment2", t, !0)), k.regex_allowed = n, k.newline_before = o, C()
		}), M = F("Unterminated regular expression", function (n) {
			for (var e, t = !1, r = !1; e = o(!0);) if (t) n += "\\" + e, t = !1; else if ("[" == e) r = !0, n += e; else if ("]" == e && r) r = !1, n += e; else {
				if ("/" == e && !r) break;
				"\\" == e ? t = !0 : n += e
			}
			var i = g();
			try {
				return f("regexp", new RegExp(n, i))
			} catch (a) {
				d(a.message)
			}
		});
		return C.context = function (n) {
			return n && (k = n), k
		}, C
	}

	function z(n, e) {
		function t(n, e) {
			return q(I.token, n, e)
		}

		function r() {
			return I.peeked || (I.peeked = I.input())
		}

		function i() {
			return I.prev = I.token, I.peeked ? (I.token = I.peeked, I.peeked = null) : I.token = I.input(), I.in_directives = I.in_directives && ("string" == I.token.type || t("punc", ";")), I.token
		}

		function a() {
			return I.prev
		}

		function u(n, e, t, r) {
			var i = I.input.context();
			O(n, i.filename, null != e ? e : i.tokline, null != t ? t : i.tokcol, null != r ? r : i.tokpos)
		}

		function c(n, e) {
			u(e, n.line, n.col)
		}

		function f(n) {
			null == n && (n = I.token), c(n, "Unexpected token: " + n.type + " (" + n.value + ")")
		}

		function l(n, e) {
			return t(n, e) ? i() : void c(I.token, "Unexpected token " + I.token.type + " «" + I.token.value + "», expected " + n + " «" + e + "»")
		}

		function p(n) {
			return l("punc", n)
		}

		function d() {
			return !e.strict && (I.token.nlb || t("eof") || t("punc", "}"))
		}

		function h() {
			t("punc", ";") ? i() : d() || f()
		}

		function m() {
			p("(");
			var n = Fn(!0);
			return p(")"), n
		}

		function v(n) {
			return function () {
				var e = I.token, t = n(), r = a();
				return t.start = e, t.end = r, t
			}
		}

		function _() {
			(t("operator", "/") || t("operator", "/=")) && (I.peeked = null, I.token = I.input(I.token.value.substr(1)))
		}

		function g() {
			var n = H(se);
			o(function (e) {
				return e.name == n.name
			}, I.labels) && u("Label " + n.name + " defined twice"), p(":"), I.labels.push(n);
			var e = L();
			return I.labels.pop(), e instanceof tn || n.references.forEach(function (e) {
				e instanceof wn && (e = e.label.start, u("Continue label `" + n.name + "` refers to non-IterationStatement.", e.line, e.col, e.pos))
			}), new en({body: e, label: n})
		}

		function b(n) {
			return new X({body: (n = Fn(!0), h(), n)})
		}

		function y(n) {
			var e, t = null;
			d() || (t = H(fe, !0)), null != t ? (e = o(function (n) {
				return n.name == t.name
			}, I.labels), e || u("Undefined label " + t.name), t.thedef = e) : 0 == I.in_loop && u(n.TYPE + " not inside a loop or switch"), h();
			var r = new n({label: t});
			return e && e.references.push(r), r
		}

		function A() {
			p("(");
			var n = null;
			return !t("punc", ";") && (n = t("keyword", "var") ? (i(), V(!0)) : Fn(!0, !0), t("operator", "in")) ? (n instanceof $n && n.definitions.length > 1 && u("Only one variable declaration allowed in for..in loop"), i(), E(n)) : w(n)
		}

		function w(n) {
			p(";");
			var e = t("punc", ";") ? null : Fn(!0);
			p(";");
			var r = t("punc", ")") ? null : Fn(!0);
			return p(")"), new un({init: n, condition: e, step: r, body: R(L)})
		}

		function E(n) {
			var e = n instanceof $n ? n.definitions[0].name : null, t = Fn(!0);
			return p(")"), new sn({init: n, name: e, object: t, body: R(L)})
		}

		function D() {
			var n = m(), e = L(), r = null;
			return t("keyword", "else") && (i(), r = L()), new En({condition: n, body: e, alternative: r})
		}

		function F() {
			p("{");
			for (var n = []; !t("punc", "}");) t("eof") && f(), n.push(L());
			return i(), n
		}

		function C() {
			p("{");
			for (var n, e = [], r = null, o = null; !t("punc", "}");) t("eof") && f(), t("keyword", "case") ? (o && (o.end = a()), r = [], o = new kn({
				start: (n = I.token, i(), n),
				expression: Fn(!0),
				body: r
			}), e.push(o), p(":")) : t("keyword", "default") ? (o && (o.end = a()), r = [], o = new Cn({
				start: (n = I.token, i(), p(":"), n),
				body: r
			}), e.push(o)) : (r || f(), r.push(L()));
			return o && (o.end = a()), i(), e
		}

		function k() {
			var n = F(), e = null, r = null;
			if (t("keyword", "catch")) {
				var o = I.token;
				i(), p("(");
				var s = H(ue);
				p(")"), e = new Bn({start: o, argname: s, body: F(), end: a()})
			}
			if (t("keyword", "finally")) {
				var o = I.token;
				i(), r = new Sn({start: o, body: F(), end: a()})
			}
			return e || r || u("Missing catch/finally blocks"), new xn({body: n, bcatch: e, bfinally: r})
		}

		function x(n, e) {
			for (var r = []; r.push(new qn({
				start: I.token,
				name: H(e ? re : te),
				value: t("operator", "=") ? (i(), Fn(!1, n)) : null,
				end: a()
			})), t("punc", ",");) i();
			return r
		}

		function B() {
			var n, e = I.token;
			switch (e.type) {
				case"name":
				case"keyword":
					n = z(ce);
					break;
				case"num":
					n = new he({start: e, end: e, value: e.value});
					break;
				case"string":
					n = new de({start: e, end: e, value: e.value, quote: e.quote});
					break;
				case"regexp":
					n = new me({start: e, end: e, value: e.value});
					break;
				case"atom":
					switch (e.value) {
						case"false":
							n = new Ee({start: e, end: e});
							break;
						case"true":
							n = new De({start: e, end: e});
							break;
						case"null":
							n = new _e({start: e, end: e})
					}
			}
			return i(), n
		}

		function S(n, e, r) {
			for (var o = !0, a = []; !t("punc", n) && (o ? o = !1 : p(","), !e || !t("punc", n));) t("punc", ",") && r ? a.push(new ye({
				start: I.token,
				end: I.token
			})) : a.push(Fn(!1));
			return i(), a
		}

		function T() {
			var n = I.token;
			switch (i(), n.type) {
				case"num":
				case"string":
				case"name":
				case"operator":
				case"keyword":
				case"atom":
					return n.value;
				default:
					f()
			}
		}

		function $() {
			var n = I.token;
			switch (i(), n.type) {
				case"name":
				case"operator":
				case"keyword":
				case"atom":
					return n.value;
				default:
					f()
			}
		}

		function z(n) {
			var e = I.token.value;
			return new ("this" == e ? le : n)({name: String(e), start: I.token, end: I.token})
		}

		function H(n, e) {
			if (!t("name")) return e || u("Name expected"), null;
			var r = z(n);
			return i(), r
		}

		function N(n, e, t) {
			return "++" != e && "--" != e || P(t) || u("Invalid use of " + e + " operator"), new n({
				operator: e,
				expression: t
			})
		}

		function j(n) {
			return vn(pn(!0), 0, n)
		}

		function P(n) {
			return e.strict ? n instanceof le ? !1 : n instanceof Nn || n instanceof Qn : !0
		}

		function R(n) {
			++I.in_loop;
			var e = n();
			return --I.in_loop, e
		}

		e = s(e, {
			strict: !1,
			filename: null,
			toplevel: null,
			expression: !1,
			html5_comments: !0,
			bare_returns: !1,
			shebang: !0
		});
		var I = {
			input: "string" == typeof n ? M(n, e.filename, e.html5_comments, e.shebang) : n,
			token: null,
			prev: null,
			peeked: null,
			in_function: 0,
			in_directives: !0,
			in_loop: 0,
			labels: []
		};
		I.token = i();
		var L = v(function () {
			var n;
			switch (_(), I.token.type) {
				case"string":
					var o = I.in_directives, s = b();
					return o && s.body instanceof de && !t("punc", ",") ? new G({
						start: s.body.start,
						end: s.body.end,
						quote: s.body.quote,
						value: s.body.value
					}) : s;
				case"num":
				case"regexp":
				case"operator":
				case"atom":
					return b();
				case"name":
					return q(r(), "punc", ":") ? g() : b();
				case"punc":
					switch (I.token.value) {
						case"{":
							return new K({start: I.token, body: F(), end: a()});
						case"[":
						case"(":
							return b();
						case";":
							return i(), new Q;
						default:
							f()
					}
				case"keyword":
					switch (n = I.token.value, i(), n) {
						case"break":
							return y(An);
						case"continue":
							return y(wn);
						case"debugger":
							return h(), new J;
						case"do":
							return new on({body: R(L), condition: (l("keyword", "while"), n = m(), h(), n)});
						case"while":
							return new an({condition: m(), body: R(L)});
						case"for":
							return A();
						case"function":
							return U(mn);
						case"if":
							return D();
						case"return":
							return 0 != I.in_function || e.bare_returns || u("'return' outside of function"), new gn({value: t("punc", ";") ? (i(), null) : d() ? null : (n = Fn(!0), h(), n)});
						case"switch":
							return new Dn({expression: m(), body: R(C)});
						case"throw":
							return I.token.nlb && u("Illegal newline after 'throw'"), new bn({value: (n = Fn(!0), h(), n)});
						case"try":
							return k();
						case"var":
							return n = V(), h(), n;
						case"const":
							return n = Y(), h(), n;
						case"with":
							return new cn({expression: m(), body: L()});
						default:
							f()
					}
			}
		}), U = function (n) {
			var e = n === mn, r = t("name") ? H(e ? oe : ae) : null;
			return e && !r && f(), p("("), new n({
				name: r, argnames: function (n, e) {
					for (; !t("punc", ")");) n ? n = !1 : p(","), e.push(H(ie));
					return i(), e
				}(!0, []), body: function (n, e) {
					++I.in_function, I.in_directives = !0, I.in_loop = 0, I.labels = [];
					var t = F();
					return --I.in_function, I.in_loop = n, I.labels = e, t
				}(I.in_loop, I.labels)
			})
		}, V = function (n) {
			return new $n({start: a(), definitions: x(n, !1), end: a()})
		}, Y = function () {
			return new On({start: a(), definitions: x(!1, !0), end: a()})
		}, W = function (n) {
			var e = I.token;
			l("operator", "new");
			var r, o = Z(!1);
			return t("punc", "(") ? (i(), r = S(")")) : r = [], fn(new zn({
				start: e,
				expression: o,
				args: r,
				end: a()
			}), n)
		}, Z = function (n) {
			if (t("operator", "new")) return W(n);
			var e = I.token;
			if (t("punc")) {
				switch (e.value) {
					case"(":
						i();
						var r = Fn(!0);
						return r.start = e, r.end = I.token, p(")"), fn(r, n);
					case"[":
						return fn(nn(), n);
					case"{":
						return fn(rn(), n)
				}
				f()
			}
			if (t("keyword", "function")) {
				i();
				var o = U(hn);
				return o.start = e, o.end = a(), fn(o, n)
			}
			return Ie[I.token.type] ? fn(B(), n) : void f()
		}, nn = v(function () {
			return p("["), new Wn({elements: S("]", !e.strict, !0)})
		}), rn = v(function () {
			p("{");
			for (var n = !0, r = []; !t("punc", "}") && (n ? n = !1 : p(","), e.strict || !t("punc", "}"));) {
				var o = I.token, u = o.type, s = T();
				if ("name" == u && !t("punc", ":")) {
					if ("get" == s) {
						r.push(new Kn({start: o, key: B(), value: U(dn), end: a()}));
						continue
					}
					if ("set" == s) {
						r.push(new Zn({start: o, key: B(), value: U(dn), end: a()}));
						continue
					}
				}
				p(":"), r.push(new Xn({start: o, quote: o.quote, key: s, value: Fn(!1), end: a()}))
			}
			return i(), new Jn({properties: r})
		}), fn = function (n, e) {
			var r = n.start;
			if (t("punc", ".")) return i(), fn(new jn({start: r, expression: n, property: $(), end: a()}), e);
			if (t("punc", "[")) {
				i();
				var o = Fn(!0);
				return p("]"), fn(new Pn({start: r, expression: n, property: o, end: a()}), e)
			}
			return e && t("punc", "(") ? (i(), fn(new Mn({start: r, expression: n, args: S(")"), end: a()}), !0)) : n
		}, pn = function (n) {
			var e = I.token;
			if (t("operator") && Ne(e.value)) {
				i(), _();
				var r = N(In, e.value, pn(n));
				return r.start = e, r.end = a(), r
			}
			for (var o = Z(n); t("operator") && je(I.token.value) && !I.token.nlb;) o = N(Ln, I.token.value, o), o.start = e, o.end = I.token, i();
			return o
		}, vn = function (n, e, r) {
			var o = t("operator") ? I.token.value : null;
			"in" == o && r && (o = null);
			var a = null != o ? Re[o] : null;
			if (null != a && a > e) {
				i();
				var u = vn(pn(!0), a, r);
				return vn(new Un({start: n.start, left: n, operator: o, right: u, end: u.end}), e, r)
			}
			return n
		}, _n = function (n) {
			var e = I.token, r = j(n);
			if (t("operator", "?")) {
				i();
				var o = Fn(!1);
				return p(":"), new Vn({start: e, condition: r, consequent: o, alternative: Fn(!1, n), end: a()})
			}
			return r
		}, yn = function (n) {
			var e = I.token, r = _n(n), o = I.token.value;
			if (t("operator") && Pe(o)) {
				if (P(r)) return i(), new Yn({start: e, left: r, operator: o, right: yn(n), end: a()});
				u("Invalid assignment")
			}
			return r
		}, Fn = function (n, e) {
			var o = I.token, a = yn(e);
			return n && t("punc", ",") ? (i(), new Hn({start: o, car: a, cdr: Fn(!0, e), end: r()})) : a
		};
		return e.expression ? Fn(!0) : function () {
			for (var n = I.token, r = []; !t("eof");) r.push(L());
			var i = a(), o = e.toplevel;
			return o ? (o.body = o.body.concat(r), o.end = i) : o = new ln({start: n, body: r, end: i}), o
		}()
	}

	function H(n, e) {
		y.call(this), this.before = n, this.after = e
	}

	function N(n, e, t) {
		this.name = t.name, this.orig = [t], this.scope = n, this.references = [], this.global = !1, this.mangled_name = null, this.undeclared = !1, this.constant = !1, this.index = e
	}

	function j(n) {
		function e(n, e) {
			return n.replace(/[\u0080-\uffff]/g, function (n) {
				var t = n.charCodeAt(0).toString(16);
				if (t.length <= 2 && !e) {
					for (; t.length < 2;) t = "0" + t;
					return "\\x" + t
				}
				for (; t.length < 4;) t = "0" + t;
				return "\\u" + t
			})
		}

		function t(t, r) {
			function i() {
				return "'" + t.replace(/\x27/g, "\\'") + "'"
			}

			function o() {
				return '"' + t.replace(/\x22/g, '\\"') + '"'
			}

			var a = 0, u = 0;
			switch (t = t.replace(/[\\\b\f\n\r\v\t\x22\x27\u2028\u2029\0\ufeff]/g, function (e) {
				switch (e) {
					case"\\":
						return "\\\\";
					case"\b":
						return "\\b";
					case"\f":
						return "\\f";
					case"\n":
						return "\\n";
					case"\r":
						return "\\r";
					case"\x0B":
						return n.screw_ie8 ? "\\v" : "\\x0B";
					case"\u2028":
						return "\\u2028";
					case"\u2029":
						return "\\u2029";
					case'"':
						return ++a, '"';
					case"'":
						return ++u, "'";
					case"\x00":
						return "\\x00";
					case"\ufeff":
						return "\\ufeff"
				}
				return e
			}), n.ascii_only && (t = e(t)), n.quote_style) {
				case 1:
					return i();
				case 2:
					return o();
				case 3:
					return "'" == r ? i() : o();
				default:
					return a > u ? i() : o()
			}
		}

		function r(e, r) {
			var i = t(e, r);
			return n.inline_script && (i = i.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1"), i = i.replace(/\x3c!--/g, "\\x3c!--"), i = i.replace(/--\x3e/g, "--\\x3e")), i
		}

		function i(t) {
			return t = t.toString(), n.ascii_only && (t = e(t, !0)), t
		}

		function o(e) {
			return a(" ", n.indent_start + A - e * n.indent_level)
		}

		function u() {
			return x.charAt(x.length - 1)
		}

		function c() {
			n.max_line_len && w > n.max_line_len && l("\n")
		}

		function l(e) {
			e = String(e);
			var t = e.charAt(0);
			if (k && (k = !1, t && !(";}".indexOf(t) < 0) || /[;]$/.test(x) || (n.semicolons || S(t) ? (F += ";", w++, D++) : (F += "\n", D++, E++, w = 0, /^\s+$/.test(e) && (k = !0)), n.beautify || (C = !1))), !n.beautify && n.preserve_line && H[H.length - 1]) for (var r = H[H.length - 1].start.line; r > E;) F += "\n", D++, E++, w = 0, C = !1;
			if (C) {
				var i = u();
				(B(i) && (B(t) || "\\" == t) || /^[\+\-\/]$/.test(t) && t == i) && (F += " ", w++, D++), C = !1
			}
			var o = e.split(/\r?\n/), a = o.length - 1;
			E += a, 0 == a ? w += o[a].length : w = o[a].length, D += e.length, x = e, F += e
		}

		function p() {
			k = !1, l(";")
		}

		function d() {
			return A + n.indent_level
		}

		function h(n) {
			var e;
			return l("{"), q(), O(d(), function () {
				e = n()
			}), $(), l("}"), e
		}

		function v(n) {
			l("(");
			var e = n();
			return l(")"), e
		}

		function _(n) {
			l("[");
			var e = n();
			return l("]"), e
		}

		function g() {
			l(","), T()
		}

		function b() {
			l(":"), n.space_colon && T()
		}

		function y() {
			return F
		}

		n = s(n, {
			indent_start: 0,
			indent_level: 4,
			quote_keys: !1,
			space_colon: !0,
			ascii_only: !1,
			unescape_regexps: !1,
			inline_script: !1,
			width: 80,
			max_line_len: 32e3,
			beautify: !1,
			source_map: null,
			bracketize: !1,
			semicolons: !0,
			comments: !1,
			shebang: !0,
			preserve_line: !1,
			screw_ie8: !1,
			preamble: null,
			quote_style: 0
		}, !0);
		var A = 0, w = 0, E = 1, D = 0, F = "", C = !1, k = !1, x = null, S = m("( [ + * / - , ."),
			T = n.beautify ? function () {
				l(" ")
			} : function () {
				C = !0
			}, $ = n.beautify ? function (e) {
				n.beautify && l(o(e ? .5 : 0))
			} : f, O = n.beautify ? function (n, e) {
				n === !0 && (n = d());
				var t = A;
				A = n;
				var r = e();
				return A = t, r
			} : function (n, e) {
				return e()
			}, q = n.beautify ? function () {
				l("\n")
			} : c, M = n.beautify ? function () {
				l(";")
			} : function () {
				k = !0
			}, z = n.source_map ? function (e, t) {
				try {
					e && n.source_map.add(e.file || "?", E, w, e.line, e.col, t || "name" != e.type ? t : e.value)
				} catch (r) {
					Y.warn("Couldn't figure out mapping for {file}:{line},{col} → {cline},{ccol} [{name}]", {
						file: e.file,
						line: e.line,
						col: e.col,
						cline: E,
						ccol: w,
						name: t || ""
					})
				}
			} : f;
		n.preamble && l(n.preamble.replace(/\r\n?|[\n\u2028\u2029]|\s*$/g, "\n"));
		var H = [];
		return {
			get: y,
			toString: y,
			indent: $,
			indentation: function () {
				return A
			},
			current_width: function () {
				return w - A
			},
			should_break: function () {
				return n.width && this.current_width() >= n.width
			},
			newline: q,
			print: l,
			space: T,
			comma: g,
			colon: b,
			last: function () {
				return x
			},
			semicolon: M,
			force_semicolon: p,
			to_ascii: e,
			print_name: function (n) {
				l(i(n))
			},
			print_string: function (n, e) {
				l(r(n, e))
			},
			next_indent: d,
			with_indent: O,
			with_block: h,
			with_parens: v,
			with_square: _,
			add_mapping: z,
			option: function (e) {
				return n[e]
			},
			line: function () {
				return E
			},
			col: function () {
				return w
			},
			pos: function () {
				return D
			},
			push_node: function (n) {
				H.push(n)
			},
			pop_node: function () {
				return H.pop()
			},
			stack: function () {
				return H
			},
			parent: function (n) {
				return H[H.length - 2 - (n || 0)]
			}
		}
	}

	function P(n, e) {
		return this instanceof P ? (H.call(this, this.before, this.after), void(this.options = s(n, {
			sequences: !e,
			properties: !e,
			dead_code: !e,
			drop_debugger: !e,
			unsafe: !1,
			unsafe_comps: !1,
			conditionals: !e,
			comparisons: !e,
			evaluate: !e,
			booleans: !e,
			loops: !e,
			unused: !e,
			hoist_funs: !e,
			keep_fargs: !0,
			keep_fnames: !1,
			hoist_vars: !1,
			if_return: !e,
			join_vars: !e,
			cascade: !e,
			side_effects: !e,
			pure_getters: !1,
			pure_funcs: null,
			negate_iife: !e,
			screw_ie8: !1,
			drop_console: !1,
			angular: !1,
			warnings: !0,
			global_defs: {}
		}, !0))) : new P(n, e)
	}

	function R(n) {
		function e(e, i, o, a, u, s) {
			if (r) {
				var c = r.originalPositionFor({line: a, column: u});
				if (null === c.source) return;
				e = c.source, a = c.line, u = c.column, s = c.name || s
			}
			t.addMapping({
				generated: {line: i + n.dest_line_diff, column: o},
				original: {line: a + n.orig_line_diff, column: u},
				source: e,
				name: s
			})
		}

		n = s(n, {file: null, root: null, orig: null, orig_line_diff: 0, dest_line_diff: 0});
		var t, r = n.orig && new MOZ_SourceMap.SourceMapConsumer(n.orig);
		return t = r ? MOZ_SourceMap.SourceMapGenerator.fromSourceMap(r) : new MOZ_SourceMap.SourceMapGenerator({
			file: n.file,
			sourceRoot: n.root
		}), {
			add: e, get: function () {
				return t
			}, toString: function () {
				return JSON.stringify(t.toJSON())
			}
		}
	}

	function I() {
		function n(n) {
			l(e, n)
		}

		var e = [];
		return [Object, Array, Function, Number, String, Boolean, Error, Math, Date, RegExp].forEach(function (e) {
			Object.getOwnPropertyNames(e).map(n), e.prototype && Object.getOwnPropertyNames(e.prototype).map(n)
		}), e
	}

	function L(n, e) {
		function t(n) {
			return h.indexOf(n) >= 0 ? !1 : c.indexOf(n) >= 0 ? !1 : e.only_cache ? f.props.has(n) : !/^[0-9.]+$/.test(n)
		}

		function r(n) {
			return p && !p.test(n) ? !1 : c.indexOf(n) >= 0 ? !1 : f.props.has(n) || d.indexOf(n) >= 0
		}

		function i(n) {
			t(n) && l(d, n), r(n) || l(h, n)
		}

		function o(n) {
			if (!r(n)) return n;
			var e = f.props.get(n);
			if (!e) {
				do e = Le(++f.cname); while (!t(e));
				f.props.set(n, e)
			}
			return e
		}

		function a(n) {
			var e = {};
			try {
				!function r(n) {
					n.walk(new y(function (n) {
						if (n instanceof Hn) return r(n.cdr), !0;
						if (n instanceof de) return i(n.value), !0;
						if (n instanceof Vn) return r(n.consequent), r(n.alternative), !0;
						throw e
					}))
				}(n)
			} catch (t) {
				if (t !== e) throw t
			}
		}

		function u(n) {
			return n.transform(new H(function (n) {
				return n instanceof Hn ? n.cdr = u(n.cdr) : n instanceof de ? n.value = o(n.value) : n instanceof Vn && (n.consequent = u(n.consequent), n.alternative = u(n.alternative)), n
			}))
		}

		e = s(e, {reserved: null, cache: null, only_cache: !1, regex: null});
		var c = e.reserved;
		null == c && (c = I());
		var f = e.cache;
		null == f && (f = {cname: -1, props: new _});
		var p = e.regex, d = [], h = [];
		return n.walk(new y(function (n) {
			n instanceof Xn ? i(n.key) : n instanceof Gn ? i(n.key.name) : n instanceof jn ? this.parent() instanceof Yn && i(n.property) : n instanceof Pn && this.parent() instanceof Yn && a(n.property)
		})), n.transform(new H(function (n) {
			n instanceof Xn ? n.key = o(n.key) : n instanceof Gn ? n.key.name = o(n.key.name) : n instanceof jn ? n.property = o(n.property) : n instanceof Pn && (n.property = u(n.property))
		}))
	}

	u.prototype = Object.create(Error.prototype), u.prototype.constructor = u, u.croak = function (n, e) {
		throw new u(n, e)
	};
	var U = function () {
		function n(n, o, a) {
			function u() {
				var u = o(n[s], s), l = u instanceof r;
				return l && (u = u.v), u instanceof e ? (u = u.v, u instanceof t ? f.push.apply(f, a ? u.v.slice().reverse() : u.v) : f.push(u)) : u !== i && (u instanceof t ? c.push.apply(c, a ? u.v.slice().reverse() : u.v) : c.push(u)), l
			}

			var s, c = [], f = [];
			if (n instanceof Array) if (a) {
				for (s = n.length; --s >= 0 && !u();) ;
				c.reverse(), f.reverse()
			} else for (s = 0; s < n.length && !u(); ++s) ; else for (s in n) if (n.hasOwnProperty(s) && u()) break;
			return f.concat(c)
		}

		function e(n) {
			this.v = n
		}

		function t(n) {
			this.v = n
		}

		function r(n) {
			this.v = n
		}

		n.at_top = function (n) {
			return new e(n)
		}, n.splice = function (n) {
			return new t(n)
		}, n.last = function (n) {
			return new r(n)
		};
		var i = n.skip = {};
		return n
	}();
	_.prototype = {
		set: function (n, e) {
			return this.has(n) || ++this._size, this._values["$" + n] = e, this
		}, add: function (n, e) {
			return this.has(n) ? this.get(n).push(e) : this.set(n, [e]), this
		}, get: function (n) {
			return this._values["$" + n]
		}, del: function (n) {
			return this.has(n) && (--this._size, delete this._values["$" + n]), this
		}, has: function (n) {
			return "$" + n in this._values
		}, each: function (n) {
			for (var e in this._values) n(this._values[e], e.substr(1))
		}, size: function () {
			return this._size
		}, map: function (n) {
			var e = [];
			for (var t in this._values) e.push(n(this._values[t], t.substr(1)));
			return e
		}, toObject: function () {
			return this._values
		}
	}, _.fromObject = function (n) {
		var e = new _;
		return e._size = c(e._values, n), e
	};
	var V = g("Token", "type value line col pos endline endcol endpos nlb comments_before file raw", {}, null),
		Y = g("Node", "start end", {
			clone: function () {
				return new this.CTOR(this)
			},
			$documentation: "Base class of all AST nodes",
			$propdoc: {
				start: "[AST_Token] The first token of this node",
				end: "[AST_Token] The last token of this node"
			},
			_walk: function (n) {
				return n._visit(this)
			},
			walk: function (n) {
				return this._walk(n)
			}
		}, null);
	Y.warn_function = null, Y.warn = function (n, e) {
		Y.warn_function && Y.warn_function(p(n, e))
	};
	var W = g("Statement", null, {$documentation: "Base class of all statements"}),
		J = g("Debugger", null, {$documentation: "Represents a debugger statement"}, W),
		G = g("Directive", "value scope quote", {
			$documentation: 'Represents a directive, like "use strict";',
			$propdoc: {
				value: "[string] The value of this directive as a plain string (it's not an AST_String!)",
				scope: "[AST_Scope/S] The scope that this directive affects",
				quote: "[string] the original quote character"
			}
		}, W), X = g("SimpleStatement", "body", {
			$documentation: "A statement consisting of an expression, i.e. a = 1 + 2",
			$propdoc: {body: "[AST_Node] an expression node (should not be instanceof AST_Statement)"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.body._walk(n)
				})
			}
		}, W), Z = g("Block", "body", {
			$documentation: "A body of statements (usually bracketed)",
			$propdoc: {body: "[AST_Statement*] an array of statements"},
			_walk: function (n) {
				return n._visit(this, function () {
					b(this, n)
				})
			}
		}, W), K = g("BlockStatement", null, {$documentation: "A block statement"}, Z), Q = g("EmptyStatement", null, {
			$documentation: "The empty statement (empty block or simply a semicolon)",
			_walk: function (n) {
				return n._visit(this)
			}
		}, W), nn = g("StatementWithBody", "body", {
			$documentation: "Base class for all statements that contain one nested body: `For`, `ForIn`, `Do`, `While`, `With`",
			$propdoc: {body: "[AST_Statement] the body; this should always be present, even if it's an AST_EmptyStatement"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.body._walk(n)
				})
			}
		}, W), en = g("LabeledStatement", "label", {
			$documentation: "Statement with a label",
			$propdoc: {label: "[AST_Label] a label definition"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.label._walk(n), this.body._walk(n)
				})
			}
		}, nn), tn = g("IterationStatement", null, {$documentation: "Internal class.  All loops inherit from it."}, nn),
		rn = g("DWLoop", "condition", {
			$documentation: "Base class for do/while statements",
			$propdoc: {condition: "[AST_Node] the loop condition.  Should not be instanceof AST_Statement"}
		}, tn), on = g("Do", null, {
			$documentation: "A `do` statement", _walk: function (n) {
				return n._visit(this, function () {
					this.body._walk(n), this.condition._walk(n)
				})
			}
		}, rn), an = g("While", null, {
			$documentation: "A `while` statement", _walk: function (n) {
				return n._visit(this, function () {
					this.condition._walk(n), this.body._walk(n)
				})
			}
		}, rn), un = g("For", "init condition step", {
			$documentation: "A `for` statement",
			$propdoc: {
				init: "[AST_Node?] the `for` initialization code, or null if empty",
				condition: "[AST_Node?] the `for` termination clause, or null if empty",
				step: "[AST_Node?] the `for` update clause, or null if empty"
			},
			_walk: function (n) {
				return n._visit(this, function () {
					this.init && this.init._walk(n), this.condition && this.condition._walk(n), this.step && this.step._walk(n), this.body._walk(n)
				})
			}
		}, tn), sn = g("ForIn", "init name object", {
			$documentation: "A `for ... in` statement",
			$propdoc: {
				init: "[AST_Node] the `for/in` initialization code",
				name: "[AST_SymbolRef?] the loop variable, only if `init` is AST_Var",
				object: "[AST_Node] the object that we're looping through"
			},
			_walk: function (n) {
				return n._visit(this, function () {
					this.init._walk(n), this.object._walk(n), this.body._walk(n)
				})
			}
		}, tn), cn = g("With", "expression", {
			$documentation: "A `with` statement",
			$propdoc: {expression: "[AST_Node] the `with` expression"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.expression._walk(n), this.body._walk(n)
				})
			}
		}, nn), fn = g("Scope", "directives variables functions uses_with uses_eval parent_scope enclosed cname", {
			$documentation: "Base class for all statements introducing a lexical scope",
			$propdoc: {
				directives: "[string*/S] an array of directives declared in this scope",
				variables: "[Object/S] a map of name -> SymbolDef for all variables/functions defined in this scope",
				functions: "[Object/S] like `variables`, but only lists function declarations",
				uses_with: "[boolean/S] tells whether this scope uses the `with` statement",
				uses_eval: "[boolean/S] tells whether this scope contains a direct call to the global `eval`",
				parent_scope: "[AST_Scope?/S] link to the parent scope",
				enclosed: "[SymbolDef*/S] a list of all symbol definitions that are accessed from this scope or any subscopes",
				cname: "[integer/S] current index for mangling variables (used internally by the mangler)"
			}
		}, Z), ln = g("Toplevel", "globals", {
			$documentation: "The toplevel scope",
			$propdoc: {globals: "[Object/S] a map of name -> SymbolDef for all undeclared names"},
			wrap_enclose: function (n) {
				var e = this, t = [], r = [];
				n.forEach(function (n) {
					var e = n.lastIndexOf(":");
					t.push(n.substr(0, e)), r.push(n.substr(e + 1))
				});
				var i = "(function(" + r.join(",") + "){ '$ORIG'; })(" + t.join(",") + ")";
				return i = z(i), i = i.transform(new H(function (n) {
					return n instanceof G && "$ORIG" == n.value ? U.splice(e.body) : void 0
				}))
			},
			wrap_commonjs: function (n, e) {
				var t = this, r = [];
				e && (t.figure_out_scope(), t.walk(new y(function (n) {
					n instanceof ee && n.definition().global && (o(function (e) {
						return e.name == n.name
					}, r) || r.push(n))
				})));
				var i = "(function(exports, global){ '$ORIG'; '$EXPORTS'; global['" + n + "'] = exports; }({}, (function(){return this}())))";
				return i = z(i), i = i.transform(new H(function (n) {
					if (n instanceof G) switch (n.value) {
						case"$ORIG":
							return U.splice(t.body);
						case"$EXPORTS":
							var e = [];
							return r.forEach(function (n) {
								e.push(new X({
									body: new Yn({
										left: new Pn({
											expression: new ce({name: "exports"}),
											property: new de({value: n.name})
										}), operator: "=", right: new ce(n)
									})
								}))
							}), U.splice(e)
					}
				}))
			}
		}, fn), pn = g("Lambda", "name argnames uses_arguments", {
			$documentation: "Base class for functions",
			$propdoc: {
				name: "[AST_SymbolDeclaration?] the name of this function",
				argnames: "[AST_SymbolFunarg*] array of function arguments",
				uses_arguments: "[boolean/S] tells whether this function accesses the arguments array"
			},
			_walk: function (n) {
				return n._visit(this, function () {
					this.name && this.name._walk(n), this.argnames.forEach(function (e) {
						e._walk(n)
					}), b(this, n)
				})
			}
		}, fn),
		dn = g("Accessor", null, {$documentation: "A setter/getter function.  The `name` property is always null."}, pn),
		hn = g("Function", null, {$documentation: "A function expression"}, pn),
		mn = g("Defun", null, {$documentation: "A function definition"}, pn),
		vn = g("Jump", null, {$documentation: "Base class for “jumps” (for now that's `return`, `throw`, `break` and `continue`)"}, W),
		_n = g("Exit", "value", {
			$documentation: "Base class for “exits” (`return` and `throw`)",
			$propdoc: {value: "[AST_Node?] the value returned or thrown by this statement; could be null for AST_Return"},
			_walk: function (n) {
				return n._visit(this, this.value && function () {
					this.value._walk(n)
				})
			}
		}, vn), gn = g("Return", null, {$documentation: "A `return` statement"}, _n),
		bn = g("Throw", null, {$documentation: "A `throw` statement"}, _n), yn = g("LoopControl", "label", {
			$documentation: "Base class for loop control statements (`break` and `continue`)",
			$propdoc: {label: "[AST_LabelRef?] the label, or null if none"},
			_walk: function (n) {
				return n._visit(this, this.label && function () {
					this.label._walk(n)
				})
			}
		}, vn), An = g("Break", null, {$documentation: "A `break` statement"}, yn),
		wn = g("Continue", null, {$documentation: "A `continue` statement"}, yn),
		En = g("If", "condition alternative", {
			$documentation: "A `if` statement",
			$propdoc: {
				condition: "[AST_Node] the `if` condition",
				alternative: "[AST_Statement?] the `else` part, or null if not present"
			},
			_walk: function (n) {
				return n._visit(this, function () {
					this.condition._walk(n), this.body._walk(n), this.alternative && this.alternative._walk(n)
				})
			}
		}, nn), Dn = g("Switch", "expression", {
			$documentation: "A `switch` statement",
			$propdoc: {expression: "[AST_Node] the `switch` “discriminant”"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.expression._walk(n), b(this, n)
				})
			}
		}, Z), Fn = g("SwitchBranch", null, {$documentation: "Base class for `switch` branches"}, Z),
		Cn = g("Default", null, {$documentation: "A `default` switch branch"}, Fn), kn = g("Case", "expression", {
			$documentation: "A `case` switch branch",
			$propdoc: {expression: "[AST_Node] the `case` expression"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.expression._walk(n), b(this, n)
				})
			}
		}, Fn), xn = g("Try", "bcatch bfinally", {
			$documentation: "A `try` statement",
			$propdoc: {
				bcatch: "[AST_Catch?] the catch block, or null if not present",
				bfinally: "[AST_Finally?] the finally block, or null if not present"
			},
			_walk: function (n) {
				return n._visit(this, function () {
					b(this, n), this.bcatch && this.bcatch._walk(n), this.bfinally && this.bfinally._walk(n)
				})
			}
		}, Z), Bn = g("Catch", "argname", {
			$documentation: "A `catch` node; only makes sense as part of a `try` statement",
			$propdoc: {argname: "[AST_SymbolCatch] symbol for the exception"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.argname._walk(n), b(this, n)
				})
			}
		}, Z),
		Sn = g("Finally", null, {$documentation: "A `finally` node; only makes sense as part of a `try` statement"}, Z),
		Tn = g("Definitions", "definitions", {
			$documentation: "Base class for `var` or `const` nodes (variable declarations/initializations)",
			$propdoc: {definitions: "[AST_VarDef*] array of variable definitions"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.definitions.forEach(function (e) {
						e._walk(n)
					})
				})
			}
		}, W), $n = g("Var", null, {$documentation: "A `var` statement"}, Tn),
		On = g("Const", null, {$documentation: "A `const` statement"}, Tn), qn = g("VarDef", "name value", {
			$documentation: "A variable declaration; only appears in a AST_Definitions node",
			$propdoc: {
				name: "[AST_SymbolVar|AST_SymbolConst] name of the variable",
				value: "[AST_Node?] initializer, or null of there's no initializer"
			},
			_walk: function (n) {
				return n._visit(this, function () {
					this.name._walk(n), this.value && this.value._walk(n)
				})
			}
		}), Mn = g("Call", "expression args", {
			$documentation: "A function call expression",
			$propdoc: {expression: "[AST_Node] expression to invoke as function", args: "[AST_Node*] array of arguments"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.expression._walk(n), this.args.forEach(function (e) {
						e._walk(n)
					})
				})
			}
		}),
		zn = g("New", null, {$documentation: "An object instantiation.  Derives from a function call since it has exactly the same properties"}, Mn),
		Hn = g("Seq", "car cdr", {
			$documentation: "A sequence expression (two comma-separated expressions)",
			$propdoc: {car: "[AST_Node] first element in sequence", cdr: "[AST_Node] second element in sequence"},
			$cons: function (n, e) {
				var t = new Hn(n);
				return t.car = n, t.cdr = e, t
			},
			$from_array: function (n) {
				if (0 == n.length) return null;
				if (1 == n.length) return n[0].clone();
				for (var e = null, t = n.length; --t >= 0;) e = Hn.cons(n[t], e);
				for (var r = e; r;) {
					if (r.cdr && !r.cdr.cdr) {
						r.cdr = r.cdr.car;
						break
					}
					r = r.cdr
				}
				return e
			},
			to_array: function () {
				for (var n = this, e = []; n;) {
					if (e.push(n.car), n.cdr && !(n.cdr instanceof Hn)) {
						e.push(n.cdr);
						break
					}
					n = n.cdr
				}
				return e
			},
			add: function (n) {
				for (var e = this; e;) {
					if (!(e.cdr instanceof Hn)) {
						var t = Hn.cons(e.cdr, n);
						return e.cdr = t
					}
					e = e.cdr
				}
			},
			_walk: function (n) {
				return n._visit(this, function () {
					this.car._walk(n), this.cdr && this.cdr._walk(n)
				})
			}
		}), Nn = g("PropAccess", "expression property", {
			$documentation: 'Base class for property access expressions, i.e. `a.foo` or `a["foo"]`',
			$propdoc: {
				expression: "[AST_Node] the “container” expression",
				property: "[AST_Node|string] the property to access.  For AST_Dot this is always a plain string, while for AST_Sub it's an arbitrary AST_Node"
			}
		}), jn = g("Dot", null, {
			$documentation: "A dotted property access expression", _walk: function (n) {
				return n._visit(this, function () {
					this.expression._walk(n)
				})
			}
		}, Nn), Pn = g("Sub", null, {
			$documentation: 'Index-style property access, i.e. `a["foo"]`', _walk: function (n) {
				return n._visit(this, function () {
					this.expression._walk(n), this.property._walk(n)
				})
			}
		}, Nn), Rn = g("Unary", "operator expression", {
			$documentation: "Base class for unary expressions",
			$propdoc: {
				operator: "[string] the operator",
				expression: "[AST_Node] expression that this unary operator applies to"
			},
			_walk: function (n) {
				return n._visit(this, function () {
					this.expression._walk(n)
				})
			}
		}), In = g("UnaryPrefix", null, {$documentation: "Unary prefix expression, i.e. `typeof i` or `++i`"}, Rn),
		Ln = g("UnaryPostfix", null, {$documentation: "Unary postfix expression, i.e. `i++`"}, Rn),
		Un = g("Binary", "left operator right", {
			$documentation: "Binary expression, i.e. `a + b`",
			$propdoc: {
				left: "[AST_Node] left-hand side expression",
				operator: "[string] the operator",
				right: "[AST_Node] right-hand side expression"
			},
			_walk: function (n) {
				return n._visit(this, function () {
					this.left._walk(n), this.right._walk(n)
				})
			}
		}), Vn = g("Conditional", "condition consequent alternative", {
			$documentation: "Conditional expression using the ternary operator, i.e. `a ? b : c`",
			$propdoc: {condition: "[AST_Node]", consequent: "[AST_Node]", alternative: "[AST_Node]"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.condition._walk(n), this.consequent._walk(n), this.alternative._walk(n)
				})
			}
		}), Yn = g("Assign", null, {$documentation: "An assignment expression — `a = b + 5`"}, Un),
		Wn = g("Array", "elements", {
			$documentation: "An array literal",
			$propdoc: {elements: "[AST_Node*] array of elements"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.elements.forEach(function (e) {
						e._walk(n)
					})
				})
			}
		}), Jn = g("Object", "properties", {
			$documentation: "An object literal",
			$propdoc: {properties: "[AST_ObjectProperty*] array of properties"},
			_walk: function (n) {
				return n._visit(this, function () {
					this.properties.forEach(function (e) {
						e._walk(n)
					})
				})
			}
		}), Gn = g("ObjectProperty", "key value", {
			$documentation: "Base class for literal object properties",
			$propdoc: {
				key: "[string] the property name converted to a string for ObjectKeyVal.  For setters and getters this is an arbitrary AST_Node.",
				value: "[AST_Node] property value.  For setters and getters this is an AST_Function."
			},
			_walk: function (n) {
				return n._visit(this, function () {
					this.value._walk(n)
				})
			}
		}), Xn = g("ObjectKeyVal", "quote", {
			$documentation: "A key: value object property",
			$propdoc: {quote: "[string] the original quote character"}
		}, Gn), Zn = g("ObjectSetter", null, {$documentation: "An object setter property"}, Gn),
		Kn = g("ObjectGetter", null, {$documentation: "An object getter property"}, Gn),
		Qn = g("Symbol", "scope name thedef", {
			$propdoc: {
				name: "[string] name of this symbol",
				scope: "[AST_Scope/S] the current scope (not necessarily the definition scope)",
				thedef: "[SymbolDef/S] the definition of this symbol"
			}, $documentation: "Base class for all symbols"
		}),
		ne = g("SymbolAccessor", null, {$documentation: "The name of a property accessor (setter/getter function)"}, Qn),
		ee = g("SymbolDeclaration", "init", {
			$documentation: "A declaration symbol (symbol in var/const, function name or argument, symbol in catch)",
			$propdoc: {init: "[AST_Node*/S] array of initializers for this declaration."}
		}, Qn), te = g("SymbolVar", null, {$documentation: "Symbol defining a variable"}, ee),
		re = g("SymbolConst", null, {$documentation: "A constant declaration"}, ee),
		ie = g("SymbolFunarg", null, {$documentation: "Symbol naming a function argument"}, te),
		oe = g("SymbolDefun", null, {$documentation: "Symbol defining a function"}, ee),
		ae = g("SymbolLambda", null, {$documentation: "Symbol naming a function expression"}, ee),
		ue = g("SymbolCatch", null, {$documentation: "Symbol naming the exception in catch"}, ee),
		se = g("Label", "references", {
			$documentation: "Symbol naming a label (declaration)",
			$propdoc: {references: "[AST_LoopControl*] a list of nodes referring to this label"},
			initialize: function () {
				this.references = [], this.thedef = this
			}
		}, Qn),
		ce = g("SymbolRef", null, {$documentation: "Reference to some symbol (not definition/declaration)"}, Qn),
		fe = g("LabelRef", null, {$documentation: "Reference to a label symbol"}, Qn),
		le = g("This", null, {$documentation: "The `this` symbol"}, Qn), pe = g("Constant", null, {
			$documentation: "Base class for all constants", getValue: function () {
				return this.value
			}
		}), de = g("String", "value quote", {
			$documentation: "A string literal",
			$propdoc: {value: "[string] the contents of this string", quote: "[string] the original quote character"}
		}, pe), he = g("Number", "value literal", {
			$documentation: "A number literal",
			$propdoc: {value: "[number] the numeric value", literal: "[string] numeric value as string (optional)"}
		}, pe), me = g("RegExp", "value", {
			$documentation: "A regexp literal",
			$propdoc: {value: "[RegExp] the actual regexp"}
		}, pe), ve = g("Atom", null, {$documentation: "Base class for atoms"}, pe),
		_e = g("Null", null, {$documentation: "The `null` atom", value: null}, ve),
		ge = g("NaN", null, {$documentation: "The impossible value", value: NaN}, ve),
		be = g("Undefined", null, {$documentation: "The `undefined` value", value: void 0}, ve),
		ye = g("Hole", null, {$documentation: "A hole in an array", value: void 0}, ve),
		Ae = g("Infinity", null, {$documentation: "The `Infinity` value", value: 1 / 0}, ve),
		we = g("Boolean", null, {$documentation: "Base class for booleans"}, ve),
		Ee = g("False", null, {$documentation: "The `false` atom", value: !1}, we),
		De = g("True", null, {$documentation: "The `true` atom", value: !0}, we);
	y.prototype = {
		_visit: function (n, e) {
			this.push(n);
			var t = this.visit(n, e ? function () {
				e.call(n)
			} : f);
			return !t && e && e.call(n), this.pop(n), t
		}, parent: function (n) {
			return this.stack[this.stack.length - 2 - (n || 0)]
		}, push: function (n) {
			n instanceof pn ? this.directives = Object.create(this.directives) : n instanceof G && (this.directives[n.value] = this.directives[n.value] ? "up" : !0), this.stack.push(n)
		}, pop: function (n) {
			this.stack.pop(), n instanceof pn && (this.directives = Object.getPrototypeOf(this.directives))
		}, self: function () {
			return this.stack[this.stack.length - 1]
		}, find_parent: function (n) {
			for (var e = this.stack, t = e.length; --t >= 0;) {
				var r = e[t];
				if (r instanceof n) return r
			}
		}, has_directive: function (n) {
			var e = this.directives[n];
			if (e) return e;
			var t = this.stack[this.stack.length - 1];
			if (t instanceof fn) for (var r = 0; r < t.body.length; ++r) {
				var i = t.body[r];
				if (!(i instanceof G)) break;
				if (i.value == n) return !0
			}
		}, in_boolean_context: function () {
			for (var n = this.stack, e = n.length, t = n[--e]; e > 0;) {
				var r = n[--e];
				if (r instanceof En && r.condition === t || r instanceof Vn && r.condition === t || r instanceof rn && r.condition === t || r instanceof un && r.condition === t || r instanceof In && "!" == r.operator && r.expression === t) return !0;
				if (!(r instanceof Un) || "&&" != r.operator && "||" != r.operator) return !1;
				t = r
			}
		}, loopcontrol_target: function (n) {
			var e = this.stack;
			if (n) for (var t = e.length; --t >= 0;) {
				var r = e[t];
				if (r instanceof en && r.label.name == n.name) return r.body
			} else for (var t = e.length; --t >= 0;) {
				var r = e[t];
				if (r instanceof Dn || r instanceof tn) return r
			}
		}
	};
	var Fe = "break case catch const continue debugger default delete do else finally for function if in instanceof new return switch throw try typeof var void while with",
		Ce = "false null true",
		ke = "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized this throws transient volatile yield " + Ce + " " + Fe,
		xe = "return new delete throw else case";
	Fe = m(Fe), ke = m(ke), xe = m(xe), Ce = m(Ce);
	var Be = m(r("+-*&%=<>!?|~^")), Se = /^0x[0-9a-f]+$/i, Te = /^0[0-7]+$/,
		$e = m(["in", "instanceof", "typeof", "new", "void", "delete", "++", "--", "+", "-", "!", "~", "&", "|", "^", "*", "/", "%", ">>", "<<", ">>>", "<", ">", "<=", ">=", "==", "===", "!=", "!==", "?", "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=", "&&", "||"]),
		Oe = m(r("  \n\r	\f\x0B​᠎             　\ufeff")), qe = m(r("[{(,.;:")), Me = m(r("[]{}(),;:")),
		ze = (m(r("gmsiy")), {
			letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u037F\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u052F\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0-\\u08B2\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0980\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F8\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA69D\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA7AD\\uA7B0\\uA7B1\\uA7F7-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uA9E0-\\uA9E4\\uA9E6-\\uA9EF\\uA9FA-\\uA9FE\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA7E-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uAB30-\\uAB5A\\uAB5C-\\uAB5F\\uAB64\\uAB65\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
			digit: new RegExp("[\\u0030-\\u0039\\u0660-\\u0669\\u06F0-\\u06F9\\u07C0-\\u07C9\\u0966-\\u096F\\u09E6-\\u09EF\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0BE6-\\u0BEF\\u0C66-\\u0C6F\\u0CE6-\\u0CEF\\u0D66-\\u0D6F\\u0DE6-\\u0DEF\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u0F20-\\u0F29\\u1040-\\u1049\\u1090-\\u1099\\u17E0-\\u17E9\\u1810-\\u1819\\u1946-\\u194F\\u19D0-\\u19D9\\u1A80-\\u1A89\\u1A90-\\u1A99\\u1B50-\\u1B59\\u1BB0-\\u1BB9\\u1C40-\\u1C49\\u1C50-\\u1C59\\uA620-\\uA629\\uA8D0-\\uA8D9\\uA900-\\uA909\\uA9D0-\\uA9D9\\uA9F0-\\uA9F9\\uAA50-\\uAA59\\uABF0-\\uABF9\\uFF10-\\uFF19]"),
			non_spacing_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065E\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0900-\\u0902\\u093C\\u0941-\\u0948\\u094D\\u0951-\\u0955\\u0962\\u0963\\u0981\\u09BC\\u09C1-\\u09C4\\u09CD\\u09E2\\u09E3\\u0A01\\u0A02\\u0A3C\\u0A41\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81\\u0A82\\u0ABC\\u0AC1-\\u0AC5\\u0AC7\\u0AC8\\u0ACD\\u0AE2\\u0AE3\\u0B01\\u0B3C\\u0B3F\\u0B41-\\u0B44\\u0B4D\\u0B56\\u0B62\\u0B63\\u0B82\\u0BC0\\u0BCD\\u0C3E-\\u0C40\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0CBC\\u0CBF\\u0CC6\\u0CCC\\u0CCD\\u0CE2\\u0CE3\\u0D41-\\u0D44\\u0D4D\\u0D62\\u0D63\\u0DCA\\u0DD2-\\u0DD4\\u0DD6\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F71-\\u0F7E\\u0F80-\\u0F84\\u0F86\\u0F87\\u0F90-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102D-\\u1030\\u1032-\\u1037\\u1039\\u103A\\u103D\\u103E\\u1058\\u1059\\u105E-\\u1060\\u1071-\\u1074\\u1082\\u1085\\u1086\\u108D\\u109D\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B7-\\u17BD\\u17C6\\u17C9-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u1922\\u1927\\u1928\\u1932\\u1939-\\u193B\\u1A17\\u1A18\\u1A56\\u1A58-\\u1A5E\\u1A60\\u1A62\\u1A65-\\u1A6C\\u1A73-\\u1A7C\\u1A7F\\u1B00-\\u1B03\\u1B34\\u1B36-\\u1B3A\\u1B3C\\u1B42\\u1B6B-\\u1B73\\u1B80\\u1B81\\u1BA2-\\u1BA5\\u1BA8\\u1BA9\\u1C2C-\\u1C33\\u1C36\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE0\\u1CE2-\\u1CE8\\u1CED\\u1DC0-\\u1DE6\\u1DFD-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA67C\\uA67D\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA825\\uA826\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA951\\uA980-\\uA982\\uA9B3\\uA9B6-\\uA9B9\\uA9BC\\uAA29-\\uAA2E\\uAA31\\uAA32\\uAA35\\uAA36\\uAA43\\uAA4C\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uABE5\\uABE8\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
			space_combining_mark: new RegExp("[\\u0903\\u093E-\\u0940\\u0949-\\u094C\\u094E\\u0982\\u0983\\u09BE-\\u09C0\\u09C7\\u09C8\\u09CB\\u09CC\\u09D7\\u0A03\\u0A3E-\\u0A40\\u0A83\\u0ABE-\\u0AC0\\u0AC9\\u0ACB\\u0ACC\\u0B02\\u0B03\\u0B3E\\u0B40\\u0B47\\u0B48\\u0B4B\\u0B4C\\u0B57\\u0BBE\\u0BBF\\u0BC1\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCC\\u0BD7\\u0C01-\\u0C03\\u0C41-\\u0C44\\u0C82\\u0C83\\u0CBE\\u0CC0-\\u0CC4\\u0CC7\\u0CC8\\u0CCA\\u0CCB\\u0CD5\\u0CD6\\u0D02\\u0D03\\u0D3E-\\u0D40\\u0D46-\\u0D48\\u0D4A-\\u0D4C\\u0D57\\u0D82\\u0D83\\u0DCF-\\u0DD1\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0F3E\\u0F3F\\u0F7F\\u102B\\u102C\\u1031\\u1038\\u103B\\u103C\\u1056\\u1057\\u1062-\\u1064\\u1067-\\u106D\\u1083\\u1084\\u1087-\\u108C\\u108F\\u109A-\\u109C\\u17B6\\u17BE-\\u17C5\\u17C7\\u17C8\\u1923-\\u1926\\u1929-\\u192B\\u1930\\u1931\\u1933-\\u1938\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A19-\\u1A1B\\u1A55\\u1A57\\u1A61\\u1A63\\u1A64\\u1A6D-\\u1A72\\u1B04\\u1B35\\u1B3B\\u1B3D-\\u1B41\\u1B43\\u1B44\\u1B82\\u1BA1\\u1BA6\\u1BA7\\u1BAA\\u1C24-\\u1C2B\\u1C34\\u1C35\\u1CE1\\u1CF2\\uA823\\uA824\\uA827\\uA880\\uA881\\uA8B4-\\uA8C3\\uA952\\uA953\\uA983\\uA9B4\\uA9B5\\uA9BA\\uA9BB\\uA9BD-\\uA9C0\\uAA2F\\uAA30\\uAA33\\uAA34\\uAA4D\\uAA7B\\uABE3\\uABE4\\uABE6\\uABE7\\uABE9\\uABEA\\uABEC]"),
			connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]")
		});
	$.prototype.toString = function () {
		return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")\n\n" + this.stack
	};
	var He = {}, Ne = m(["typeof", "void", "delete", "--", "++", "!", "~", "-", "+"]), je = m(["--", "++"]),
		Pe = m(["=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="]), Re = function (n, e) {
			for (var t = 0; t < n.length; ++t) for (var r = n[t], i = 0; i < r.length; ++i) e[r[i]] = t + 1;
			return e
		}([["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "===", "!=", "!=="], ["<", ">", "<=", ">=", "in", "instanceof"], [">>", "<<", ">>>"], ["+", "-"], ["*", "/", "%"]], {}),
		Ie = (t(["for", "do", "while", "switch"]), t(["atom", "num", "string", "regexp", "name"]));
	H.prototype = new y, function (n) {
		function e(e, t) {
			e.DEFMETHOD("transform", function (e, r) {
				var i, o;
				return e.push(this), e.before && (i = e.before(this, t, r)), i === n && (e.after ? (e.stack[e.stack.length - 1] = i = this.clone(), t(i, e), o = e.after(i, r), o !== n && (i = o)) : (i = this, t(i, e))), e.pop(this), i
			})
		}

		function t(n, e) {
			return U(n, function (n) {
				return n.transform(e, !0)
			})
		}

		e(Y, f), e(en, function (n, e) {
			n.label = n.label.transform(e), n.body = n.body.transform(e)
		}), e(X, function (n, e) {
			n.body = n.body.transform(e)
		}), e(Z, function (n, e) {
			n.body = t(n.body, e)
		}), e(rn, function (n, e) {
			n.condition = n.condition.transform(e), n.body = n.body.transform(e)
		}), e(un, function (n, e) {
			n.init && (n.init = n.init.transform(e)), n.condition && (n.condition = n.condition.transform(e)), n.step && (n.step = n.step.transform(e)), n.body = n.body.transform(e)
		}), e(sn, function (n, e) {
			n.init = n.init.transform(e), n.object = n.object.transform(e), n.body = n.body.transform(e)
		}), e(cn, function (n, e) {
			n.expression = n.expression.transform(e), n.body = n.body.transform(e)
		}), e(_n, function (n, e) {
			n.value && (n.value = n.value.transform(e))
		}), e(yn, function (n, e) {
			n.label && (n.label = n.label.transform(e))
		}), e(En, function (n, e) {
			n.condition = n.condition.transform(e), n.body = n.body.transform(e), n.alternative && (n.alternative = n.alternative.transform(e))
		}), e(Dn, function (n, e) {
			n.expression = n.expression.transform(e), n.body = t(n.body, e)
		}), e(kn, function (n, e) {
			n.expression = n.expression.transform(e), n.body = t(n.body, e)
		}), e(xn, function (n, e) {
			n.body = t(n.body, e), n.bcatch && (n.bcatch = n.bcatch.transform(e)), n.bfinally && (n.bfinally = n.bfinally.transform(e))
		}), e(Bn, function (n, e) {
			n.argname = n.argname.transform(e), n.body = t(n.body, e)
		}), e(Tn, function (n, e) {
			n.definitions = t(n.definitions, e)
		}), e(qn, function (n, e) {
			n.name = n.name.transform(e), n.value && (n.value = n.value.transform(e))
		}), e(pn, function (n, e) {
			n.name && (n.name = n.name.transform(e)), n.argnames = t(n.argnames, e), n.body = t(n.body, e)
		}), e(Mn, function (n, e) {
			n.expression = n.expression.transform(e), n.args = t(n.args, e)
		}), e(Hn, function (n, e) {
			n.car = n.car.transform(e), n.cdr = n.cdr.transform(e)
		}), e(jn, function (n, e) {
			n.expression = n.expression.transform(e)
		}), e(Pn, function (n, e) {
			n.expression = n.expression.transform(e), n.property = n.property.transform(e)
		}), e(Rn, function (n, e) {
			n.expression = n.expression.transform(e)
		}), e(Un, function (n, e) {
			n.left = n.left.transform(e), n.right = n.right.transform(e)
		}), e(Vn, function (n, e) {
			n.condition = n.condition.transform(e), n.consequent = n.consequent.transform(e), n.alternative = n.alternative.transform(e)
		}), e(Wn, function (n, e) {
			n.elements = t(n.elements, e)
		}), e(Jn, function (n, e) {
			n.properties = t(n.properties, e)
		}), e(Gn, function (n, e) {
			n.value = n.value.transform(e)
		})
	}(), N.prototype = {
		unmangleable: function (n) {
			return n || (n = {}), this.global && !n.toplevel || this.undeclared || !n.eval && (this.scope.uses_eval || this.scope.uses_with) || n.keep_fnames && (this.orig[0] instanceof ae || this.orig[0] instanceof oe)
		}, mangle: function (n) {
			var e = n.cache && n.cache.props;
			if (this.global && e && e.has(this.name)) this.mangled_name = e.get(this.name); else if (!this.mangled_name && !this.unmangleable(n)) {
				var t = this.scope;
				!n.screw_ie8 && this.orig[0] instanceof ae && (t = t.parent_scope), this.mangled_name = t.next_mangled(n, this), this.global && e && e.set(this.name, this.mangled_name)
			}
		}
	}, ln.DEFMETHOD("figure_out_scope", function (n) {
		n = s(n, {screw_ie8: !1, cache: null});
		var e = this, t = e.parent_scope = null, r = new _, i = null, o = 0, a = new y(function (e, u) {
			if (n.screw_ie8 && e instanceof Bn) {
				var s = t;
				return t = new fn(e), t.init_scope_vars(o), t.parent_scope = s, u(), t = s, !0
			}
			if (e instanceof fn) {
				e.init_scope_vars(o);
				var s = e.parent_scope = t, c = i, f = r;
				return i = t = e, r = new _, ++o, u(), --o, t = s, i = c, r = f, !0
			}
			if (e instanceof en) {
				var l = e.label;
				if (r.has(l.name)) throw new Error(p("Label {name} defined twice", l));
				return r.set(l.name, l), u(), r.del(l.name), !0
			}
			if (e instanceof cn) for (var d = t; d; d = d.parent_scope) d.uses_with = !0; else if (e instanceof Qn && (e.scope = t), e instanceof se && (e.thedef = e, e.references = []), e instanceof ae) i.def_function(e); else if (e instanceof oe) (e.scope = i.parent_scope).def_function(e); else if (e instanceof te || e instanceof re) {
				var h = i.def_variable(e);
				h.constant = e instanceof re, h.init = a.parent().value
			} else if (e instanceof ue) (n.screw_ie8 ? t : i).def_variable(e); else if (e instanceof fe) {
				var m = r.get(e.name);
				if (!m) throw new Error(p("Undefined label {name} [{line},{col}]", {
					name: e.name,
					line: e.start.line,
					col: e.start.col
				}));
				e.thedef = m
			}
		});
		e.walk(a);
		var u = null, c = e.globals = new _, a = new y(function (n, t) {
			if (n instanceof pn) {
				var r = u;
				return u = n, t(), u = r, !0
			}
			if (n instanceof yn && n.label) return n.label.thedef.references.push(n), !0;
			if (n instanceof ce) {
				var i = n.name, o = n.scope.find_variable(i);
				if (o) n.thedef = o; else {
					var s;
					if (c.has(i) ? s = c.get(i) : (s = new N(e, c.size(), n), s.undeclared = !0, s.global = !0, c.set(i, s)), n.thedef = s, "eval" == i && a.parent() instanceof Mn) for (var f = n.scope; f && !f.uses_eval; f = f.parent_scope) f.uses_eval = !0;
					u && "arguments" == i && (u.uses_arguments = !0)
				}
				return n.reference(), !0
			}
		});
		e.walk(a), n.cache && (this.cname = n.cache.cname)
	}), fn.DEFMETHOD("init_scope_vars", function (n) {
		this.variables = new _, this.functions = new _, this.uses_with = !1, this.uses_eval = !1, this.parent_scope = null, this.enclosed = [], this.cname = -1, this.nesting = n
	}), pn.DEFMETHOD("init_scope_vars", function () {
		fn.prototype.init_scope_vars.apply(this, arguments), this.uses_arguments = !1
	}), ce.DEFMETHOD("reference", function () {
		var n = this.definition();
		n.references.push(this);
		for (var e = this.scope; e && (l(e.enclosed, n), e !== n.scope);) e = e.parent_scope;
		this.frame = this.scope.nesting - n.scope.nesting
	}), fn.DEFMETHOD("find_variable", function (n) {
		return n instanceof Qn && (n = n.name), this.variables.get(n) || this.parent_scope && this.parent_scope.find_variable(n)
	}), fn.DEFMETHOD("def_function", function (n) {
		this.functions.set(n.name, this.def_variable(n))
	}), fn.DEFMETHOD("def_variable", function (n) {
		var e;
		return this.variables.has(n.name) ? (e = this.variables.get(n.name), e.orig.push(n)) : (e = new N(this, this.variables.size(), n), this.variables.set(n.name, e), e.global = !this.parent_scope), n.thedef = e
	}), fn.DEFMETHOD("next_mangled", function (n) {
		var e = this.enclosed;
		n:for (; ;) {
			var t = Le(++this.cname);
			if (k(t) && !(n.except.indexOf(t) >= 0)) {
				for (var r = e.length; --r >= 0;) {
					var i = e[r], o = i.mangled_name || i.unmangleable(n) && i.name;
					if (t == o) continue n
				}
				return t
			}
		}
	}), hn.DEFMETHOD("next_mangled", function (n, e) {
		for (var t = e.orig[0] instanceof ie && this.name && this.name.definition(); ;) {
			var r = pn.prototype.next_mangled.call(this, n, e);
			if (!t || t.mangled_name != r) return r
		}
	}), fn.DEFMETHOD("references", function (n) {
		return n instanceof Qn && (n = n.definition()), this.enclosed.indexOf(n) < 0 ? null : n
	}), Qn.DEFMETHOD("unmangleable", function (n) {
		return this.definition().unmangleable(n)
	}), ne.DEFMETHOD("unmangleable", function () {
		return !0
	}), se.DEFMETHOD("unmangleable", function () {
		return !1
	}), Qn.DEFMETHOD("unreferenced", function () {
		return 0 == this.definition().references.length && !(this.scope.uses_eval || this.scope.uses_with)
	}), Qn.DEFMETHOD("undeclared", function () {
		return this.definition().undeclared
	}), fe.DEFMETHOD("undeclared", function () {
		return !1
	}), se.DEFMETHOD("undeclared", function () {
		return !1
	}), Qn.DEFMETHOD("definition", function () {
		return this.thedef
	}), Qn.DEFMETHOD("global", function () {
		return this.definition().global
	}), ln.DEFMETHOD("_default_mangler_options", function (n) {
		return s(n, {except: [], eval: !1, sort: !1, toplevel: !1, screw_ie8: !1, keep_fnames: !1})
	}), ln.DEFMETHOD("mangle_names", function (n) {
		n = this._default_mangler_options(n);
		var e = -1, t = [];
		n.cache && this.globals.each(function (e) {
			n.except.indexOf(e.name) < 0 && t.push(e)
		});
		var r = new y(function (i, o) {
			if (i instanceof en) {
				var a = e;
				return o(), e = a, !0
			}
			if (i instanceof fn) {
				var u = (r.parent(), []);
				return i.variables.each(function (e) {
					n.except.indexOf(e.name) < 0 && u.push(e)
				}), n.sort && u.sort(function (n, e) {
					return e.references.length - n.references.length
				}), void t.push.apply(t, u)
			}
			if (i instanceof se) {
				var s;
				do s = Le(++e); while (!k(s));
				return i.mangled_name = s, !0
			}
			return n.screw_ie8 && i instanceof ue ? void t.push(i.definition()) : void 0
		});
		this.walk(r), t.forEach(function (e) {
			e.mangle(n)
		}), n.cache && (n.cache.cname = this.cname)
	}), ln.DEFMETHOD("compute_char_frequency", function (n) {
		n = this._default_mangler_options(n);
		var e = new y(function (e) {
			e instanceof pe ? Le.consider(e.print_to_string()) : e instanceof gn ? Le.consider("return") : e instanceof bn ? Le.consider("throw") : e instanceof wn ? Le.consider("continue") : e instanceof An ? Le.consider("break") : e instanceof J ? Le.consider("debugger") : e instanceof G ? Le.consider(e.value) : e instanceof an ? Le.consider("while") : e instanceof on ? Le.consider("do while") : e instanceof En ? (Le.consider("if"), e.alternative && Le.consider("else")) : e instanceof $n ? Le.consider("var") : e instanceof On ? Le.consider("const") : e instanceof pn ? Le.consider("function") : e instanceof un ? Le.consider("for") : e instanceof sn ? Le.consider("for in") : e instanceof Dn ? Le.consider("switch") : e instanceof kn ? Le.consider("case") : e instanceof Cn ? Le.consider("default") : e instanceof cn ? Le.consider("with") : e instanceof Zn ? Le.consider("set" + e.key) : e instanceof Kn ? Le.consider("get" + e.key) : e instanceof Xn ? Le.consider(e.key) : e instanceof zn ? Le.consider("new") : e instanceof le ? Le.consider("this") : e instanceof xn ? Le.consider("try") : e instanceof Bn ? Le.consider("catch") : e instanceof Sn ? Le.consider("finally") : e instanceof Qn && e.unmangleable(n) ? Le.consider(e.name) : e instanceof Rn || e instanceof Un ? Le.consider(e.operator) : e instanceof jn && Le.consider(e.property)
		});
		this.walk(e), Le.sort()
	});
	var Le = function () {
		function n() {
			r = Object.create(null), t = i.split("").map(function (n) {
				return n.charCodeAt(0)
			}), t.forEach(function (n) {
				r[n] = 0
			})
		}

		function e(n) {
			var e = "", r = 54;
			n++;
			do n--, e += String.fromCharCode(t[n % r]), n = Math.floor(n / r), r = 64; while (n > 0);
			return e
		}

		var t, r, i = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";
		return e.consider = function (n) {
			for (var e = n.length; --e >= 0;) {
				var t = n.charCodeAt(e);
				t in r && ++r[t]
			}
		}, e.sort = function () {
			t = h(t, function (n, e) {
				return w(n) && !w(e) ? 1 : w(e) && !w(n) ? -1 : r[e] - r[n]
			})
		}, e.reset = n, n(), e.get = function () {
			return t
		}, e.freq = function () {
			return r
		}, e
	}();
	ln.DEFMETHOD("scope_warnings", function (n) {
		n = s(n, {
			undeclared: !1,
			unreferenced: !0,
			assign_to_global: !0,
			func_arguments: !0,
			nested_defuns: !0,
			eval: !0
		});
		var e = new y(function (t) {
			if (n.undeclared && t instanceof ce && t.undeclared() && Y.warn("Undeclared symbol: {name} [{file}:{line},{col}]", {
				name: t.name,
				file: t.start.file,
				line: t.start.line,
				col: t.start.col
			}), n.assign_to_global) {
				var r = null;
				t instanceof Yn && t.left instanceof ce ? r = t.left : t instanceof sn && t.init instanceof ce && (r = t.init), r && (r.undeclared() || r.global() && r.scope !== r.definition().scope) && Y.warn("{msg}: {name} [{file}:{line},{col}]", {
					msg: r.undeclared() ? "Accidental global?" : "Assignment to global",
					name: r.name,
					file: r.start.file,
					line: r.start.line,
					col: r.start.col
				})
			}
			n.eval && t instanceof ce && t.undeclared() && "eval" == t.name && Y.warn("Eval is used [{file}:{line},{col}]", t.start), n.unreferenced && (t instanceof ee || t instanceof se) && !(t instanceof ue) && t.unreferenced() && Y.warn("{type} {name} is declared but not referenced [{file}:{line},{col}]", {
				type: t instanceof se ? "Label" : "Symbol",
				name: t.name,
				file: t.start.file,
				line: t.start.line,
				col: t.start.col
			}), n.func_arguments && t instanceof pn && t.uses_arguments && Y.warn("arguments used in function {name} [{file}:{line},{col}]", {
				name: t.name ? t.name.name : "anonymous",
				file: t.start.file,
				line: t.start.line,
				col: t.start.col
			}), n.nested_defuns && t instanceof mn && !(e.parent() instanceof fn) && Y.warn('Function {name} declared in nested statement "{type}" [{file}:{line},{col}]', {
				name: t.name.name,
				type: e.parent().TYPE,
				file: t.start.file,
				line: t.start.line,
				col: t.start.col
			})
		});
		this.walk(e)
	}), function () {
		function n(n, e) {
			n.DEFMETHOD("_codegen", e)
		}

		function e(n, t) {
			Array.isArray(n) ? n.forEach(function (n) {
				e(n, t)
			}) : n.DEFMETHOD("needs_parens", t)
		}

		function t(n, e, t) {
			var r = n.length - 1;
			n.forEach(function (n, i) {
				n instanceof Q || (t.indent(), n.print(t), i == r && e || (t.newline(), e && t.newline()))
			})
		}

		function r(n, e) {
			n.length > 0 ? e.with_block(function () {
				t(n, !1, e)
			}) : e.print("{}")
		}

		function i(n, e) {
			if (e.option("bracketize")) return void d(n.body, e);
			if (!n.body) return e.force_semicolon();
			if (n.body instanceof on && !e.option("screw_ie8")) return void d(n.body, e);
			for (var t = n.body; ;) if (t instanceof En) {
				if (!t.alternative) return void d(n.body, e);
				t = t.alternative
			} else {
				if (!(t instanceof nn)) break;
				t = t.body
			}
			u(n.body, e)
		}

		function o(n, e, t) {
			if (t) try {
				n.walk(new y(function (n) {
					if (n instanceof Un && "in" == n.operator) throw e
				})), n.print(e)
			} catch (r) {
				if (r !== e) throw r;
				n.print(e, !0)
			} else n.print(e)
		}

		function a(n) {
			return [92, 47, 46, 43, 42, 63, 40, 41, 91, 93, 123, 125, 36, 94, 58, 124, 33, 10, 13, 0, 65279, 8232, 8233].indexOf(n) < 0
		}

		function u(n, e) {
			e.option("bracketize") ? !n || n instanceof Q ? e.print("{}") : n instanceof K ? n.print(e) : e.with_block(function () {
				e.indent(), n.print(e), e.newline()
			}) : !n || n instanceof Q ? e.force_semicolon() : n.print(e)
		}

		function s(n) {
			for (var e = n.stack(), t = e.length, r = e[--t], i = e[--t]; t > 0;) {
				if (i instanceof W && i.body === r) return !0;
				if (!(i instanceof Hn && i.car === r || i instanceof Mn && i.expression === r && !(i instanceof zn) || i instanceof jn && i.expression === r || i instanceof Pn && i.expression === r || i instanceof Vn && i.condition === r || i instanceof Un && i.left === r || i instanceof Ln && i.expression === r)) return !1;
				r = i, i = e[--t]
			}
		}

		function c(n, e) {
			return 0 == n.args.length && !e.option("beautify")
		}

		function l(n) {
			for (var e = n[0], t = e.length, r = 1; r < n.length; ++r) n[r].length < t && (e = n[r], t = e.length);
			return e
		}

		function p(n) {
			var e, t = n.toString(10), r = [t.replace(/^0\./, ".").replace("e+", "e")];
			return Math.floor(n) === n ? (n >= 0 ? r.push("0x" + n.toString(16).toLowerCase(), "0" + n.toString(8)) : r.push("-0x" + (-n).toString(16).toLowerCase(), "-0" + (-n).toString(8)), (e = /^(.*?)(0+)$/.exec(n)) && r.push(e[1] + "e" + e[2].length)) : (e = /^0?\.(0+)(.*)$/.exec(n)) && r.push(e[2] + "e-" + (e[1].length + e[2].length), t.substr(t.indexOf("."))), l(r)
		}

		function d(n, e) {
			return n instanceof K ? void n.print(e) : void e.with_block(function () {
				e.indent(), n.print(e), e.newline()
			})
		}

		function h(n, e) {
			n.DEFMETHOD("add_source_map", function (n) {
				e(this, n)
			})
		}

		function m(n, e) {
			e.add_mapping(n.start)
		}

		var v = !1;
		Y.DEFMETHOD("print", function (n, e) {
			function t() {
				r.add_comments(n), r.add_source_map(n), i(r, n)
			}

			var r = this, i = r._codegen, o = v;
			r instanceof G && "use asm" == r.value && (v = !0), n.push_node(r), e || r.needs_parens(n) ? n.with_parens(t) : t(), n.pop_node(), r instanceof pn && (v = o)
		}), Y.DEFMETHOD("print_to_string", function (n) {
			var e = j(n);
			return this.print(e), e.get()
		}), Y.DEFMETHOD("add_comments", function (n) {
			var e = n.option("comments"), t = this, r = t.start;
			if (r && !r._comments_dumped) {
				r._comments_dumped = !0;
				var i = r.comments_before || [];
				t instanceof _n && t.value && t.value.walk(new y(function (n) {
					return n.start && n.start.comments_before && (i = i.concat(n.start.comments_before), n.start.comments_before = []), n instanceof hn || n instanceof Wn || n instanceof Jn ? !0 : void 0
				})), e ? e.test ? i = i.filter(function (n) {
					return e.test(n.value) || "comment5" == n.type
				}) : "function" == typeof e && (i = i.filter(function (n) {
					return e(t, n) || "comment5" == n.type
				})) : i = i.filter(function (n) {
					return "comment5" == n.type
				}), !n.option("beautify") && i.length > 0 && /comment[134]/.test(i[0].type) && 0 !== n.col() && i[0].nlb && n.print("\n"), i.forEach(function (e) {
					/comment[134]/.test(e.type) ? (n.print("//" + e.value + "\n"), n.indent()) : "comment2" == e.type ? (n.print("/*" + e.value + "*/"), r.nlb ? (n.print("\n"), n.indent()) : n.space()) : 0 === n.pos() && "comment5" == e.type && n.option("shebang") && (n.print("#!" + e.value + "\n"), n.indent())
				})
			}
		}), e(Y, function () {
			return !1
		}), e(hn, function (n) {
			return s(n)
		}), e(Jn, function (n) {
			return s(n)
		}), e([Rn, be], function (n) {
			var e = n.parent();
			return e instanceof Nn && e.expression === this
		}), e(Hn, function (n) {
			var e = n.parent();
			return e instanceof Mn || e instanceof Rn || e instanceof Un || e instanceof qn || e instanceof Nn || e instanceof Wn || e instanceof Gn || e instanceof Vn
		}), e(Un, function (n) {
			var e = n.parent();
			if (e instanceof Mn && e.expression === this) return !0;
			if (e instanceof Rn) return !0;
			if (e instanceof Nn && e.expression === this) return !0;
			if (e instanceof Un) {
				var t = e.operator, r = Re[t], i = this.operator, o = Re[i];
				if (r > o || r == o && this === e.right) return !0
			}
		}), e(Nn, function (n) {
			var e = n.parent();
			if (e instanceof zn && e.expression === this) try {
				this.walk(new y(function (n) {
					if (n instanceof Mn) throw e
				}))
			} catch (t) {
				if (t !== e) throw t;
				return !0
			}
		}), e(Mn, function (n) {
			var e, t = n.parent();
			return t instanceof zn && t.expression === this ? !0 : this.expression instanceof hn && t instanceof Nn && t.expression === this && (e = n.parent(1)) instanceof Yn && e.left === t
		}), e(zn, function (n) {
			var e = n.parent();
			return c(this, n) && (e instanceof Nn || e instanceof Mn && e.expression === this) ? !0 : void 0
		}), e(he, function (n) {
			var e = n.parent();
			return this.getValue() < 0 && e instanceof Nn && e.expression === this ? !0 : void 0
		}), e([Yn, Vn], function (n) {
			var e = n.parent();
			return e instanceof Rn ? !0 : e instanceof Un && !(e instanceof Yn) ? !0 : e instanceof Mn && e.expression === this ? !0 : e instanceof Vn && e.condition === this ? !0 : e instanceof Nn && e.expression === this ? !0 : void 0
		}), n(G, function (n, e) {
			e.print_string(n.value, n.quote), e.semicolon()
		}), n(J, function (n, e) {
			e.print("debugger"), e.semicolon()
		}), nn.DEFMETHOD("_do_print_body", function (n) {
			u(this.body, n)
		}), n(W, function (n, e) {
			n.body.print(e), e.semicolon()
		}), n(ln, function (n, e) {
			t(n.body, !0, e), e.print("")
		}), n(en, function (n, e) {
			n.label.print(e), e.colon(), n.body.print(e)
		}), n(X, function (n, e) {
			n.body.print(e), e.semicolon()
		}), n(K, function (n, e) {
			r(n.body, e)
		}), n(Q, function (n, e) {
			e.semicolon()
		}), n(on, function (n, e) {
			e.print("do"), e.space(), n._do_print_body(e), e.space(), e.print("while"), e.space(), e.with_parens(function () {
				n.condition.print(e)
			}), e.semicolon()
		}), n(an, function (n, e) {
			e.print("while"), e.space(), e.with_parens(function () {
				n.condition.print(e)
			}), e.space(), n._do_print_body(e)
		}), n(un, function (n, e) {
			e.print("for"), e.space(), e.with_parens(function () {
				!n.init || n.init instanceof Q ? e.print(";") : (n.init instanceof Tn ? n.init.print(e) : o(n.init, e, !0), e.print(";"), e.space()), n.condition ? (n.condition.print(e), e.print(";"), e.space()) : e.print(";"), n.step && n.step.print(e)
			}), e.space(), n._do_print_body(e)
		}), n(sn, function (n, e) {
			e.print("for"), e.space(), e.with_parens(function () {
				n.init.print(e), e.space(), e.print("in"), e.space(), n.object.print(e)
			}), e.space(), n._do_print_body(e)
		}), n(cn, function (n, e) {
			e.print("with"), e.space(), e.with_parens(function () {
				n.expression.print(e)
			}), e.space(), n._do_print_body(e)
		}), pn.DEFMETHOD("_do_print", function (n, e) {
			var t = this;
			e || n.print("function"), t.name && (n.space(), t.name.print(n)), n.with_parens(function () {
				t.argnames.forEach(function (e, t) {
					t && n.comma(), e.print(n)
				})
			}), n.space(), r(t.body, n)
		}), n(pn, function (n, e) {
			n._do_print(e)
		}), _n.DEFMETHOD("_do_print", function (n, e) {
			n.print(e), this.value && (n.space(), this.value.print(n)), n.semicolon()
		}), n(gn, function (n, e) {
			n._do_print(e, "return")
		}), n(bn, function (n, e) {
			n._do_print(e, "throw")
		}), yn.DEFMETHOD("_do_print", function (n, e) {
			n.print(e), this.label && (n.space(), this.label.print(n)), n.semicolon()
		}), n(An, function (n, e) {
			n._do_print(e, "break")
		}), n(wn, function (n, e) {
			n._do_print(e, "continue")
		}), n(En, function (n, e) {
			e.print("if"), e.space(), e.with_parens(function () {
				n.condition.print(e)
			}), e.space(), n.alternative ? (i(n, e), e.space(), e.print("else"), e.space(), u(n.alternative, e)) : n._do_print_body(e)
		}), n(Dn, function (n, e) {
			e.print("switch"), e.space(), e.with_parens(function () {
				n.expression.print(e)
			}), e.space(), n.body.length > 0 ? e.with_block(function () {
				n.body.forEach(function (n, t) {
					t && e.newline(), e.indent(!0), n.print(e)
				})
			}) : e.print("{}")
		}), Fn.DEFMETHOD("_do_print_body", function (n) {
			this.body.length > 0 && (n.newline(), this.body.forEach(function (e) {
				n.indent(), e.print(n), n.newline()
			}))
		}), n(Cn, function (n, e) {
			e.print("default:"), n._do_print_body(e)
		}), n(kn, function (n, e) {
			e.print("case"), e.space(), n.expression.print(e), e.print(":"), n._do_print_body(e)
		}), n(xn, function (n, e) {
			e.print("try"), e.space(), r(n.body, e), n.bcatch && (e.space(), n.bcatch.print(e)), n.bfinally && (e.space(), n.bfinally.print(e))
		}), n(Bn, function (n, e) {
			e.print("catch"), e.space(), e.with_parens(function () {
				n.argname.print(e)
			}), e.space(), r(n.body, e)
		}), n(Sn, function (n, e) {
			e.print("finally"), e.space(), r(n.body, e)
		}), Tn.DEFMETHOD("_do_print", function (n, e) {
			n.print(e), n.space(), this.definitions.forEach(function (e, t) {
				t && n.comma(), e.print(n)
			});
			var t = n.parent(), r = t instanceof un || t instanceof sn, i = r && t.init === this;
			i || n.semicolon()
		}), n($n, function (n, e) {
			n._do_print(e, "var")
		}), n(On, function (n, e) {
			n._do_print(e, "const")
		}), n(qn, function (n, e) {
			if (n.name.print(e), n.value) {
				e.space(), e.print("="), e.space();
				var t = e.parent(1), r = t instanceof un || t instanceof sn;
				o(n.value, e, r)
			}
		}), n(Mn, function (n, e) {
			n.expression.print(e), n instanceof zn && c(n, e) || e.with_parens(function () {
				n.args.forEach(function (n, t) {
					t && e.comma(), n.print(e)
				})
			})
		}), n(zn, function (n, e) {
			e.print("new"), e.space(), Mn.prototype._codegen(n, e)
		}), Hn.DEFMETHOD("_do_print", function (n) {
			this.car.print(n), this.cdr && (n.comma(), n.should_break() && (n.newline(), n.indent()), this.cdr.print(n))
		}), n(Hn, function (n, e) {
			n._do_print(e)
		}), n(jn, function (n, e) {
			var t = n.expression;
			t.print(e), t instanceof he && t.getValue() >= 0 && (/[xa-f.]/i.test(e.last()) || e.print(".")), e.print("."), e.add_mapping(n.end), e.print_name(n.property)
		}), n(Pn, function (n, e) {
			n.expression.print(e), e.print("["), n.property.print(e), e.print("]")
		}), n(In, function (n, e) {
			var t = n.operator;
			e.print(t), (/^[a-z]/i.test(t) || /[+-]$/.test(t) && n.expression instanceof In && /^[+-]/.test(n.expression.operator)) && e.space(), n.expression.print(e)
		}), n(Ln, function (n, e) {
			n.expression.print(e), e.print(n.operator)
		}), n(Un, function (n, e) {
			var t = n.operator;
			n.left.print(e), ">" == t[0] && n.left instanceof Ln && "--" == n.left.operator ? e.print(" ") : e.space(), e.print(t), ("<" == t || "<<" == t) && n.right instanceof In && "!" == n.right.operator && n.right.expression instanceof In && "--" == n.right.expression.operator ? e.print(" ") : e.space(), n.right.print(e)
		}), n(Vn, function (n, e) {
			n.condition.print(e), e.space(), e.print("?"), e.space(), n.consequent.print(e), e.space(), e.colon(), n.alternative.print(e)
		}), n(Wn, function (n, e) {
			e.with_square(function () {
				var t = n.elements, r = t.length;
				r > 0 && e.space(), t.forEach(function (n, t) {
					t && e.comma(), n.print(e), t === r - 1 && n instanceof ye && e.comma()
				}), r > 0 && e.space()
			})
		}), n(Jn, function (n, e) {
			n.properties.length > 0 ? e.with_block(function () {
				n.properties.forEach(function (n, t) {
					t && (e.print(","), e.newline()), e.indent(), n.print(e)
				}), e.newline()
			}) : e.print("{}")
		}), n(Xn, function (n, e) {
			var t = n.key, r = n.quote;
			e.option("quote_keys") ? e.print_string(t + "") : ("number" == typeof t || !e.option("beautify") && +t + "" == t) && parseFloat(t) >= 0 ? e.print(p(t)) : (ke(t) ? e.option("screw_ie8") : S(t)) ? e.print_name(t) : e.print_string(t, r), e.colon(), n.value.print(e)
		}), n(Zn, function (n, e) {
			e.print("set"), e.space(), n.key.print(e), n.value._do_print(e, !0)
		}), n(Kn, function (n, e) {
			e.print("get"), e.space(), n.key.print(e), n.value._do_print(e, !0)
		}), n(Qn, function (n, e) {
			var t = n.definition();
			e.print_name(t ? t.mangled_name || t.name : n.name)
		}), n(be, function (n, e) {
			e.print("void 0")
		}), n(ye, f), n(Ae, function (n, e) {
			e.print("Infinity")
		}), n(ge, function (n, e) {
			e.print("NaN")
		}), n(le, function (n, e) {
			e.print("this")
		}), n(pe, function (n, e) {
			e.print(n.getValue())
		}), n(de, function (n, e) {
			e.print_string(n.getValue(), n.quote)
		}), n(he, function (n, e) {
			v && null != n.start.raw ? e.print(n.start.raw) : e.print(p(n.getValue()))
		}), n(me, function (n, e) {
			var t = n.getValue().toString();
			e.option("ascii_only") ? t = e.to_ascii(t) : e.option("unescape_regexps") && (t = t.split("\\\\").map(function (n) {
				return n.replace(/\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}/g, function (n) {
					var e = parseInt(n.substr(2), 16);
					return a(e) ? String.fromCharCode(e) : n
				})
			}).join("\\\\")), e.print(t);
			var r = e.parent();
			r instanceof Un && /^in/.test(r.operator) && r.left === n && e.print(" ")
		}), h(Y, f), h(G, m), h(J, m), h(Qn, m), h(vn, m), h(nn, m), h(en, f), h(pn, m), h(Dn, m), h(Fn, m), h(K, m), h(ln, f), h(zn, m), h(xn, m), h(Bn, m), h(Sn, m), h(Tn, m), h(pe, m), h(Zn, function (n, e) {
			e.add_mapping(n.start, n.key.name)
		}), h(Kn, function (n, e) {
			e.add_mapping(n.start, n.key.name)
		}), h(Gn, function (n, e) {
			e.add_mapping(n.start, n.key)
		})
	}(), P.prototype = new H, c(P.prototype, {
		option: function (n) {
			return this.options[n]
		}, warn: function () {
			this.options.warnings && Y.warn.apply(Y, arguments)
		}, before: function (n, e, t) {
			if (n._squeezed) return n;
			var r = !1;
			return n instanceof fn && (n = n.hoist_declarations(this), r = !0), e(n, this), n = n.optimize(this), r && n instanceof fn && (n.drop_unused(this), e(n, this)), n._squeezed = !0, n
		}
	}), function () {
		function n(n, e) {
			n.DEFMETHOD("optimize", function (n) {
				var t = this;
				if (t._optimized) return t;
				if (n.has_directive("use asm")) return t;
				var r = e(t, n);
				return r._optimized = !0, r === t ? r : r.transform(n)
			})
		}

		function e(n, e, t) {
			return t || (t = {}), e && (t.start || (t.start = e.start), t.end || (t.end = e.end)), new n(t)
		}

		function t(n, t, r) {
			if (t instanceof Y) return t.transform(n);
			switch (typeof t) {
				case"string":
					return e(de, r, {value: t}).optimize(n);
				case"number":
					return e(isNaN(t) ? ge : he, r, {value: t}).optimize(n);
				case"boolean":
					return e(t ? De : Ee, r).optimize(n);
				case"undefined":
					return e(be, r).optimize(n);
				default:
					if (null === t) return e(_e, r, {value: null}).optimize(n);
					if (t instanceof RegExp) return e(me, r, {value: t}).optimize(n);
					throw new Error(p("Can't handle constant of type: {type}", {type: typeof t}))
			}
		}

		function r(n) {
			if (null === n) return [];
			if (n instanceof K) return n.body;
			if (n instanceof Q) return [];
			if (n instanceof W) return [n];
			throw new Error("Can't convert thing to statement array")
		}

		function a(n) {
			return null === n ? !0 : n instanceof Q ? !0 : n instanceof K ? 0 == n.body.length : !1
		}

		function u(n) {
			return n instanceof Dn ? n : (n instanceof un || n instanceof sn || n instanceof rn) && n.body instanceof K ? n.body : n
		}

		function s(n, t) {
			function i(n) {
				function r(n) {
					return /@ngInject/.test(n.value)
				}

				function i(n) {
					return n.argnames.map(function (n) {
						return e(de, n, {value: n.name})
					})
				}

				function o(n, t) {
					return e(Wn, n, {elements: t})
				}

				function a(n, t) {
					return e(X, n, {
						body: e(Yn, n, {
							operator: "=",
							left: e(jn, t, {expression: e(ce, t, t), property: "$inject"}),
							right: o(n, i(n))
						})
					})
				}

				function u(n) {
					n && n.args && (n.args.forEach(function (n, e, t) {
						var a = n.start.comments_before;
						n instanceof pn && a.length && r(a[0]) && (t[e] = o(n, i(n).concat(n)))
					}), n.expression && n.expression.expression && u(n.expression.expression))
				}

				return n.reduce(function (n, e) {
					if (n.push(e), e.body && e.body.args) u(e.body); else {
						var i = e.start, o = i.comments_before;
						if (o && o.length > 0) {
							var s = o.pop();
							r(s) && (e instanceof mn ? n.push(a(e, e.name)) : e instanceof Tn ? e.definitions.forEach(function (e) {
								e.value && e.value instanceof pn && n.push(a(e.value, e.name))
							}) : t.warn("Unknown statement marked with @ngInject [{file}:{line},{col}]", i))
						}
					}
					return n
				}, [])
			}

			function o(n) {
				var e = [];
				return n.reduce(function (n, t) {
					return t instanceof K ? (m = !0, n.push.apply(n, o(t.body))) : t instanceof Q ? m = !0 : t instanceof G ? e.indexOf(t.value) < 0 ? (n.push(t), e.push(t.value)) : m = !0 : n.push(t), n
				}, [])
			}

			function a(n, t) {
				var i = t.self(), o = i instanceof pn, a = [];
				n:for (var s = n.length; --s >= 0;) {
					var c = n[s];
					switch (!0) {
						case o && c instanceof gn && !c.value && 0 == a.length:
							m = !0;
							continue n;
						case c instanceof En:
							if (c.body instanceof gn) {
								if ((o && 0 == a.length || a[0] instanceof gn && !a[0].value) && !c.body.value && !c.alternative) {
									m = !0;
									var f = e(X, c.condition, {body: c.condition});
									a.unshift(f);
									continue n
								}
								if (a[0] instanceof gn && c.body.value && a[0].value && !c.alternative) {
									m = !0, c = c.clone(), c.alternative = a[0], a[0] = c.transform(t);
									continue n
								}
								if ((0 == a.length || a[0] instanceof gn) && c.body.value && !c.alternative && o) {
									m = !0, c = c.clone(), c.alternative = a[0] || e(gn, c, {value: e(be, c)}), a[0] = c.transform(t);
									continue n
								}
								if (!c.body.value && o) {
									m = !0, c = c.clone(), c.condition = c.condition.negate(t), c.body = e(K, c, {body: r(c.alternative).concat(a)}), c.alternative = null, a = [c.transform(t)];
									continue n
								}
								if (t.option("sequences") && 1 == a.length && o && a[0] instanceof X && (!c.alternative || c.alternative instanceof X)) {
									m = !0, a.push(e(gn, a[0], {value: e(be, a[0])}).transform(t)), a = r(c.alternative).concat(a), a.unshift(c);
									continue n
								}
							}
							var l = g(c.body), p = l instanceof yn ? t.loopcontrol_target(l.label) : null;
							if (l && (l instanceof gn && !l.value && o || l instanceof wn && i === u(p) || l instanceof An && p instanceof K && i === p)) {
								l.label && d(l.label.thedef.references, l), m = !0;
								var h = r(c.body).slice(0, -1);
								c = c.clone(), c.condition = c.condition.negate(t), c.body = e(K, c, {body: r(c.alternative).concat(a)}), c.alternative = e(K, c, {body: h}), a = [c.transform(t)];
								continue n
							}
							var l = g(c.alternative), p = l instanceof yn ? t.loopcontrol_target(l.label) : null;
							if (l && (l instanceof gn && !l.value && o || l instanceof wn && i === u(p) || l instanceof An && p instanceof K && i === p)) {
								l.label && d(l.label.thedef.references, l), m = !0, c = c.clone(), c.body = e(K, c.body, {body: r(c.body).concat(a)}), c.alternative = e(K, c.alternative, {body: r(c.alternative).slice(0, -1)}), a = [c.transform(t)];
								continue n
							}
							a.unshift(c);
							break;
						default:
							a.unshift(c)
					}
				}
				return a
			}

			function s(n, e) {
				var t = !1, r = n.length, i = e.self();
				return n = n.reduce(function (n, r) {
					if (t) c(e, r, n); else {
						if (r instanceof yn) {
							var o = e.loopcontrol_target(r.label);
							r instanceof An && o instanceof K && u(o) === i || r instanceof wn && u(o) === i ? r.label && d(r.label.thedef.references, r) : n.push(r)
						} else n.push(r);
						g(r) && (t = !0)
					}
					return n
				}, []), m = n.length != r, n
			}

			function f(n, t) {
				function r() {
					i = Hn.from_array(i), i && o.push(e(X, i, {body: i})), i = []
				}

				if (n.length < 2) return n;
				var i = [], o = [];
				return n.forEach(function (n) {
					n instanceof X && i.length < 2e3 ? i.push(n.body) : (r(), o.push(n))
				}), r(), o = l(o, t), m = o.length != n.length, o
			}

			function l(n, t) {
				function r(n) {
					i.pop();
					var e = o.body;
					return e instanceof Hn ? e.add(n) : e = Hn.cons(e, n), e.transform(t)
				}

				var i = [], o = null;
				return n.forEach(function (n) {
					if (o) if (n instanceof un) {
						var t = {};
						try {
							o.body.walk(new y(function (n) {
								if (n instanceof Un && "in" == n.operator) throw t
							})), !n.init || n.init instanceof Tn ? n.init || (n.init = o.body, i.pop()) : n.init = r(n.init)
						} catch (a) {
							if (a !== t) throw a
						}
					} else n instanceof En ? n.condition = r(n.condition) : n instanceof cn ? n.expression = r(n.expression) : n instanceof _n && n.value ? n.value = r(n.value) : n instanceof _n ? n.value = r(e(be, n)) : n instanceof Dn && (n.expression = r(n.expression));
					i.push(n), o = n instanceof X ? n : null
				}), i
			}

			function p(n, e) {
				var t = null;
				return n.reduce(function (n, e) {
					return e instanceof Tn && t && t.TYPE == e.TYPE ? (t.definitions = t.definitions.concat(e.definitions), m = !0) : e instanceof un && t instanceof Tn && (!e.init || e.init.TYPE == t.TYPE) ? (m = !0, n.pop(), e.init ? e.init.definitions = t.definitions.concat(e.init.definitions) : e.init = t, n.push(e), t = e) : (t = e, n.push(e)), n
				}, [])
			}

			function h(n, t) {
				n.forEach(function (n) {
					n instanceof X && (n.body = function t(n) {
						return n.transform(new H(function (n) {
							if (n instanceof Mn && n.expression instanceof hn) return e(In, n, {
								operator: "!",
								expression: n
							});
							if (n instanceof Mn) n.expression = t(n.expression); else if (n instanceof Hn) n.car = t(n.car); else if (n instanceof Vn) {
								var r = t(n.condition);
								if (r !== n.condition) {
									n.condition = r;
									var i = n.consequent;
									n.consequent = n.alternative, n.alternative = i
								}
							}
							return n
						}))
					}(n.body))
				})
			}

			var m, v = 10;
			do m = !1, t.option("angular") && (n = i(n)), n = o(n), t.option("dead_code") && (n = s(n, t)), t.option("if_return") && (n = a(n, t)), t.option("sequences") && (n = f(n, t)), t.option("join_vars") && (n = p(n, t)); while (m && v-- > 0);
			return t.option("negate_iife") && h(n, t), n
		}

		function c(n, e, t) {
			n.warn("Dropping unreachable code [{file}:{line},{col}]", e.start), e.walk(new y(function (e) {
				return e instanceof Tn ? (n.warn("Declarations in unreachable code! [{file}:{line},{col}]", e.start), e.remove_initializers(), t.push(e), !0) : e instanceof mn ? (t.push(e), !0) : e instanceof fn ? !0 : void 0
			}))
		}

		function f(n, e) {
			return n.print_to_string().length > e.print_to_string().length ? e : n
		}

		function g(n) {
			return n && n.aborts()
		}

		function b(n, t) {
			function i(i) {
				i = r(i), n.body instanceof K ? (n.body = n.body.clone(), n.body.body = i.concat(n.body.body.slice(1)), n.body = n.body.transform(t)) : n.body = e(K, n.body, {body: i}).transform(t), b(n, t)
			}

			var o = n.body instanceof K ? n.body.body[0] : n.body;
			o instanceof En && (o.body instanceof An && t.loopcontrol_target(o.body.label) === n ? (n.condition ? n.condition = e(Un, n.condition, {
				left: n.condition,
				operator: "&&",
				right: o.condition.negate(t)
			}) : n.condition = o.condition.negate(t), i(o.alternative)) : o.alternative instanceof An && t.loopcontrol_target(o.alternative.label) === n && (n.condition ? n.condition = e(Un, n.condition, {
				left: n.condition,
				operator: "&&",
				right: o.condition
			}) : n.condition = o.condition, i(o.body)))
		}

		function A(n, e) {
			var t = e.option("pure_getters");
			e.options.pure_getters = !1;
			var r = n.has_side_effects(e);
			return e.options.pure_getters = t, r
		}

		function w(n, t) {
			return t.option("booleans") && t.in_boolean_context() && !n.has_side_effects(t) ? e(De, n) : n
		}

		n(Y, function (n, e) {
			return n
		}), Y.DEFMETHOD("equivalent_to", function (n) {
			return this.print_to_string() == n.print_to_string()
		}), function (n) {
			var e = ["!", "delete"], t = ["in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">"];
			n(Y, function () {
				return !1
			}), n(In, function () {
				return i(this.operator, e)
			}), n(Un, function () {
				return i(this.operator, t) || ("&&" == this.operator || "||" == this.operator) && this.left.is_boolean() && this.right.is_boolean()
			}), n(Vn, function () {
				return this.consequent.is_boolean() && this.alternative.is_boolean()
			}), n(Yn, function () {
				return "=" == this.operator && this.right.is_boolean()
			}), n(Hn, function () {
				return this.cdr.is_boolean()
			}), n(De, function () {
				return !0
			}), n(Ee, function () {
				return !0
			})
		}(function (n, e) {
			n.DEFMETHOD("is_boolean", e)
		}), function (n) {
			n(Y, function () {
				return !1
			}), n(de, function () {
				return !0
			}), n(In, function () {
				return "typeof" == this.operator
			}), n(Un, function (n) {
				return "+" == this.operator && (this.left.is_string(n) || this.right.is_string(n))
			}), n(Yn, function (n) {
				return ("=" == this.operator || "+=" == this.operator) && this.right.is_string(n)
			}), n(Hn, function (n) {
				return this.cdr.is_string(n)
			}), n(Vn, function (n) {
				return this.consequent.is_string(n) && this.alternative.is_string(n)
			}), n(Mn, function (n) {
				return n.option("unsafe") && this.expression instanceof ce && "String" == this.expression.name && this.expression.undeclared()
			})
		}(function (n, e) {
			n.DEFMETHOD("is_string", e)
		}), function (n) {
			function e(n, e) {
				if (!e) throw new Error("Compressor must be passed");
				return n._eval(e)
			}

			Y.DEFMETHOD("evaluate", function (e) {
				if (!e.option("evaluate")) return [this];
				try {
					var r = this._eval(e);
					return [f(t(e, r, this), this), r]
				} catch (i) {
					if (i !== n) throw i;
					return [this]
				}
			}), n(W, function () {
				throw new Error(p("Cannot evaluate a statement [{file}:{line},{col}]", this.start))
			}), n(hn, function () {
				throw n
			}), n(Y, function () {
				throw n
			}), n(pe, function () {
				return this.getValue()
			}), n(In, function (t) {
				var r = this.expression;
				switch (this.operator) {
					case"!":
						return !e(r, t);
					case"typeof":
						if (r instanceof hn) return "function";
						if (r = e(r, t), r instanceof RegExp) throw n;
						return typeof r;
					case"void":
						return void e(r, t);
					case"~":
						return ~e(r, t);
					case"-":
						if (r = e(r, t), 0 === r) throw n;
						return -r;
					case"+":
						return +e(r, t)
				}
				throw n
			}), n(Un, function (t) {
				var r = this.left, i = this.right;
				switch (this.operator) {
					case"&&":
						return e(r, t) && e(i, t);
					case"||":
						return e(r, t) || e(i, t);
					case"|":
						return e(r, t) | e(i, t);
					case"&":
						return e(r, t) & e(i, t);
					case"^":
						return e(r, t) ^ e(i, t);
					case"+":
						return e(r, t) + e(i, t);
					case"*":
						return e(r, t) * e(i, t);
					case"/":
						return e(r, t) / e(i, t);
					case"%":
						return e(r, t) % e(i, t);
					case"-":
						return e(r, t) - e(i, t);
					case"<<":
						return e(r, t) << e(i, t);
					case">>":
						return e(r, t) >> e(i, t);
					case">>>":
						return e(r, t) >>> e(i, t);
					case"==":
						return e(r, t) == e(i, t);
					case"===":
						return e(r, t) === e(i, t);
					case"!=":
						return e(r, t) != e(i, t);
					case"!==":
						return e(r, t) !== e(i, t);
					case"<":
						return e(r, t) < e(i, t);
					case"<=":
						return e(r, t) <= e(i, t);
					case">":
						return e(r, t) > e(i, t);
					case">=":
						return e(r, t) >= e(i, t);
					case"in":
						return e(r, t) in e(i, t);
					case"instanceof":
						return e(r, t) instanceof e(i, t)
				}
				throw n
			}), n(Vn, function (n) {
				return e(this.condition, n) ? e(this.consequent, n) : e(this.alternative, n)
			}), n(ce, function (t) {
				var r = this.definition();
				if (r && r.constant && r.init) return e(r.init, t);
				throw n
			}), n(jn, function (t) {
				if (t.option("unsafe") && "length" == this.property) {
					var r = e(this.expression, t);
					if ("string" == typeof r) return r.length
				}
				throw n
			})
		}(function (n, e) {
			n.DEFMETHOD("_eval", e)
		}), function (n) {
			function t(n) {
				return e(In, n, {operator: "!", expression: n})
			}

			n(Y, function () {
				return t(this)
			}), n(W, function () {
				throw new Error("Cannot negate a statement")
			}), n(hn, function () {
				return t(this)
			}), n(In, function () {
				return "!" == this.operator ? this.expression : t(this)
			}), n(Hn, function (n) {
				var e = this.clone();
				return e.cdr = e.cdr.negate(n), e
			}), n(Vn, function (n) {
				var e = this.clone();
				return e.consequent = e.consequent.negate(n), e.alternative = e.alternative.negate(n), f(t(this), e)
			}), n(Un, function (n) {
				var e = this.clone(), r = this.operator;
				if (n.option("unsafe_comps")) switch (r) {
					case"<=":
						return e.operator = ">", e;
					case"<":
						return e.operator = ">=", e;
					case">=":
						return e.operator = "<", e;
					case">":
						return e.operator = "<=", e
				}
				switch (r) {
					case"==":
						return e.operator = "!=", e;
					case"!=":
						return e.operator = "==", e;
					case"===":
						return e.operator = "!==", e;
					case"!==":
						return e.operator = "===", e;
					case"&&":
						return e.operator = "||", e.left = e.left.negate(n), e.right = e.right.negate(n), f(t(this), e);
					case"||":
						return e.operator = "&&", e.left = e.left.negate(n), e.right = e.right.negate(n), f(t(this), e)
				}
				return t(this)
			})
		}(function (n, e) {
			n.DEFMETHOD("negate", function (n) {
				return e.call(this, n)
			})
		}), function (n) {
			n(Y, function (n) {
				return !0
			}), n(Q, function (n) {
				return !1
			}), n(pe, function (n) {
				return !1
			}), n(le, function (n) {
				return !1
			}), n(Mn, function (n) {
				var e = n.option("pure_funcs");
				return e ? "function" == typeof e ? e(this) : e.indexOf(this.expression.print_to_string()) < 0 : !0
			}), n(Z, function (n) {
				for (var e = this.body.length; --e >= 0;) if (this.body[e].has_side_effects(n)) return !0;
				return !1
			}), n(X, function (n) {
				return this.body.has_side_effects(n)
			}), n(mn, function (n) {
				return !0
			}), n(hn, function (n) {
				return !1
			}), n(Un, function (n) {
				return this.left.has_side_effects(n) || this.right.has_side_effects(n)
			}), n(Yn, function (n) {
				return !0
			}), n(Vn, function (n) {
				return this.condition.has_side_effects(n) || this.consequent.has_side_effects(n) || this.alternative.has_side_effects(n)
			}), n(Rn, function (n) {
				return "delete" == this.operator || "++" == this.operator || "--" == this.operator || this.expression.has_side_effects(n)
			}), n(ce, function (n) {
				return this.global() && this.undeclared()
			}), n(Jn, function (n) {
				for (var e = this.properties.length; --e >= 0;) if (this.properties[e].has_side_effects(n)) return !0;
				return !1
			}), n(Gn, function (n) {
				return this.value.has_side_effects(n)
			}), n(Wn, function (n) {
				for (var e = this.elements.length; --e >= 0;) if (this.elements[e].has_side_effects(n)) return !0;
				return !1
			}), n(jn, function (n) {
				return n.option("pure_getters") ? this.expression.has_side_effects(n) : !0
			}), n(Pn, function (n) {
				return n.option("pure_getters") ? this.expression.has_side_effects(n) || this.property.has_side_effects(n) : !0
			}), n(Nn, function (n) {
				return !n.option("pure_getters")
			}), n(Hn, function (n) {
				return this.car.has_side_effects(n) || this.cdr.has_side_effects(n)
			})
		}(function (n, e) {
			n.DEFMETHOD("has_side_effects", e)
		}), function (n) {
			function e() {
				var n = this.body.length;
				return n > 0 && g(this.body[n - 1])
			}

			n(W, function () {
				return null
			}), n(vn, function () {
				return this
			}), n(K, e), n(Fn, e), n(En, function () {
				return this.alternative && g(this.body) && g(this.alternative) && this
			})
		}(function (n, e) {
			n.DEFMETHOD("aborts", e)
		}), n(G, function (n, t) {
			return "up" === t.has_directive(n.value) ? e(Q, n) : n
		}), n(J, function (n, t) {
			return t.option("drop_debugger") ? e(Q, n) : n
		}), n(en, function (n, t) {
			return n.body instanceof An && t.loopcontrol_target(n.body.label) === n.body ? e(Q, n) : 0 == n.label.references.length ? n.body : n
		}), n(Z, function (n, e) {
			return n.body = s(n.body, e), n
		}), n(K, function (n, t) {
			switch (n.body = s(n.body, t), n.body.length) {
				case 1:
					return n.body[0];
				case 0:
					return e(Q, n)
			}
			return n
		}), fn.DEFMETHOD("drop_unused", function (n) {
			var t = this;
			if (n.has_directive("use asm")) return t;
			if (n.option("unused") && !(t instanceof ln) && !t.uses_eval) {
				var r = [], o = new _, a = this, u = new y(function (e, i) {
					if (e !== t) {
						if (e instanceof mn) return o.add(e.name.name, e), !0;
						if (e instanceof Tn && a === t) return e.definitions.forEach(function (e) {
							e.value && (o.add(e.name.name, e.value), e.value.has_side_effects(n) && e.value.walk(u))
						}), !0;
						if (e instanceof ce) return l(r, e.definition()), !0;
						if (e instanceof fn) {
							var s = a;
							return a = e, i(), a = s, !0
						}
					}
				});
				t.walk(u);
				for (var s = 0; s < r.length; ++s) r[s].orig.forEach(function (n) {
					var e = o.get(n.name);
					e && e.forEach(function (n) {
						var e = new y(function (n) {
							n instanceof ce && l(r, n.definition())
						});
						n.walk(e)
					})
				});
				var c = new H(function (o, a, u) {
					if (o instanceof pn && !(o instanceof dn) && !n.option("keep_fargs")) for (var s = o.argnames, f = s.length; --f >= 0;) {
						var l = s[f];
						if (!l.unreferenced()) break;
						s.pop(), n.warn("Dropping unused function argument {name} [{file}:{line},{col}]", {
							name: l.name,
							file: l.start.file,
							line: l.start.line,
							col: l.start.col
						})
					}
					if (o instanceof mn && o !== t) return i(o.name.definition(), r) ? o : (n.warn("Dropping unused function {name} [{file}:{line},{col}]", {
						name: o.name.name,
						file: o.name.start.file,
						line: o.name.start.line,
						col: o.name.start.col
					}), e(Q, o));
					if (o instanceof Tn && !(c.parent() instanceof sn)) {
						var p = o.definitions.filter(function (e) {
							if (i(e.name.definition(), r)) return !0;
							var t = {
								name: e.name.name,
								file: e.name.start.file,
								line: e.name.start.line,
								col: e.name.start.col
							};
							return e.value && e.value.has_side_effects(n) ? (e._unused_side_effects = !0, n.warn("Side effects in initialization of unused variable {name} [{file}:{line},{col}]", t), !0) : (n.warn("Dropping unused variable {name} [{file}:{line},{col}]", t), !1)
						});
						p = h(p, function (n, e) {
							return !n.value && e.value ? -1 : !e.value && n.value ? 1 : 0
						});
						for (var d = [], f = 0; f < p.length;) {
							var m = p[f];
							m._unused_side_effects ? (d.push(m.value), p.splice(f, 1)) : (d.length > 0 && (d.push(m.value), m.value = Hn.from_array(d), d = []), ++f)
						}
						return d = d.length > 0 ? e(K, o, {body: [e(X, o, {body: Hn.from_array(d)})]}) : null, 0 != p.length || d ? 0 == p.length ? u ? U.splice(d.body) : d : (o.definitions = p, d ? (d.body.unshift(o), u ? U.splice(d.body) : d) : o) : e(Q, o)
					}
					if (o instanceof un && (a(o, this), o.init instanceof K)) {
						var v = o.init.body.slice(0, -1);
						return o.init = o.init.body.slice(-1)[0].body, v.push(o), u ? U.splice(v) : e(K, o, {body: v})
					}
					return o instanceof fn && o !== t ? o : void 0
				});
				t.transform(c)
			}
		}), fn.DEFMETHOD("hoist_declarations", function (n) {
			var t = this;
			if (n.has_directive("use asm")) return t;
			var r = n.option("hoist_funs"), i = n.option("hoist_vars");
			if (r || i) {
				var a = [], u = [], s = new _, c = 0, f = 0;
				t.walk(new y(function (n) {
					return n instanceof fn && n !== t ? !0 : n instanceof $n ? (++f, !0) : void 0
				})), i = i && f > 1;
				var l = new H(function (n) {
					if (n !== t) {
						if (n instanceof G) return a.push(n), e(Q, n);
						if (n instanceof mn && r) return u.push(n), e(Q, n);
						if (n instanceof $n && i) {
							n.definitions.forEach(function (n) {
								s.set(n.name.name, n), ++c
							});
							var o = n.to_assignments(), f = l.parent();
							return f instanceof sn && f.init === n ? null == o ? n.definitions[0].name : o : f instanceof un && f.init === n ? o : o ? e(X, n, {body: o}) : e(Q, n)
						}
						if (n instanceof fn) return n
					}
				});
				if (t = t.transform(l), c > 0) {
					var p = [];
					if (s.each(function (n, e) {
						t instanceof pn && o(function (e) {
							return e.name == n.name.name
						}, t.argnames) ? s.del(e) : (n = n.clone(),
							n.value = null, p.push(n), s.set(e, n))
					}), p.length > 0) {
						for (var h = 0; h < t.body.length;) {
							if (t.body[h] instanceof X) {
								var m, v, g = t.body[h].body;
								if (g instanceof Yn && "=" == g.operator && (m = g.left) instanceof Qn && s.has(m.name)) {
									var b = s.get(m.name);
									if (b.value) break;
									b.value = g.right, d(p, b), p.push(b), t.body.splice(h, 1);
									continue
								}
								if (g instanceof Hn && (v = g.car) instanceof Yn && "=" == v.operator && (m = v.left) instanceof Qn && s.has(m.name)) {
									var b = s.get(m.name);
									if (b.value) break;
									b.value = v.right, d(p, b), p.push(b), t.body[h].body = g.cdr;
									continue
								}
							}
							if (t.body[h] instanceof Q) t.body.splice(h, 1); else {
								if (!(t.body[h] instanceof K)) break;
								var A = [h, 1].concat(t.body[h].body);
								t.body.splice.apply(t.body, A)
							}
						}
						p = e($n, t, {definitions: p}), u.push(p)
					}
				}
				t.body = a.concat(u, t.body)
			}
			return t
		}), n(X, function (n, t) {
			return t.option("side_effects") && !n.body.has_side_effects(t) ? (t.warn("Dropping side-effect-free statement [{file}:{line},{col}]", n.start), e(Q, n)) : n
		}), n(rn, function (n, t) {
			var r = n.condition.evaluate(t);
			if (n.condition = r[0], !t.option("loops")) return n;
			if (r.length > 1) {
				if (r[1]) return e(un, n, {body: n.body});
				if (n instanceof an && t.option("dead_code")) {
					var i = [];
					return c(t, n.body, i), e(K, n, {body: i})
				}
			}
			return n
		}), n(an, function (n, t) {
			return t.option("loops") ? (n = rn.prototype.optimize.call(n, t), n instanceof an && (b(n, t), n = e(un, n, n).transform(t)), n) : n
		}), n(un, function (n, t) {
			var r = n.condition;
			if (r && (r = r.evaluate(t), n.condition = r[0]), !t.option("loops")) return n;
			if (r && r.length > 1 && !r[1] && t.option("dead_code")) {
				var i = [];
				return n.init instanceof W ? i.push(n.init) : n.init && i.push(e(X, n.init, {body: n.init})), c(t, n.body, i), e(K, n, {body: i})
			}
			return b(n, t), n
		}), n(En, function (n, t) {
			if (!t.option("conditionals")) return n;
			var r = n.condition.evaluate(t);
			if (n.condition = r[0], r.length > 1) if (r[1]) {
				if (t.warn("Condition always true [{file}:{line},{col}]", n.condition.start), t.option("dead_code")) {
					var i = [];
					return n.alternative && c(t, n.alternative, i), i.push(n.body), e(K, n, {body: i}).transform(t)
				}
			} else if (t.warn("Condition always false [{file}:{line},{col}]", n.condition.start), t.option("dead_code")) {
				var i = [];
				return c(t, n.body, i), n.alternative && i.push(n.alternative), e(K, n, {body: i}).transform(t)
			}
			a(n.alternative) && (n.alternative = null);
			var o = n.condition.negate(t), u = f(n.condition, o) === o;
			if (n.alternative && u) {
				u = !1, n.condition = o;
				var s = n.body;
				n.body = n.alternative || e(Q), n.alternative = s
			}
			if (a(n.body) && a(n.alternative)) return e(X, n.condition, {body: n.condition}).transform(t);
			if (n.body instanceof X && n.alternative instanceof X) return e(X, n, {
				body: e(Vn, n, {
					condition: n.condition,
					consequent: n.body.body,
					alternative: n.alternative.body
				})
			}).transform(t);
			if (a(n.alternative) && n.body instanceof X) return u ? e(X, n, {
				body: e(Un, n, {
					operator: "||",
					left: o,
					right: n.body.body
				})
			}).transform(t) : e(X, n, {
				body: e(Un, n, {
					operator: "&&",
					left: n.condition,
					right: n.body.body
				})
			}).transform(t);
			if (n.body instanceof Q && n.alternative && n.alternative instanceof X) return e(X, n, {
				body: e(Un, n, {
					operator: "||",
					left: n.condition,
					right: n.alternative.body
				})
			}).transform(t);
			if (n.body instanceof _n && n.alternative instanceof _n && n.body.TYPE == n.alternative.TYPE) return e(n.body.CTOR, n, {
				value: e(Vn, n, {
					condition: n.condition,
					consequent: n.body.value || e(be, n.body).optimize(t),
					alternative: n.alternative.value || e(be, n.alternative).optimize(t)
				})
			}).transform(t);
			if (n.body instanceof En && !n.body.alternative && !n.alternative && (n.condition = e(Un, n.condition, {
				operator: "&&",
				left: n.condition,
				right: n.body.condition
			}).transform(t), n.body = n.body.body), g(n.body) && n.alternative) {
				var l = n.alternative;
				return n.alternative = null, e(K, n, {body: [n, l]}).transform(t)
			}
			if (g(n.alternative)) {
				var p = n.body;
				return n.body = n.alternative, n.condition = u ? o : n.condition.negate(t), n.alternative = null, e(K, n, {body: [n, p]}).transform(t)
			}
			return n
		}), n(Dn, function (n, t) {
			if (0 == n.body.length && t.option("conditionals")) return e(X, n, {body: n.expression}).transform(t);
			for (; ;) {
				var r = n.body[n.body.length - 1];
				if (r) {
					var i = r.body[r.body.length - 1];
					if (i instanceof An && u(t.loopcontrol_target(i.label)) === n && r.body.pop(), r instanceof Cn && 0 == r.body.length) {
						n.body.pop();
						continue
					}
				}
				break
			}
			var o = n.expression.evaluate(t);
			n:if (2 == o.length) try {
				if (n.expression = o[0], !t.option("dead_code")) break n;
				var a = o[1], s = !1, c = !1, f = !1, l = !1, p = !1, d = new H(function (r, i, o) {
					if (r instanceof pn || r instanceof X) return r;
					if (r instanceof Dn && r === n) return r = r.clone(), i(r, this), p ? r : e(K, r, {
						body: r.body.reduce(function (n, e) {
							return n.concat(e.body)
						}, [])
					}).transform(t);
					if (r instanceof En || r instanceof xn) {
						var u = s;
						return s = !c, i(r, this), s = u, r
					}
					if (r instanceof nn || r instanceof Dn) {
						var u = c;
						return c = !0, i(r, this), c = u, r
					}
					if (r instanceof An && this.loopcontrol_target(r.label) === n) return s ? (p = !0, r) : c ? r : (l = !0, o ? U.skip : e(Q, r));
					if (r instanceof Fn && this.parent() === n) {
						if (l) return U.skip;
						if (r instanceof kn) {
							var d = r.expression.evaluate(t);
							if (d.length < 2) throw n;
							return d[1] === a || f ? (f = !0, g(r) && (l = !0), i(r, this), r) : U.skip
						}
						return i(r, this), r
					}
				});
				d.stack = t.stack.slice(), n = n.transform(d)
			} catch (h) {
				if (h !== n) throw h
			}
			return n
		}), n(kn, function (n, e) {
			return n.body = s(n.body, e), n
		}), n(xn, function (n, e) {
			return n.body = s(n.body, e), n
		}), Tn.DEFMETHOD("remove_initializers", function () {
			this.definitions.forEach(function (n) {
				n.value = null
			})
		}), Tn.DEFMETHOD("to_assignments", function () {
			var n = this.definitions.reduce(function (n, t) {
				if (t.value) {
					var r = e(ce, t.name, t.name);
					n.push(e(Yn, t, {operator: "=", left: r, right: t.value}))
				}
				return n
			}, []);
			return 0 == n.length ? null : Hn.from_array(n)
		}), n(Tn, function (n, t) {
			return 0 == n.definitions.length ? e(Q, n) : n
		}), n(hn, function (n, e) {
			return n = pn.prototype.optimize.call(n, e), e.option("unused") && !e.option("keep_fnames") && n.name && n.name.unreferenced() && (n.name = null), n
		}), n(Mn, function (n, r) {
			if (r.option("unsafe")) {
				var i = n.expression;
				if (i instanceof ce && i.undeclared()) switch (i.name) {
					case"Array":
						if (1 != n.args.length) return e(Wn, n, {elements: n.args}).transform(r);
						break;
					case"Object":
						if (0 == n.args.length) return e(Jn, n, {properties: []});
						break;
					case"String":
						if (0 == n.args.length) return e(de, n, {value: ""});
						if (n.args.length <= 1) return e(Un, n, {
							left: n.args[0],
							operator: "+",
							right: e(de, n, {value: ""})
						}).transform(r);
						break;
					case"Number":
						if (0 == n.args.length) return e(he, n, {value: 0});
						if (1 == n.args.length) return e(In, n, {expression: n.args[0], operator: "+"}).transform(r);
					case"Boolean":
						if (0 == n.args.length) return e(Ee, n);
						if (1 == n.args.length) return e(In, n, {
							expression: e(In, null, {
								expression: n.args[0],
								operator: "!"
							}), operator: "!"
						}).transform(r);
						break;
					case"Function":
						if (0 == n.args.length) return e(hn, n, {argnames: [], body: []});
						if (v(n.args, function (n) {
							return n instanceof de
						})) try {
							var o = "(function(" + n.args.slice(0, -1).map(function (n) {
								return n.value
							}).join(",") + "){" + n.args[n.args.length - 1].value + "})()", a = z(o);
							a.figure_out_scope({screw_ie8: r.option("screw_ie8")});
							var u = new P(r.options);
							a = a.transform(u), a.figure_out_scope({screw_ie8: r.option("screw_ie8")}), a.mangle_names();
							var s;
							try {
								a.walk(new y(function (n) {
									if (n instanceof pn) throw s = n, a
								}))
							} catch (c) {
								if (c !== a) throw c
							}
							if (!s) return n;
							var l = s.argnames.map(function (t, r) {
								return e(de, n.args[r], {value: t.print_to_string()})
							}), o = j();
							return K.prototype._codegen.call(s, s, o), o = o.toString().replace(/^\{|\}$/g, ""), l.push(e(de, n.args[n.args.length - 1], {value: o})), n.args = l, n
						} catch (c) {
							if (!(c instanceof $)) throw console.log(c), c;
							r.warn("Error parsing code passed to new Function [{file}:{line},{col}]", n.args[n.args.length - 1].start), r.warn(c.toString())
						}
				} else {
					if (i instanceof jn && "toString" == i.property && 0 == n.args.length) return e(Un, n, {
						left: e(de, n, {value: ""}),
						operator: "+",
						right: i.expression
					}).transform(r);
					if (i instanceof jn && i.expression instanceof Wn && "join" == i.property) {
						var p = 0 == n.args.length ? "," : n.args[0].evaluate(r)[1];
						if (null != p) {
							var d = i.expression.elements.reduce(function (n, e) {
								if (e = e.evaluate(r), 0 == n.length || 1 == e.length) n.push(e); else {
									var i = n[n.length - 1];
									if (2 == i.length) {
										var o = "" + i[1] + p + e[1];
										n[n.length - 1] = [t(r, o, i[0]), o]
									} else n.push(e)
								}
								return n
							}, []);
							if (0 == d.length) return e(de, n, {value: ""});
							if (1 == d.length) return d[0][0];
							if ("" == p) {
								var h;
								return h = d[0][0] instanceof de || d[1][0] instanceof de ? d.shift()[0] : e(de, n, {value: ""}), d.reduce(function (n, t) {
									return e(Un, t[0], {operator: "+", left: n, right: t[0]})
								}, h).transform(r)
							}
							var m = n.clone();
							return m.expression = m.expression.clone(), m.expression.expression = m.expression.expression.clone(), m.expression.expression.elements = d.map(function (n) {
								return n[0]
							}), f(n, m)
						}
					}
				}
			}
			if (r.option("side_effects") && n.expression instanceof hn && 0 == n.args.length && !Z.prototype.has_side_effects.call(n.expression, r)) return e(be, n).transform(r);
			if (r.option("drop_console") && n.expression instanceof Nn) {
				for (var _ = n.expression.expression; _.expression;) _ = _.expression;
				if (_ instanceof ce && "console" == _.name && _.undeclared()) return e(be, n).transform(r)
			}
			return n.evaluate(r)[0]
		}), n(zn, function (n, t) {
			if (t.option("unsafe")) {
				var r = n.expression;
				if (r instanceof ce && r.undeclared()) switch (r.name) {
					case"Object":
					case"RegExp":
					case"Function":
					case"Error":
					case"Array":
						return e(Mn, n, n).transform(t)
				}
			}
			return n
		}), n(Hn, function (n, t) {
			if (!t.option("side_effects")) return n;
			if (!n.car.has_side_effects(t)) {
				var r = t.parent();
				if (!(r instanceof Mn && r.expression === n)) return n.cdr
			}
			if (t.option("cascade")) {
				if (n.car instanceof Yn && !n.car.left.has_side_effects(t)) {
					if (n.car.left.equivalent_to(n.cdr)) return n.car;
					if (n.cdr instanceof Mn && n.cdr.expression.equivalent_to(n.car.left)) return n.cdr.expression = n.car, n.cdr
				}
				if (!n.car.has_side_effects(t) && !n.cdr.has_side_effects(t) && n.car.equivalent_to(n.cdr)) return n.car
			}
			return n.cdr instanceof In && "void" == n.cdr.operator && !n.cdr.expression.has_side_effects(t) ? (n.cdr.expression = n.car, n.cdr) : n.cdr instanceof be ? e(In, n, {
				operator: "void",
				expression: n.car
			}) : n
		}), Rn.DEFMETHOD("lift_sequences", function (n) {
			if (n.option("sequences") && this.expression instanceof Hn) {
				var e = this.expression, t = e.to_array();
				return this.expression = t.pop(), t.push(this), e = Hn.from_array(t).transform(n)
			}
			return this
		}), n(Ln, function (n, e) {
			return n.lift_sequences(e)
		}), n(In, function (n, t) {
			n = n.lift_sequences(t);
			var r = n.expression;
			if (t.option("booleans") && t.in_boolean_context()) {
				switch (n.operator) {
					case"!":
						if (r instanceof In && "!" == r.operator) return r.expression;
						break;
					case"typeof":
						return t.warn("Boolean expression always true [{file}:{line},{col}]", n.start), e(De, n)
				}
				r instanceof Un && "!" == n.operator && (n = f(n, r.negate(t)))
			}
			return n.evaluate(t)[0]
		}), Un.DEFMETHOD("lift_sequences", function (n) {
			if (n.option("sequences")) {
				if (this.left instanceof Hn) {
					var e = this.left, t = e.to_array();
					return this.left = t.pop(), t.push(this), e = Hn.from_array(t).transform(n)
				}
				if (this.right instanceof Hn && this instanceof Yn && !A(this.left, n)) {
					var e = this.right, t = e.to_array();
					return this.right = t.pop(), t.push(this), e = Hn.from_array(t).transform(n)
				}
			}
			return this
		});
		var E = m("== === != !== * & | ^");
		n(Un, function (n, t) {
			function r(e, r) {
				if (r || !n.left.has_side_effects(t) && !n.right.has_side_effects(t)) {
					e && (n.operator = e);
					var i = n.left;
					n.left = n.right, n.right = i
				}
			}

			if (E(n.operator) && (n.right instanceof pe && !(n.left instanceof pe) && (n.left instanceof Un && Re[n.left.operator] >= Re[n.operator] || r(null, !0)), /^[!=]==?$/.test(n.operator))) {
				if (n.left instanceof ce && n.right instanceof Vn) {
					if (n.right.consequent instanceof ce && n.right.consequent.definition() === n.left.definition()) {
						if (/^==/.test(n.operator)) return n.right.condition;
						if (/^!=/.test(n.operator)) return n.right.condition.negate(t)
					}
					if (n.right.alternative instanceof ce && n.right.alternative.definition() === n.left.definition()) {
						if (/^==/.test(n.operator)) return n.right.condition.negate(t);
						if (/^!=/.test(n.operator)) return n.right.condition
					}
				}
				if (n.right instanceof ce && n.left instanceof Vn) {
					if (n.left.consequent instanceof ce && n.left.consequent.definition() === n.right.definition()) {
						if (/^==/.test(n.operator)) return n.left.condition;
						if (/^!=/.test(n.operator)) return n.left.condition.negate(t)
					}
					if (n.left.alternative instanceof ce && n.left.alternative.definition() === n.right.definition()) {
						if (/^==/.test(n.operator)) return n.left.condition.negate(t);
						if (/^!=/.test(n.operator)) return n.left.condition
					}
				}
			}
			if (n = n.lift_sequences(t), t.option("comparisons")) switch (n.operator) {
				case"===":
				case"!==":
					(n.left.is_string(t) && n.right.is_string(t) || n.left.is_boolean() && n.right.is_boolean()) && (n.operator = n.operator.substr(0, 2));
				case"==":
				case"!=":
					n.left instanceof de && "undefined" == n.left.value && n.right instanceof In && "typeof" == n.right.operator && t.option("unsafe") && (n.right.expression instanceof ce && n.right.expression.undeclared() || (n.right = n.right.expression, n.left = e(be, n.left).optimize(t), 2 == n.operator.length && (n.operator += "=")))
			}
			if (t.option("conditionals")) if ("&&" == n.operator) {
				var i = n.left.evaluate(t);
				if (i.length > 1) {
					if (i[1]) {
						t.warn("Condition left of && always true [{file}:{line},{col}]", n.start);
						var o = n.right.evaluate(t);
						return o[0]
					}
					return t.warn("Condition left of && always false [{file}:{line},{col}]", n.start), i[0]
				}
			} else if ("||" == n.operator) {
				var i = n.left.evaluate(t);
				if (i.length > 1) {
					if (i[1]) return t.warn("Condition left of || always true [{file}:{line},{col}]", n.start), i[0];
					t.warn("Condition left of || always false [{file}:{line},{col}]", n.start);
					var o = n.right.evaluate(t);
					return o[0]
				}
			}
			if (t.option("booleans") && t.in_boolean_context()) switch (n.operator) {
				case"&&":
					var i = n.left.evaluate(t), o = n.right.evaluate(t);
					if (i.length > 1 && !i[1] || o.length > 1 && !o[1]) return t.warn("Boolean && always false [{file}:{line},{col}]", n.start), n.left.has_side_effects(t) ? e(Hn, n, {
						car: n.left,
						cdr: e(Ee)
					}).optimize(t) : e(Ee, n);
					if (i.length > 1 && i[1]) return o[0];
					if (o.length > 1 && o[1]) return i[0];
					break;
				case"||":
					var i = n.left.evaluate(t), o = n.right.evaluate(t);
					if (i.length > 1 && i[1] || o.length > 1 && o[1]) return t.warn("Boolean || always true [{file}:{line},{col}]", n.start), n.left.has_side_effects(t) ? e(Hn, n, {
						car: n.left,
						cdr: e(De)
					}).optimize(t) : e(De, n);
					if (i.length > 1 && !i[1]) return o[0];
					if (o.length > 1 && !o[1]) return i[0];
					break;
				case"+":
					var i = n.left.evaluate(t), o = n.right.evaluate(t);
					if (i.length > 1 && i[0] instanceof de && i[1] || o.length > 1 && o[0] instanceof de && o[1]) return t.warn("+ in boolean context always true [{file}:{line},{col}]", n.start), e(De, n)
			}
			if (t.option("comparisons") && n.is_boolean()) {
				if (!(t.parent() instanceof Un) || t.parent() instanceof Yn) {
					var a = e(In, n, {operator: "!", expression: n.negate(t)});
					n = f(n, a)
				}
				switch (n.operator) {
					case"<":
						r(">");
						break;
					case"<=":
						r(">=")
				}
			}
			return "+" == n.operator && n.right instanceof de && "" === n.right.getValue() && n.left instanceof Un && "+" == n.left.operator && n.left.is_string(t) ? n.left : (t.option("evaluate") && "+" == n.operator && (n.left instanceof pe && n.right instanceof Un && "+" == n.right.operator && n.right.left instanceof pe && n.right.is_string(t) && (n = e(Un, n, {
				operator: "+",
				left: e(de, null, {
					value: "" + n.left.getValue() + n.right.left.getValue(),
					start: n.left.start,
					end: n.right.left.end
				}),
				right: n.right.right
			})), n.right instanceof pe && n.left instanceof Un && "+" == n.left.operator && n.left.right instanceof pe && n.left.is_string(t) && (n = e(Un, n, {
				operator: "+",
				left: n.left.left,
				right: e(de, null, {
					value: "" + n.left.right.getValue() + n.right.getValue(),
					start: n.left.right.start,
					end: n.right.end
				})
			})), n.left instanceof Un && "+" == n.left.operator && n.left.is_string(t) && n.left.right instanceof pe && n.right instanceof Un && "+" == n.right.operator && n.right.left instanceof pe && n.right.is_string(t) && (n = e(Un, n, {
				operator: "+",
				left: e(Un, n.left, {
					operator: "+",
					left: n.left.left,
					right: e(de, null, {
						value: "" + n.left.right.getValue() + n.right.left.getValue(),
						start: n.left.right.start,
						end: n.right.left.end
					})
				}),
				right: n.right.right
			}))), n.right instanceof Un && n.right.operator == n.operator && ("&&" == n.operator || "||" == n.operator) ? (n.left = e(Un, n.left, {
				operator: n.operator,
				left: n.left,
				right: n.right.left
			}), n.right = n.right.right, n.transform(t)) : n.evaluate(t)[0])
		}), n(ce, function (n, r) {
			function i(n, e) {
				return e instanceof Un && "=" === e.operator && e.left === n
			}

			if (n.undeclared() && !i(n, r.parent())) {
				var o = r.option("global_defs");
				if (o && o.hasOwnProperty(n.name)) return t(r, o[n.name], n);
				switch (n.name) {
					case"undefined":
						return e(be, n);
					case"NaN":
						return e(ge, n).transform(r);
					case"Infinity":
						return e(Ae, n).transform(r)
				}
			}
			return n
		}), n(Ae, function (n, t) {
			return e(Un, n, {operator: "/", left: e(he, n, {value: 1}), right: e(he, n, {value: 0})})
		}), n(be, function (n, t) {
			if (t.option("unsafe")) {
				var r = t.find_parent(fn), i = r.find_variable("undefined");
				if (i) {
					var o = e(ce, n, {name: "undefined", scope: r, thedef: i});
					return o.reference(), o
				}
			}
			return n
		});
		var D = ["+", "-", "/", "*", "%", ">>", "<<", ">>>", "|", "^", "&"];
		n(Yn, function (n, e) {
			return n = n.lift_sequences(e), "=" == n.operator && n.left instanceof ce && n.right instanceof Un && n.right.left instanceof ce && n.right.left.name == n.left.name && i(n.right.operator, D) && (n.operator = n.right.operator + "=", n.right = n.right.right), n
		}), n(Vn, function (n, r) {
			if (!r.option("conditionals")) return n;
			if (n.condition instanceof Hn) {
				var i = n.condition.car;
				return n.condition = n.condition.cdr, Hn.cons(i, n)
			}
			var o = n.condition.evaluate(r);
			if (o.length > 1) return o[1] ? (r.warn("Condition always true [{file}:{line},{col}]", n.start), n.consequent) : (r.warn("Condition always false [{file}:{line},{col}]", n.start), n.alternative);
			var a = o[0].negate(r);
			f(o[0], a) === a && (n = e(Vn, n, {condition: a, consequent: n.alternative, alternative: n.consequent}));
			var u = n.consequent, s = n.alternative;
			if (u instanceof Yn && s instanceof Yn && u.operator == s.operator && u.left.equivalent_to(s.left) && !u.left.has_side_effects(r)) return e(Yn, n, {
				operator: u.operator,
				left: u.left,
				right: e(Vn, n, {condition: n.condition, consequent: u.right, alternative: s.right})
			});
			if (u instanceof Mn && s.TYPE === u.TYPE && u.args.length == s.args.length && !u.expression.has_side_effects(r) && u.expression.equivalent_to(s.expression)) {
				if (0 == u.args.length) return e(Hn, n, {car: n.condition, cdr: u});
				if (1 == u.args.length) return u.args[0] = e(Vn, n, {
					condition: n.condition,
					consequent: u.args[0],
					alternative: s.args[0]
				}), u
			}
			return u instanceof Vn && u.alternative.equivalent_to(s) ? e(Vn, n, {
				condition: e(Un, n, {
					left: n.condition,
					operator: "&&",
					right: u.condition
				}), consequent: u.consequent, alternative: s
			}) : u instanceof pe && s instanceof pe && u.equivalent_to(s) ? n.condition.has_side_effects(r) ? Hn.from_array([n.condition, t(r, u.value, n)]) : t(r, u.value, n) : u instanceof De && s instanceof Ee ? (n.condition = n.condition.negate(r), e(In, n.condition, {
				operator: "!",
				expression: n.condition
			})) : u instanceof Ee && s instanceof De ? n.condition.negate(r) : n
		}), n(we, function (n, t) {
			if (t.option("booleans")) {
				var r = t.parent();
				return r instanceof Un && ("==" == r.operator || "!=" == r.operator) ? (t.warn("Non-strict equality against boolean: {operator} {value} [{file}:{line},{col}]", {
					operator: r.operator,
					value: n.value,
					file: r.start.file,
					line: r.start.line,
					col: r.start.col
				}), e(he, n, {value: +n.value})) : e(In, n, {operator: "!", expression: e(he, n, {value: 1 - n.value})})
			}
			return n
		}), n(Pn, function (n, t) {
			var r = n.property;
			if (r instanceof de && t.option("properties")) {
				if (r = r.getValue(), ke(r) ? t.option("screw_ie8") : S(r)) return e(jn, n, {
					expression: n.expression,
					property: r
				}).optimize(t);
				var i = parseFloat(r);
				isNaN(i) || i.toString() != r || (n.property = e(he, n.property, {value: i}))
			}
			return n
		}), n(jn, function (n, t) {
			var r = n.property;
			return ke(r) && !t.option("screw_ie8") ? e(Pn, n, {
				expression: n.expression,
				property: e(de, n, {value: r})
			}).optimize(t) : n.evaluate(t)[0]
		}), n(Wn, w), n(Jn, w), n(me, w), n(gn, function (n, e) {
			return n.value instanceof be && (n.value = null), n
		})
	}(), function () {
		function e(n) {
			return "Literal" == n.type ? null != n.raw ? n.raw : n.value + "" : void 0
		}

		function t(n) {
			var t = n.loc, r = t && t.start, i = n.range;
			return new V({
				file: t && t.source,
				line: r && r.line,
				col: r && r.column,
				pos: i ? i[0] : n.start,
				endline: r && r.line,
				endcol: r && r.column,
				endpos: i ? i[0] : n.start,
				raw: e(n)
			})
		}

		function r(n) {
			var t = n.loc, r = t && t.end, i = n.range;
			return new V({
				file: t && t.source,
				line: r && r.line,
				col: r && r.column,
				pos: i ? i[1] : n.end,
				endline: r && r.line,
				endcol: r && r.column,
				endpos: i ? i[1] : n.end,
				raw: e(n)
			})
		}

		function i(e, i, a) {
			var l = "function From_Moz_" + e + "(M){\n";
			l += "return new U2." + i.name + "({\nstart: my_start_token(M),\nend: my_end_token(M)";
			var p = "function To_Moz_" + e + "(M){\n";
			p += "return {\ntype: " + JSON.stringify(e), a && a.split(/\s*,\s*/).forEach(function (n) {
				var e = /([a-z0-9$_]+)(=|@|>|%)([a-z0-9$_]+)/i.exec(n);
				if (!e) throw new Error("Can't understand property map: " + n);
				var t = e[1], r = e[2], i = e[3];
				switch (l += ",\n" + i + ": ", p += ",\n" + t + ": ", r) {
					case"@":
						l += "M." + t + ".map(from_moz)", p += "M." + i + ".map(to_moz)";
						break;
					case">":
						l += "from_moz(M." + t + ")", p += "to_moz(M." + i + ")";
						break;
					case"=":
						l += "M." + t, p += "M." + i;
						break;
					case"%":
						l += "from_moz(M." + t + ").body", p += "to_moz_block(M)";
						break;
					default:
						throw new Error("Can't understand operator in propmap: " + n)
				}
			}), l += "\n})\n}", p += "\n}\n}", l = new Function("U2", "my_start_token", "my_end_token", "from_moz", "return(" + l + ")")(n, t, r, o), p = new Function("to_moz", "to_moz_block", "return(" + p + ")")(s, c), f[e] = l, u(i, p)
		}

		function o(n) {
			l.push(n);
			var e = null != n ? f[n.type](n) : null;
			return l.pop(), e
		}

		function a(n, e, t) {
			var r = n.start, i = n.end;
			return null != r.pos && null != i.endpos && (e.range = [r.pos, i.endpos]), r.line && (e.loc = {
				start: {
					line: r.line,
					column: r.col
				}, end: i.endline ? {line: i.endline, column: i.endcol} : null
			}, r.file && (e.loc.source = r.file)), e
		}

		function u(n, e) {
			n.DEFMETHOD("to_mozilla_ast", function () {
				return a(this, e(this))
			})
		}

		function s(n) {
			return null != n ? n.to_mozilla_ast() : null
		}

		function c(n) {
			return {type: "BlockStatement", body: n.body.map(s)}
		}

		var f = {
			ExpressionStatement: function (n) {
				var e = n.expression;
				return "Literal" === e.type && "string" == typeof e.value ? new G({
					start: t(n),
					end: r(n),
					value: e.value
				}) : new X({start: t(n), end: r(n), body: o(e)})
			}, TryStatement: function (n) {
				var e = n.handlers || [n.handler];
				if (e.length > 1 || n.guardedHandlers && n.guardedHandlers.length) throw new Error("Multiple catch clauses are not supported.");
				return new xn({
					start: t(n),
					end: r(n),
					body: o(n.block).body,
					bcatch: o(e[0]),
					bfinally: n.finalizer ? new Sn(o(n.finalizer)) : null
				})
			}, Property: function (n) {
				var e = n.key, i = "Identifier" == e.type ? e.name : e.value,
					a = {start: t(e), end: r(n.value), key: i, value: o(n.value)};
				switch (n.kind) {
					case"init":
						return new Xn(a);
					case"set":
						return a.value.name = o(e), new Zn(a);
					case"get":
						return a.value.name = o(e), new Kn(a)
				}
			}, ObjectExpression: function (n) {
				return new Jn({
					start: t(n), end: r(n), properties: n.properties.map(function (n) {
						return n.type = "Property", o(n)
					})
				})
			}, SequenceExpression: function (n) {
				return Hn.from_array(n.expressions.map(o))
			}, MemberExpression: function (n) {
				return new (n.computed ? Pn : jn)({
					start: t(n),
					end: r(n),
					property: n.computed ? o(n.property) : n.property.name,
					expression: o(n.object)
				})
			}, SwitchCase: function (n) {
				return new (n.test ? kn : Cn)({
					start: t(n),
					end: r(n),
					expression: o(n.test),
					body: n.consequent.map(o)
				})
			}, VariableDeclaration: function (n) {
				return new ("const" === n.kind ? On : $n)({start: t(n), end: r(n), definitions: n.declarations.map(o)})
			}, Literal: function (n) {
				var e = n.value, i = {start: t(n), end: r(n)};
				if (null === e) return new _e(i);
				switch (typeof e) {
					case"string":
						return i.value = e, new de(i);
					case"number":
						return i.value = e, new he(i);
					case"boolean":
						return new (e ? De : Ee)(i);
					default:
						var o = n.regex;
						return o && o.pattern ? i.value = new RegExp(o.pattern, o.flags).toString() : i.value = n.regex && n.raw ? n.raw : e, new me(i)
				}
			}, Identifier: function (n) {
				var e = l[l.length - 2];
				return new ("LabeledStatement" == e.type ? se : "VariableDeclarator" == e.type && e.id === n ? "const" == e.kind ? re : te : "FunctionExpression" == e.type ? e.id === n ? ae : ie : "FunctionDeclaration" == e.type ? e.id === n ? oe : ie : "CatchClause" == e.type ? ue : "BreakStatement" == e.type || "ContinueStatement" == e.type ? fe : ce)({
					start: t(n),
					end: r(n),
					name: n.name
				})
			}
		};
		f.UpdateExpression = f.UnaryExpression = function (n) {
			var e = "prefix" in n ? n.prefix : "UnaryExpression" == n.type;
			return new (e ? In : Ln)({start: t(n), end: r(n), operator: n.operator, expression: o(n.argument)})
		}, i("Program", ln, "body@body"), i("EmptyStatement", Q), i("BlockStatement", K, "body@body"), i("IfStatement", En, "test>condition, consequent>body, alternate>alternative"), i("LabeledStatement", en, "label>label, body>body"), i("BreakStatement", An, "label>label"), i("ContinueStatement", wn, "label>label"), i("WithStatement", cn, "object>expression, body>body"), i("SwitchStatement", Dn, "discriminant>expression, cases@body"), i("ReturnStatement", gn, "argument>value"), i("ThrowStatement", bn, "argument>value"), i("WhileStatement", an, "test>condition, body>body"), i("DoWhileStatement", on, "test>condition, body>body"), i("ForStatement", un, "init>init, test>condition, update>step, body>body"), i("ForInStatement", sn, "left>init, right>object, body>body"), i("DebuggerStatement", J), i("FunctionDeclaration", mn, "id>name, params@argnames, body%body"), i("VariableDeclarator", qn, "id>name, init>value"), i("CatchClause", Bn, "param>argname, body%body"), i("ThisExpression", le), i("ArrayExpression", Wn, "elements@elements"), i("FunctionExpression", hn, "id>name, params@argnames, body%body"), i("BinaryExpression", Un, "operator=operator, left>left, right>right"), i("LogicalExpression", Un, "operator=operator, left>left, right>right"), i("AssignmentExpression", Yn, "operator=operator, left>left, right>right"), i("ConditionalExpression", Vn, "test>condition, consequent>consequent, alternate>alternative"), i("NewExpression", zn, "callee>expression, arguments@args"), i("CallExpression", Mn, "callee>expression, arguments@args"), u(G, function (n) {
			return {type: "ExpressionStatement", expression: {type: "Literal", value: n.value}}
		}), u(X, function (n) {
			return {type: "ExpressionStatement", expression: s(n.body)}
		}), u(Fn, function (n) {
			return {type: "SwitchCase", test: s(n.expression), consequent: n.body.map(s)}
		}), u(xn, function (n) {
			return {
				type: "TryStatement",
				block: c(n),
				handler: s(n.bcatch),
				guardedHandlers: [],
				finalizer: s(n.bfinally)
			}
		}), u(Bn, function (n) {
			return {type: "CatchClause", param: s(n.argname), guard: null, body: c(n)}
		}), u(Tn, function (n) {
			return {
				type: "VariableDeclaration",
				kind: n instanceof On ? "const" : "var",
				declarations: n.definitions.map(s)
			}
		}), u(Hn, function (n) {
			return {type: "SequenceExpression", expressions: n.to_array().map(s)}
		}), u(Nn, function (n) {
			var e = n instanceof Pn;
			return {
				type: "MemberExpression",
				object: s(n.expression),
				computed: e,
				property: e ? s(n.property) : {type: "Identifier", name: n.property}
			}
		}), u(Rn, function (n) {
			return {
				type: "++" == n.operator || "--" == n.operator ? "UpdateExpression" : "UnaryExpression",
				operator: n.operator,
				prefix: n instanceof In,
				argument: s(n.expression)
			}
		}), u(Un, function (n) {
			return {
				type: "&&" == n.operator || "||" == n.operator ? "LogicalExpression" : "BinaryExpression",
				left: s(n.left),
				operator: n.operator,
				right: s(n.right)
			}
		}), u(Jn, function (n) {
			return {type: "ObjectExpression", properties: n.properties.map(s)}
		}), u(Gn, function (n) {
			var e, t = k(n.key) ? {type: "Identifier", name: n.key} : {type: "Literal", value: n.key};
			return n instanceof Xn ? e = "init" : n instanceof Kn ? e = "get" : n instanceof Zn && (e = "set"), {
				type: "Property",
				kind: e,
				key: t,
				value: s(n.value)
			}
		}), u(Qn, function (n) {
			var e = n.definition();
			return {type: "Identifier", name: e ? e.mangled_name || e.name : n.name}
		}), u(me, function (n) {
			var e = n.value;
			return {
				type: "Literal",
				value: e,
				raw: e.toString(),
				regex: {pattern: e.source, flags: e.toString().match(/[gimuy]*$/)[0]}
			}
		}), u(pe, function (n) {
			var e = n.value;
			return "number" == typeof e && (0 > e || 0 === e && 0 > 1 / e) ? {
				type: "UnaryExpression",
				operator: "-",
				prefix: !0,
				argument: {type: "Literal", value: -e, raw: n.start.raw}
			} : {type: "Literal", value: e, raw: n.start.raw}
		}), u(ve, function (n) {
			return {type: "Identifier", name: String(n.value)}
		}), we.DEFMETHOD("to_mozilla_ast", pe.prototype.to_mozilla_ast), _e.DEFMETHOD("to_mozilla_ast", pe.prototype.to_mozilla_ast), ye.DEFMETHOD("to_mozilla_ast", function () {
			return null
		}), Z.DEFMETHOD("to_mozilla_ast", K.prototype.to_mozilla_ast), pn.DEFMETHOD("to_mozilla_ast", hn.prototype.to_mozilla_ast);
		var l = null;
		Y.from_mozilla_ast = function (n) {
			var e = l;
			l = [];
			var t = o(n);
			return l = e, t
		}
	}(), n.Compressor = P, n.DefaultsError = u, n.Dictionary = _, n.JS_Parse_Error = $, n.MAP = U, n.OutputStream = j, n.SourceMap = R, n.TreeTransformer = H, n.TreeWalker = y, n.base54 = Le, n.defaults = s, n.mangle_properties = L, n.merge = c, n.parse = z, n.push_uniq = l, n.string_template = p, n.is_identifier = k, e.UglifyJS = n
}({}, function () {
	return Uglify || this;
}());


module.exports.UglifyJS = Uglify.UglifyJS;