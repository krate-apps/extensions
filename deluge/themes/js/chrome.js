/**
 * @file Injected Krate chrome: variant select + What's New dialog.
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

	function setMarkCssVar() {
		try {
			document.documentElement.style.setProperty("--kr-mark-url", 'url("' + markUrl() + '")');
			document.documentElement.style.setProperty("--kr-favicon-url", 'url("' + brandUrl() + '")');
		} catch (e) { /* ignore */ }
	}

	/**
	 * Deluge WebUI base under path-prefix proxies (e.g. /trevor/deluge/).
	 * Absolute /icons/... and /themes/... must be rewritten to this base.
	 */
	function webBase() {
		try {
			var b = document.querySelector("base");
			if (b && b.href) {
				var u = new URL(b.href, location.href);
				var p = u.pathname || "/";
				if (p.slice(-1) !== "/") p += "/";
				return p;
			}
		} catch (e) { /* ignore */ }
		var path = location.pathname || "/";
		var m = path.match(/^(.*?\/deluge)(?:\/|$)/i);
		if (m) return m[1] + "/";
		/* Root install or unknown — keep absolute paths as-is. */
		return "/";
	}

	function withWebBase(absPath) {
		if (!absPath || absPath.charAt(0) !== "/") return absPath;
		var base = webBase().replace(/\/$/, "");
		if (!base) return absPath;
		if (absPath.indexOf(base + "/") === 0 || absPath === base) return absPath;
		return base + absPath;
	}

	function rewriteAbsUrl(url) {
		if (!url) return url;
		var m = String(url).match(/^url\(\s*['"]?(\/(?:icons|themes)\/[^'")\s]+)['"]?\s*\)$/i);
		if (m) return "url(" + withWebBase(m[1]) + ")";
		if (url.charAt(0) === "/" && (url.indexOf("/icons/") === 0 || url.indexOf("/themes/") === 0)) {
			return withWebBase(url);
		}
		return url;
	}

	/** Ensure icon background leaves room for the label (Ext often skips x-btn-text-icon). */
	function ensureBtnIconPadding(el) {
		if (!el || !el.style) return;
		var bg = el.style.backgroundImage || "";
		if (!bg || bg === "none" || bg.indexOf("url(") < 0) return;
		/* Icon-only square buttons keep centered glyph. */
		if (el.className && /\bx-btn-icon\b/.test(el.parentNode && el.parentNode.className || "")) return;
		if (!el.style.paddingLeft || parseInt(el.style.paddingLeft, 10) < 18) {
			el.style.paddingLeft = "22px";
		}
		el.style.backgroundRepeat = "no-repeat";
		if (!el.style.backgroundPosition) el.style.backgroundPosition = "3px center";
	}

	/** Rewrite ExtJS /icons and /themes asset URLs under strip_prefix proxies. */
	function fixAssetImgs(root) {
		var scope = root && root.querySelectorAll ? root : document;
		var i;

		if (root && root.tagName === "IMG") {
			var alone = root.getAttribute("src") || "";
			var aloneFixed = rewriteAbsUrl(alone);
			if (aloneFixed !== alone) root.setAttribute("src", aloneFixed);
		}

		var imgs = scope.querySelectorAll
			? scope.querySelectorAll('img[src^="/icons/"], img[src^="/themes/"]')
			: [];
		for (i = 0; i < imgs.length; i++) {
			var src = imgs[i].getAttribute("src") || "";
			var fixed = rewriteAbsUrl(src);
			if (fixed !== src) imgs[i].setAttribute("src", fixed);
		}

		/* Ext.Button icon: sets inline background-image: url(/icons/...). */
		var styled = scope.querySelectorAll
			? scope.querySelectorAll('[style*="/icons/"], [style*="/themes/"]')
			: [];
		for (i = 0; i < styled.length; i++) {
			var el = styled[i];
			var bg = el.style && el.style.backgroundImage;
			if (bg && (bg.indexOf("/icons/") >= 0 || bg.indexOf("/themes/") >= 0)) {
				var next = rewriteAbsUrl(bg);
				if (next !== bg) el.style.backgroundImage = next;
			}
			var attr = el.getAttribute("style") || "";
			if (/url\(\s*['"]?\/(icons|themes)\//i.test(attr)) {
				el.setAttribute(
					"style",
					attr.replace(
						/url\(\s*['"]?(\/(?:icons|themes)\/[^'")\s]+)['"]?\s*\)/gi,
						function (_, p) { return "url(" + withWebBase(p) + ")"; }
					)
				);
			}
			ensureBtnIconPadding(el);
		}

		/*
		 * Legacy silk buttons need left padding for background-image icons.
		 * Preferences / Connection Manager / icon-* use ::before masks — do NOT
		 * add 22px padding or hit boxes telescope into the neighbour button.
		 */
		var iconBtns = scope.querySelectorAll
			? scope.querySelectorAll(
				".x-btn .x-btn-text[class*='icon-'], .x-btn button[class*='icon-']," +
				".x-btn .x-btn-text.x-deluge-preferences, .x-btn .x-btn-text.x-deluge-connection-manager," +
				".x-btn button.x-deluge-preferences, .x-btn button.x-deluge-connection-manager"
			)
			: [];
		for (i = 0; i < iconBtns.length; i++) {
			var ib = iconBtns[i];
			var parentCls = (ib.parentNode && ib.parentNode.className) || "";
			var cls = ib.className || "";
			if (/\bx-btn-icon\b/.test(parentCls)) continue;
			if (
				/\bx-deluge-preferences\b|\bx-deluge-connection-manager\b|\bicon-/.test(cls)
			) {
				ib.style.paddingLeft = "6px";
				ib.style.backgroundImage = "none";
				continue;
			}
			ensureBtnIconPadding(ib);
		}
	}

	/**
	 * Replace Deluge silk PNGs with HarmonyUI mono SVG masks (ruTorrent set).
	 * Uses kr.path so assets come from krate-theme, not vendor /icons/.
	 */
	function injectIconCss() {
		if (document.getElementById("kr-icon-css")) return;
		var iconBase = (kr.path || "") + "images/icons/";
		var q = VERSION ? "?kr=" + VERSION : "";
		var map = {
			"icon-create": "toolbar-create.svg",
			"icon-add": "toolbar-add.svg",
			"icon-remove": "toolbar-remove.svg",
			"icon-pause": "toolbar-pause.svg",
			"icon-resume": "toolbar-start.svg",
			"icon-up": "toolbar-move-up.svg",
			"icon-down": "toolbar-move-down.svg",
			"icon-top": "toolbar-move-up.svg",
			"icon-bottom": "toolbar-move-down.svg",
			"icon-options": "toolbar-settings.svg",
			"icon-help": "toolbar-help.svg",
			"icon-edit-trackers": "header-settings.svg",
			"icon-move": "toolbar-move-up.svg",
			"icon-recheck": "toolbar-start.svg",
			"icon-update-tracker": "toolbar-start.svg",
			"icon-queue": "state-queued.svg",
			"icon-logout": "menu-close.svg",
			"x-deluge-preferences": "toolbar-settings.svg",
			"x-deluge-connection-manager": "statusbar-connections.svg"
		};
		var rules = [
			/* Kill stock PNG / inline gif on any mapped control. */
			".x-btn .x-btn-text[class*='icon-'],.x-btn button[class*='icon-']," +
			".x-btn .x-btn-text.x-deluge-preferences,.x-btn .x-btn-text.x-deluge-connection-manager," +
			".x-btn button.x-deluge-preferences,.x-btn button.x-deluge-connection-manager," +
			".x-menu-item-icon[class*='icon-'],.x-menu-item-icon.x-deluge-preferences{" +
			"background-image:none!important;background-position:center!important;}",
			/* Hide Ext <img> icons when we paint masks instead. */
			".x-btn button > img,.x-btn .x-btn-text > img,.x-menu-item-icon img{display:none!important;}"
		];
		Object.keys(map).forEach(function (cls) {
			var url = "url(\"" + iconBase + map[cls] + q + "\")";
			var textSel =
				".x-btn-text." + cls + ",.x-btn button." + cls +
				",.x-btn ." + cls + ".x-btn-text";
			/* Inline-flex + static ::before — vertical center in Ext table buttons. */
			rules.push(
				textSel + "{" +
				"display:inline-flex!important;align-items:center!important;" +
				"justify-content:flex-start!important;gap:8px!important;" +
				"box-sizing:border-box!important;" +
				"background-image:none!important;padding-left:6px!important;}"
			);
			rules.push(
				textSel + "::before{" +
				"content:\"\";display:block!important;position:static!important;" +
				"flex:0 0 16px;width:16px!important;height:16px!important;" +
				"transform:none!important;top:auto!important;left:auto!important;" +
				"background-color:var(--kr-icon, #a3a3a3);" +
				"-webkit-mask:" + url + " center/contain no-repeat;" +
				"mask:" + url + " center/contain no-repeat;}"
			);
			/* Main app bar: larger glyphs. */
			rules.push(
				"body.kr-deluge .x-toolbar[data-kr-bar=\"1\"] " + textSel + "::before{" +
				"flex-basis:20px;width:20px!important;height:20px!important;}"
			);
			rules.push(
				".x-btn-icon " + textSel + "{" +
				"padding-left:0!important;justify-content:center!important;" +
				"width:20px!important;height:20px!important;gap:0!important;}"
			);
			rules.push(
				".x-btn-icon " + textSel + "::before{margin:0 auto;}"
			);
			rules.push(
				".x-toolbar .x-btn-over " + textSel + "::before," +
				".x-menu-item-active .x-menu-item-icon." + cls + "{" +
				"background-color:var(--kr-icon-hover, var(--kr-primary-text, #38bdf8));}"
			);
			rules.push(
				".x-menu-item-icon." + cls + "{" +
				"background-image:none!important;" +
				"background-color:var(--kr-icon, #a3a3a3)!important;" +
				"-webkit-mask:" + url + " center/16px no-repeat!important;" +
				"mask:" + url + " center/16px no-repeat!important;" +
				"width:16px!important;height:16px!important;}"
			);
		});
		/* App bar chips; dialog toolbars keep natural Ext height but center glyphs. */
		rules.push(
			"body.kr-deluge .x-toolbar[data-kr-bar=\"1\"] .x-btn{" +
			"min-width:42px!important;min-height:42px!important;" +
			"padding:0 8px!important;border-radius:10px!important;" +
			"position:relative!important;overflow:hidden!important;z-index:1;}",
			/* Keep Preferences / Connection Manager hit boxes from overlapping. */
			"body.kr-deluge .x-toolbar[data-kr-bar=\"1\"] #preferences," +
			"body.kr-deluge .x-toolbar[data-kr-bar=\"1\"] #connectionman{" +
			"margin:0 3px!important;isolation:isolate;}",
			"body.kr-deluge .x-toolbar[data-kr-bar=\"1\"] #preferences .x-btn-text," +
			"body.kr-deluge .x-toolbar[data-kr-bar=\"1\"] #preferences button," +
			"body.kr-deluge .x-toolbar[data-kr-bar=\"1\"] #connectionman .x-btn-text," +
			"body.kr-deluge .x-toolbar[data-kr-bar=\"1\"] #connectionman button{" +
			"padding-left:6px!important;background-image:none!important;" +
			"max-width:100%!important;box-sizing:border-box!important;}",
			"body.kr-deluge .x-toolbar .x-btn-mc," +
			"body.kr-deluge .x-toolbar .x-btn-tc," +
			"body.kr-deluge .x-toolbar .x-btn-bc{background:transparent!important;}",
			/* Modal / panel footers: center icon+label in the chip. */
			"body.kr-deluge .x-window .x-toolbar .x-btn," +
			"body.kr-deluge .x-window-bbar .x-btn," +
			"body.kr-deluge .x-panel-bbar .x-btn{" +
			"min-height:32px!important;}",
			"body.kr-deluge .x-window .x-toolbar .x-btn .x-btn-mc," +
			"body.kr-deluge .x-window-bbar .x-btn .x-btn-mc," +
			"body.kr-deluge .x-panel-bbar .x-btn .x-btn-mc{" +
			"display:flex!important;align-items:center!important;justify-content:center!important;}",
			"body.kr-deluge .x-window .x-toolbar .x-btn .x-btn-text," +
			"body.kr-deluge .x-window-bbar .x-btn .x-btn-text," +
			"body.kr-deluge .x-panel-bbar .x-btn .x-btn-text{" +
			"line-height:1!important;}"
		);
		var style = document.createElement("style");
		style.id = "kr-icon-css";
		style.textContent = rules.join("\n");
		document.head.appendChild(style);
	}

	function makeMark(cls) {
		var el = document.createElement("span");
		el.className = cls || "kr-mark";
		el.setAttribute("aria-hidden", "true");
		el.title = "Krate";
		return el;
	}

	function brandUrl() {
		/* Full-color mark (favicon), not a masked glyph that reads as Deluge blue. */
		return kr.path + "images/brand/krate-logo.png" + (VERSION ? "?kr=" + VERSION : "");
	}

	function setFavicon() {
		var href = brandUrl();
		var links = document.querySelectorAll('link[rel*="icon"]');
		if (!links.length) {
			var l = document.createElement("link");
			l.rel = "icon";
			l.type = "image/png";
			l.href = href;
			(document.head || document.documentElement).appendChild(l);
			return;
		}
		for (var i = 0; i < links.length; i++) {
			links[i].href = href;
		}
	}

	function findMainToolbar(brand) {
		if (!brand) return null;
		if (brand.closest) {
			var t = brand.closest(".x-toolbar");
			if (t) return t;
		}
		var p = brand.parentNode;
		while (p && p !== document.body) {
			if (p.classList && p.classList.contains("x-toolbar")) return p;
			p = p.parentNode;
		}
		return null;
	}

	/**
	 * App bar: brand + theme switcher on the left; actions on the right.
	 * Ext uses left/right tables (`->` spacer) — we reflow with CSS + mount #kr-chrome.
	 */
	function placeSwitcherAfterBrand(toolbar, brand) {
		if (!toolbar || !brand) return;
		var brandLeft = 10;
		var gap = 12;
		var w = brand.offsetWidth || 0;
		if (!w) {
			try {
				var r = brand.getBoundingClientRect();
				w = r && r.width ? r.width : 0;
			} catch (e) { w = 0; }
		}
		/* Fallback wide enough for icon + "Deluge" so Clair never overlaps. */
		if (w < 80) w = 100;
		toolbar.style.setProperty("--kr-switcher-left", Math.round(brandLeft + w + gap) + "px");
	}

	function layoutToolbar() {
		var brand = document.getElementById("tbar-deluge-text");
		if (!brand) return null;
		var toolbar = findMainToolbar(brand);
		if (!toolbar) return null;
		toolbar.setAttribute("data-kr-bar", "1");
		brand.setAttribute("data-kr-branded", "1");
		/* Collapse brand's table cell — brand is absolutely pinned left. */
		var cell = brand.parentNode;
		while (cell && cell !== toolbar) {
			if (cell.tagName === "TD") {
				cell.style.setProperty("width", "0", "important");
				cell.style.setProperty("padding", "0", "important");
				cell.style.setProperty("overflow", "visible", "important");
				cell.setAttribute("data-kr-brand-cell", "1");
				break;
			}
			cell = cell.parentNode;
		}
		placeSwitcherAfterBrand(toolbar, brand);
		return toolbar;
	}

	/** Park #kr-chrome in the app bar, just after the brand. */
	function mountChrome(bar) {
		if (!bar) return;
		var toolbar = layoutToolbar();
		if (toolbar) {
			if (bar.parentNode !== toolbar) toolbar.appendChild(bar);
			bar.setAttribute("data-kr-mounted", "toolbar");
			/* Remeasure after mount/fonts so left clears the brand. */
			var brand = document.getElementById("tbar-deluge-text");
			placeSwitcherAfterBrand(toolbar, brand);
			setTimeout(function () {
				placeSwitcherAfterBrand(toolbar, document.getElementById("tbar-deluge-text"));
			}, 50);
			setTimeout(function () {
				placeSwitcherAfterBrand(toolbar, document.getElementById("tbar-deluge-text"));
			}, 300);
			return;
		}
		if (!bar.parentNode) document.body.appendChild(bar);
		bar.removeAttribute("data-kr-mounted");
	}

	/** Restyle stock #tbar-deluge-text with Krate favicon. */
	function brandToolbar() {
		layoutToolbar();
		var btn = document.getElementById("tbar-deluge-text");
		if (!btn) return;
		btn.setAttribute("data-kr-branded", "1");
		var label = btn.querySelector(".x-btn-text") || btn.querySelector("button");
		if (label) {
			label.style.setProperty("color", "", "important");
			label.style.setProperty("opacity", "1", "important");
			label.style.setProperty("background-image", "url(\"" + brandUrl() + "\")", "important");
			label.style.setProperty("background-size", "18px 18px", "important");
			label.style.setProperty("background-position", "4px center", "important");
			label.style.setProperty("background-repeat", "no-repeat", "important");
			label.style.setProperty("padding-left", "28px", "important");
			label.classList.add("kr-brand-label");
		}
	}

	function brandWindowHeaders() {
		var headers = document.querySelectorAll(".x-window-header-text");
		for (var i = 0; i < headers.length; i++) {
			var h = headers[i];
			if (h.querySelector(".kr-win-brand")) continue;
			h.insertBefore(makeMark("kr-win-brand"), h.firstChild);
		}
	}

	/**
	 * Widen cramped Ext dialogs (Preferences, Edit Trackers, Connection Manager).
	 * Mark with data-kr-wide for CSS; also poke Ext setSize when available.
	 */
	function widenWindows() {
		var wins = document.querySelectorAll(".x-window");
		for (var i = 0; i < wins.length; i++) {
			var win = wins[i];
			if (win.getAttribute("data-kr-login") === "1") continue;
			var titleEl = win.querySelector(".x-window-header-text");
			var title = titleEl ? (titleEl.textContent || "").replace(/\s+/g, " ").trim() : "";
			var lower = title.toLowerCase();
			var isPrefs = /preferences|préférences|preferencias|einstellungen|preferências|偏好/.test(lower);
			var isTrackers = /trackers|trackeurs|rastreadores/.test(lower);
			var isConn =
				/connection manager|gestionnaire de connexions|gestor de conexiones|verbindungsmanager|gerenciador de conexões|连接管理/.test(
					lower
				) ||
				(win.className && /x-deluge-connect-window/.test(win.className)) ||
				!!win.querySelector(".x-deluge-connect-window-icon");
			if (!isPrefs && !isTrackers && !isConn) continue;
			var kind = isPrefs ? "prefs" : isTrackers ? "trackers" : "conn";
			win.setAttribute("data-kr-wide", kind);
			try {
				if (window.Ext && Ext.getCmp) {
					/* Prefer Ext sizing so layouts reflow. */
					var id = win.id;
					var cmp = id && Ext.getCmp(id);
					if (cmp && typeof cmp.setSize === "function") {
						if (isPrefs && (!cmp.krKrWide || cmp.getWidth() < 640)) {
							cmp.krKrWide = true;
							cmp.setSize(720, 560);
							if (cmp.center) cmp.center();
							var west = cmp.items && cmp.items.get && cmp.items.get(0);
							if (west && west.setWidth) west.setWidth(200);
						}
						if (isTrackers && (!cmp.krKrWide || cmp.getWidth() < 520)) {
							cmp.krKrWide = true;
							cmp.setSize(560, 360);
							if (cmp.center) cmp.center();
						}
						if (isConn && (!cmp.krKrWide || cmp.getWidth() < 480)) {
							cmp.krKrWide = true;
							cmp.setSize(520, 380);
							if (cmp.center) cmp.center();
						}
					}
				}
				/* Prototype patch so first show is already large. */
				if (isConn && window.Deluge && Deluge.ConnectionManager && !Deluge.ConnectionManager.prototype.krKrWide) {
					Deluge.ConnectionManager.prototype.krKrWide = true;
					Deluge.ConnectionManager.prototype.width = 520;
					Deluge.ConnectionManager.prototype.height = 380;
				}
			} catch (e) { /* ignore */ }
			if (isPrefs) {
				win.style.setProperty("width", "720px", "important");
				/* Border layout west = category list (stock 120px). */
				var panels = win.querySelectorAll(".x-border-layout-ct > .x-panel, .x-border-layout-ct > .x-box-item");
				if (panels && panels[0]) {
					panels[0].style.setProperty("width", "200px", "important");
				}
				var listBodies = win.querySelectorAll(".x-list-body, .x-list-wrap");
				for (var li = 0; li < listBodies.length; li++) {
					listBodies[li].style.setProperty("width", "100%", "important");
				}
			}
			if (isTrackers) {
				win.style.setProperty("width", "560px", "important");
				win.style.setProperty("height", "360px", "important");
			}
			if (isConn) {
				win.style.setProperty("width", "520px", "important");
				win.style.setProperty("height", "380px", "important");
			}
		}
	}

	/* Slightly wider than stock 300×120 — keep Ext sizing; never force height:auto via CSS. */
	var LOGIN_W = 360;
	var LOGIN_H = 180;
	var loginSized = false;
	var loginBusy = false;

	function closestWindow(el) {
		while (el && el !== document.body) {
			if (el.classList && el.classList.contains("x-window")) return el;
			el = el.parentNode;
		}
		return null;
	}

	function findLoginDom() {
		var icon = document.querySelector(".x-deluge-login-window-icon");
		if (icon) {
			var fromIcon = closestWindow(icon);
			if (fromIcon) return fromIcon;
		}
		var field =
			document.getElementById("_password") ||
			document.getElementById("password") ||
			document.querySelector(".x-window input[type='password']");
		if (field) return closestWindow(field);
		var headers = document.querySelectorAll(".x-window-header-text");
		for (var i = 0; i < headers.length; i++) {
			var txt = (headers[i].textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
			if (/login|connexion/.test(txt)) return closestWindow(headers[i]);
		}
		return null;
	}

	function applyLoginDomSize(win) {
		if (!win || loginBusy) return;
		loginBusy = true;
		try {
			win.setAttribute("data-kr-login", "1");
			/* Mark only — do not fight Ext position/size with !important inline styles. */
			loginSized = true;
		} finally {
			loginBusy = false;
		}
	}

	function enlargeExtLogin(cmp) {
		if (!cmp || cmp.krLoginSized) return;
		cmp.krLoginSized = true;
		try {
			cmp.width = LOGIN_W;
			cmp.height = LOGIN_H;
			if (typeof cmp.setSize === "function" && cmp.rendered) {
				cmp.setSize(LOGIN_W, LOGIN_H);
				if (typeof cmp.center === "function") cmp.center();
			}
			if (cmp.el && cmp.el.dom) applyLoginDomSize(cmp.el.dom);
			if (cmp.on) {
				cmp.on("show", function () {
					if (typeof cmp.setSize === "function") cmp.setSize(LOGIN_W, LOGIN_H);
					if (typeof cmp.center === "function") cmp.center();
					if (cmp.el && cmp.el.dom) applyLoginDomSize(cmp.el.dom);
				});
			}
		} catch (e) { /* ignore */ }
	}

	function patchLoginCtor() {
		try {
			if (!window.Ext) return;
			var Ctor =
				(Ext.deluge && Ext.deluge.LoginWindow) ||
				(window.Deluge && Deluge.LoginWindow) ||
				null;
			if (!Ctor || !Ctor.prototype || Ctor.prototype.krKrLoginPatch) return;
			Ctor.prototype.krKrLoginPatch = true;
			Ctor.prototype.width = LOGIN_W;
			Ctor.prototype.height = LOGIN_H;
			var prevShow = Ctor.prototype.show;
			Ctor.prototype.show = function () {
				this.width = LOGIN_W;
				this.height = LOGIN_H;
				var r = prevShow ? prevShow.apply(this, arguments) : undefined;
				enlargeExtLogin(this);
				return r;
			};
		} catch (e) { /* ignore */ }
	}

	/** One-shot / cheap login resize — never observe style attrs (that loops). */
	function fixLoginWindow() {
		if (loginSized && document.querySelector('.x-window[data-kr-login="1"]')) return;
		var win = findLoginDom();
		if (win) applyLoginDomSize(win);
		try {
			if (window.Deluge && Deluge.Login) enlargeExtLogin(Deluge.Login);
			if (window.deluge && deluge.login) enlargeExtLogin(deluge.login);
			patchLoginCtor();
			if (window.Ext && Ext.getCmp) {
				var form = Ext.getCmp("loginForm");
				if (form && form.ownerCt) enlargeExtLogin(form.ownerCt);
			}
		} catch (e) { /* ignore */ }
	}

	function watchLoginWindow() {
		patchLoginCtor();
		fixLoginWindow();
		/* A few delayed retries while Ext boots — no style MutationObserver. */
		[300, 1000, 2500].forEach(function (ms) {
			setTimeout(fixLoginWindow, ms);
		});
	}

	/** Deluge UI language via GetText / toolbar labels (not browser navigator). */
	var LANG_SUPPORTED = ["en", "da", "de", "es", "fr", "pt-br", "zh-cn"];
	var PREF_TO_LANG = {
		Preferences: "en",
		Préférences: "fr",
		Einstellungen: "de",
		Preferencias: "es",
		Indstillinger: "da",
		Preferências: "pt-br",
		"首选项": "zh-cn",
		"偏好设置": "zh-cn"
	};

	function delugeMsg(msgid) {
		try {
			if (typeof _ === "function") return String(_(msgid) || "");
			if (window.GetText && typeof GetText.get === "function") {
				return String(GetText.get(msgid) || "");
			}
		} catch (e) { /* ignore */ }
		return "";
	}

	function detectAppLang() {
		var sample = delugeMsg("Preferences");
		/* Untranslated msgid means GetText is English OR not ready — prefer toolbar. */
		if (!sample || sample === "Preferences") {
			var el = document.getElementById("preferences");
			if (el) {
				var txt = (el.textContent || "").replace(/\s+/g, " ").trim();
				if (txt) sample = txt;
			}
		}
		if (PREF_TO_LANG[sample]) return PREF_TO_LANG[sample];
		var help = delugeMsg("Help");
		if (help === "Aide") return "fr";
		if (help === "Hilfe") return "de";
		if (help === "Ayuda") return "es";
		if (help === "Ajuda") return "pt-br";
		if (help === "Hjælp") return "da";
		if (help === "帮助") return "zh-cn";
		var lower = String(sample || "").toLowerCase();
		if (/pr[eé]f/.test(lower) && /[èé]/.test(sample)) return "fr";
		if (/einstell/.test(lower)) return "de";
		if (/preferenc/.test(lower) && /cias$/.test(lower)) return "es";
		if (/preferên/.test(lower)) return "pt-br";
		if (/indstilling/.test(lower)) return "da";
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
			/* Re-apply English base so a prior locale does not stick. */
			return loadLangScript("en").then(function () {
				refreshVariantSelect();
			});
		}
		return loadLangScript("en").then(function () {
			return loadLangScript(code);
		}).then(function () {
			refreshVariantSelect();
		});
	}

	function patchConnectionManager() {
		try {
			if (window.Deluge && Deluge.ConnectionManager && !Deluge.ConnectionManager.prototype.krKrWideProto) {
				Deluge.ConnectionManager.prototype.krKrWideProto = true;
				Deluge.ConnectionManager.prototype.width = 520;
				Deluge.ConnectionManager.prototype.height = 380;
			}
			var cm = window.deluge && deluge.connectionManager;
			if (cm && !cm.krKrWide) {
				cm.krKrWide = true;
				cm.width = 520;
				cm.height = 380;
				if (typeof cm.setSize === "function" && cm.rendered) {
					cm.setSize(520, 380);
				}
				if (cm.on) {
					cm.on("show", function () {
						if (typeof cm.setSize === "function") cm.setSize(520, 380);
						if (typeof cm.center === "function") cm.center();
						if (cm.el && cm.el.dom) cm.el.dom.setAttribute("data-kr-wide", "conn");
					});
				}
			}
		} catch (e) { /* ignore */ }
	}

	function ensureChrome() {
		try {
			document.documentElement.classList.add("kr-deluge");
			if (document.body) document.body.classList.add("kr-deluge");
		} catch (e) { /* ignore */ }
		setMarkCssVar();
		setFavicon();
		injectIconCss();
		fixAssetImgs(document);
		brandToolbar();
		brandWindowHeaders();
		widenWindows();
		patchConnectionManager();
		watchLoginWindow();
		var bar = document.getElementById("kr-chrome");
		if (!bar) {
			bar = document.createElement("div");
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
		}
		mountChrome(bar);
		syncChromeLanguage();
		/* Toolbar / GetText / ConnectionManager appear after Ext boots. */
		[400, 1200, 2500].forEach(function (ms) {
			setTimeout(function () {
				brandToolbar();
				fixAssetImgs(document);
				mountChrome(document.getElementById("kr-chrome"));
				widenWindows();
				patchConnectionManager();
				syncChromeLanguage();
			}, ms);
		});
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
		ensureChrome();
		applyVariant(storedPreference() || "auto");
		/* ExtJS builds windows/toolbar lazily — re-brand + fix icon paths. */
		if (!window.krBrandObserver && typeof MutationObserver === "function") {
			window.krBrandObserver = new MutationObserver(function (mutations) {
				brandToolbar();
				brandWindowHeaders();
				widenWindows();
				for (var i = 0; i < mutations.length; i++) {
					var m = mutations[i];
					if (m.type === "attributes" && m.target) {
						fixAssetImgs(m.target);
						continue;
					}
					var nodes = m.addedNodes;
					for (var j = 0; j < nodes.length; j++) {
						var node = nodes[j];
						fixAssetImgs(node);
						/* New Ext windows only — never react to style writes. */
						if (node && node.nodeType === 1) {
							if (node.classList && node.classList.contains("x-window")) {
								fixLoginWindow();
								widenWindows();
							} else if (node.querySelector && node.querySelector(".x-window, input[type='password']")) {
								fixLoginWindow();
								widenWindows();
							}
						}
					}
				}
			});
			window.krBrandObserver.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ["src"]
			});
		}
	}

	bootChrome();
	window.addEventListener("focus", function () {
		if ((storedPreference() || "auto") === "auto") applyVariant("auto");
	});
})(window.kr);
