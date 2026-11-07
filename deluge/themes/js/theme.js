/**
 * @file Deluge Krate UI — palette, mono icons, Status overview cards.
 * Design matches ruTorrent Krate (hero + Swarm/Tracker/Storage). Deluge Ext host.
 */
;(function (kr) {
	"use strict";
	if (!kr || window.krDelugeThemeInit) return;
	window.krDelugeThemeInit = true;

	var OVERRIDE_KEY = kr.overrideKey || "kr-deluge-variant";
	var VERSION = kr.version || "";
	var RING_R = 38;
	var RING_C = 2 * Math.PI * RING_R;
	var SPARK_MAX = 30;
	var POLL_MS = 2000;

	var variants = (kr.lib && kr.lib.variants) || {
		normalizeVariant: function (v) { return v === "light" ? "light" : "dark"; },
		resolveAutoTheme: function () { return "dark"; }
	};

	function t(key, fallback) {
		return kr.lib && kr.lib.i18n ? kr.lib.i18n.t(key, fallback) : (fallback || "");
	}

	function iconUrl(name) {
		return (kr.path || "") + "images/icons/" + name + ".svg" + (VERSION ? "?kr=" + VERSION : "");
	}

	function maskUrl(name) {
		return "url(" + iconUrl(name) + ")";
	}

	/* ---------- variant ---------- */
	function storedPreference() {
		try { return localStorage.getItem(OVERRIDE_KEY); } catch (e) { return null; }
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
		return v;
	}
	kr.applyVariant = applyVariant;
	kr.getPreference = function () { return storedPreference() || "auto"; };

	/* ---------- DOM helpers ---------- */
	function el(tag, cls, parent) {
		var e = document.createElement(tag);
		if (cls) e.className = cls;
		if (parent) parent.appendChild(e);
		return e;
	}
	function maskSpan(name) {
		var s = el("span", "kr-icon");
		s.style.webkitMaskImage = maskUrl(name);
		s.style.maskImage = maskUrl(name);
		return s;
	}
	function dash(node) {
		if (!node) return;
		node.textContent = "—";
		node.classList.add("kr-muted");
	}
	function setText(node, text) {
		if (!node) return;
		if (text == null || text === "") { dash(node); return; }
		node.textContent = text;
		node.classList.remove("kr-muted");
	}
	function setMidTrunc(container, full, headRatio) {
		if (!container) return;
		container.textContent = "";
		if (full == null || full === "") { dash(container); return; }
		container.classList.remove("kr-muted");
		var cut = Math.max(0, Math.floor(String(full).length * (headRatio || 0.6)));
		var a = el("span", "kr-mid-a", container);
		a.textContent = String(full).slice(0, cut);
		var b = el("span", "kr-mid-b", container);
		b.textContent = String(full).slice(cut);
		container.title = String(full);
	}

	/* ---------- toolbar: brand + palette + Add + icons ---------- */
	function injectIconCss() {
		if (document.getElementById("kr-icon-css")) return;
		var map = {
			"icon-add": "toolbar-add",
			"icon-create": "toolbar-create",
			"icon-remove": "toolbar-remove",
			"icon-edit": "toolbar-edit",
			"icon-edit-trackers": "toolbar-edit",
			"icon-apply": "menu-check",
			"icon-error": "state-error",
			"icon-pause": "toolbar-pause",
			"icon-resume": "toolbar-start",
			"icon-up": "toolbar-move-up",
			"icon-down": "toolbar-move-down",
			"icon-queue-up": "toolbar-move-up",
			"icon-queue-down": "toolbar-move-down",
			"x-deluge-preferences": "toolbar-settings",
			"x-deluge-connection-manager": "toolbar-settings",
			"x-deluge-edit-trackers": "tab-trackers",
			"x-deluge-connect-window-icon": "statusbar-connections"
		};
		var rules = [];
		Object.keys(map).forEach(function (cls) {
			var u = maskUrl(map[cls]);
			/* Toolbar + window footers / Options buttons — kill broken silk PNGs */
			rules.push(
				"body.kr-deluge ." + cls + "{--kr-ico:" + u + ";background-image:none!important;}",
				"body.kr-deluge .x-btn ." + cls + "{--kr-ico:" + u + ";background-image:none!important;}",
				"body.kr-deluge button." + cls + "{--kr-ico:" + u + ";background-image:none!important;}"
			);
		});
		/* Preferences sidebar page glyphs (order matches PreferencesWindow pages) */
		var prefsIcons = [
			"tab-filemanager", "statusbar-connections", "state-encrypted",
			"statusbar-upload", "palette-switch", "toolbar-settings",
			"header-settings", "state-queued", "statusbar-port",
			"tab-files", "tab-plugins"
		];
		prefsIcons.forEach(function (name, i) {
			var n = i + 1;
			var u = maskUrl(name);
			rules.push(
				"body.kr-deluge .x-window .x-list-body .x-list-item:nth-child(" + n + ")::before{",
				"content:\"\";display:inline-block;width:16px;height:16px;margin-right:10px;",
				"vertical-align:-3px;background-color:currentColor;",
				"-webkit-mask:" + u + " center/contain no-repeat;",
				"mask:" + u + " center/contain no-repeat;}"
			);
		});
		var s = document.createElement("style");
		s.id = "kr-icon-css";
		s.textContent = rules.join("\n");
		document.head.appendChild(s);
	}

	function markIconButtons() {
		var sel = [
			".icon-add", ".icon-create", ".icon-remove", ".icon-edit", ".icon-edit-trackers",
			".icon-apply", ".icon-error",
			".icon-pause", ".icon-resume", ".icon-up", ".icon-down",
			".icon-queue-up", ".icon-queue-down",
			".x-deluge-preferences", ".x-deluge-connection-manager",
			".x-deluge-edit-trackers"
		].join(",");
		var nodes = document.querySelectorAll(sel);
		for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("kr-ico-mask");
		/* Map by label when iconCls missing / wrong (Edit Trackers uses icon-edit-trackers) */
		var byLabel = {
			add: "icon-add",
			edit: "icon-edit",
			remove: "icon-remove",
			up: "icon-up",
			down: "icon-down",
			"edit trackers": "x-deluge-edit-trackers",
			apply: "icon-apply"
		};
		var labels = document.querySelectorAll(
			".x-window .x-btn-text, .x-window button.x-btn-text, .x-deluge-options .x-btn-text, .x-deluge-options button"
		);
		for (var j = 0; j < labels.length; j++) {
			var el = labels[j];
			var key = (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
			var cls = byLabel[key];
			if (!cls) continue;
			el.classList.add("kr-ico-mask", cls);
			var imgs = el.querySelectorAll("img");
			for (var k = 0; k < imgs.length; k++) imgs[k].style.display = "none";
		}
		/* Options tab: make Edit Trackers / Apply look like real buttons */
		["edit_trackers", "apply"].forEach(function (id) {
			var host = document.getElementById(id);
			if (!host) return;
			host.classList.add("kr-opts-action");
			if (id === "apply") host.classList.add("kr-btn-primary");
			var t = host.querySelector(".x-btn-text") || host.querySelector("button");
			if (!t) return;
			if (id === "edit_trackers") t.classList.add("kr-ico-mask", "x-deluge-edit-trackers");
			if (id === "apply") t.classList.add("kr-ico-mask", "icon-apply");
		});
	}

	function styleAddButton() {
		var btn = document.getElementById("add");
		if (!btn) return;
		btn.classList.add("kr-add-primary");
		var label = btn.querySelector(".x-btn-text") || btn.querySelector("button");
		if (label) label.classList.add("kr-ico-mask", "icon-add");
	}

	function brandUrl() {
		return (kr.path || "") + "images/brand/krate-logo.png" + (VERSION ? "?kr=" + VERSION : "");
	}

	/** Restyle stock #tbar-deluge-text — one brand row (Krate mark + "Deluge"). */
	function brandToolbar() {
		var btn = document.getElementById("tbar-deluge-text");
		if (!btn) return null;
		btn.setAttribute("data-kr-branded", "1");
		btn.classList.add("kr-brand-host");
		var label = btn.querySelector(".x-btn-text") || btn.querySelector("button") || btn;
		label.classList.add("kr-brand-label");
		try {
			document.documentElement.style.setProperty("--kr-logo-url", 'url("' + brandUrl() + '")');
		} catch (e) { /* ignore */ }
		return btn;
	}

	function toolbarCell(node) {
		var p = node;
		while (p && p !== document.body) {
			if (p.tagName === "TD") return p;
			p = p.parentNode;
		}
		return null;
	}

	/**
	 * Palette only. Menu is teleported to document.body with position:fixed —
	 * Ext toolbar / border layouts clip overflow:hidden absolute menus.
	 */
	function buildPalette() {
		var bar = document.getElementById("kr-chrome");
		if (bar && bar.getAttribute("data-kr-palette") === "fixed") return bar;
		if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
		var oldMenu = document.getElementById("kr-palette-menu");
		if (oldMenu && oldMenu.parentNode) oldMenu.parentNode.removeChild(oldMenu);

		bar = el("div");
		bar.id = "kr-chrome";
		bar.setAttribute("data-kr-palette", "fixed");

		var pal = el("div", "kr-palette", bar);
		var pbtn = el("button", "kr-palette-btn", pal);
		pbtn.type = "button";
		pbtn.title = t("krAppearance", "Appearance");
		pbtn.setAttribute("aria-label", t("krAppearance", "Appearance"));
		pbtn.setAttribute("aria-haspopup", "menu");
		pbtn.setAttribute("aria-expanded", "false");
		el("span", "kr-palette-glyph", pbtn);

		var menu = el("div", "kr-palette-menu");
		menu.id = "kr-palette-menu";
		menu.hidden = true;
		menu.setAttribute("role", "menu");
		document.body.appendChild(menu);

		[
			["auto", "krVariantAuto", "Auto"],
			["dark", "krVariantDark", "Dark"],
			["light", "krVariantLight", "Light"]
		].forEach(function (o) {
			var it = el("button", "kr-palette-item", menu);
			it.type = "button";
			it.setAttribute("data-variant", o[0]);
			it.setAttribute("role", "menuitemradio");
			el("span", null, it).textContent = t(o[1], o[2]);
			el("span", "kr-palette-check", it);
			it.addEventListener("click", function (e) {
				e.preventDefault();
				e.stopPropagation();
				setPreference(o[0]);
				applyVariant(o[0]);
				markActive();
				closeMenu();
			});
		});

		function markActive() {
			var cur = storedPreference() || "auto";
			menu.querySelectorAll(".kr-palette-item").forEach(function (it) {
				var on = it.getAttribute("data-variant") === cur;
				it.classList.toggle("active", on);
				it.setAttribute("aria-checked", on ? "true" : "false");
			});
		}
		function placeMenu() {
			var r = pbtn.getBoundingClientRect();
			menu.style.position = "fixed";
			menu.style.top = Math.round(r.bottom + 6) + "px";
			menu.style.left = Math.round(r.left) + "px";
			menu.style.right = "auto";
			menu.style.zIndex = "100000";
			/* Keep on-screen if near the right edge */
			requestAnimationFrame(function () {
				var mr = menu.getBoundingClientRect();
				if (mr.right > window.innerWidth - 8) {
					menu.style.left = Math.max(8, Math.round(window.innerWidth - mr.width - 8)) + "px";
				}
			});
		}
		function onDoc(e) {
			if (pal.contains(e.target) || menu.contains(e.target)) return;
			closeMenu();
		}
		function onEsc(e) { if (e.key === "Escape") closeMenu(); }
		function onScroll() { if (!menu.hidden) placeMenu(); }
		function openMenu() {
			markActive();
			menu.hidden = false;
			pbtn.classList.add("open");
			pbtn.setAttribute("aria-expanded", "true");
			placeMenu();
			document.addEventListener("mousedown", onDoc, true);
			document.addEventListener("keydown", onEsc, true);
			window.addEventListener("resize", placeMenu, true);
			window.addEventListener("scroll", onScroll, true);
		}
		function closeMenu() {
			menu.hidden = true;
			pbtn.classList.remove("open");
			pbtn.setAttribute("aria-expanded", "false");
			document.removeEventListener("mousedown", onDoc, true);
			document.removeEventListener("keydown", onEsc, true);
			window.removeEventListener("resize", placeMenu, true);
			window.removeEventListener("scroll", onScroll, true);
		}
		pbtn.addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();
			menu.hidden ? openMenu() : closeMenu();
		});
		markActive();
		return bar;
	}

	/** Park palette in its own toolbar cell, immediately after the brand. */
	function mountChrome() {
		try {
			document.documentElement.classList.add("kr-deluge");
			if (document.body) document.body.classList.add("kr-deluge");
		} catch (e) { /* ignore */ }
		injectIconCss();
		markIconButtons();
		styleAddButton();
		var brand = brandToolbar();
		var bar = buildPalette();
		if (!brand) {
			var tb = document.getElementById("deluge-toolbar");
			if (tb && bar.parentNode !== tb) tb.appendChild(bar);
			return;
		}
		var brandCell = toolbarCell(brand);
		if (!brandCell || !brandCell.parentNode) {
			if (brand.parentNode && bar.parentNode !== brand.parentNode) {
				brand.parentNode.insertBefore(bar, brand.nextSibling);
			}
			return;
		}
		var palCell = bar.parentNode && bar.parentNode.tagName === "TD" ? bar.parentNode : null;
		if (!palCell) {
			palCell = document.createElement("td");
			palCell.className = "x-toolbar-cell";
			palCell.setAttribute("data-kr-palette-cell", "1");
			palCell.appendChild(bar);
		} else if (bar.parentNode !== palCell) {
			palCell.appendChild(bar);
		}
		if (palCell.parentNode !== brandCell.parentNode || palCell.previousSibling !== brandCell) {
			if (brandCell.nextSibling) brandCell.parentNode.insertBefore(palCell, brandCell.nextSibling);
			else brandCell.parentNode.appendChild(palCell);
		}
	}

	/* ---------- Status overview ---------- */
	var ov = null;
	var lastId = null;
	var sparkDown = [];
	var sparkUp = [];
	var pollTimer = null;

	function copyButton(getValue) {
		var btn = el("button", "kr-copy-btn kr-icon-btn");
		btn.type = "button";
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
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(v).then(flash, function () {});
			}
		});
		return btn;
	}

	function buildRing(parent) {
		var ns = "http://www.w3.org/2000/svg";
		var svg = document.createElementNS(ns, "svg");
		svg.setAttribute("class", "kr-ring");
		svg.setAttribute("viewBox", "0 0 96 96");
		svg.setAttribute("width", "88");
		svg.setAttribute("height", "88");
		var defs = document.createElementNS(ns, "defs");
		var grad = document.createElementNS(ns, "linearGradient");
		grad.setAttribute("id", "kr-ring-grad");
		grad.setAttribute("x1", "0%"); grad.setAttribute("y1", "0%");
		grad.setAttribute("x2", "100%"); grad.setAttribute("y2", "100%");
		var s1 = document.createElementNS(ns, "stop");
		s1.setAttribute("class", "kr-ring-s1"); s1.setAttribute("offset", "0%");
		var s2 = document.createElementNS(ns, "stop");
		s2.setAttribute("class", "kr-ring-s2"); s2.setAttribute("offset", "100%");
		grad.appendChild(s1); grad.appendChild(s2); defs.appendChild(grad); svg.appendChild(defs);
		var track = document.createElementNS(ns, "circle");
		track.setAttribute("class", "kr-ring-track");
		track.setAttribute("cx", "48"); track.setAttribute("cy", "48"); track.setAttribute("r", String(RING_R));
		svg.appendChild(track);
		var arc = document.createElementNS(ns, "circle");
		arc.setAttribute("class", "kr-ring-arc");
		arc.setAttribute("cx", "48"); arc.setAttribute("cy", "48"); arc.setAttribute("r", String(RING_R));
		arc.setAttribute("stroke-dasharray", String(RING_C));
		arc.setAttribute("stroke-dashoffset", String(RING_C));
		arc.setAttribute("transform", "rotate(-90 48 48)");
		svg.appendChild(arc);
		var label = document.createElementNS(ns, "text");
		label.setAttribute("class", "kr-ring-label");
		label.setAttribute("x", "48"); label.setAttribute("y", "52");
		label.setAttribute("text-anchor", "middle");
		label.textContent = "0%";
		svg.appendChild(label);
		parent.appendChild(svg);
		return { arc: arc, label: label };
	}

	function sparkPoints(buf, w, h) {
		if (!buf.length) return { line: "", area: "" };
		var max = 1;
		for (var i = 0; i < buf.length; i++) if (buf[i] > max) max = buf[i];
		var step = w / Math.max(buf.length - 1, 1);
		var line = [];
		var area = ["0," + h];
		for (var j = 0; j < buf.length; j++) {
			var x = j * step;
			var y = h - (buf[j] / max) * (h - 2);
			line.push(x + "," + y);
			area.push(x + "," + y);
		}
		area.push(w + "," + h);
		return { line: line.join(" "), area: area.join(" ") };
	}

	function buildSpark(cell, dirClass, iconName, labelText) {
		var row = el("div", "kr-spd " + dirClass, cell);
		row.appendChild(maskSpan(iconName)).classList.add("kr-spd-icon");
		var text = el("div", "kr-spd-text", row);
		var num = el("div", "kr-spd-num", text);
		el("div", "kr-spd-lab", text).textContent = labelText;
		var ns = "http://www.w3.org/2000/svg";
		var svg = document.createElementNS(ns, "svg");
		svg.setAttribute("class", "kr-spark");
		svg.setAttribute("viewBox", "0 0 80 26");
		svg.setAttribute("preserveAspectRatio", "none");
		var area = document.createElementNS(ns, "polygon");
		area.setAttribute("class", "kr-spark-area");
		var line = document.createElementNS(ns, "polyline");
		line.setAttribute("class", "kr-spark-line");
		svg.appendChild(area); svg.appendChild(line);
		row.appendChild(svg);
		return { num: num, line: line, area: area };
	}

	function buildCard(parent, iconName, title) {
		var card = el("div", "kr-card", parent);
		var head = el("div", "kr-card-head", card);
		head.appendChild(maskSpan(iconName)).classList.add("kr-card-icon");
		el("div", "kr-card-title", head).textContent = title;
		return el("div", "kr-card-body", card);
	}

	function metaRow(parent, label) {
		var row = el("div", "kr-meta", parent);
		el("div", "kr-meta-label", row).textContent = label;
		var val = el("div", "kr-meta-value", row);
		return val;
	}

	function miniStat(parent, label) {
		var box = el("div", "kr-ministat", parent);
		el("div", "kr-ministat-label", box).textContent = label;
		return el("div", "kr-ministat-value", box);
	}

	function friendlyUnit(bytes, isSpeed) {
		bytes = Number(bytes) || 0;
		var u = ["B", "KiB", "MiB", "GiB", "TiB"];
		var i = 0;
		while (bytes >= 1024 && i < u.length - 1) { bytes /= 1024; i++; }
		var n = bytes < 10 && i > 0 ? bytes.toFixed(1) : Math.round(bytes);
		return n + " " + u[i] + (isSpeed ? "/s" : "");
	}

	function friendlyDuration(sec) {
		sec = Math.max(0, Math.floor(Number(sec) || 0));
		if (!isFinite(sec) || sec > 8640000) return "∞";
		var d = Math.floor(sec / 86400);
		var h = Math.floor((sec % 86400) / 3600);
		var m = Math.floor((sec % 3600) / 60);
		var s = sec % 60;
		if (d) return d + "d " + h + "h";
		if (h) return h + "h " + m + "m";
		if (m) return m + "m " + s + "s";
		return s + "s";
	}

	function stateTone(state) {
		state = String(state || "").toLowerCase();
		if (/downloading|allocating/.test(state)) return "downloading";
		if (/seeding/.test(state)) return "seeding";
		if (/paused|checking|queued/.test(state)) return "paused";
		if (/error/.test(state)) return "error";
		return "stopped";
	}

	function panelBody(cmp) {
		if (!cmp) return null;
		if (cmp.body && cmp.body.dom) return cmp.body.dom;
		if (cmp.el && cmp.el.dom) {
			var b = cmp.el.dom.querySelector(".x-panel-body");
			if (b) return b;
		}
		return null;
	}

	/** StatusTab body (first torrentDetails tab) — never the inner #deluge-details-status updater. */
	function statusTab() {
		try {
			if (!window.Ext || typeof Ext.getCmp !== "function") return null;
			var details = Ext.getCmp("torrentDetails");
			if (!details || !details.items) return null;
			if (typeof details.items.get === "function") return details.items.get(0) || null;
			if (details.getComponent) return details.getComponent(0) || null;
		} catch (e) { /* ignore */ }
		return null;
	}

	function findHost() {
		var body = panelBody(statusTab());
		if (body) return body;
		/* Last resort: climb from stock markup to the Status panel body. */
		var stock = document.getElementById("deluge-details-status");
		if (!stock) return null;
		var p = stock.parentNode;
		while (p && p !== document.body) {
			if (p.classList && p.classList.contains("x-panel-body")) return p;
			p = p.parentNode;
		}
		return stock.parentNode;
	}

	function hideStock(host) {
		if (!host) return;
		var kids = host.children;
		for (var i = 0; i < kids.length; i++) {
			if (kids[i].classList && kids[i].classList.contains("kr-ov")) continue;
			kids[i].style.setProperty("display", "none", "important");
			kids[i].setAttribute("data-kr-stock-hidden", "1");
		}
		var kill = host.querySelectorAll(
			".x-deluge-status-progressbar, .x-progress-wrap, #deluge-details-status, .x-deluge-status"
		);
		for (var j = 0; j < kill.length; j++) {
			kill[j].style.setProperty("display", "none", "important");
		}
	}

	function buildOverview(host) {
		if (!host) return;
		if (host.getAttribute("data-kr-built") === "1") {
			if (ov && ov.root && host.contains(ov.root)) { hideStock(host); return; }
			ov = null;
			host.removeAttribute("data-kr-built");
			var stale = host.querySelector(".kr-ov");
			if (stale && stale.parentNode) stale.parentNode.removeChild(stale);
		}
		host.classList.add("kr-prop-overview", "x-deluge-status-host");
		host.setAttribute("data-kr-built", "1");
		hideStock(host);

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
		var metaLine = el("div", "kr-ov-metaline", ovInfo);
		var statePill = el("div", "kr-state-pill", ovInfo);

		var speedCell = el("div", "kr-hero-cell kr-hero-speed", hero);
		var spDown = buildSpark(speedCell, "kr-dir-down", "statusbar-download", t("kr_det_download", "Download"));
		var spUp = buildSpark(speedCell, "kr-dir-up", "statusbar-upload", t("kr_det_upload", "Upload"));

		var ratioCell = el("div", "kr-hero-cell kr-hero-ratio", hero);
		el("div", "kr-hero-label", ratioCell).textContent = t("kr_det_ratio", "Ratio");
		var rVal = el("div", "kr-ratio-value", ratioCell);
		var rTrack = el("div", "kr-ratio-track", ratioCell);
		var rFill = el("div", "kr-ratio-fill", rTrack);
		el("div", "kr-ratio-tick", rTrack);
		var rSub = el("div", "kr-hero-sub", ratioCell);

		var timeCell = el("div", "kr-hero-cell kr-hero-time", hero);
		var tStats = el("div", "kr-ministats", timeCell);
		var tEta = miniStat(tStats, t("kr_det_eta", "ETA"));
		var tEl = miniStat(tStats, t("kr_det_elapsed", "Elapsed"));
		var tSeed = miniStat(tStats, t("kr_det_seeding", "Seeding"));

		var cards = el("div", "kr-ov-cards", body);
		var swarm = buildCard(cards, "tab-peers", t("kr_det_swarm", "Swarm"));
		var seedRow = el("div", "kr-swarm-row", swarm);
		el("div", "kr-swarm-key", seedRow).textContent = t("kr_det_seeds", "Seeds");
		var seedVal = el("div", "kr-swarm-val", seedRow);
		var seedBar = el("div", "kr-swarm-bar", swarm);
		var seedFill = el("div", "kr-swarm-fill kr-dir-up", seedBar);
		var peerRow = el("div", "kr-swarm-row", swarm);
		el("div", "kr-swarm-key", peerRow).textContent = t("kr_det_peers", "Peers");
		var peerVal = el("div", "kr-swarm-val", peerRow);
		var peerBar = el("div", "kr-swarm-bar", swarm);
		var peerFill = el("div", "kr-swarm-fill kr-dir-down", peerBar);

		var tracker = buildCard(cards, "tab-trackers", t("kr_det_tracker", "Tracker"));
		var trkStatus = metaRow(tracker, t("kr_det_status", "Status"));
		var trkHost = metaRow(tracker, t("kr_det_url", "Tracker"));

		var storage = buildCard(cards, "tab-filemanager", t("kr_det_storage", "Storage"));
		var pathRow = el("div", "kr-meta kr-meta-wide", storage);
		el("div", "kr-meta-label", pathRow).textContent = t("kr_det_save_path", "Save path");
		var pathWrap = el("div", "kr-meta-value kr-trunc-wrap", pathRow);
		var pathVal = el("div", "kr-trunc", pathWrap);
		var pathStore = { v: "" };
		pathWrap.appendChild(copyButton(function () { return pathStore.v; }));
		var hashRow = el("div", "kr-meta kr-meta-wide", storage);
		el("div", "kr-meta-label", hashRow).textContent = t("kr_det_hash", "Hash");
		var hashWrap = el("div", "kr-meta-value kr-trunc-wrap", hashRow);
		var hashVal = el("div", "kr-trunc kr-mono", hashWrap);
		var hashStore = { v: "" };
		hashWrap.appendChild(copyButton(function () { return hashStore.v; }));
		var piecesMeta = metaRow(storage, t("kr_det_pieces", "Pieces"));
		var cmtRow = el("div", "kr-meta kr-meta-wide", storage);
		el("div", "kr-meta-label", cmtRow).textContent = t("kr_det_comment", "Comment");
		var cmtVal = el("div", "kr-meta-value kr-comment", cmtRow);

		ov = {
			root: root, empty: empty, body: body,
			ringArc: ring.arc, ringLabel: ring.label, statePill: statePill,
			nameEl: nameEl, metaLine: metaLine,
			spDown: spDown, spUp: spUp,
			rVal: rVal, rFill: rFill, rSub: rSub,
			tEta: tEta, tEl: tEl, tSeed: tSeed,
			seedVal: seedVal, seedFill: seedFill,
			peerVal: peerVal, peerFill: peerFill,
			trkStatus: trkStatus, trkHost: trkHost,
			pathVal: pathVal, pathStore: pathStore,
			hashVal: hashVal, hashStore: hashStore,
			piecesMeta: piecesMeta, cmtVal: cmtVal
		};
	}

	function showEmpty(on) {
		if (!ov) return;
		ov.empty.hidden = !on;
		ov.body.hidden = on;
	}

	function setRing(pct) {
		pct = Math.max(0, Math.min(100, Number(pct) || 0));
		ov.ringArc.setAttribute("stroke-dashoffset", String(RING_C * (1 - pct / 100)));
		ov.ringLabel.textContent = Math.round(pct) + "%";
	}

	function applySpark(buf, line, area, sample) {
		buf.push(Math.max(0, Number(sample) || 0));
		while (buf.length > SPARK_MAX) buf.shift();
		var pts = sparkPoints(buf, 80, 26);
		line.setAttribute("points", pts.line);
		area.setAttribute("points", pts.area);
	}

	function selectedId() {
		try {
			if (window.deluge && deluge.torrents && typeof deluge.torrents.getSelected === "function") {
				var sel = deluge.torrents.getSelected();
				if (!sel) return null;
				if (typeof sel === "string") return sel;
				if (sel.id != null) return sel.id;
				if (sel.data && sel.data.id != null) return sel.data.id;
				if (typeof sel.get === "function") return sel.get("id") || sel.get("torrent_id");
			}
		} catch (e) { /* ignore */ }
		return null;
	}

	function render(status) {
		if (!ov || !status) { showEmpty(true); return; }
		showEmpty(false);
		var prog = Number(status.progress);
		if (!isFinite(prog)) prog = 0;
		if (prog <= 1) prog *= 100;
		setRing(prog);
		setMidTrunc(ov.nameEl, status.name || "", 0.55);
		setText(ov.metaLine, friendlyUnit(status.total_done) + " / " + friendlyUnit(status.total_size));
		var tone = stateTone(status.state);
		ov.statePill.setAttribute("data-tone", tone);
		setText(ov.statePill, status.state || "");

		var dl = Number(status.download_payload_rate) || 0;
		var ul = Number(status.upload_payload_rate) || 0;
		setText(ov.spDown.num, friendlyUnit(dl, true));
		setText(ov.spUp.num, friendlyUnit(ul, true));
		applySpark(sparkDown, ov.spDown.line, ov.spDown.area, dl);
		applySpark(sparkUp, ov.spUp.line, ov.spUp.area, ul);

		var ratio = Number(status.ratio);
		if (!isFinite(ratio)) ratio = 0;
		setText(ov.rVal, ratio.toFixed(3));
		ov.rFill.style.setProperty("--kr-p", String(Math.min(1, ratio / 1)));
		ov.rFill.setAttribute("data-met", ratio >= 1 ? "1" : "0");
		ov.rVal.setAttribute("data-met", ratio >= 1 ? "1" : "0");
		setText(ov.rSub, t("kr_det_updown", "{up} up / {down} down")
			.replace("{up}", friendlyUnit(status.total_uploaded))
			.replace("{down}", friendlyUnit(status.total_done)));

		setText(ov.tEta, friendlyDuration(status.eta));
		setText(ov.tEl, friendlyDuration(status.active_time));
		setText(ov.tSeed, friendlyDuration(status.seeding_time));

		var seeds = (status.num_seeds || 0) + " (" + (status.total_seeds || 0) + ")";
		var peers = (status.num_peers || 0) + " (" + (status.total_peers || 0) + ")";
		setText(ov.seedVal, seeds);
		setText(ov.peerVal, peers);
		var ts = Math.max(1, Number(status.total_seeds) || 1);
		var tp = Math.max(1, Number(status.total_peers) || 1);
		ov.seedFill.style.setProperty("--kr-p", String(Math.min(1, (status.num_seeds || 0) / ts)));
		ov.peerFill.style.setProperty("--kr-p", String(Math.min(1, (status.num_peers || 0) / tp)));

		setText(ov.trkStatus, status.tracker_status || "");
		setText(ov.trkHost, status.tracker_host || status.tracker || "");

		ov.pathStore.v = status.save_path || "";
		setMidTrunc(ov.pathVal, ov.pathStore.v, 0.45);
		ov.hashStore.v = status.hash || status.torrent_id || "";
		setMidTrunc(ov.hashVal, ov.hashStore.v, 0.4);
		var pieces = (status.num_pieces || "—") + " × " + friendlyUnit(status.piece_length);
		setText(ov.piecesMeta, pieces);
		setText(ov.cmtVal, status.comment || t("kr_det_no_comment", "No comment"));
	}

	var STATUS_KEYS = [
		"name", "state", "progress", "download_payload_rate", "upload_payload_rate",
		"eta", "ratio", "total_done", "total_size", "total_uploaded",
		"num_seeds", "num_peers", "total_seeds", "total_peers",
		"tracker_status", "tracker_host", "tracker", "save_path", "hash",
		"comment", "active_time", "seeding_time", "num_pieces", "piece_length"
	];

	function fetchStatus(id) {
		if (!id || !window.deluge || !deluge.client || !deluge.client.web ||
			typeof deluge.client.web.get_torrent_status !== "function") {
			showEmpty(true);
			return;
		}
		deluge.client.web.get_torrent_status(id, STATUS_KEYS, {
			success: function (status) { render(status || {}); },
			failure: function () { showEmpty(true); }
		});
	}

	function tick() {
		var host = findHost();
		if (host) buildOverview(host);
		var id = selectedId();
		if (!id) {
			if (lastId) { lastId = null; sparkDown = []; sparkUp = []; }
			showEmpty(true);
			return;
		}
		if (id !== lastId) {
			lastId = id;
			sparkDown = [];
			sparkUp = [];
		}
		fetchStatus(id);
	}

	function ensureOverview() {
		var host = findHost();
		if (host) buildOverview(host);
		tick();
	}

	var hookedDetails = false;
	function hookDelugeEvents() {
		if (hookedDetails) return;
		try {
			var details = window.Ext && Ext.getCmp && Ext.getCmp("torrentDetails");
			if (!details) return;
			hookedDetails = true;
			details.on("tabchange", function () { setTimeout(ensureOverview, 50); });
			if (window.deluge && deluge.torrents && deluge.torrents.on) {
				deluge.torrents.on("rowclick", function () { setTimeout(ensureOverview, 50); });
			}
			/* Ext Status updater rewrites stock HTML — remount if our root vanishes. */
			if (typeof MutationObserver === "function") {
				var host = findHost();
				if (host) {
					new MutationObserver(function () {
						if (!host.querySelector(".kr-ov")) {
							host.removeAttribute("data-kr-built");
							ensureOverview();
						} else {
							hideStock(host);
						}
					}).observe(host, { childList: true, subtree: true });
				}
			}
		} catch (e) { /* ignore */ }
	}

	/* ---------- Widen + polish Ext modals ---------- */
	function sizeWindow(win, w, h, westW) {
		if (!win || win.__krModalSized) return;
		win.__krModalSized = true;
		win.width = w;
		win.height = h;
		if (win.minWidth != null) win.minWidth = Math.min(win.minWidth, w);
		function apply() {
			try {
				if (typeof win.setSize === "function") win.setSize(w, h);
				if (westW != null && win.items && typeof win.items.get === "function") {
					var west = win.items.get(0);
					if (west && typeof west.setWidth === "function") west.setWidth(westW);
					else if (west) west.width = westW;
				}
				if (typeof win.center === "function" && win.isVisible && win.isVisible()) win.center();
				if (win.el && win.el.dom) win.el.dom.setAttribute("data-kr-modal", "1");
			} catch (e) { /* ignore */ }
		}
		function onShow() {
			apply();
			markIconButtons();
			setTimeout(markIconButtons, 50);
		}
		if (win.on) {
			win.on("show", onShow);
			win.on("beforeshow", apply);
		}
		if (win.rendered) apply();
	}

	function polishLoginWindow(win) {
		if (!win) return;
		/* Stock LoginWindow is 300×120 — Krate chrome + stacked field needs ~240px. */
		sizeWindow(win, 380, 240);
		try {
			if (win.form && !win.form.__krLoginForm) {
				win.form.__krLoginForm = true;
				win.form.labelAlign = "top";
				win.form.labelWidth = 1;
				if (typeof win.form.doLayout === "function") win.form.doLayout();
			}
			var pf = win.passwordField;
			if (pf && !pf.__krLoginField) {
				pf.__krLoginField = true;
				/* grow + right-aligned labelWidth mis-measure → nested borders */
				pf.grow = false;
				pf.anchor = "100%";
				pf.width = undefined;
				if (typeof pf.setWidth === "function" && win.body && win.body.getWidth) {
					pf.setWidth(Math.max(200, win.body.getWidth() - 8));
				}
			}
			if (typeof win.doLayout === "function") win.doLayout();
		} catch (e) { /* ignore */ }
	}

	function widenModals() {
		try {
			if (!window.deluge) return;
			if (deluge.login) polishLoginWindow(deluge.login);
			if (deluge.preferences) {
				sizeWindow(deluge.preferences, 960, 720, 220);
				stretchPreferencesPages(deluge.preferences);
			}
			if (deluge.connectionManager) sizeWindow(deluge.connectionManager, 700, 460);
			if (deluge.editTrackers) sizeWindow(deluge.editTrackers, 720, 500);
			if (deluge.add) sizeWindow(deluge.add, 760, 580);
			if (window.Deluge) {
				if (Deluge.LoginWindow && Deluge.LoginWindow.prototype && !Deluge.LoginWindow.prototype.__krWide) {
					Deluge.LoginWindow.prototype.__krWide = true;
					Deluge.LoginWindow.prototype.width = 380;
					Deluge.LoginWindow.prototype.height = 240;
				}
				if (Deluge.ConnectionManager && Deluge.ConnectionManager.prototype && !Deluge.ConnectionManager.prototype.__krWide) {
					Deluge.ConnectionManager.prototype.__krWide = true;
					Deluge.ConnectionManager.prototype.width = 700;
					Deluge.ConnectionManager.prototype.height = 460;
				}
				if (Deluge.EditTrackersWindow && Deluge.EditTrackersWindow.prototype && !Deluge.EditTrackersWindow.prototype.__krWide) {
					Deluge.EditTrackersWindow.prototype.__krWide = true;
					Deluge.EditTrackersWindow.prototype.width = 720;
					Deluge.EditTrackersWindow.prototype.height = 500;
				}
				if (Deluge.preferences && Deluge.preferences.PreferencesWindow && Deluge.preferences.PreferencesWindow.prototype && !Deluge.preferences.PreferencesWindow.prototype.__krWide) {
					Deluge.preferences.PreferencesWindow.prototype.__krWide = true;
					Deluge.preferences.PreferencesWindow.prototype.width = 960;
					Deluge.preferences.PreferencesWindow.prototype.height = 720;
				}
			}
			enlargeTorrentOptions();
			markIconButtons();
		} catch (e) { /* ignore */ }
	}

	/**
	 * Downloads/Encryption hardcode FormPanel+fieldset widths (~280–320).
	 * Network does not — stretch narrow pages to fill the center card like Network.
	 */
	function stretchPreferencesPages(prefs) {
		if (!prefs || prefs.__krPrefStretch) return;
		prefs.__krPrefStretch = true;

		function pageWidth() {
			try {
				if (prefs.configPanel && prefs.configPanel.body && prefs.configPanel.body.getWidth) {
					var w = prefs.configPanel.body.getWidth();
					if (w > 80) return w - 16;
				}
				if (prefs.getWidth) return Math.max(480, prefs.getWidth() - 260);
			} catch (e) { /* ignore */ }
			return 640;
		}

		function widenField(f, innerW) {
			if (!f) return;
			try {
				if (typeof f.height === "number" && f.height <= 28) {
					f.height = "auto";
					if (f.setHeight) f.setHeight("auto");
					if (f.el && f.el.setHeight) f.el.setHeight("auto");
				}
				if (f.input && typeof f.input.setWidth === "function") f.input.setWidth(innerW);
				else if (f.input) f.input.width = innerW;
				/* Skip tiny spinners / checkboxes — only grow path fields & combos */
				var xt = (f.getXType && f.getXType()) || f.xtype || "";
				if (xt === "checkbox" || xt === "spinnerfield" || xt === "spinnergroup") return;
				if (typeof f.setWidth === "function" && (f.width == null || f.width >= 120)) {
					f.setWidth(innerW);
				} else if (f.width != null && f.width >= 120) {
					f.width = innerW;
				}
			} catch (e) { /* ignore */ }
		}

		function stretchPage(page) {
			if (!page) return;
			function apply() {
				try {
					var w = pageWidth();
					var fsW = Math.max(320, w - 8);
					var innerW = Math.max(280, fsW - 36);
					page.width = w;
					if (page.setWidth) page.setWidth(w);
					if (page.body && page.body.setWidth) page.body.setWidth(w);
					if (!page.items || typeof page.items.each !== "function") return;
					page.items.each(function (fs) {
						if (!fs) return;
						if (fs.width != null || (fs.getXType && fs.getXType() === "fieldset") || fs.xtype === "fieldset") {
							fs.width = fsW;
							if (fs.setWidth) fs.setWidth(fsW);
						}
						if (fs.items && typeof fs.items.each === "function") {
							fs.items.each(function (f) { widenField(f, innerW); });
						}
					});
					if (typeof page.doLayout === "function") page.doLayout();
				} catch (e) { /* ignore */ }
			}
			if (page.on && !page.__krStretchHook) {
				page.__krStretchHook = true;
				page.on("activate", apply);
				page.on("show", apply);
			}
			if (page.rendered) apply();
			setTimeout(apply, 50);
		}

		function enablePageScroll(page) {
			if (!page) return;
			try {
				page.autoScroll = true;
				if (page.body && page.body.setStyle) {
					page.body.setStyle({ "overflow-y": "auto", "overflow-x": "hidden" });
				}
				if (page.el && page.el.setStyle) {
					page.el.setStyle({ "overflow-y": "auto", "overflow-x": "hidden" });
				}
			} catch (e) { /* ignore */ }
		}

		function stretchAll() {
			try {
				if (prefs.configPanel) {
					prefs.configPanel.autoScroll = true;
					prefs.configPanel.width = undefined;
					if (prefs.configPanel.setWidth && prefs.getWidth) {
						prefs.configPanel.setWidth(Math.max(400, prefs.getWidth() - 240));
					}
					if (prefs.configPanel.body && prefs.configPanel.body.setStyle) {
						prefs.configPanel.body.setStyle({
							"overflow-y": "auto",
							"overflow-x": "hidden"
						});
					}
				}
				var pages = prefs.pages || {};
				Object.keys(pages).forEach(function (key) {
					enablePageScroll(pages[key]);
					stretchPage(pages[key]);
				});
			} catch (e) { /* ignore */ }
		}

		if (prefs.on) {
			prefs.on("show", stretchAll);
			prefs.on("afterlayout", stretchAll);
		}
		if (prefs.list && prefs.list.on) {
			prefs.list.on("selectionchange", function () { setTimeout(stretchAll, 30); });
		}
		if (prefs.rendered || (prefs.isVisible && prefs.isVisible())) stretchAll();
		setTimeout(stretchAll, 200);
	}

	/** Enlarge Status→Options fieldsets to fill the details pane (stock ~210–250px). */
	function enlargeTorrentOptions() {
		try {
			if (!window.Ext || typeof Ext.getCmp !== "function") return;
			var details = Ext.getCmp("torrentDetails");
			if (!details || !details.items) return;
			var opt = typeof details.items.get === "function" ? details.items.get(4) : null;
			if (!opt || !opt.fieldsets) return;
			if (opt.__krOptsWide) {
				/* still re-grow on activate in case pane resized */
			} else {
				opt.__krOptsWide = true;
			}
			function grow() {
				try {
					var bodyW = 900;
					if (opt.body && opt.body.getWidth) bodyW = opt.body.getWidth();
					else if (details.body && details.body.getWidth) bodyW = details.body.getWidth();
					bodyW = Math.max(720, bodyW - 28);
					var bwW = Math.floor(bodyW * 0.38);
					var qW = Math.floor(bodyW * 0.34);
					var colW = Math.max(240, bodyW - bwW - qW - 24);
					var bw = opt.fieldsets.bandwidth;
					var q = opt.fieldsets.queue;
					var g = opt.fieldsets.general;
					var col = opt.rightColumn;
					if (bw && bw.setWidth) bw.setWidth(bwW);
					else if (bw) bw.width = bwW;
					if (q && q.setWidth) q.setWidth(qW);
					else if (q) q.width = qW;
					if (col && col.setWidth) col.setWidth(colW);
					else if (col) col.width = colW;
					if (g && g.setWidth) g.setWidth(colW - 8);
					if (opt.fields) {
						["max_download_speed", "max_upload_speed", "max_connections", "max_upload_slots"].forEach(function (id) {
							var f = opt.fields[id];
							if (f && f.setWidth) f.setWidth(112);
						});
						/* Path under Move Completed — full queue width, no DOM surgery */
						if (opt.fields.move_completed_path && opt.fields.move_completed_path.setWidth) {
							opt.fields.move_completed_path.setWidth(Math.max(180, qW - 48));
						}
						if (opt.fields.stop_ratio && opt.fields.stop_ratio.setWidth) {
							opt.fields.stop_ratio.setWidth(72);
						}
					}
					/* Edit Trackers / Apply — stock hbox width:100 overlaps when restyled */
					try {
						var editBtn = typeof Ext.getCmp === "function" ? Ext.getCmp("edit_trackers") : null;
						var applyBtn = typeof Ext.getCmp === "function" ? Ext.getCmp("apply") : null;
						if (editBtn) {
							editBtn.width = 148;
							if (editBtn.setWidth) editBtn.setWidth(148);
						}
						if (applyBtn) {
							applyBtn.width = 108;
							if (applyBtn.setWidth) applyBtn.setWidth(108);
						}
						if (opt.buttonPanel) {
							opt.buttonPanel.width = Math.max(270, colW - 8);
							if (opt.buttonPanel.setWidth) opt.buttonPanel.setWidth(Math.max(270, colW - 8));
							if (opt.buttonPanel.doLayout) opt.buttonPanel.doLayout();
						}
					} catch (btnErr) { /* ignore */ }
					if (typeof opt.doLayout === "function") opt.doLayout();
					if (opt.body && opt.body.dom) opt.body.dom.classList.add("kr-options-wide");
					markIconButtons();
				} catch (e) { /* ignore */ }
			}
			if (opt.on && !opt.__krGrowHook) {
				opt.__krGrowHook = true;
				opt.on("activate", grow);
				opt.on("resize", grow);
			}
			if (opt.rendered) grow();
			setTimeout(grow, 200);
		} catch (e) { /* ignore */ }
	}

	/* ---------- boot ---------- */
	function boot() {
		if (!document.body) {
			document.addEventListener("DOMContentLoaded", boot, { once: true });
			return;
		}
		applyVariant(storedPreference() || "auto");
		mountChrome();
		ensureOverview();
		hookDelugeEvents();
		widenModals();
		[400, 1200, 2500, 5000].forEach(function (ms) {
			setTimeout(function () {
				mountChrome();
				hookedDetails = false;
				hookDelugeEvents();
				ensureOverview();
				widenModals();
			}, ms);
		});
		if (!pollTimer) pollTimer = setInterval(tick, POLL_MS);
		window.addEventListener("focus", function () {
			if ((storedPreference() || "auto") === "auto") applyVariant("auto");
		});
	}

	boot();
})(window.kr);
