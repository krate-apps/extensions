/**
 * @file Krate theme shell for Deluge (Caddy-injected).
 * Resolves asset base from this script URL, loads libs/lang/chrome, applies variants.
 */
;(function () {
	"use strict";
	/* var: scripts/release.sh rewrites this literal on bump. Also used as ?kr= cache-bust. */
	/* Bump when injected CSS/JS must bypass caches (login resize, etc.). */
	var KR_VERSION = "0.0.16";
	var OVERRIDE_KEY = "kr-deluge-variant";
	var LIBS = ["variants", "i18n", "dom", "markdown"];
	var LANGS = ["en", "fr", "de", "es", "da", "pt-br", "zh-cn"];

	/**
	 * Kill Ext 9-slice/gradients BEFORE any stylesheet settles.
	 * Hardcoded charcoal first-paint — variant CSS overrides once loaded.
	 * This must work even when the vendor xtheme link is a stale browser cache.
	 */
	function injectCriticalCss() {
		if (document.getElementById("kr-critical-css")) return;
		var s = document.createElement("style");
		s.id = "kr-critical-css";
		s.textContent = [
			'html,body{background:#171519!important;color:#f5f5f5!important;',
			'font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",sans-serif!important;}',
			'.x-window-tc,.x-window-tl,.x-window-tr,.x-window-bc,.x-window-bl,.x-window-br,',
			'.x-window-ml,.x-window-mr,.x-window-mc,.x-panel-tc,.x-panel-tl,.x-panel-tr,',
			'.x-panel-bc,.x-panel-bl,.x-panel-br,.x-panel-ml,.x-panel-mr,.x-panel-mc,',
			'.x-panel-header,.x-toolbar,ul.x-tab-strip-top,ul.x-tab-strip-bottom,',
			'.x-tab-strip-top .x-tab-right,.x-tab-strip-top .x-tab-left,',
			'.x-tab-strip-top .x-tab-strip-inner,.x-btn-tl,.x-btn-tr,.x-btn-tc,',
			'.x-btn-ml,.x-btn-mr,.x-btn-mc,.x-btn-bl,.x-btn-br,.x-btn-bc,',
			'.x-progress-inner,.x-menu,.x-menu-item-active{background-image:none!important;}',
			'.x-viewport,.x-border-layout-ct,.x-panel,.x-panel-body,.x-panel-bwrap,',
			'.x-tab-panel,.x-tab-panel-body,.x-grid3,.x-grid3-body,.x-grid3-scroller{',
			'background-color:#1c1a1f!important;background-image:none!important;color:#f5f5f5!important;}',
			'.x-toolbar,#deluge-toolbar,.x-panel-tbar .x-toolbar{',
			'background:#1c1a1f!important;background-image:none!important;',
			'border-bottom:1px solid #3f3f46!important;',
			'box-shadow:inset 0 -2px 0 #0ea5e9!important;padding:8px 12px!important;}',
			'.x-btn{background:transparent!important;border:1px solid transparent!important;',
			'border-radius:8px!important;}',
			'.x-btn-over{background:rgba(14,165,233,.14)!important;border-color:#3f3f46!important;}',
			'.x-btn button,.x-btn .x-btn-text{color:#f5f5f5!important;}',
			'.x-window{border:1px solid #3f3f46!important;border-radius:14px!important;',
			'box-shadow:0 16px 36px rgba(0,0,0,.45)!important;background:#1c1a1f!important;}',
			'.x-window-tl,.x-window-tr,.x-window-tc{background:#1c1a1f!important;',
			'background-image:none!important;border-bottom:1px solid #3f3f46!important;}',
			'.x-window-ml,.x-window-mr,.x-window-mc,.x-window-bl,.x-window-br,.x-window-bc,',
			'.x-window-body,.x-window-bwrap{background:#1c1a1f!important;background-image:none!important;',
			'color:#f5f5f5!important;}',
			'.x-window-header-text{color:#f5f5f5!important;font-size:15px!important;font-weight:600!important;}',
			'.x-panel-header{background:#1c1a1f!important;background-image:none!important;',
			'border-color:#3f3f46!important;color:#f5f5f5!important;font-weight:600!important;}',
			'.x-grid3-header,.x-grid3-hd{background:#222027!important;background-image:none!important;',
			'color:#a3a3a3!important;}',
			'.x-grid3-row{background:#1c1a1f!important;background-image:none!important;}',
			'.x-grid3-row-selected,.x-list-selected,.x-tree-selected{',
			'background:rgba(14,165,233,.22)!important;}',
			'.x-form-text,input.x-form-text,textarea.x-form-field{',
			'background:#141218!important;color:#f5f5f5!important;border:1px solid #3f3f46!important;',
			'border-radius:8px!important;box-shadow:none!important;}',
			'.x-menu{background:#1c1a1f!important;border:1px solid #3f3f46!important;',
			'border-radius:10px!important;padding:6px!important;}',
			'.x-statusbar{background:#1c1a1f!important;background-image:none!important;',
			'border-top:1px solid #3f3f46!important;color:#a3a3a3!important;}',
			'.x-progress-wrap{border-radius:999px!important;overflow:hidden!important;',
			'background:#2a272e!important;border-color:#3f3f46!important;}',
			'.x-progress-bar{background:linear-gradient(90deg,#0284c7,#38bdf8)!important;',
			'background-image:linear-gradient(90deg,#0284c7,#38bdf8)!important;border:0!important;}',
			'.ext-el-mask{background:rgba(0,0,0,.55)!important;}'
		].join("");
		(document.head || document.documentElement).appendChild(s);
	}

	/**
	 * Login cosmetics only — never touch Ext 9-slice padding/height or positioning.
	 * Sizing + centering are owned by chrome.js (Ext.setWidth / center).
	 */
	function injectLoginCssEarly() {
		if (document.getElementById("kr-login-css")) return;
		var s = document.createElement("style");
		s.id = "kr-login-css";
		var sel = '.x-window[data-kr-login="1"]';
		s.textContent = [
			sel + '{',
			'border:1px solid #3f3f46!important;border-radius:16px!important;',
			'box-shadow:0 24px 56px rgba(0,0,0,.55)!important;',
			'background:#1c1a1f!important;}',
			sel + ' .x-window-tl,' + sel + ' .x-window-tr,' + sel + ' .x-window-tc,',
			sel + ' .x-window-ml,' + sel + ' .x-window-mr,' + sel + ' .x-window-mc,',
			sel + ' .x-window-bl,' + sel + ' .x-window-br,' + sel + ' .x-window-bc,',
			sel + ' .x-window-body,' + sel + ' .x-window-bwrap{',
			'background:#1c1a1f!important;background-image:none!important;color:#f5f5f5!important;}',
			sel + ' .x-window-tl,' + sel + ' .x-window-tr,' + sel + ' .x-window-tc{',
			'border-bottom:1px solid #2a2a30!important;}',
			sel + ' .x-window-header-text{',
			'font-size:16px!important;font-weight:600!important;color:#f5f5f5!important;}',
			sel + ' .x-window-body{border:0!important;}',
			sel + ' .x-form-item-label{color:#a3a3a3!important;font-weight:500!important;}',
			sel + ' .x-form-text,' + sel + ' input{',
			'height:40px!important;line-height:22px!important;padding:8px 12px!important;',
			'box-sizing:border-box!important;border:1px solid #3f3f46!important;',
			'border-radius:10px!important;background:#141218!important;color:#f5f5f5!important;',
			'box-shadow:none!important;}',
			sel + ' .x-window-bbar{background:#1c1a1f!important;border-top:1px solid #2a2a30!important;}',
			sel + ' .x-window-bbar .x-toolbar{background:transparent!important;background-image:none!important;}',
			sel + ' .x-window-bbar .x-btn{',
			'background:#0ea5e9!important;background-image:none!important;',
			'border:1px solid #0ea5e9!important;border-radius:10px!important;min-height:36px!important;}',
			sel + ' .x-window-bbar .x-btn-tl,' + sel + ' .x-window-bbar .x-btn-tr,' + sel + ' .x-window-bbar .x-btn-tc,',
			sel + ' .x-window-bbar .x-btn-ml,' + sel + ' .x-window-bbar .x-btn-mr,' + sel + ' .x-window-bbar .x-btn-mc,',
			sel + ' .x-window-bbar .x-btn-bl,' + sel + ' .x-window-bbar .x-btn-br,' + sel + ' .x-window-bbar .x-btn-bc{',
			'background:transparent!important;background-image:none!important;}',
			sel + ' .x-window-bbar .x-btn .x-btn-text{',
			'color:#0b1220!important;font-weight:600!important;}'
		].join("");
		(document.head || document.documentElement).appendChild(s);
	}

	/** Disable stale vendor xtheme link so only the busted package CSS paints. */
	function disableVendorXtheme() {
		var links = document.querySelectorAll('link[rel="stylesheet"]');
		for (var i = 0; i < links.length; i++) {
			var href = links[i].getAttribute("href") || "";
			if (/xtheme-krate\.css/.test(href) && href.indexOf("krate-theme") < 0) {
				links[i].disabled = true;
				try { links[i].parentNode && links[i].parentNode.removeChild(links[i]); } catch (e) { /* ignore */ }
			}
		}
	}

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
	/* Provisional — chrome.js re-syncs from Deluge GetText / toolbar labels. */
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

	injectCriticalCss();
	injectLoginCssEarly();
	disableVendorXtheme();
	try {
		document.documentElement.style.setProperty(
			"--kr-mark-url",
			'url("' + bust("images/brand/krate-mark.svg") + '")'
		);
		document.documentElement.style.setProperty(
			"--kr-favicon-url",
			'url("' + bust("images/brand/krate-logo.png") + '")'
		);
	} catch (e) { /* ignore */ }
	/* Package CSS with cache-bust — wins over any leftover vendor link. */
	loadCss(bust("themes/css/xtheme-krate.css"));
	loadCss(bust("css/chrome.css"));
	/* Re-disable vendor if Ext/Deluge re-injects the link later. */
	setTimeout(disableVendorXtheme, 0);
	setTimeout(disableVendorXtheme, 1500);

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
			try { console.warn("[krate-deluge]", err); } catch (e) { /* ignore */ }
		});
})();
