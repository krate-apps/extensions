/**
 * @file Injected Krate chrome: palette switcher.
 * Mounts into Flood's .action-bar (not a floating overlay).
 * @requires window.kr, kr.lib.{variants,i18n,dom}
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

		var pal = document.createElement("div");
		pal.className = "kr-palette";
		var pbtn = document.createElement("button");
		pbtn.type = "button";
		pbtn.className = "kr-palette-btn";
		pbtn.setAttribute("aria-haspopup", "true");
		pbtn.setAttribute("aria-label", t("krAppearance", "Appearance"));
		pbtn.title = t("krAppearance", "Appearance");
		pbtn.appendChild(document.createElement("span")).className = "kr-palette-glyph";

		var menu = document.createElement("div");
		menu.className = "kr-palette-menu";
		menu.hidden = true;
		menu.setAttribute("role", "menu");

		var OPTS = [
			["auto", "krVariantAuto", "Auto (HarmonyUI)"],
			["dark", "krVariantDark", "Dark"],
			["light", "krVariantLight", "Light"]
		];
		OPTS.forEach(function (o) {
			var it = document.createElement("button");
			it.type = "button";
			it.className = "kr-palette-item";
			it.setAttribute("data-variant", o[0]);
			it.setAttribute("role", "menuitemradio");
			var lb = document.createElement("span");
			lb.textContent = t(o[1], o[2]);
			var ck = document.createElement("span");
			ck.className = "kr-palette-check";
			it.appendChild(lb);
			it.appendChild(ck);
			it.addEventListener("click", function () {
				setPreference(o[0]);
				applyVariant(o[0]);
				markActive();
				closeMenu();
			});
			menu.appendChild(it);
		});

		function markActive() {
			var cur = storedPreference() || "auto";
			menu.querySelectorAll(".kr-palette-item").forEach(function (it) {
				var on = it.getAttribute("data-variant") === cur;
				it.classList.toggle("active", on);
				it.setAttribute("aria-checked", on ? "true" : "false");
			});
		}
		function onDoc(e) { if (!pal.contains(e.target)) closeMenu(); }
		function onEsc(e) { if (e.key === "Escape") closeMenu(); }
		function openMenu() {
			markActive();
			menu.hidden = false;
			pbtn.classList.add("open");
			document.addEventListener("mousedown", onDoc, true);
			document.addEventListener("keydown", onEsc, true);
		}
		function closeMenu() {
			menu.hidden = true;
			pbtn.classList.remove("open");
			document.removeEventListener("mousedown", onDoc, true);
			document.removeEventListener("keydown", onEsc, true);
		}
		pbtn.addEventListener("click", function () {
			menu.hidden ? openMenu() : closeMenu();
		});

		pal.appendChild(pbtn);
		pal.appendChild(menu);
		bar.appendChild(pal);
		bar._krMarkActive = markActive;
		markActive();
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
		if (existing && existing.querySelector("select.kr-variant")) {
			existing.parentNode && existing.parentNode.removeChild(existing);
			existing = null;
		}
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
