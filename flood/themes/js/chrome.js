/**
 * @file Injected Krate chrome: variant select + What's New dialog.
 * Mounts into Flood's .action-bar (not a floating overlay).
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
	var currentDark = true;
	var appDarkObserver = null;
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

	/** Keep .application.dark aligned when Flood's React re-renders className. */
	function enforceApplicationDark(isDark) {
		currentDark = !!isDark;
		var app = document.querySelector(".application");
		if (!app) return;
		var has = app.classList.contains("dark");
		if (isDark && !has) app.classList.add("dark");
		if (!isDark && has) app.classList.remove("dark");
	}

	function watchApplicationDark() {
		if (appDarkObserver || typeof MutationObserver !== "function") return;
		appDarkObserver = new MutationObserver(function () {
			enforceApplicationDark(currentDark);
		});
		function bind(app) {
			appDarkObserver.observe(app, { attributes: true, attributeFilter: ["class"] });
			enforceApplicationDark(currentDark);
		}
		var app = document.querySelector(".application");
		if (app) {
			bind(app);
			return;
		}
		var boot = new MutationObserver(function () {
			var el = document.querySelector(".application");
			if (!el) return;
			boot.disconnect();
			bind(el);
		});
		boot.observe(document.documentElement, { childList: true, subtree: true });
	}

	function applyVariant(pref) {
		var v = appliedVariant(pref);
		var root = document.documentElement;
		root.setAttribute("data-kr-variant", v);
		root.classList.toggle("dark", v === "dark");
		root.setAttribute("data-theme", v);
		currentDark = v === "dark";
		if (typeof kr.onVariant === "function") kr.onVariant(v, pref || storedPreference() || "auto");
		enforceApplicationDark(currentDark);
		return v;
	}

	function buildChrome() {
		var bar = document.createElement("div");
		bar.id = "kr-chrome";
		bar.className = "action-bar__item action-bar__item--krate";
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

	function mountIntoActionBar(bar) {
		var host = document.querySelector(".action-bar");
		if (!host) return false;
		if (bar.parentNode === host) return true;
		host.appendChild(bar);
		return true;
	}

	function ensureChrome() {
		var existing = document.getElementById("kr-chrome");
		if (existing) {
			mountIntoActionBar(existing);
			return existing;
		}
		var bar = buildChrome();
		if (!mountIntoActionBar(bar)) {
			document.body.appendChild(bar);
			if (typeof MutationObserver === "function" && !mountObserver) {
				mountObserver = new MutationObserver(function () {
					if (mountIntoActionBar(bar) && mountObserver) {
						mountObserver.disconnect();
						mountObserver = null;
					}
				});
				mountObserver.observe(document.documentElement, { childList: true, subtree: true });
			}
		}
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
		watchApplicationDark();
		ensureChrome();
		applyVariant(storedPreference() || "auto");
	}

	bootChrome();
	window.addEventListener("focus", function () {
		if ((storedPreference() || "auto") === "auto") applyVariant("auto");
	});
})(window.kr);
