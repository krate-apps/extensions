/**
 * @file Krate Deluge shell (Caddy-injected).
 * Loads style.css + libs + theme.js. Ext xtheme-krate.css is served by Deluge
 * vendor WebUI (copied at deploy) — not from this tree via Caddy rewrite.
 */
;(function () {
	"use strict";
	/* var: scripts/release.sh rewrites this literal on bump. Also used as ?kr= cache-bust. */
	var KR_VERSION = "1.0.0";
	var OVERRIDE_KEY = "kr-deluge-variant";
	var LIBS = ["variants", "i18n", "dom"];
	var LANGS = ["en", "fr", "de", "es", "da", "pt-br", "zh-cn"];

	function scriptBase() {
		var src = "";
		try {
			if (document.currentScript && document.currentScript.src) src = document.currentScript.src;
		} catch (e) { /* ignore */ }
		if (!src) {
			var nodes = document.getElementsByTagName("script");
			for (var i = nodes.length - 1; i >= 0; i--) {
				if (nodes[i].src && /\/init\.js(\?|$)/.test(nodes[i].src)) {
					src = nodes[i].src;
					break;
				}
			}
		}
		return src ? src.replace(/\/init\.js(\?.*)?$/, "/") : "./";
	}

	var BASE = scriptBase();
	window.theUILang = window.theUILang || {};
	window.kr = window.kr || {};
	kr.version = KR_VERSION;
	kr.path = BASE;
	kr.overrideKey = OVERRIDE_KEY;
	kr.app = "deluge";
	kr.lang = null;

	function loadScript(url) {
		return new Promise(function (resolve, reject) {
			var s = document.createElement("script");
			s.src = url;
			s.async = false;
			s.onload = function () { resolve(); };
			s.onerror = function () { reject(new Error(url)); };
			document.head.appendChild(s);
		});
	}

	function loadCss(url) {
		var l = document.createElement("link");
		l.rel = "stylesheet";
		l.href = url;
		document.head.appendChild(l);
	}

	function bust(path) {
		return BASE + path + (KR_VERSION ? "?kr=" + KR_VERSION : "");
	}

	function browserLang() {
		var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
		nav = String(nav).toLowerCase();
		if (LANGS.indexOf(nav) >= 0) return nav;
		var short = nav.split("-")[0];
		if (short === "pt") return "pt-br";
		if (short === "zh") return "zh-cn";
		if (LANGS.indexOf(short) >= 0) return short;
		return "en";
	}

	try {
		document.documentElement.style.setProperty(
			"--kr-mark-url",
			'url("' + bust("images/brand/krate-mark.svg") + '")'
		);
	} catch (e) { /* ignore */ }

	loadCss(bust("style.css"));

	var chain = Promise.resolve();
	LIBS.forEach(function (name) {
		chain = chain.then(function () { return loadScript(bust("js/lib/" + name + ".js")); });
	});
	chain = chain
		.then(function () { return loadScript(bust("lang/en.js")); })
		.then(function () {
			var code = browserLang();
			kr.lang = code;
			if (code === "en") return;
			return loadScript(bust("lang/" + code + ".js")).catch(function () { /* keep en */ });
		})
		.then(function () { return loadScript(bust("js/theme.js")); })
		.catch(function (err) {
			try { console.warn("[krate-deluge]", err); } catch (e) { /* ignore */ }
		});
})();
