/**
 * @file Injected Krate chrome for qBittorrent: brand + palette switcher in mochaToolbar.
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
	var VERSION = kr.version || "";
	var mountObserver = null;

	/** qBit Options "Color scheme" — LocalPreferences / ClientData / localStorage. */
	function readQbitScheme() {
		try {
			if (window.qBittorrent && qBittorrent.ClientData && typeof qBittorrent.ClientData.get === "function") {
				var cd = qBittorrent.ClientData.get("color_scheme");
				if (cd === "light" || cd === "dark") return cd;
				if (cd == null || cd === "") return "auto";
			}
		} catch (e) { /* ignore */ }
		try {
			if (window.LocalPreferences && typeof LocalPreferences.get === "function") {
				var lp = LocalPreferences.get("color_scheme");
				if (lp === "light" || lp === "dark") return lp;
				/* Unset / Auto: get may return "" or a missing default. */
				if (!lp || lp === "null" || lp === "undefined") return "auto";
			}
		} catch (e2) { /* ignore */ }
		try {
			var ls = localStorage.getItem("color_scheme");
			if (ls === "light" || ls === "dark") return ls;
			if (ls === null) return "auto";
		} catch (e3) { /* ignore */ }
		return null;
	}

	function writeQbitScheme(pref) {
		var val = (!pref || pref === "auto") ? null : pref;
		try {
			if (window.qBittorrent && qBittorrent.ClientData) {
				if (typeof qBittorrent.ClientData.set === "function") {
					qBittorrent.ClientData.set("color_scheme", val);
				} else if (typeof qBittorrent.ClientData.store === "function") {
					var payload = {};
					payload.color_scheme = val;
					qBittorrent.ClientData.store(payload);
				}
			}
		} catch (e) { /* ignore */ }
		try {
			if (window.LocalPreferences) {
				if (!val && typeof LocalPreferences.remove === "function") LocalPreferences.remove("color_scheme");
				else if (val && typeof LocalPreferences.set === "function") LocalPreferences.set("color_scheme", val);
			}
		} catch (e2) { /* ignore */ }
		try {
			if (!val) localStorage.removeItem("color_scheme");
			else localStorage.setItem("color_scheme", val);
			/* Drop legacy override so it cannot fight Options. */
			localStorage.removeItem(OVERRIDE_KEY);
		} catch (e3) { /* ignore */ }
		try {
			var sel = document.getElementById("colorSchemeSelect");
			if (sel) {
				if (!val) sel.value = "0";
				else if (val === "light") sel.value = "1";
				else if (val === "dark") sel.value = "2";
			}
		} catch (e4) { /* ignore */ }
	}

	function storedPreference() {
		var q = readQbitScheme();
		if (q === "light" || q === "dark") return q;
		if (q === "auto") return null;
		try {
			var legacy = localStorage.getItem(OVERRIDE_KEY);
			if (legacy === "light" || legacy === "dark") return legacy;
		} catch (e) { /* ignore */ }
		return null;
	}

	function setPreference(pref) {
		writeQbitScheme(pref);
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
		try {
			if (window.qBittorrent && qBittorrent.ColorScheme && typeof qBittorrent.ColorScheme.update === "function") {
				qBittorrent.ColorScheme.update();
			}
		} catch (e) { /* ignore */ }
		if (typeof kr.onVariant === "function") kr.onVariant(v, pref || storedPreference() || "auto");
		return v;
	}

	function syncFromQbitScheme() {
		var pref = storedPreference() || "auto";
		applyVariant(pref);
		var bar = document.getElementById("kr-chrome");
		if (bar && typeof bar._krMarkActive === "function") bar._krMarkActive();
	}

	function markUrl() {
		return kr.path + "images/brand/krate-mark.svg" + (VERSION ? "?kr=" + VERSION : "");
	}

	function setMarkCssVar() {
		try {
			/* Krate mark is for the toolbar brand chip only — leave favicon alone. */
			document.documentElement.style.setProperty("--kr-mark-url", 'url("' + markUrl() + '")');
		} catch (e) { /* ignore */ }
	}

	/**
	 * ruTorrent-minded icon treatment for qBit:
	 * keep stock <img> visible (never opacity:0 / Deluge masks — those blanked
	 * the whole UI when SVGs 404'd). Tint to muted mono via brightness(0)+invert
	 * so #1e90ff stock fills become grey/sky, not orange.
	 */
	function injectIconCss() {
		var head = document.head || document.getElementsByTagName("head")[0];
		if (!head) return;
		var iconBase = (kr.path || "") + "images/icons/";
		var q = VERSION ? "?kr=" + VERSION : "";
		try {
			document.documentElement.style.setProperty(
				"--kr-palette-icon-url",
				'url("' + iconBase + "palette-switch.svg" + q + '")'
			);
			document.documentElement.style.setProperty(
				"--kr-menu-check-url",
				'url("' + iconBase + "menu-check.svg" + q + '")'
			);
		} catch (e) { /* ignore */ }

		var existing = document.getElementById("kr-icon-css");
		if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

		/* brightness(0) → silhouette, invert → mono grey (NOT invert-only → orange). */
		var monoDark = "brightness(0) invert(0.72)";
		var monoHover = "brightness(0) invert(0.7) sepia(1) saturate(8) hue-rotate(175deg)";
		var monoLight = "brightness(0) invert(0.35)";
		/* Exclude palette + brand cube logo from mono tint. */
		var imgs =
			"#mochaToolbar img:not(.kr-palette-glyph-img):not(.kr-tb-brand-img)," +
			"#Filters img,ul.filterList img,.filterList img," +
			"#statusBar img,.contextMenu img,#desktopNavbar img,#mainWindowTabs img," +
			".MyMenuIcon,img.mochaToolButton,.propertiesTabContent img";

		function scoped(prefix) {
			return imgs.split(",").map(function (s) { return prefix + s; }).join(",");
		}

		var rules = [
			scoped("body.kr-qbittorrent ") + "{" +
			"opacity:1!important;visibility:visible!important;" +
			"-webkit-mask:none!important;mask:none!important;" +
			"-webkit-mask-image:none!important;mask-image:none!important;" +
			"background-color:transparent!important;" +
			"object-fit:contain!important;object-position:center!important;}",
			scoped('html[data-kr-variant="dark"] body.kr-qbittorrent ') + "," +
			scoped("html.dark body.kr-qbittorrent ") +
			"{filter:" + monoDark + "!important;}",
			scoped('html[data-kr-variant="light"] body.kr-qbittorrent ') +
			"{filter:" + monoLight + "!important;}",
			'html[data-kr-variant="dark"] body.kr-qbittorrent #mochaToolbar a:hover img:not(.kr-palette-glyph-img):not(.kr-tb-brand-img),' +
			'html[data-kr-variant="dark"] body.kr-qbittorrent #mochaToolbar label:hover img,' +
			'html[data-kr-variant="dark"] body.kr-qbittorrent ul.filterList li:hover img,' +
			'html[data-kr-variant="dark"] body.kr-qbittorrent .selectedFilter img,' +
			"html.dark body.kr-qbittorrent #mochaToolbar a:hover img:not(.kr-palette-glyph-img):not(.kr-tb-brand-img)," +
			"html.dark body.kr-qbittorrent ul.filterList li:hover img," +
			"html.dark body.kr-qbittorrent .selectedFilter img{" +
			"filter:" + monoHover + "!important;}",
			"body.kr-qbittorrent #Filters," +
			"body.kr-qbittorrent #filtersColumn," +
			"body.kr-qbittorrent ul.filterList," +
			"body.kr-qbittorrent .filterList," +
			"body.kr-qbittorrent ul.filterList li," +
			"body.kr-qbittorrent ul.filterList .link," +
			"body.kr-qbittorrent .filterList .link," +
			"body.kr-qbittorrent #Filters .filterTitle," +
			"body.kr-qbittorrent ul.filterList a{" +
			"color:var(--kr-foreground,#f5f5f5)!important;" +
			"opacity:1!important;visibility:visible!important;}"
		];

		var style = document.createElement("style");
		style.id = "kr-icon-css";
		style.textContent = rules.join("\n");
		head.appendChild(style);
	}

	var KR_LOGO_DATA = "data:image/png;base64,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";
	function makeMark(cls) {
		var el = document.createElement("span");
		el.className = cls || "kr-tb-brand";
		el.setAttribute("aria-hidden", "true");
		el.title = "Krate";
		/* Embedded PNG — never depends on theme file_server paths. */
		var img = document.createElement("img");
		img.className = "kr-tb-brand-img";
		img.alt = "Krate";
		img.width = 20;
		img.height = 20;
		img.decoding = "async";
		img.src = KR_LOGO_DATA;
		el.appendChild(img);
		return el;
	}

	function isInsideMocha(node) {
		while (node && node !== document.body) {
			if (node.id === "desktopFooter") return true;
			if (node.classList) {
				if (
					node.classList.contains("mocha") ||
					node.classList.contains("mochaWindow") ||
					node.classList.contains("mochaOverlay")
				) {
					return true;
				}
			}
			node = node.parentNode;
		}
		return false;
	}

	/** Main app toolbar only — never Mocha dialog toolbars. */
	function findToolbar() {
		var header = document.getElementById("desktopHeader");
		if (header) {
			/* Prefer direct child, but accept nested (some builds wrap the bar). */
			var direct = null;
			try { direct = header.querySelector(":scope > #mochaToolbar"); } catch (e) { direct = null; }
			if (direct && !isInsideMocha(direct)) return direct;
			var nested = header.querySelector("#mochaToolbar");
			if (nested && !isInsideMocha(nested)) return nested;
			var kids = header.children;
			for (var i = 0; i < kids.length; i++) {
				if (kids[i].id === "mochaToolbar") return kids[i];
			}
		}
		var all = document.querySelectorAll("#mochaToolbar");
		for (var j = 0; j < all.length; j++) {
			if (!isInsideMocha(all[j])) return all[j];
		}
		return null;
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

		var pal = document.createElement("div");
		pal.className = "kr-palette";
		var pbtn = document.createElement("button");
		pbtn.type = "button";
		pbtn.className = "kr-palette-btn";
		pbtn.setAttribute("aria-haspopup", "true");
		pbtn.setAttribute("aria-label", t("krAppearance", "Appearance"));
		pbtn.title = t("krAppearance", "Appearance");
		/*
		 * Inline SVG — no network fetch. An <img src="…/palette-switch.svg">
		 * showed as a broken square whenever the icons tree wasn't rsynced.
		 */
		var pglyph = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		pglyph.setAttribute("class", "kr-palette-glyph");
		pglyph.setAttribute("viewBox", "0 0 24 24");
		pglyph.setAttribute("width", "18");
		pglyph.setAttribute("height", "18");
		pglyph.setAttribute("aria-hidden", "true");
		pglyph.setAttribute("focusable", "false");
		var ppath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		ppath.setAttribute(
			"d",
			"M12 22A10 10 0 0 1 2 12A10 10 0 0 1 12 2c5.5 0 10 4 10 9a6 6 0 0 1-6 6h-1.8c-.3 0-.5.2-.5.5c0 .1.1.2.1.3c.4.5.6 1.1.6 1.7c.1 1.4-1 2.5-2.4 2.5m0-18a8 8 0 0 0-8 8a8 8 0 0 0 8 8c.3 0 .5-.2.5-.5c0-.2-.1-.3-.1-.4c-.4-.5-.6-1-.6-1.6c0-1.4 1.1-2.5 2.5-2.5H16a4 4 0 0 0 4-4c0-3.9-3.6-7-8-7m-5.5 6c.8 0 1.5.7 1.5 1.5S7.3 13 6.5 13S5 12.3 5 11.5S5.7 10 6.5 10m3-4c.8 0 1.5.7 1.5 1.5S10.3 9 9.5 9S8 8.3 8 7.5S8.7 6 9.5 6m5 0c.8 0 1.5.7 1.5 1.5S15.3 9 14.5 9S13 8.3 13 7.5S13.7 6 14.5 6m3 4c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5"
		);
		ppath.setAttribute("fill", "currentColor");
		pglyph.appendChild(ppath);
		pbtn.appendChild(pglyph);

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

	function parkChrome(bar) {
		/* Hide until main toolbar exists — never float into Mocha dialogs. */
		if (!bar) return;
		bar.removeAttribute("data-kr-mounted");
		bar.style.setProperty("display", "none", "important");
		var host = document.getElementById("desktop") || document.body;
		if (bar.parentNode !== host) host.appendChild(bar);
	}

	function mountChrome(bar) {
		if (!bar) return false;
		var tb = brandToolbar();
		if (!tb) {
			parkChrome(bar);
			return false;
		}
		/* Clear parkChrome inline hide; CSS [data-kr-mounted] also forces flex. */
		bar.style.removeProperty("display");
		bar.style.setProperty("display", "inline-flex", "important");
		var word = tb.querySelector(".kr-tb-wordmark");
		var brand = tb.querySelector(".kr-tb-brand");
		var anchor = (word && word.nextSibling) || (brand && brand.nextSibling);
		if (bar.parentNode !== tb) {
			if (word) tb.insertBefore(bar, word.nextSibling);
			else if (anchor) tb.insertBefore(bar, anchor);
			else if (brand) tb.insertBefore(bar, brand.nextSibling);
			else tb.insertBefore(bar, tb.firstChild);
		} else if (word && bar.previousSibling !== word) {
			tb.insertBefore(bar, word.nextSibling);
		}
		bar.setAttribute("data-kr-mounted", "toolbar");
		return true;
	}

	function shouldIgnoreMutation(node) {
		if (!node || node.nodeType !== 1) return true;
		if (node.id === "kr-chrome" || (node.closest && node.closest("#kr-chrome"))) return true;
		if (isInsideMocha(node)) return true;
		return false;
	}

	function chromeNeedsRemount(bar) {
		var tb = findToolbar();
		if (!tb || !bar) return false;
		return bar.parentNode !== tb || bar.getAttribute("data-kr-mounted") !== "toolbar";
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

	function refreshPalette() {
		var bar = document.getElementById("kr-chrome");
		if (!bar) return;
		bar.setAttribute("aria-label", t("krAppearance", "Appearance"));
		var btn = bar.querySelector(".kr-palette-btn");
		if (btn) {
			btn.setAttribute("aria-label", t("krAppearance", "Appearance"));
			btn.title = t("krAppearance", "Appearance");
		}
		var labels = {
			auto: t("krVariantAuto", "Auto (HarmonyUI)"),
			dark: t("krVariantDark", "Dark"),
			light: t("krVariantLight", "Light")
		};
		bar.querySelectorAll(".kr-palette-item").forEach(function (it) {
			var v = it.getAttribute("data-variant");
			var lb = it.querySelector("span:not(.kr-palette-check)");
			if (lb && labels[v]) lb.textContent = labels[v];
		});
		if (typeof bar._krMarkActive === "function") bar._krMarkActive();
	}

	function syncChromeLanguage() {
		var code = detectAppLang();
		if (!code) {
			refreshPalette();
			return Promise.resolve();
		}
		if (kr.lang === code) {
			refreshPalette();
			return Promise.resolve();
		}
		kr.lang = code;
		if (code === "en") {
			return loadLangScript("en").then(refreshPalette);
		}
		return loadLangScript("en").then(function () {
			return loadLangScript(code);
		}).then(refreshPalette);
	}

	function ensureChrome() {
		setMarkCssVar();
		injectIconCss();
		var bar = document.getElementById("kr-chrome");
		if (bar && bar.querySelector("select.kr-variant")) {
			/* Migrate leftover select chrome from a prior theme build. */
			bar.parentNode && bar.parentNode.removeChild(bar);
			bar = null;
		}
		bar = bar || buildChrome();
		if (!bar.parentNode) {
			(document.getElementById("desktop") || document.body).appendChild(bar);
		}
		mountChrome(bar);
		syncChromeLanguage();
		if (!mountObserver && typeof MutationObserver === "function") {
			mountObserver = new MutationObserver(function (mutations) {
				var relevant = false;
				for (var i = 0; i < mutations.length; i++) {
					var m = mutations[i];
					var nodes = m.addedNodes;
					if (m.type === "childList" && (!nodes || !nodes.length)) {
						if (m.target && !shouldIgnoreMutation(m.target)) relevant = true;
						continue;
					}
					for (var j = 0; nodes && j < nodes.length; j++) {
						if (!shouldIgnoreMutation(nodes[j])) {
							relevant = true;
							break;
						}
					}
					if (relevant) break;
				}
				if (!relevant) return;
				var chrome = document.getElementById("kr-chrome") || buildChrome();
				brandToolbar();
				mountChrome(chrome);
			});
			mountObserver.observe(document.body, { childList: true, subtree: true });
		}
		[200, 600, 1200, 2500, 5000].forEach(function (ms) {
			setTimeout(function () {
				var chrome = document.getElementById("kr-chrome") || buildChrome();
				brandToolbar();
				mountChrome(chrome);
				syncChromeLanguage();
			}, ms);
		});
		return bar;
	}

	kr.applyVariant = applyVariant;
	kr.getPreference = function () { return storedPreference() || "auto"; };

	function watchQbitScheme() {
		/* Options dialog select + LocalPreferences changes. */
		document.addEventListener("change", function (e) {
			var t = e.target;
			if (!t || t.id !== "colorSchemeSelect") return;
			var map = { "0": "auto", "1": "light", "2": "dark" };
			var pref = map[String(t.value)] || "auto";
			/* Options may not have written LocalPreferences yet — write + apply. */
			setPreference(pref);
			applyVariant(pref);
			var bar = document.getElementById("kr-chrome");
			if (bar && typeof bar._krMarkActive === "function") bar._krMarkActive();
		}, true);

		window.addEventListener("storage", function (e) {
			if (!e || (e.key !== "color_scheme" && e.key !== OVERRIDE_KEY)) return;
			syncFromQbitScheme();
		});

		/* Re-sync when Options saves preferences (qBit updates ClientData async). */
		[400, 1200, 2500].forEach(function (ms) {
			setTimeout(syncFromQbitScheme, ms);
		});
		setInterval(function () {
			var want = storedPreference() || "auto";
			var have = document.documentElement.getAttribute("data-kr-variant");
			var next = appliedVariant(want);
			if (have !== next) applyVariant(want);
			var bar = document.getElementById("kr-chrome");
			if (bar && typeof bar._krMarkActive === "function") bar._krMarkActive();
		}, 2000);
	}

	/**
	 * Execution Log recovery:
	 * - Stock showLogTab waits on private isLogPanelLoaded; if that never flips,
	 *   the tab highlights but Transfers stay up.
	 * - Mocha panelHeight does border/height.toInt() → height: NaN blanks Log.
	 * - #logTabLink is the <li>, not the inner <a>.
	 * Capture-phase click schedules fallbacks that still run if stock throws.
	 */
	function sanitizeMochaHeights() {
		function bad(h) {
			return !h || /NaN/i.test(String(h));
		}
		var pw = document.getElementById("pageWrapper");
		if (pw) {
			var header = document.getElementById("desktopHeader");
			var footer = document.getElementById("desktopFooter");
			var hh = header ? header.offsetHeight : 0;
			var fh = footer ? footer.offsetHeight : 0;
			var wantPw = Math.max(0, window.innerHeight - hh - fh);
			if (bad(pw.style.height) || parseFloat(pw.style.height) < 1) {
				pw.style.height = wantPw + "px";
			}
		}
		var nodes = document.querySelectorAll(
			"#pageWrapper .column, #pageWrapper .panelWrapper, #pageWrapper .panel, " +
			"#pageWrapper .panel-content, #logTabColumn, #LogPanel, #LogPanel_header, " +
			"#LogPanel_pad, #logView, #logContentView"
		);
		for (var i = 0; i < nodes.length; i++) {
			if (bad(nodes[i].style.height)) nodes[i].style.height = "";
		}
		var col = document.getElementById("logTabColumn");
		if (col && pw && !col.classList.contains("invisible")) {
			var ch = pw.clientHeight || parseFloat(pw.style.height) || 0;
			if (ch > 0) {
				col.style.width = "100%";
				col.style.height = ch + "px";
			}
			var panel = document.getElementById("LogPanel");
			if (panel && ch > 0) {
				var pHeader = document.getElementById("LogPanel_header");
				var ph = pHeader ? pHeader.offsetHeight : 0;
				var want = Math.max(80, ch - ph);
				panel.style.height = want + "px";
				if (panel.parentNode && panel.parentNode.classList &&
					panel.parentNode.classList.contains("panelWrapper")) {
					panel.parentNode.style.height = ch + "px";
				}
				var pad = document.getElementById("LogPanel_pad") ||
					panel.parentNode && panel.parentNode.querySelector(".panel-content");
				if (pad) pad.style.height = want + "px";
				var content = panel.querySelector(".panel-contentContent") ||
					document.getElementById("logView");
				if (content) {
					content.style.height = "100%";
					content.style.minHeight = Math.max(60, want - 8) + "px";
				}
				try {
					if (window.MUI && MUI.Panels && MUI.Panels.instances) {
						var inst = MUI.Panels.instances.LogPanel ||
							(MUI.Panels.instances.get && MUI.Panels.instances.get("LogPanel"));
						if (inst && inst.contentEl) inst.contentEl.style.height = "100%";
					}
				} catch (eC) { /* ignore */ }
			}
		}
	}

	function patchMochaDesktop() {
		if (!window.MochaUI || !MochaUI.Desktop || MochaUI.Desktop._krPatched) return;
		var desk = MochaUI.Desktop;
		desk._krPatched = true;
		var orig = typeof desk.setDesktopSize === "function"
			? desk.setDesktopSize.bind(desk)
			: null;
		desk.setDesktopSize = function () {
			try {
				if (orig) orig();
			} catch (e) { /* ignore */ }
			sanitizeMochaHeights();
		};
	}

	function showLogFallback() {
		try {
			patchMochaDesktop();
			var col = document.getElementById("logTabColumn");
			if (!col) return;
			[
				"filtersColumn",
				"filtersColumn_handle",
				"mainColumn",
				"torrentsFilterToolbar",
				"searchTabColumn",
				"rssTabColumn"
			].forEach(function (id) {
				var n = document.getElementById(id);
				if (n) n.classList.add("invisible");
			});
			col.classList.remove("invisible");
			/* #logTabLink is the <li> itself in stock index.html. */
			var logLi = document.getElementById("logTabLink");
			var tabs = document.getElementById("mainWindowTabsList");
			if (tabs) {
				var lis = tabs.querySelectorAll("li");
				for (var i = 0; i < lis.length; i++) lis[i].classList.remove("selected");
			}
			if (logLi) logLi.classList.add("selected");
			sanitizeMochaHeights();
			try {
				if (window.MochaUI && MochaUI.Desktop && MochaUI.Desktop.setDesktopSize) {
					MochaUI.Desktop.setDesktopSize();
				}
			} catch (e0) { /* ignore */ }
			sanitizeMochaHeights();
			if (window.qBittorrent && qBittorrent.Log) {
				try {
					if (!qBittorrent.Log._krInited && typeof qBittorrent.Log.init === "function") {
						qBittorrent.Log.init();
						qBittorrent.Log._krInited = true;
					} else if (typeof qBittorrent.Log.load === "function") {
						qBittorrent.Log.load();
					}
				} catch (e1) { /* ignore */ }
			}
		} catch (e) { /* ignore */ }
	}

	function patchLogTab() {
		patchMochaDesktop();
		var link = document.getElementById("logTabLink");
		if (!link || link.getAttribute("data-kr-log") === "1") return;
		link.setAttribute("data-kr-log", "1");
		function schedule() {
			[0, 50, 150, 400, 1000, 2000].forEach(function (ms) {
				window.setTimeout(showLogFallback, ms);
			});
		}
		link.addEventListener("click", schedule, true);
		var anchor = link.querySelector("a");
		if (anchor) anchor.addEventListener("click", schedule, true);
	}

	function bootChrome() {
		if (!document.body) {
			document.addEventListener("DOMContentLoaded", bootChrome, { once: true });
			return;
		}
		document.documentElement.classList.add("kr-qbittorrent");
		document.body.classList.add("kr-qbittorrent");
		ensureChrome();
		/* Prefer qBit Color scheme over legacy kr-qbittorrent-variant. */
		applyVariant(storedPreference() || "auto");
		watchQbitScheme();
		patchLogTab();
		[500, 1500, 4000].forEach(function (ms) {
			setTimeout(patchLogTab, ms);
		});
	}

	bootChrome();
	window.addEventListener("focus", function () {
		syncFromQbitScheme();
	});
})(window.kr);

/**
 * @file qBittorrent General-tab overview (ruTorrent-minded cards).
 * Hides stock #propGeneral fieldsets and mirrors live torrent data into
 * a Krate hero + Swarm / Tracker / Storage cards.
 * @requires window.kr
 */
;(function (kr) {
	"use strict";
	if (!kr || window.krQbitDetailsInit) return;
	window.krQbitDetailsInit = true;

	var t = function (key, fallback) {
		return kr.lib && kr.lib.i18n ? kr.lib.i18n.t(key, fallback) : (fallback || "");
	};

	var RING_R = 38;
	var RING_C = 2 * Math.PI * RING_R;
	var SPARK_MAX = 30;
	var POLL_MS = 2000;

	var ov = null;
	var lastHash = null;
	var sparkDown = [];
	var sparkUp = [];
	var pollTimer = null;
	var bootObserver = null;

	function el(tag, cls, parent) {
		var e = document.createElement(tag);
		if (cls) e.className = cls;
		if (parent) parent.appendChild(e);
		return e;
	}

	function maskSpan(name) {
		var s = document.createElement("span");
		s.className = "kr-icon";
		var u = "url(" + (kr.path || "") + "images/icons/" + name + ".svg" +
			(kr.version ? "?kr=" + kr.version : "") + ")";
		s.style.webkitMaskImage = u;
		s.style.maskImage = u;
		return s;
	}

	function dash(node) {
		if (!node) return;
		node.textContent = "—";
		node.classList.add("kr-muted");
	}

	function setText(node, text) {
		if (!node) return;
		if (text == null || text === "") {
			dash(node);
			return;
		}
		node.textContent = text;
		node.classList.remove("kr-muted");
	}

	function setHtml(node, html, plainFallback) {
		if (!node) return;
		if (!html) {
			dash(node);
			return;
		}
		node.classList.remove("kr-muted");
		try {
			node.innerHTML = html;
		} catch (e) {
			node.textContent = plainFallback || "";
		}
	}

	function setMidTrunc(container, full, headRatio) {
		if (!container) return;
		container.textContent = "";
		if (full == null || full === "") {
			dash(container);
			return;
		}
		container.classList.remove("kr-muted");
		var cut = Math.max(0, Math.floor(full.length * (headRatio || 0.6)));
		var a = document.createElement("span");
		a.className = "kr-mid-a";
		a.textContent = full.slice(0, cut);
		var b = document.createElement("span");
		b.className = "kr-mid-b";
		b.textContent = full.slice(cut);
		container.appendChild(a);
		container.appendChild(b);
		container.title = full;
	}

	function copyButton(getValue) {
		var btn = document.createElement("button");
		btn.type = "button";
		btn.className = "kr-copy-btn kr-icon-btn";
		btn.title = t("kr_det_copy", "Copy");
		btn.appendChild(maskSpan("fm-copy"));
		btn.addEventListener("click", function () {
			var v = "";
			try { v = getValue() || ""; } catch (e) { v = ""; }
			if (!v) return;
			var flash = function () {
				btn.classList.add("kr-copied");
				setTimeout(function () { btn.classList.remove("kr-copied"); }, 900);
			};
			try {
				if (navigator.clipboard && navigator.clipboard.writeText) {
					navigator.clipboard.writeText(v).then(flash, function () {});
				} else {
					var ta = document.createElement("textarea");
					ta.value = v;
					ta.style.position = "fixed";
					ta.style.opacity = "0";
					document.body.appendChild(ta);
					ta.select();
					try { document.execCommand("copy"); flash(); } catch (e2) {}
					document.body.removeChild(ta);
				}
			} catch (e3) {}
		});
		return btn;
	}

	function buildRing(parent) {
		var NS = "http://www.w3.org/2000/svg";
		var svg = document.createElementNS(NS, "svg");
		svg.setAttribute("class", "kr-ring");
		svg.setAttribute("viewBox", "0 0 88 88");
		svg.setAttribute("width", "88");
		svg.setAttribute("height", "88");
		var defs = document.createElementNS(NS, "defs");
		var grad = document.createElementNS(NS, "linearGradient");
		grad.setAttribute("id", "kr-ring-grad");
		grad.setAttribute("x1", "0");
		grad.setAttribute("y1", "0");
		grad.setAttribute("x2", "1");
		grad.setAttribute("y2", "1");
		var s1 = document.createElementNS(NS, "stop");
		s1.setAttribute("offset", "0%");
		s1.setAttribute("class", "kr-ring-s1");
		var s2 = document.createElementNS(NS, "stop");
		s2.setAttribute("offset", "100%");
		s2.setAttribute("class", "kr-ring-s2");
		grad.appendChild(s1);
		grad.appendChild(s2);
		defs.appendChild(grad);
		svg.appendChild(defs);
		var track = document.createElementNS(NS, "circle");
		track.setAttribute("class", "kr-ring-track");
		track.setAttribute("cx", "44");
		track.setAttribute("cy", "44");
		track.setAttribute("r", String(RING_R));
		svg.appendChild(track);
		var arc = document.createElementNS(NS, "circle");
		arc.setAttribute("class", "kr-ring-arc");
		arc.setAttribute("cx", "44");
		arc.setAttribute("cy", "44");
		arc.setAttribute("r", String(RING_R));
		arc.setAttribute("stroke-dasharray", RING_C.toFixed(2));
		arc.setAttribute("stroke-dashoffset", RING_C.toFixed(2));
		arc.setAttribute("transform", "rotate(-90 44 44)");
		svg.appendChild(arc);
		var label = document.createElementNS(NS, "text");
		label.setAttribute("class", "kr-ring-label");
		label.setAttribute("x", "44");
		label.setAttribute("y", "44");
		label.setAttribute("text-anchor", "middle");
		label.setAttribute("dominant-baseline", "central");
		label.textContent = "0%";
		svg.appendChild(label);
		parent.appendChild(svg);
		return { arc: arc, label: label };
	}

	function sparkPoints(buf, w, h) {
		if (!buf.length) return "";
		var max = 1;
		for (var i = 0; i < buf.length; i++) if (buf[i] > max) max = buf[i];
		var n = buf.length;
		var step = n > 1 ? w / (n - 1) : w;
		var pts = [];
		for (var j = 0; j < n; j++) {
			pts.push((j * step).toFixed(1) + "," + (h - (buf[j] / max) * (h - 2) - 1).toFixed(1));
		}
		return pts.join(" ");
	}

	function buildSpark(cell, dirClass, iconName, labelText) {
		var NS = "http://www.w3.org/2000/svg";
		var row = el("div", "kr-spd " + dirClass, cell);
		var ic = maskSpan(iconName);
		ic.className = "kr-icon kr-spd-icon";
		row.appendChild(ic);
		var txt = el("div", "kr-spd-text", row);
		var num = el("div", "kr-spd-num", txt);
		num.textContent = "0 B/s";
		var lab = el("div", "kr-spd-lab", txt);
		lab.textContent = labelText;
		var svg = document.createElementNS(NS, "svg");
		svg.setAttribute("class", "kr-spark");
		svg.setAttribute("viewBox", "0 0 84 26");
		svg.setAttribute("preserveAspectRatio", "none");
		var area = document.createElementNS(NS, "polyline");
		area.setAttribute("class", "kr-spark-area");
		var line = document.createElementNS(NS, "polyline");
		line.setAttribute("class", "kr-spark-line");
		svg.appendChild(area);
		svg.appendChild(line);
		row.appendChild(svg);
		return { num: num, area: area, line: line };
	}

	function buildCard(parent, iconName, title) {
		var card = el("div", "kr-card", parent);
		var head = el("div", "kr-card-head", card);
		var ic = maskSpan(iconName);
		ic.className = "kr-icon kr-card-icon";
		head.appendChild(ic);
		el("div", "kr-card-title", head).textContent = title;
		return el("div", "kr-card-body", card);
	}

	function metaRow(parent, label) {
		var row = el("div", "kr-meta", parent);
		el("div", "kr-meta-label", row).textContent = label;
		var v = el("div", "kr-meta-value", row);
		return { row: row, value: v };
	}

	function miniStat(parent, label) {
		var cell = el("div", "kr-ministat", parent);
		el("div", "kr-ministat-label", cell).textContent = label;
		var v = el("div", "kr-ministat-value", cell);
		v.textContent = "—";
		return v;
	}

	function friendlyUnit(bytes, isSpeed) {
		try {
			if (window.qBittorrent && qBittorrent.Misc && qBittorrent.Misc.friendlyUnit) {
				return qBittorrent.Misc.friendlyUnit(bytes, !!isSpeed);
			}
		} catch (e) {}
		var u = ["B", "KiB", "MiB", "GiB", "TiB"];
		var n = Math.max(0, Number(bytes) || 0);
		var i = 0;
		while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
		var s = (i === 0 ? String(Math.round(n)) : n.toFixed(2)) + " " + u[i];
		return isSpeed ? s + "/s" : s;
	}

	function friendlyDuration(sec) {
		try {
			if (window.qBittorrent && qBittorrent.Misc && qBittorrent.Misc.friendlyDuration) {
				return qBittorrent.Misc.friendlyDuration(sec);
			}
		} catch (e) {}
		if (sec == null || sec < 0 || sec >= 8640000) return "∞";
		sec = Math.floor(sec);
		var d = Math.floor(sec / 86400);
		var h = Math.floor((sec % 86400) / 3600);
		var m = Math.floor((sec % 3600) / 60);
		var s = sec % 60;
		if (d > 0) return d + "d " + h + "h";
		if (h > 0) return h + "h " + m + "m";
		if (m > 0) return m + "m " + s + "s";
		return s + "s";
	}

	function spanText(id) {
		var node = document.getElementById(id);
		return node ? (node.textContent || "").trim() : "";
	}

	function currentHash() {
		try {
			if (window.torrentsTable) {
				if (typeof torrentsTable.getCurrentTorrentID === "function") {
					var id = torrentsTable.getCurrentTorrentID();
					if (id) return String(id);
				}
				if (torrentsTable.selectedTorrents && torrentsTable.selectedTorrents.length) {
					return String(torrentsTable.selectedTorrents[0]);
				}
				if (typeof torrentsTable.selectedRowsIds === "function") {
					var ids = torrentsTable.selectedRowsIds();
					if (ids && ids.length) return String(ids[0]);
				}
				if (torrentsTable.selectedRows && torrentsTable.selectedRows.length) {
					return String(torrentsTable.selectedRows[0]);
				}
			}
		} catch (e) {}
		try {
			var tr = document.querySelector(
				"#torrentsTableDiv tr.selected, #torrentsTable tr.selected, " +
				"#transferList tr.selected, .dynamicTable tbody tr.selected"
			);
			if (tr) {
				return tr.getAttribute("data-row-id") ||
					tr.getAttribute("data-hash") ||
					(tr.id ? String(tr.id).replace(/^torrentRow_?/i, "") : "") ||
					"";
			}
		} catch (e2) {}
		return "";
	}

	function hasStockGeneralData() {
		return !!(
			spanText("save_path") ||
			spanText("progressPercentage") ||
			spanText("total_size") ||
			spanText("torrent_hash_v1")
		);
	}

	function rowData(hash) {
		try {
			if (!hash || !window.torrentsTable || typeof torrentsTable.getRow !== "function") return null;
			var row = torrentsTable.getRow(hash);
			return row && row.full_data ? row.full_data : null;
		} catch (e) {
			return null;
		}
	}

	function stateTone(state) {
		var s = String(state || "").toLowerCase();
		if (s.indexOf("error") !== -1 || s.indexOf("missing") !== -1) return "error";
		if (s.indexOf("check") !== -1 || s.indexOf("moving") !== -1) return "checking";
		if (s.indexOf("paused") !== -1 || s.indexOf("stopped") !== -1) return "paused";
		if (s.indexOf("queued") !== -1) return "checking";
		if (s.indexOf("up") !== -1 || s.indexOf("seed") !== -1 || s.indexOf("forcedup") !== -1) return "seeding";
		if (s.indexOf("down") !== -1 || s.indexOf("meta") !== -1) return "downloading";
		return "stopped";
	}

	function stateLabel(state) {
		var s = String(state || "");
		if (!s) return "—";
		/* Prefer localized cell text from the selected transfer row. */
		try {
			var hash = currentHash();
			var tr = document.querySelector('#torrentsTableDiv tr[data-row-id="' + hash + '"], #torrentsTable tr.selected');
			if (!tr) tr = document.querySelector("#torrentsTableDiv tr.selected, .dynamicTable tr.selected");
			if (tr) {
				var cells = tr.querySelectorAll("td");
				for (var i = 0; i < cells.length; i++) {
					var col = cells[i].getAttribute("data-column") || cells[i].className || "";
					if (/state|status/i.test(col) && (cells[i].textContent || "").trim()) {
						return (cells[i].textContent || "").trim();
					}
				}
			}
		} catch (e) {}
		return s.replace(/([a-z])([A-Z])/g, "$1 $2");
	}

	function freeDiskText() {
		var ids = ["freeSpaceOnDisk", "freeDiskSpace", "free_space"];
		for (var i = 0; i < ids.length; i++) {
			var v = spanText(ids[i]);
			if (v) return v.replace(/^[^:]*:\s*/, "");
		}
		try {
			var sb = document.getElementById("statusBar") || document.getElementById("desktopFooter");
			if (sb) {
				var m = (sb.textContent || "").match(/Free space:\s*([^\n|]+)/i) ||
					(sb.textContent || "").match(/Espace libre\s*:\s*([^\n|]+)/i);
				if (m) return m[1].trim();
			}
		} catch (e) {}
		return "";
	}

	function hideStockGeneral(host) {
		if (!host) return;
		var kids = host.children;
		for (var i = 0; i < kids.length; i++) {
			if (kids[i].classList && kids[i].classList.contains("kr-ov")) continue;
			kids[i].style.setProperty("display", "none", "important");
			kids[i].setAttribute("data-kr-stock-hidden", "1");
		}
	}

	function buildOverview(host) {
		if (!host || host.getAttribute("data-kr-built")) return;
		host.classList.add("kr-prop-overview");
		host.setAttribute("data-kr-built", "1");
		hideStockGeneral(host);

		var root = el("div", "kr-ov", host);
		var empty = el("div", "kr-ov-empty", root);
		empty.textContent = t("kr_det_empty_general", "Select a torrent to see its overview");

		var body = el("div", "kr-ov-body", root);
		body.hidden = true;

		var hero = el("div", "kr-ov-hero", body);
		var ringCell = el("div", "kr-hero-cell kr-hero-overview", hero);
		var ring = buildRing(ringCell);
		var ovInfo = el("div", "kr-overview-info", ringCell);
		var nameEl = el("div", "kr-ov-name", ovInfo);
		nameEl.textContent = "—";
		var metaLine = el("div", "kr-ov-metaline", ovInfo);
		metaLine.textContent = "—";
		var statePill = el("div", "kr-state-pill", ovInfo);
		statePill.textContent = "—";

		var speedCell = el("div", "kr-hero-cell kr-hero-speed", hero);
		var spDown = buildSpark(speedCell, "kr-dir-down", "statusbar-download", t("kr_det_download", "Download"));
		var spUp = buildSpark(speedCell, "kr-dir-up", "statusbar-upload", t("kr_det_upload", "Upload"));

		var ratioCell = el("div", "kr-hero-cell kr-hero-ratio", hero);
		el("div", "kr-hero-label", ratioCell).textContent = t("kr_det_ratio", "Ratio");
		var rVal = el("div", "kr-ratio-value", ratioCell);
		rVal.textContent = "—";
		var rTrack = el("div", "kr-ratio-track", ratioCell);
		var rFill = el("div", "kr-ratio-fill", rTrack);
		el("div", "kr-ratio-tick", rTrack);
		var rSub = el("div", "kr-hero-sub", ratioCell);
		rSub.textContent = "—";

		var timeCell = el("div", "kr-hero-cell kr-hero-time", hero);
		var tStats = el("div", "kr-ministats", timeCell);
		var tEta = miniStat(tStats, t("kr_det_eta", "ETA"));
		var tEl = miniStat(tStats, t("kr_det_elapsed", "Elapsed"));
		var tRem = miniStat(tStats, t("kr_det_remaining", "Remaining"));

		var cards = el("div", "kr-ov-cards", body);

		var swarm = buildCard(cards, "tab-peers", t("kr_det_swarm", "Swarm"));
		var seedRow = el("div", "kr-swarm-row", swarm);
		el("div", "kr-swarm-key", seedRow).textContent = t("kr_det_seeds", "Seeds");
		var seedVal = el("div", "kr-swarm-val", seedRow);
		seedVal.textContent = "—";
		var seedBar = el("div", "kr-swarm-bar", swarm);
		var seedFill = el("div", "kr-swarm-fill kr-dir-up", seedBar);
		var peerRow = el("div", "kr-swarm-row", swarm);
		el("div", "kr-swarm-key", peerRow).textContent = t("kr_det_peers", "Peers");
		var peerVal = el("div", "kr-swarm-val", peerRow);
		peerVal.textContent = "—";
		var peerBar = el("div", "kr-swarm-bar", swarm);
		var peerFill = el("div", "kr-swarm-fill kr-dir-down", peerBar);
		var wastedMeta = metaRow(swarm, t("kr_det_wasted", "Wasted"));

		/* Full tracker list (replaces single-URL row + properties Trackers tab). */
		var tracker = buildCard(cards, "tab-trackers", t("kr_det_tracker", "Trackers"));
		var trkList = el("div", "kr-list kr-trk-list", tracker);
		trkList.textContent = "—";

		/* Full peers list. */
		var peersCard = buildCard(cards, "tab-peers", t("kr_det_peers", "Peers"));
		var peerList = el("div", "kr-list kr-peer-list", peersCard);
		peerList.textContent = "—";

		var storage = buildCard(cards, "tab-filemanager", t("kr_det_storage", "Storage"));
		var pathRow = el("div", "kr-meta kr-meta-wide", storage);
		el("div", "kr-meta-label", pathRow).textContent = t("kr_det_save_path", "Save path");
		var pathWrap = el("div", "kr-meta-value kr-trunc-wrap", pathRow);
		var pathVal = el("div", "kr-trunc", pathWrap);
		pathVal.textContent = "—";
		var pathStore = { v: "" };
		pathWrap.appendChild(copyButton(function () { return pathStore.v; }));
		var diskRow = el("div", "kr-meta kr-meta-wide", storage);
		var diskHead = el("div", "kr-disk-head", diskRow);
		el("div", "kr-meta-label", diskHead).textContent = t("kr_det_free_disk", "Free disk");
		var diskVal = el("div", "kr-disk-val", diskHead);
		diskVal.textContent = "—";
		var diskTrack = el("div", "kr-disk-track", diskRow);
		var diskFill = el("div", "kr-disk-fill", diskTrack);
		var hashRow = el("div", "kr-meta kr-meta-wide", storage);
		el("div", "kr-meta-label", hashRow).textContent = t("kr_det_hash", "Hash");
		var hashWrap = el("div", "kr-meta-value kr-trunc-wrap", hashRow);
		var hashVal = el("div", "kr-trunc kr-mono", hashWrap);
		hashVal.textContent = "—";
		var hashStore = { v: "" };
		hashWrap.appendChild(copyButton(function () { return hashStore.v; }));
		var cmtRow = el("div", "kr-meta kr-meta-wide", storage);
		el("div", "kr-meta-label", cmtRow).textContent = t("kr_det_comment", "Comment");
		var cmtVal = el("div", "kr-meta-value kr-comment", cmtRow);
		cmtVal.textContent = "—";

		ov = {
			root: root,
			empty: empty,
			body: body,
			ringArc: ring.arc,
			ringLabel: ring.label,
			statePill: statePill,
			nameEl: nameEl,
			metaLine: metaLine,
			spDownNum: spDown.num,
			spDownArea: spDown.area,
			spDownLine: spDown.line,
			spUpNum: spUp.num,
			spUpArea: spUp.area,
			spUpLine: spUp.line,
			rVal: rVal,
			rFill: rFill,
			rSub: rSub,
			tEta: tEta,
			tEl: tEl,
			tRem: tRem,
			seedVal: seedVal,
			seedFill: seedFill,
			peerVal: peerVal,
			peerFill: peerFill,
			wasted: wastedMeta.value,
			trkList: trkList,
			peerList: peerList,
			pathVal: pathVal,
			pathStore: pathStore,
			diskVal: diskVal,
			diskFill: diskFill,
			hashVal: hashVal,
			hashStore: hashStore,
			cmtVal: cmtVal
		};
	}

	function showEmpty(on) {
		if (!ov) return;
		ov.empty.hidden = !on;
		ov.body.hidden = !!on;
	}

	function applySpark(buf, line, area, sample) {
		buf.push(Math.max(0, sample || 0));
		if (buf.length > SPARK_MAX) buf.shift();
		var pts = sparkPoints(buf, 84, 26);
		line.setAttribute("points", pts);
		area.setAttribute("points", pts ? ("0,26 " + pts + " 84,26") : "");
	}

	function renderFromDomFallback() {
		if (!ov) return;
		var pctTxt = spanText("progressPercentage");
		var pct = parseFloat(pctTxt);
		if (isNaN(pct)) pct = 0;
		ov.ringArc.setAttribute("stroke-dashoffset", (RING_C * (1 - Math.max(0, Math.min(100, pct)) / 100)).toFixed(2));
		ov.ringLabel.textContent = pctTxt || (Math.round(pct) + "%");

		setText(ov.spDownNum, (spanText("dl_speed").split("(")[0] || "").trim() || "0 B/s");
		setText(ov.spUpNum, (spanText("up_speed").split("(")[0] || "").trim() || "0 B/s");
		setText(ov.rVal, spanText("share_ratio") || "—");
		setText(ov.tEta, spanText("eta"));
		setText(ov.tEl, (spanText("time_elapsed").split("(")[0] || "").trim());
		setText(ov.seedVal, spanText("seeds"));
		setText(ov.peerVal, spanText("peers"));
		setText(ov.wasted, spanText("total_wasted"));
		var path = spanText("save_path");
		ov.pathStore.v = path;
		setMidTrunc(ov.pathVal, path, 0.55);
		var hash = spanText("torrent_hash_v1");
		if (!hash || /^N\/A/i.test(hash)) hash = spanText("torrent_hash_v2");
		ov.hashStore.v = hash;
		setMidTrunc(ov.hashVal, hash, 0.45);
		var cmt = document.getElementById("comment");
		if (cmt && cmt.innerHTML) setHtml(ov.cmtVal, cmt.innerHTML, cmt.textContent);
		else setText(ov.cmtVal, t("kr_det_no_comment", "No comment"));
		setText(ov.diskVal, freeDiskText());
		setText(ov.rSub, t("kr_det_updown", "{up} up / {down} down")
			.replace("{up}", (spanText("total_uploaded").split("(")[0] || "").trim() || "—")
			.replace("{down}", (spanText("total_downloaded").split("(")[0] || "").trim() || "—"));
		var size = spanText("total_size");
		setText(ov.metaLine, size || "—");
		setText(ov.tRem, size && pct < 100 ? "~" : (size || "—"));
	}

	function renderProperties(data, row) {
		if (!ov || !data) return;
		showEmpty(false);

		var pct = Math.max(0, Math.min(100, (Number(data.progress) || 0) * 100));
		ov.ringArc.setAttribute("stroke-dashoffset", (RING_C * (1 - pct / 100)).toFixed(2));
		ov.ringLabel.textContent = (pct >= 99.95 ? 100 : Math.round(pct * 10) / 10) + "%";

		var name = (row && row.name) || data.name || "";
		setMidTrunc(ov.nameEl, name, 0.7);

		var state = (row && row.state) || "";
		ov.statePill.textContent = stateLabel(state);
		ov.statePill.setAttribute("data-tone", stateTone(state));

		var sizeTxt = friendlyUnit(data.total_size);
		setText(ov.metaLine, sizeTxt);

		var dl = Number(data.dl_speed) || 0;
		var ul = Number(data.up_speed) || 0;
		ov.spDownNum.textContent = friendlyUnit(dl, true);
		ov.spUpNum.textContent = friendlyUnit(ul, true);
		applySpark(sparkDown, ov.spDownLine, ov.spDownArea, dl);
		applySpark(sparkUp, ov.spUpLine, ov.spUpArea, ul);

		var ratio = Number(data.share_ratio);
		var infinite = !isFinite(ratio) || ratio < 0;
		ov.rVal.textContent = infinite ? "∞" : ratio.toFixed(3);
		var met = infinite || ratio >= 1;
		ov.rFill.style.setProperty("--kr-p", String((infinite ? 100 : Math.min(100, ratio * 100)) / 100));
		ov.rFill.setAttribute("data-met", met ? "1" : "0");
		ov.rVal.setAttribute("data-met", met ? "1" : "0");
		ov.rSub.textContent = t("kr_det_updown", "{up} up / {down} down")
			.replace("{up}", friendlyUnit(data.total_uploaded))
			.replace("{down}", friendlyUnit(data.total_downloaded));

		setText(ov.tEta, friendlyDuration(data.eta));
		setText(ov.tEl, friendlyDuration(data.time_elapsed));
		var remaining = Math.max(0, (Number(data.total_size) || 0) * (1 - (Number(data.progress) || 0)));
		setText(ov.tRem, remaining > 0 ? friendlyUnit(remaining) : friendlyUnit(0));

		var seeds = (data.seeds || 0) + " / " + (data.seeds_total || 0);
		var peers = (data.peers || 0) + " / " + (data.peers_total || 0);
		setText(ov.seedVal, seeds);
		setText(ov.peerVal, peers);
		var seedP = data.seeds_total > 0 ? Math.min(1, data.seeds / data.seeds_total) : 0;
		var peerP = data.peers_total > 0 ? Math.min(1, data.peers / data.peers_total) : 0;
		ov.seedFill.style.setProperty("--kr-p", String(seedP));
		ov.peerFill.style.setProperty("--kr-p", String(peerP));
		setText(ov.wasted, friendlyUnit(data.total_wasted));

		ov.pathStore.v = data.save_path || "";
		setMidTrunc(ov.pathVal, ov.pathStore.v, 0.55);

		var hash = data.infohash_v1 || data.infohash_v2 || currentHash() || "";
		ov.hashStore.v = hash;
		setMidTrunc(ov.hashVal, hash, 0.45);

		if (data.comment) {
			try {
				var html = (window.qBittorrent && qBittorrent.Misc && qBittorrent.Misc.parseHtmlLinks)
					? qBittorrent.Misc.parseHtmlLinks(qBittorrent.Misc.escapeHtml(data.comment))
					: data.comment;
				setHtml(ov.cmtVal, html, data.comment);
			} catch (e) {
				setText(ov.cmtVal, data.comment);
			}
		} else {
			setText(ov.cmtVal, t("kr_det_no_comment", "No comment"));
		}

		setText(ov.diskVal, freeDiskText() || "—");
		ov.diskFill.style.setProperty("--kr-p", "0.35");
	}

	function fetchJson(url) {
		return fetch(url, { method: "GET", cache: "no-store" }).then(function (r) {
			if (!r.ok) throw new Error(String(r.status));
			return r.json();
		});
	}

	function trackerStatusLabel(tr) {
		var ok = tr.status === 2 || /working|ok/i.test(String(tr.msg || ""));
		var err = tr.status === 4 || /error|fail/i.test(String(tr.msg || ""));
		if (ok) return { text: t("kr_det_tracker_ok", "OK"), tone: "ok" };
		if (err) return { text: tr.msg || "Error", tone: "error" };
		return { text: tr.msg || String(tr.status != null ? tr.status : "—"), tone: "updating" };
	}

	function renderTrackerList(list) {
		if (!ov || !ov.trkList) return;
		ov.trkList.textContent = "";
		var rows = [];
		for (var i = 0; i < (list || []).length; i++) {
			var tr = list[i];
			if (!tr || !tr.url || String(tr.url).indexOf("**") === 0) continue;
			rows.push(tr);
		}
		if (!rows.length) {
			dash(ov.trkList);
			return;
		}
		rows.forEach(function (tr) {
			var row = el("div", "kr-list-row", ov.trkList);
			var main = el("div", "kr-list-main", row);
			var urlEl = el("div", "kr-list-title kr-mono", main);
			urlEl.textContent = tr.url;
			urlEl.title = tr.url;
			var st = trackerStatusLabel(tr);
			var pill = el("span", "kr-status-pill", row);
			pill.textContent = st.text;
			pill.setAttribute("data-tone", st.tone);
			if (tr.num_peers != null || tr.num_seeds != null) {
				var sub = el("div", "kr-list-sub", main);
				sub.textContent = t("kr_det_seeds", "Seeds") + " " + (tr.num_seeds != null ? tr.num_seeds : "—") +
					" · " + t("kr_det_peers", "Peers") + " " + (tr.num_peers != null ? tr.num_peers : "—");
			}
		});
	}

	function renderPeerList(peersObj) {
		if (!ov || !ov.peerList) return;
		ov.peerList.textContent = "";
		var peers = peersObj && peersObj.peers ? peersObj.peers : peersObj;
		var keys = peers && typeof peers === "object" ? Object.keys(peers) : [];
		if (!keys.length) {
			dash(ov.peerList);
			return;
		}
		keys.sort();
		keys.forEach(function (k) {
			var p = peers[k];
			if (!p) return;
			var row = el("div", "kr-list-row", ov.peerList);
			var main = el("div", "kr-list-main", row);
			var title = el("div", "kr-list-title", main);
			var ip = p.ip || p.address || k;
			title.textContent = ip + (p.client ? " · " + p.client : "");
			title.title = title.textContent;
			var sub = el("div", "kr-list-sub", main);
			var dl = friendlyUnit(p.dl_speed || p.downloaded || 0, true);
			var ul = friendlyUnit(p.up_speed || p.uploaded || 0, true);
			var prog = (p.progress != null) ? (Math.round(Number(p.progress) * 1000) / 10) + "%" : "—";
			sub.textContent = "↓ " + dl + "  ↑ " + ul + "  ·  " + prog;
			var flag = el("span", "kr-list-flag", row);
			flag.textContent = p.country || p.connection || "";
		});
	}

	function updateTrackers(hash) {
		if (!ov || !hash) return;
		var url = new URL("api/v2/torrents/trackers", window.location.href);
		url.search = new URLSearchParams({ hash: hash });
		fetchJson(url.toString()).then(function (list) {
			renderTrackerList(list);
		}).catch(function () {
			if (ov && ov.trkList) dash(ov.trkList);
		});
	}

	function updatePeers(hash) {
		if (!ov || !hash) return;
		var url = new URL("api/v2/sync/torrentPeers", window.location.href);
		url.search = new URLSearchParams({ hash: hash });
		fetchJson(url.toString()).then(function (data) {
			renderPeerList(data);
		}).catch(function () {
			if (ov && ov.peerList) dash(ov.peerList);
		});
	}

	function tick() {
		if (!ov) return;
		if (document.hidden) return;
		var host = document.getElementById("propGeneral");
		if (!host || host.classList.contains("invisible")) return;
		var collapse = document.getElementById("propertiesPanel_collapseToggle");
		if (collapse && collapse.classList.contains("panel-expand")) return;

		hideStockGeneral(host);

		var hash = currentHash();
		if (!hash) {
			if (hasStockGeneralData()) {
				/* Selection exists in the General DOM even if table API lags. */
				showEmpty(false);
				renderFromDomFallback();
				return;
			}
			showEmpty(true);
			lastHash = null;
			sparkDown = [];
			sparkUp = [];
			return;
		}
		if (hash !== lastHash) {
			sparkDown = [];
			sparkUp = [];
			lastHash = hash;
		}

		var row = rowData(hash);
		var url;
		try {
			url = new URL("api/v2/torrents/properties", window.location.href);
		} catch (e) {
			url = null;
		}
		if (!url) {
			showEmpty(false);
			renderFromDomFallback();
			return;
		}
		url.search = new URLSearchParams({ hash: hash });
		fetchJson(url.toString()).then(function (data) {
			if (!data) {
				renderFromDomFallback();
				showEmpty(false);
				return;
			}
			renderProperties(data, row);
			updateTrackers(hash);
			updatePeers(hash);
		}).catch(function () {
			renderFromDomFallback();
			showEmpty(false);
			var name = (row && row.name) || "";
			if (name) setMidTrunc(ov.nameEl, name, 0.7);
			if (row && row.state) {
				ov.statePill.textContent = stateLabel(row.state);
				ov.statePill.setAttribute("data-tone", stateTone(row.state));
			}
		});
	}

	function schedule() {
		clearTimeout(pollTimer);
		pollTimer = setTimeout(function () {
			tick();
			schedule();
		}, POLL_MS);
	}

	function forceOverviewPane() {
		try {
			var gen = document.getElementById("propGeneral");
			if (gen) gen.classList.remove("invisible");
			["propTrackers", "propPeers", "propWebSeeds", "propFiles"].forEach(function (id) {
				var pane = document.getElementById(id);
				if (pane) pane.classList.add("invisible");
			});
		} catch (e) { /* ignore */ }
	}

	function ensure() {
		var host = document.getElementById("propGeneral");
		if (!host) return false;
		forceOverviewPane();
		buildOverview(host);
		tick();
		schedule();
		return true;
	}

	function boot() {
		if (ensure()) return;
		if (bootObserver) return;
		bootObserver = new MutationObserver(function () {
			if (ensure() && bootObserver) {
				bootObserver.disconnect();
				bootObserver = null;
			}
		});
		bootObserver.observe(document.documentElement, { childList: true, subtree: true });
		[300, 800, 1600, 3200, 6000].forEach(function (ms) {
			setTimeout(function () { ensure(); }, ms);
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", boot);
	} else {
		boot();
	}
})(window.kr);
