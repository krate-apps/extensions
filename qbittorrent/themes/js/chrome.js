/**
 * @file Injected Krate chrome for qBittorrent: brand + variant select in mochaToolbar.
 * @requires window.kr, kr.lib.{variants,i18n,markdown,dom}
 */
;(function (kr) {
	"use strict";
	if (!kr || window.krChromeInit) return;
	window.krChromeInit = true;

	var OVERRIDE_KEY = kr.overrideKey || "kr-theme-variant";
	var t = function (key, fallback) {
		return kr.lib && kr.lib.i18n ? kr.lib.i18n.t(key, fallback) : (fallback || "");
	};
	var variants = (kr.lib && kr.lib.variants) || {
		normalizeVariant: function (v) { return v === "light" ? "light" : "dark"; },
		resolveAutoTheme: function () { return "dark"; }
	};
	var md = kr.lib && kr.lib.markdown;
	var VERSION = kr.version || "";
	var notesCache = {};
	var mountObserver = null;

	function storedPreference() {
		try {
			return localStorage.getItem(OVERRIDE_KEY);
		} catch (e) {
			return null;
		}
	}

	function setPreference(pref) {
		try {
			if (!pref || pref === "auto") localStorage.removeItem(OVERRIDE_KEY);
			else localStorage.setItem(OVERRIDE_KEY, pref);
		} catch (e) { /* ignore */ }
	}

	function appliedVariant(pref) {
		pref = pref || storedPreference() || "auto";
		if (pref === "dark" || pref === "light") return pref;
		return variants.resolveAutoTheme();
	}

	function applyVariant(pref) {
		var v = appliedVariant(pref);
		var root = document.documentElement;
		root.setAttribute("data-kr-variant", v);
		root.classList.toggle("dark", v === "dark");
		root.setAttribute("data-theme", v);
		if (typeof kr.onVariant === "function") kr.onVariant(v, pref || storedPreference() || "auto");
		return v;
	}

	function markUrl() {
		return kr.path + "images/brand/krate-mark.svg" + (VERSION ? "?kr=" + VERSION : "");
	}

	function brandUrl() {
		return kr.path + "images/brand/krate-logo.png" + (VERSION ? "?kr=" + VERSION : "");
	}

	function setMarkCssVar() {
		try {
			document.documentElement.style.setProperty("--kr-mark-url", 'url("' + markUrl() + '")');
			document.documentElement.style.setProperty("--kr-favicon-url", 'url("' + brandUrl() + '")');
		} catch (e) { /* ignore */ }
	}

	function setFavicon() {
		try {
			var href = brandUrl();
			var links = document.querySelectorAll('link[rel*="icon"]');
			if (!links.length) {
				var l = document.createElement("link");
				l.rel = "icon";
				l.href = href;
				document.head.appendChild(l);
				return;
			}
			for (var i = 0; i < links.length; i++) links[i].href = href;
		} catch (e) { /* ignore */ }
	}

	function makeMark(cls) {
		var el = document.createElement("span");
		el.className = cls || "kr-tb-brand";
		el.setAttribute("aria-hidden", "true");
		el.title = "Krate";
		return el;
	}

	function findToolbar() {
		return document.getElementById("mochaToolbar") ||
			document.querySelector(".mochaToolbar") ||
			document.querySelector("#desktopHeader");
	}

	function brandToolbar() {
		var tb = findToolbar();
		if (!tb) return null;
		tb.setAttribute("data-kr-bar", "1");
		if (!tb.querySelector(".kr-tb-brand")) {
			tb.insertBefore(makeMark("kr-tb-brand"), tb.firstChild);
		}
		if (!tb.querySelector(".kr-tb-wordmark")) {
			var mark = tb.querySelector(".kr-tb-brand");
			var word = document.createElement("span");
			word.className = "kr-tb-wordmark";
			word.textContent = "qBittorrent";
			if (mark && mark.nextSibling) tb.insertBefore(word, mark.nextSibling);
			else if (mark) tb.appendChild(word);
			else tb.insertBefore(word, tb.firstChild);
		}
		return tb;
	}

	function buildChrome() {
		var bar = document.createElement("div");
		bar.id = "kr-chrome";
		bar.setAttribute("role", "group");
		bar.setAttribute("aria-label", t("krAppearance", "Appearance"));

		var sel = document.createElement("select");
		sel.className = "kr-variant";
		sel.setAttribute("aria-label", t("krAppearance", "Appearance"));
		[
			["auto", t("krVariantAuto", "Auto (HarmonyUI)")],
			["dark", t("krVariantDark", "Dark")],
			["light", t("krVariantLight", "Light")]
		].forEach(function (opt) {
			var o = document.createElement("option");
			o.value = opt[0];
			o.textContent = opt[1];
			sel.appendChild(o);
		});
		sel.value = storedPreference() || "auto";
		sel.addEventListener("change", function () {
			setPreference(sel.value);
			applyVariant(sel.value);
		});
		bar.appendChild(sel);
		return bar;
	}

	function mountChrome(bar) {
		if (!bar) return false;
		var tb = brandToolbar();
		if (!tb) {
			if (!bar.parentNode) document.body.appendChild(bar);
			bar.removeAttribute("data-kr-mounted");
			return false;
		}
		var word = tb.querySelector(".kr-tb-wordmark");
		var anchor = word && word.nextSibling;
		if (bar.parentNode !== tb) {
			if (anchor) tb.insertBefore(bar, anchor);
			else if (word) tb.insertBefore(bar, word.nextSibling);
			else tb.insertBefore(bar, tb.firstChild);
		} else if (word && bar.previousSibling !== word) {
			tb.insertBefore(bar, word.nextSibling);
		}
		bar.setAttribute("data-kr-mounted", "toolbar");
		return true;
	}

	/** Prefer qBittorrent UI locale over browser language. */
	var LANG_SUPPORTED = ["en", "da", "de", "es", "fr", "pt-br", "zh-cn"];

	function detectAppLang() {
		var code = "";
		try {
			code = String(
				(window.qBittorrent && qBittorrent.Client && qBittorrent.Client.locale) ||
				localStorage.getItem("locale") ||
				localStorage.getItem("lang") ||
				""
			).toLowerCase().replace("_", "-");
		} catch (e) { code = ""; }
		if (!code) {
			try {
				var htmlLang = (document.documentElement.lang || "").toLowerCase();
				if (htmlLang) code = htmlLang;
			} catch (e2) { /* ignore */ }
		}
		if (code.indexOf("pt") === 0) code = "pt-br";
		if (code.indexOf("zh") === 0) code = "zh-cn";
		if (LANG_SUPPORTED.indexOf(code) >= 0) return code;
		var short = code.split("-")[0];
		if (LANG_SUPPORTED.indexOf(short) >= 0) return short;
		return null;
	}

	function loadLangScript(code) {
		return new Promise(function (resolve) {
			if (!code || LANG_SUPPORTED.indexOf(code) < 0) {
				resolve(false);
				return;
			}
			var s = document.createElement("script");
			s.src = (kr.path || "") + "lang/" + code + ".js" + (VERSION ? "?kr=" + VERSION : "");
			s.onload = function () { resolve(true); };
			s.onerror = function () { resolve(false); };
			document.head.appendChild(s);
		});
	}

	function refreshVariantSelect() {
		var sel = document.querySelector("#kr-chrome select.kr-variant");
		if (!sel) return;
		var labels = [
			t("krVariantAuto", "Auto (HarmonyUI)"),
			t("krVariantDark", "Dark"),
			t("krVariantLight", "Light")
		];
		for (var i = 0; i < sel.options.length && i < labels.length; i++) {
			sel.options[i].textContent = labels[i];
		}
		var bar = document.getElementById("kr-chrome");
		if (bar) bar.setAttribute("aria-label", t("krAppearance", "Appearance"));
		sel.setAttribute("aria-label", t("krAppearance", "Appearance"));
	}

	function syncChromeLanguage() {
		var code = detectAppLang();
		if (!code) {
			refreshVariantSelect();
			return Promise.resolve();
		}
		if (kr.lang === code) {
			refreshVariantSelect();
			return Promise.resolve();
		}
		kr.lang = code;
		if (code === "en") {
			return loadLangScript("en").then(refreshVariantSelect);
		}
		return loadLangScript("en").then(function () {
			return loadLangScript(code);
		}).then(refreshVariantSelect);
	}

	function ensureChrome() {
		setMarkCssVar();
		setFavicon();
		var bar = document.getElementById("kr-chrome") || buildChrome();
		mountChrome(bar);
		syncChromeLanguage();
		if (!mountObserver && typeof MutationObserver === "function") {
			mountObserver = new MutationObserver(function () {
				brandToolbar();
				mountChrome(document.getElementById("kr-chrome"));
			});
			mountObserver.observe(document.body, { childList: true, subtree: true });
		}
		[400, 1200, 2500].forEach(function (ms) {
			setTimeout(function () {
				brandToolbar();
				mountChrome(document.getElementById("kr-chrome"));
				syncChromeLanguage();
			}, ms);
		});
		return bar;
	}

	function ensureDialog() {
		var existing = document.getElementById("krWhatsNew");
		if (existing) return existing;
		var overlay = document.createElement("div");
		overlay.id = "krWhatsNew";
		overlay.innerHTML =
			'<div class="kr-wn-panel" role="dialog" aria-modal="true">' +
			'<div class="kr-wn-title"><span></span><button type="button" class="kr-wn-close"></button></div>' +
			'<div class="kr-wn-body"></div></div>';
		overlay.querySelector(".kr-wn-title span").textContent =
			t("kr_wn_title", "What's new in Krate");
		var close = overlay.querySelector(".kr-wn-close");
		close.textContent = t("kr_wn_close", "Close");
		close.addEventListener("click", function () { overlay.removeAttribute("data-open"); });
		overlay.addEventListener("click", function (e) {
			if (e.target === overlay) overlay.removeAttribute("data-open");
		});
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape") overlay.removeAttribute("data-open");
		});
		document.body.appendChild(overlay);
		return overlay;
	}

	function localUrl(path) {
		return kr.path + path + (VERSION ? "?kr=" + VERSION : "");
	}

	function fetchText(url) {
		if (notesCache[url] != null) return Promise.resolve(notesCache[url]);
		if (typeof fetch !== "function") return Promise.reject();
		return fetch(url, { credentials: "same-origin" }).then(function (r) {
			if (!r.ok) throw 0;
			return r.text();
		}).then(function (txt) {
			notesCache[url] = txt;
			return txt;
		});
	}

	function renderMarkdown(container, text) {
		if (md && typeof md.renderMarkdown === "function") md.renderMarkdown(container, text);
		else container.appendChild(document.createTextNode(String(text)));
	}

	kr.openWhatsNew = function () {
		var overlay = ensureDialog();
		var body = overlay.querySelector(".kr-wn-body");
		body.textContent = "";
		fetchText(localUrl("changelogs/index.json"))
			.then(function (txt) {
				var idx = JSON.parse(txt);
				if (!Array.isArray(idx) || !idx.length) throw 0;
				var chain = Promise.resolve();
				idx.forEach(function (entry) {
					chain = chain.then(function () {
						return fetchText(localUrl(entry.file)).then(function (mdTxt) {
							var sec = document.createElement("section");
							sec.className = "kr-wn-entry";
							renderMarkdown(sec, mdTxt);
							body.appendChild(sec);
						}).catch(function () { /* skip */ });
					});
				});
				return chain;
			})
			.catch(function () {
				if (body.childNodes.length) return;
				var empty = document.createElement("p");
				empty.className = "kr-wn-empty";
				empty.textContent = t("kr_wn_none", "No release notes yet.");
				body.appendChild(empty);
			});
		overlay.setAttribute("data-open", "1");
	};

	kr.applyVariant = applyVariant;
	kr.getPreference = function () { return storedPreference() || "auto"; };

	function bootChrome() {
		if (!document.body) {
			document.addEventListener("DOMContentLoaded", bootChrome, { once: true });
			return;
		}
		document.documentElement.classList.add("kr-qbittorrent");
		document.body.classList.add("kr-qbittorrent");
		ensureChrome();
		applyVariant(storedPreference() || "auto");
	}

	bootChrome();
	window.addEventListener("focus", function () {
		if ((storedPreference() || "auto") === "auto") applyVariant("auto");
	});
})(window.kr);
