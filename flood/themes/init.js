/**
 * @file Krate theme shell for Flood (Caddy-injected).
 * style.css is injected separately; this loads libs/lang/chrome and applies variants.
 */
;(function () {
	"use strict";
	/* var: scripts/release.sh rewrites this literal on bump. Also used as ?kr= cache-bust. */
	var KR_VERSION = "0.0.1";
	var OVERRIDE_KEY = "kr-flood-variant";
	var LIBS = ["variants", "i18n", "dom", "markdown"];
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
	kr.app = "flood";

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

	/*
	 * Flood stores theme in localStorage.userPreferDark and puts .dark on
	 * .application (ConfigStore), not on <html>. Keep both in sync so stock
	 * styles and our tokens agree; the sidebar ThemeSwitch is hidden in CSS.
	 */
	kr.onVariant = function (variant) {
		var isDark = variant === "dark";
		document.documentElement.classList.toggle("dark", isDark);
		try {
			localStorage.setItem("userPreferDark", isDark ? "true" : "false");
			localStorage.setItem("theme", isDark ? "dark" : "light");
		} catch (e) { /* ignore */ }
		var app = document.querySelector(".application");
		if (app) app.classList.toggle("dark", isDark);
	};

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
			try { console.warn("[krate-flood]", err); } catch (e) { /* ignore */ }
		});
})();
