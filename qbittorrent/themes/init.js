/**
 * @file Krate theme shell for qBittorrent (Caddy-injected).
 * Loads style.css + libs/lang/chrome (chrome.js also boots the General overview).
 */
;(function () {
	"use strict";
	/* var: scripts/release.sh rewrites this literal on bump. Also used as ?kr= cache-bust. */
	var KR_VERSION = "1.0.0";
	var OVERRIDE_KEY = "kr-qbittorrent-variant";
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
	kr.app = "qbittorrent";
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

	/** Always pin style.css to ?kr=VERSION (Caddy injects an unbust link). */
	function ensureStyle(url) {
		var nodes = document.querySelectorAll('link[rel="stylesheet"][href*="krate-theme/style.css"]');
		if (nodes.length) {
			for (var i = 0; i < nodes.length; i++) nodes[i].href = url;
			return;
		}
		loadCss(url);
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

	ensureStyle(bust("style.css"));

	var chain = Promise.resolve();
	LIBS.forEach(function (name) {
		chain = chain.then(function () { return loadScript(bust("js/lib/" + name + ".js")); });
	});
	chain = chain
		.then(function () { return loadScript(bust("lang/en.js")); })
		.then(function () {
			var code = browserLang();
			if (code === "en") return;
			return loadScript(bust("lang/" + code + ".js")).catch(function () { /* keep en */ });
		})
		.then(function () { return loadScript(bust("js/chrome.js")); })
		.catch(function (err) {
			try { console.warn("[krate-qbittorrent]", err); } catch (e) { /* ignore */ }
		});
})();
