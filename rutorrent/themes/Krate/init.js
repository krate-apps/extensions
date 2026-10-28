/**
 * @file Krate theme shell (ruTorrent theme plugin closure).
 * @requires plugin, dxSTable, thePlugins, theUILang, theWebUI, RGBackground, injectScript, $
 *
 * Loads CSS/JS, exposes window.kr, applies Dark|Light (or Auto via HarmonyUI
 * cookie / localStorage.theme / prefers-color-scheme). Sync variant logic lives
 * here so the first paint is correct; js/lib/variants.js is the shared copy for
 * feature modules and Node tests.
 */
;(function () {
	/* var: scripts/release.sh rewrites this literal on bump. Also used as ?kr= cache-bust. */
	var KR_VERSION = "1.0.1";
	const VARIANTS = ["dark", "light"];
	const OVERRIDE_KEY = "kr-rutorrent-variant";
	const LIB_MODULES = ["variants", "i18n", "dom", "markdown"];
	const CSS_MODULES = ["base", "topbar", "sidebar", "table", "peers", "details", "chunks", "dialogs", "settings", "settings-plugins", "select", "statusbar", "extras", "about", "icons"];
	const JS_MODULES = ["topbar", "sidebar", "table", "peers", "details", "chunks", "dialogs", "settings", "settings-plugins", "select", "statusbar", "extras", "about", "icons"];
	const root = document.documentElement;
	const variantListeners = [];
	let jsModulesLoaded = false;

	/* ------------------------------------------------------------
	 * Early compatibility shims (must run before third-party plugins
	 * finish init). Silence deprecated resizeTop(w,h); alias the
	 * toggle-details plugin under both hyphen and underscore ids so
	 * waitLoad("…toggle_details_button…") keeps working when the
	 * folder is packaged as toggle-details-button.
	 * ------------------------------------------------------------ */
	(function compatShims() {
		function patchResizeTop() {
			if (!window.theWebUI || typeof theWebUI.resizeTop !== "function") return false;
			if (theWebUI.resizeTop.__krCompat) return true;
			var orig = theWebUI.resizeTop;
			theWebUI.resizeTop = function (w, h) {
				/* Two truthy args → old callers; forward height only so core
				 * does not emit the deprecation noty. */
				if (arguments.length >= 2 && w != null && h != null) return orig.call(theWebUI, null, h);
				return orig.apply(theWebUI, arguments);
			};
			theWebUI.resizeTop.__krCompat = true;
			return true;
		}
		function aliasToggleDetails() {
			if (!window.thePlugins || !thePlugins.list) return false;
			var hy = thePlugins.list["toggle-details-button"];
			var us = thePlugins.list["toggle_details_button"];
			if (hy && !us) thePlugins.list["toggle_details_button"] = hy;
			if (us && !hy) thePlugins.list["toggle-details-button"] = us;
			return !!(hy || us);
		}
		/* Legacy rDirBrowser(dlgId, editId, btnId) → modern (editId). Must
		 * land before autodl-irssi __init2, which still ships the old call. */
		function patchDirBrowser() {
			if (!window.theWebUI || typeof theWebUI.rDirBrowser !== "function") return false;
			if (theWebUI.__krDirBrowserLegacy) return true;
			var Orig = theWebUI.rDirBrowser;
			theWebUI.rDirBrowser = function (edit_id, withFiles, height) {
				try {
					if (typeof withFiles === "string") {
						var legacyEdit = document.getElementById(withFiles);
						if (legacyEdit && /^INPUT|TEXTAREA$/i.test(legacyEdit.tagName)) {
							var legacyBtn = typeof height === "string" ? document.getElementById(height) : null;
							if (legacyBtn && legacyBtn.parentNode) legacyBtn.parentNode.removeChild(legacyBtn);
							edit_id = withFiles;
							withFiles = false;
							height = undefined;
						}
					}
				} catch (e) { /* keep original args */ }
				return new Orig(edit_id, withFiles, height);
			};
			theWebUI.rDirBrowser.prototype = Orig.prototype;
			theWebUI.__krDirBrowserLegacy = true;
			return true;
		}
		var tries = 0;
		function tick() {
			var a = patchResizeTop();
			var b = aliasToggleDetails();
			var c = patchDirBrowser();
			tries++;
			if ((a && b && c) || tries > 200) clearInterval(timer);
		}
		var timer = setInterval(tick, 50);
		tick();
	})();

	function token(name) {
		return getComputedStyle(root).getPropertyValue(name).trim();
	}

	/* Load the per-surface CSS modules moved out of style.css. Array order is
	 * the cascade order (base first, extras last); each resolves to
	 * plugins/theme/themes/Krate/css/<name>.css via plugin.path. A
	 * short holding <style> hides the shell until the last module lands so the
	 * chrome never flashes unstyled; a timer clears it even if a fetch fails. */
	var hold = document.createElement("style");
	hold.id = "kr-hold";
	hold.textContent = "#Layout,#t,#StatusBar,#side-panel{visibility:hidden!important}";
	(document.head || root).appendChild(hold);
	function clearHold() {
		var h = document.getElementById("kr-hold");
		if (h && h.parentNode) h.parentNode.removeChild(h);
	}
	var remaining = CSS_MODULES.length;
	function cssDone() {
		if (--remaining <= 0) clearHold();
	}
	CSS_MODULES.forEach(function (name) {
		injectCSS(plugin.path + "css/" + name + ".css?kr=" + KR_VERSION, cssDone);
	});

	/* ============================================================
	 * String catalog: load lang/<code>.js for the active ruTorrent language,
	 * then gate feature modules (see allDone). English first, then override.
	 * Custom loader (onload/onerror) because injectScript is async with no
	 * error handler. Safety timer so a hung request never blocks the theme. */
	var LANG_SUPPORTED = ["en", "da", "de", "es", "fr", "pt-br", "zh-cn"];
	var LANG_ALIAS = { "pt-pt": "pt-br" };
	var LANG_READY_TIMEOUT = 3000;
	var langReady = false;
	var langReadyCbs = [];
	function onLangReady(fn) {
		if (langReady) { try { fn(); } catch (e) { /* a listener must not break the engine */ } return; }
		langReadyCbs.push(fn);
	}
	function signalLangReady() {
		if (langReady) return;
		langReady = true;
		var cbs = langReadyCbs; langReadyCbs = [];
		for (var i = 0; i < cbs.length; i++) { try { cbs[i](); } catch (e) { /* ditto */ } }
	}
	function activeLang() {
		var code = "";
		try {
			if (typeof GetActiveLanguage === "function") code = String(GetActiveLanguage() || "").toLowerCase();
		} catch (e) { code = ""; }
		if (LANG_ALIAS[code]) code = LANG_ALIAS[code];
		return LANG_SUPPORTED.indexOf(code) !== -1 ? code : "en";
	}
	/* Load one lang/<code>.js and call done() once it has executed OR failed.
	 * ?kr=<version> busts the browser cache when the theme version bumps. */
	function loadLangFile(code, done) {
		var called = false;
		function settle() { if (!called) { called = true; done(); } }
		try {
			var s = document.createElement("script");
			s.type = "text/javascript";
			s.onload = settle;
			s.onerror = settle;
			s.src = plugin.path + "lang/" + code + ".js?kr=" + KR_VERSION;
			(document.head || root).appendChild(s);
		} catch (e) { settle(); }
	}
	/* English base first, the active language on top, then ready. */
	loadLangFile("en", function () {
		var code = activeLang();
		if (code === "en") { signalLangReady(); return; }
		loadLangFile(code, signalLangReady);
	});
	setTimeout(signalLangReady, LANG_READY_TIMEOUT);

	/* Re-key the three sheets the theme plugin loads itself (style.css,
	 * stable.css, plugins.css at the theme root). Each already carries ruTorrent's
	 * ?v= cache-bust; prepend ?kr=<version> and keep the v so a release bumps the
	 * URL. The plugin inserts some of them (notably plugins.css, twice) AFTER this
	 * file runs, so a one-time pass misses them -- hence the <head> observer
	 * below. A second link for an already-keyed sheet is a duplicate the plugin
	 * added twice, so it is dropped rather than keyed a second time. */
	var SELF_SHEETS = ["style.css", "stable.css", "plugins.css"];
	var sheetKeyed = {};
	function sheetOf(href) {
		for (var i = 0; i < SELF_SHEETS.length; i++) {
			if (href.indexOf("themes/Krate/" + SELF_SHEETS[i]) !== -1) return SELF_SHEETS[i];
		}
		return null;
	}
	function rekeyLink(lk) {
		var href = lk.getAttribute("href") || "";
		var sheet = sheetOf(href);
		if (!sheet) return false;
		if (href.indexOf("kr=") !== -1) { sheetKeyed[sheet] = true; return false; }
		if (sheetKeyed[sheet]) { if (lk.parentNode) lk.parentNode.removeChild(lk); return false; }
		var q = href.indexOf("?");
		var base = q === -1 ? href : href.slice(0, q);
		var vm = href.match(/[?&]v=([^&]*)/);
		sheetKeyed[sheet] = true;
		lk.setAttribute("href", base + "?kr=" + KR_VERSION + (vm ? "&v=" + vm[1] : ""));
		return true;
	}
	function allSheetsKeyed() {
		for (var i = 0; i < SELF_SHEETS.length; i++) if (!sheetKeyed[SELF_SHEETS[i]]) return false;
		return true;
	}
	/* Sheets present now: re-key inside the hold, counting each into it so
	 * clearHold waits for the re-fetch and the swap never flashes unstyled
	 * chrome. Iterate the live list backwards so a dropped duplicate is safe. */
	var headLinks = (document.head || root).getElementsByTagName("link");
	for (var li = headLinks.length - 1; li >= 0; li--) {
		var lk = headLinks[li];
		if (rekeyLink(lk)) {
			remaining++;
			lk.onload = cssDone;
			lk.onerror = cssDone;
		}
	}
	/* The theme plugin loads some self-sheets after this file runs -- notably it
	 * calls loadCSS("plugins") twice (once in its config hook, once in allDone),
	 * and the allDone one fires AFTER the three sheets are first keyed. Stopping
	 * the observer on allSheetsKeyed() or a timer therefore missed that second
	 * insertion and left an unkeyed, stale-cacheable duplicate. So the observer
	 * runs for the session: it keys the first link for each self-sheet and drops
	 * every later duplicate (rekeyLink), leaving exactly one keyed link per sheet
	 * on every load. A <link> add from any other plugin is a cheap no-op. */
	if (!allSheetsKeyed() && window.MutationObserver) {
		new MutationObserver(function (muts) {
			for (var mi = 0; mi < muts.length; mi++) {
				var added = muts[mi].addedNodes;
				for (var ai = 0; ai < added.length; ai++) {
					if (added[ai] && added[ai].tagName === "LINK") rekeyLink(added[ai]);
				}
			}
		}).observe(document.head || root, { childList: true });
	}
	setTimeout(clearHold, 2500);

	/* ============================================================
	 * window.kr -- shared helpers for the feature modules.
	 * ============================================================ */
	var TIP_DELAY = 400;
	var tipEl = null, tipTimer = null, tipTarget = null;
	function ensureTip() {
		if (tipEl) return tipEl;
		tipEl = document.createElement("div");
		tipEl.className = "kr-tooltip";
		tipEl.setAttribute("role", "tooltip");
		/* Only geometry + visibility live inline; the visual box (sizing, wrap,
		 * colours) is .kr-tooltip in css/base.css so a long unbroken value wraps
		 * inside the padded body. JS sets left/top/opacity to position + reveal. */
		tipEl.style.cssText = "position:fixed;z-index:99999;pointer-events:none;opacity:0;";
		document.body.appendChild(tipEl);
		return tipEl;
	}
	/* A tip is suppressed while its control -- or the nearest [aria-expanded]
	 * ancestor it lives in -- is open, so a hover hint never sits over the menu
	 * the control just opened. closest() returns the element itself when it
	 * carries the attribute, covering both the control and its ancestor. */
	function tipSuppressed(el) {
		var ex = el && el.closest ? el.closest("[aria-expanded]") : null;
		return !!(ex && ex.getAttribute("aria-expanded") === "true");
	}
	function showTip(el, pointerX) {
		if (tipSuppressed(el)) return;
		var text = el.getAttribute("data-kr-tip");
		if (!text) return;
		var t = ensureTip();
		t.textContent = text;
		t.style.display = "block";
		var r = el.getBoundingClientRect();
		var tw = t.offsetWidth, th = t.offsetHeight;
		var vw = window.innerWidth, vh = window.innerHeight;
		var isCell = /^(TD|TH|TR)$/.test(el.tagName || "");
		var left, top;
		if (el.getAttribute("data-kr-tip-side") === "right") {
			/* Beside the control, flipping to its left when the right edge has no
			 * room; vertically centred and clamped into the viewport. */
			left = r.right + 6;
			if (left + tw > vw - 4) left = r.left - tw - 6;
			left = Math.max(4, left);
			top = Math.max(4, Math.min(r.top + r.height / 2 - th / 2, vh - th - 4));
		} else if (typeof pointerX === "number" && (isCell || r.width > tw * 2)) {
			/* Centring on a wide target (a table cell/row, or anything over twice
			 * the tip width) lands the tip far from the cursor. Anchor it at the
			 * pointer x instead, below the target row, both clamped 8px inside the
			 * viewport. Keyboard focus passes no pointer, keeping element anchoring. */
			left = Math.max(8, Math.min(pointerX - tw / 2, vw - tw - 8));
			top = r.bottom + 6;
			if (top + th > vh - 8) top = r.top - th - 6;
			top = Math.max(8, Math.min(top, vh - th - 8));
		} else {
			left = Math.max(4, Math.min(r.left + r.width / 2 - tw / 2, vw - tw - 4));
			top = r.bottom + 6;
			if (top + th > vh - 4) top = r.top - th - 6;
			top = Math.max(4, top);
		}
		t.style.left = left + "px";
		t.style.top = top + "px";
		t.style.opacity = "1";
	}
	function scheduleTip(el, pointerX) {
		clearTimeout(tipTimer);
		tipTarget = el;
		tipTimer = setTimeout(function () { showTip(el, pointerX); }, TIP_DELAY);
	}
	function hideTip() {
		clearTimeout(tipTimer);
		tipTarget = null;
		if (tipEl) tipEl.style.opacity = "0";
	}

	/* Migrate a native title= into data-kr-tip so the custom tooltip renders
	 * it and the browser popup never fires. aria-label is only added when the
	 * element has no other accessible text, so visible labels are preserved. */
	function migrateTitle(el) {
		if (!el || el.nodeType !== 1 || !el.getAttribute) return;
		var t = el.getAttribute("title");
		if (t == null || t === "") return;
		el.setAttribute("data-kr-tip", t);
		el.removeAttribute("title");
		if (!el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") &&
			!(el.textContent || "").trim()) {
			el.setAttribute("aria-label", t);
		}
	}
	function migrateTree(node) {
		if (!node || node.nodeType !== 1) return;
		migrateTitle(node);
		if (node.querySelectorAll) {
			var withTitle = node.querySelectorAll("[title]");
			for (var i = 0; i < withTitle.length; i++) migrateTitle(withTitle[i]);
		}
	}

	var kr = {
		path: plugin.path,
		version: KR_VERSION,
		/* Return a mask <span> that tints the named SVG glyph with --kr-icon.
		 * Size/color come from inline style so it works without a stylesheet. */
		icon: function (name) {
			var s = document.createElement("span");
			s.className = "kr-icon";
			s.style.cssText =
				"display:inline-block;width:18px;height:18px;flex:none;" +
				"background-color:var(--kr-icon);" +
				"-webkit-mask:center/contain no-repeat;mask:center/contain no-repeat;";
			var u = "url(" + kr.path + "images/icons/" + name + ".svg)";
			s.style.webkitMaskImage = u;
			s.style.maskImage = u;
			return s;
		},
		/* Mark an element for the one shared custom tooltip. Never a native
		 * title= (that bypasses theme styling); the delegated listeners below
		 * drive display, so this just records the text. */
		tooltip: function (el, text, opts) {
			if (!el || !text) return;
			el.removeAttribute("title");
			el.setAttribute("data-kr-tip", text);
			/* { side: "right" } places the tip beside the control (see showTip);
			 * default placement (below) is unchanged. An element can opt in with
			 * data-kr-tip-side="right" in markup without touching this file. */
			if (opts && opts.side === "right") el.setAttribute("data-kr-tip-side", "right");
			if (!el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") &&
				!(el.textContent || "").trim()) {
				el.setAttribute("aria-label", text);
			}
		},
		/* Register a callback fired with (variant, isDark) on every change,
		 * including the initial apply. */
		onVariant: function (fn) {
			if (typeof fn === "function") variantListeners.push(fn);
		},
		/* The one apply path. The Appearance select, the topbar switcher and the
		 * command palette all call this so persistence and paint stay in sync.
		 * "auto" clears the override and follows HarmonyUI / system preference. */
		setVariant: function (v) {
			try {
				if (v === "auto") window.localStorage.removeItem(OVERRIDE_KEY);
				else window.localStorage.setItem(OVERRIDE_KEY, normalizeVariant(v) || v);
			} catch (e) {
				/* storage unavailable: fall back to a session-only apply */
			}
			applyVariant(resolveVariant());
		},
		/* True when a scroll event came from inside a body-level popover panel
		 * (its own option list scrolling), rather than the page or a dialog
		 * scrolling underneath. The custom popovers (select, category "More",
		 * tab-overflow) listen for scroll in the capture phase so they re-place
		 * when the surface behind them moves; without this guard the list's own
		 * scroll re-triggers that placement, which re-measures the panel and
		 * snaps the list back to the top. A page/document scroll has a non-element
		 * target and is never treated as inside, so re-placement still runs. */
		panelScrolledInside: function (e, panel) {
			if (!e || !panel) return false;
			var tgt = e.target;
			if (!tgt || tgt.nodeType !== 1) return false;
			return panel === tgt || (panel.contains && panel.contains(tgt));
		}
	};
	window.kr = kr;

	/* Global title -> custom tooltip: sweep the current tree, watch for new
	 * nodes and new title= attributes, and drive the one tooltip by delegation
	 * (400ms hover delay, keyboard focus shows it, Escape or blur hides it). */
	function closestTip(node) {
		return node && node.closest ? node.closest("[data-kr-tip]") : null;
	}
	migrateTree(document.body || root);
	if (window.MutationObserver) {
		/* Coalesce title migrations; skip deep walks inside the torrent table
		 * body (progress/status refresh spam) — those cells use data-kr-tip or
		 * native titles that rarely need the custom tooltip. */
		var tipPending = false;
		var tipAttrs = [];
		var tipTrees = [];
		function tipInHotTable(node) {
			return !!(node && node.closest && node.closest("#List .stable-body, #FileList .stable-body, #PeerList .stable-body"));
		}
		function flushTips() {
			tipPending = false;
			var i;
			for (i = 0; i < tipAttrs.length; i++) {
				if (tipAttrs[i] && tipAttrs[i].isConnected && !tipInHotTable(tipAttrs[i])) migrateTitle(tipAttrs[i]);
			}
			tipAttrs.length = 0;
			for (i = 0; i < tipTrees.length; i++) {
				if (tipTrees[i] && tipTrees[i].isConnected && !tipInHotTable(tipTrees[i])) migrateTree(tipTrees[i]);
			}
			tipTrees.length = 0;
		}
		function scheduleTips() {
			if (tipPending) return;
			tipPending = true;
			requestAnimationFrame(flushTips);
		}
		new MutationObserver(function (muts) {
			for (var i = 0; i < muts.length; i++) {
				var m = muts[i];
				if (m.type === "attributes") {
					if (!tipInHotTable(m.target)) tipAttrs.push(m.target);
				} else if (m.type === "childList") {
					for (var j = 0; j < m.addedNodes.length; j++) {
						var n = m.addedNodes[j];
						if (n.nodeType === 1 && !tipInHotTable(n)) tipTrees.push(n);
					}
				}
			}
			if (tipAttrs.length || tipTrees.length) scheduleTips();
		}).observe(document.documentElement, {
			subtree: true, childList: true, attributes: true, attributeFilter: ["title"]
		});
	}
	document.addEventListener("mouseover", function (e) {
		var el = closestTip(e.target);
		if (el) scheduleTip(el, e.clientX);
	});
	document.addEventListener("mouseout", function (e) {
		if (closestTip(e.target) === tipTarget && tipTarget) hideTip();
	});
	document.addEventListener("focusin", function (e) {
		var el = closestTip(e.target);
		if (el) showTip(el);
	});
	document.addEventListener("focusout", function (e) {
		if (closestTip(e.target)) hideTip();
	});
	/* Activating a control dismisses its tip: pointerdown and click cover mouse
	 * and touch, the keydown branch covers keyboard activation (Enter/Space). A
	 * control that opens a menu on activation thus loses its hint, and the
	 * aria-expanded guard in showTip keeps it from reappearing while the menu is
	 * open. */
	document.addEventListener("pointerdown", function (e) {
		if (closestTip(e.target)) hideTip();
	});
	document.addEventListener("click", function (e) {
		if (closestTip(e.target)) hideTip();
	});
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape" || e.keyCode === 27) { hideTip(); return; }
		if ((e.key === "Enter" || e.key === " " || e.key === "Spacebar" ||
			e.keyCode === 13 || e.keyCode === 32) && closestTip(e.target)) hideTip();
	});

	/* ============================================================
	 * Variant resolution + apply.
	 * ============================================================ */
	/** @returns {"dark"|"light"|null} */
	function normalizeVariant(v) {
		if (!v) return null;
		v = String(v).toLowerCase();
		if (v === "slate") return "dark";
		return VARIANTS.indexOf(v) !== -1 ? v : null;
	}

	function storedOverride() {
		try {
			const raw = window.localStorage.getItem(OVERRIDE_KEY);
			if (!raw) return "auto";
			const n = normalizeVariant(raw);
			if (!n) return "auto";
			/* Migrate legacy Slate override to Dark. */
			if (String(raw).toLowerCase() === "slate") {
				try { window.localStorage.setItem(OVERRIDE_KEY, "dark"); } catch (e) { /* ignore */ }
			}
			return n;
		} catch (e) {
			return "auto";
		}
	}

	/** Auto: HarmonyUI cookie → localStorage.theme → prefers-color-scheme. */
	function krateTheme() {
		const m = document.cookie.match(/(?:^|;\s*)krate_theme=([^;]*)/);
		if (m) {
			const cookie = decodeURIComponent(m[1]).toLowerCase();
			if (cookie === "light" || cookie === "dark") return cookie;
		}
		try {
			let ls = window.localStorage.getItem("theme");
			if (ls) {
				ls = String(ls).toLowerCase();
				if (ls === "light" || ls === "winter") return "light";
				if (ls === "dark" || ls === "synthwave") return "dark";
			}
		} catch (e) { /* storage unavailable */ }
		try {
			if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
				return "light";
			}
		} catch (e) { /* matchMedia unavailable */ }
		return "dark";
	}

	function resolveVariant() {
		var override = storedOverride();
		return override === "auto" ? krateTheme() : override;
	}

	function isDark(variant) {
		return variant !== "light";
	}

	/* Capacity-meter fill tint by usage: ok below 80%, amber past 80%, danger
	 * past 90%. The fill is painted inline by each bar plugin's setValue, so
	 * the tint is applied there (and re-applied on variant change). */
	var METER_BARS = {
		diskspace: "#meter-disk-value",
		diskapceh: "#qmeter-disk-value",
		quotaspace: "#qmeter-band-value"
	};
	function meterThresholdColor(pct) {
		if (pct > 90) return token("--kr-destructive");
		if (pct > 80) return token("--kr-state-paused");
		return token("--kr-primary");
	}
	function tintMeterBar(sel) {
		var el = sel && document.querySelector(sel);
		if (!el) return;
		var pct = parseFloat(el.style.width) || 0;
		el.style.backgroundColor = meterThresholdColor(pct);
	}

	/* Repaint progress/meter gradients from the active variant tokens.
	 * RGBackground cannot read a var() off a CSS rule, so resolved hex is
	 * passed in. Completion bars use the brand gradient; capacity meters run
	 * ok (primary) -> danger (destructive) and take the usage-threshold tint. */
	function paintMeters() {
		var prgStart = token("--kr-prg-start");
		var prgEnd = token("--kr-prg-end");
		var ok = token("--kr-primary");
		var danger = token("--kr-destructive");
		if (window.theWebUI && theWebUI.tables) {
			for (var key in theWebUI.tables) {
				var obj = theWebUI.tables[key] && theWebUI.tables[key].obj;
				if (obj) {
					obj.prgStartColor = new RGBackground(prgStart);
					obj.prgEndColor = new RGBackground(prgEnd);
				}
			}
		}
		if (window.thePlugins) {
			["diskapceh", "diskspace", "quotaspace", "cpuload"].forEach(function (name) {
				var plg = thePlugins.get(name);
				if (plg && plg.enabled) {
					plg.prgStartColor = new RGBackground(ok);
					plg.prgEndColor = new RGBackground(danger);
				}
			});
			/* Wrap each bar plugin's setValue once so live updates re-tint, and
			 * re-tint the current fill now for the active variant. */
			Object.keys(METER_BARS).forEach(function (name) {
				var plg = thePlugins.get(name);
				var sel = METER_BARS[name];
				if (plg && typeof plg.setValue === "function" && !plg._krTint) {
					plg._krTint = true;
					var orig = plg.setValue;
					plg.setValue = function () {
						var r = orig.apply(this, arguments);
						tintMeterBar(sel);
						return r;
					};
				}
				tintMeterBar(sel);
			});
		}
	}

	function applyVariant(variant) {
		var dark = isDark(variant);
		root.setAttribute("data-kr-variant", variant);
		/* Bootstrap 5 dark mode + native control / scrollbar hints. */
		root.setAttribute("data-bs-theme", dark ? "dark" : "light");
		root.style.colorScheme = dark ? "dark" : "light";
		/* accent-color flips via CSS (`:root { accent-color: var(--kr-primary) }`)
		 * so it never races the stylesheet load. */
		/* ruTorrent theme hint: toggles dark-theme/light-theme now and seeds
		 * the next-load FOUC cover. */
		if (typeof setThemeHint === "function") setThemeHint(dark);
		paintMeters();
		variantListeners.forEach(function (fn) {
			try { fn(variant, dark); } catch (e) { /* a listener must not break the engine */ }
		});
	}

	/* Resolve + set before the rest of the theme paints. */
	applyVariant(resolveVariant());

	/* Auto-follow HarmonyUI / system preference when no explicit override is set. */
	function maybeFollow() {
		if (storedOverride() !== "auto") return;
		var next = krateTheme();
		if (next !== root.getAttribute("data-kr-variant")) applyVariant(next);
	}
	document.addEventListener("visibilitychange", function () {
		if (!document.hidden) maybeFollow();
	});
	window.addEventListener("focus", maybeFollow);

	/* ============================================================
	 * Strings + the Appearance select in Settings.
	 * ============================================================ */
	theUILang.krAppearance = theUILang.krAppearance || "Appearance";
	theUILang.krVariantAuto = theUILang.krVariantAuto || "Auto (HarmonyUI)";
	theUILang.krVariantDark = theUILang.krVariantDark || "Dark";
	theUILang.krVariantLight = theUILang.krVariantLight || "Light";

	var VARIANT_LABELS = {
		auto: "krVariantAuto",
		dark: "krVariantDark",
		light: "krVariantLight"
	};
	var VARIANT_LABEL_FALLBACK = {
		auto: "Auto (HarmonyUI)",
		dark: "Dark",
		light: "Light"
	};

	var themeOnLangLoaded = plugin.onLangLoaded;
	plugin.onLangLoaded = function () {
		if (typeof themeOnLangLoaded === "function") themeOnLangLoaded.call(this);
		if (document.getElementById("kr.variant")) return;
		var current = storedOverride();
		var opts = "";
		["auto", "dark", "light"].forEach(function (val) {
			opts += '<option value="' + val + '"' + (current === val ? " selected" : "") +
				">" + (theUILang[VARIANT_LABELS[val]] || VARIANT_LABEL_FALLBACK[val]) + "</option>";
		});
		$($$("webui.theme")).closest("div").after(
			$("<div>").addClass("col-6 col-md-3").append(
				$("<label>").attr({ for: "kr.variant" }).text(theUILang.krAppearance + ": ")
			),
			$("<div>").addClass("col-6 col-md-3").append(
				$("<select>").attr({ id: "kr.variant" }).html(opts).on("change", function () {
					kr.setVariant(this.value);
				})
			)
		);
	};

	/* The Settings Appearance select may be built (in onLangLoaded) before the
	 * language catalog is ready; if so, relabel its options and caption when the
	 * catalog lands. A no-op when the select does not exist yet (it builds with
	 * the ready values) or when it is already current. */
	function relabelVariantSelect() {
		var sel = document.getElementById("kr.variant");
		if (sel && sel.options) {
			for (var i = 0; i < sel.options.length; i++) {
				var v = sel.options[i].value;
				if (VARIANT_LABELS[v]) sel.options[i].text = theUILang[VARIANT_LABELS[v]] || VARIANT_LABEL_FALLBACK[v];
			}
		}
		var lab = document.querySelector && document.querySelector('label[for="kr.variant"]');
		if (lab) lab.textContent = (theUILang.krAppearance || "Appearance") + ": ";
	}
	onLangReady(relabelVariantSelect);

	/* ============================================================
	 * Table completion bars + capacity meters + JS modules.
	 * ============================================================ */

	/* Torrent/file/peer table completion bars use the variant brand gradient. */
	plugin.KrateTableCreate = dxSTable.prototype.create;
	dxSTable.prototype.create = function (ele, styles, aName) {
		plugin.KrateTableCreate.call(this, ele, styles, aName);
		this.prgStartColor = new RGBackground(token("--kr-prg-start"));
		this.prgEndColor = new RGBackground(token("--kr-prg-end"));
	};

	/**
	 * Load theme scripts with onload/onerror so order is reliable.
	 * ruTorrent injectScript has no completion callback.
	 */
	function loadThemeScript(src, done) {
		let settled = false;
		const settle = () => { if (!settled) { settled = true; done(); } };
		try {
			const s = document.createElement("script");
			s.type = "text/javascript";
			s.onload = settle;
			s.onerror = settle;
			s.src = src;
			(document.head || root).appendChild(s);
		} catch (e) { settle(); }
	}

	function loadScriptSeries(urls, done) {
		let i = 0;
		const next = () => {
			if (i >= urls.length) { done(); return; }
			loadThemeScript(urls[i++], next);
		};
		next();
	}

	/* Capacity meters + lib (series) + feature modules once plugins finish. */
	plugin.KrateAllDone = plugin.allDone;
	plugin.allDone = function () {
		plugin.KrateAllDone.call(this);
		paintMeters();
		if (!jsModulesLoaded) {
			jsModulesLoaded = true;
			onLangReady(function () {
				const libUrls = LIB_MODULES.map(
					(name) => plugin.path + "js/lib/" + name + ".js?kr=" + KR_VERSION
				);
				loadScriptSeries(libUrls, function () {
					JS_MODULES.forEach(function (name) {
						injectScript(plugin.path + "js/" + name + ".js?kr=" + KR_VERSION);
					});
				});
			});
		}
	};
})();
