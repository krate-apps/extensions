/**
 * @file Torrent details drawer (General overview and tabs).
 * @requires window.kr, theWebUI, theUILang, jQuery
 */
;(function (kr) {
	"use strict";

	const t = (key, fallback) =>
		(kr.lib && kr.lib.i18n ? kr.lib.i18n.t(key, fallback) :
			((window.theUILang && theUILang[key]) || fallback));

	/* Only these detail tabs are scoped to a single torrent; the rest
	 * (Plugins, File Manager, Speed, History, Tasks, Traffic, Log) always
	 * render their own global content and never show the empty state. */
	var TORRENT_TABS = { gcont: 1, FileList: 1, TrackerList: 1, PeerList: 1, Chunks: 1 };
	/* Per-panel empty state: glyph + line shown inside each torrent-scoped tab
	 * when no single torrent is selected. The line is tab-specific. */
	var TORRENT_TAB_EMPTY = {
		gcont:       { icon: "tab-general",  key: "kr_det_empty_general",  fallback: "Select a torrent to see its overview" },
		FileList:    { icon: "tab-files",    key: "kr_det_empty_files",    fallback: "Select a torrent to see its files" },
		TrackerList: { icon: "tab-trackers", key: "kr_det_empty_trackers", fallback: "Select a torrent to see its trackers" },
		PeerList:    { icon: "tab-peers",    key: "kr_det_empty_peers",    fallback: "Select a torrent to see its peers" },
		Chunks:      { icon: "tab-chunks",   key: "kr_det_empty_pieces",   fallback: "Select a torrent to see its pieces" }
	};
	var noSelection = true;
	var currentTab = "gcont";
	var drawerEl = null;

	/* Inject the empty-state node into one torrent panel (idempotent). The
	 * panel is made a positioning context so the node fills it below the strip
	 * and its opaque surface hides any stale data. Panels can be built lazily,
	 * so this is called for the active tab on every refresh, not once up front. */
	function ensureTabEmpty(tabKey) {
		try {
			var spec = TORRENT_TAB_EMPTY[tabKey];
			if (!spec) return;
			var panel = document.getElementById(tabKey);
			if (!panel || panel.querySelector(".kr-tab-empty")) return;
			if (getComputedStyle(panel).position === "static") panel.style.position = "relative";
			var empty = document.createElement("div");
			empty.className = "kr-tab-empty";
			var glyph = maskSpan(spec.icon);
			glyph.classList.add("kr-tab-empty-glyph");
			var text = document.createElement("div");
			text.className = "kr-tab-empty-text";
			text.textContent = t(spec.key, spec.fallback);
			empty.appendChild(glyph);
			empty.appendChild(text);
			panel.appendChild(empty);
		} catch (e) { /* never break the bundle */ }
	}

	function refreshEmpty() {
		try {
			if (!drawerEl) drawerEl = document.getElementById("tdetails");
			if (!drawerEl) return;
			var show = noSelection && !!TORRENT_TABS[currentTab];
			if (show) ensureTabEmpty(currentTab);
			drawerEl.classList.toggle("kr-nosel", show);
		} catch (e) { /* never break the bundle */ }
	}

	/* The restored tab is already shown by the core before this module is
	 * injected, so the theTabs.show wrapper never fires for it -- read the
	 * live active tab instead of trusting the "gcont" default. */
	function resolveActiveTab() {
		try {
			if (window.theTabs && theTabs.activeId) return theTabs.activeId;
			var li = document.querySelector("#tabbar li.selected, #tabbar li.active");
			if (li && li.id && li.id.indexOf("tab_") === 0) return li.id.slice(4);
		} catch (e) {}
		return currentTab;
	}

	function maskSpan(name) {
		var s = document.createElement("span");
		s.className = "kr-icon";
		var u = "url(" + (kr && kr.path ? kr.path : "") + "images/icons/" + name + ".svg)";
		s.style.webkitMaskImage = u;
		s.style.maskImage = u;
		return s;
	}

	/* Small value helpers -------------------------------------------------- */
	function conv() { return window.theConverter; }
	function fmtSpeed(b) {
		try { var s = conv().speed(b); return s || "0 B/s"; } catch (e) { return "0 B/s"; }
	}
	function fmtBytes(b) {
		try { var s = conv().bytes(b, "details"); return s || "0 B"; } catch (e) { return "0 B"; }
	}
	function fmtTime(sec) {
		try { return conv().time(sec); } catch (e) { return ""; }
	}
	function dash(el) { el.textContent = "—"; el.classList.add("kr-muted"); }
	function setText(el, text) {
		if (text == null || text === "") { dash(el); return; }
		el.textContent = text;
		el.classList.remove("kr-muted");
	}
	function spanText(id) {
		var el = document.getElementById(id);
		return el ? (el.textContent || "").trim() : "";
	}

	/* Responsive middle truncation: a head span that ellipsises when narrow
	 * and a tail span that is always shown in full, so the useful end of a
	 * path/hash/url survives at any card width. The full value goes to the
	 * shared tooltip. */
	function setMidTrunc(container, full, headRatio) {
		container.textContent = "";
		if (full == null || full === "") {
			container.textContent = "—";
			container.classList.add("kr-muted");
			if (kr && kr.tooltip) kr.tooltip(container, "");
			container.removeAttribute("data-kr-tip");
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
		if (kr && kr.tooltip) kr.tooltip(container, full);
	}

	/* A compact copy-to-clipboard icon button; reads its value lazily so the
	 * live-updated source is always what lands on the clipboard. */
	function copyButton(getValue) {
		var btn = document.createElement("button");
		btn.type = "button";
		btn.className = "kr-copy-btn kr-icon-btn kr-icon-btn--md";
		btn.appendChild(maskSpan("fm-copy"));
		if (kr && kr.tooltip) kr.tooltip(btn, t("kr_det_copy", "Copy"));
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
					ta.value = v; ta.style.position = "fixed"; ta.style.opacity = "0";
					document.body.appendChild(ta); ta.select();
					try { document.execCommand("copy"); flash(); } catch (e) {}
					document.body.removeChild(ta);
				}
			} catch (e) {}
		});
		return btn;
	}

	/* File Manager jail helpers: the FM browser works in paths relative to
	 * its jail root (flm.config.homedir), so an absolute save dir has to be
	 * stripped before goToPath; a path outside the jail cannot be opened. */
	function fmParentDir(path) {
		if (!path) return "";
		return path.replace(/\/+$/, "").replace(/\/[^/]*$/, "") || "/";
	}
	function fmHomeNorm() {
		try {
			var h = window.flm && flm.config && flm.config.homedir;
			return h ? h.replace(/\/+$/, "") : "";
		} catch (e) { return ""; }
	}
	function fmInsideHome(dir) {
		var home = fmHomeNorm();
		if (!home || !dir) return false;
		return (dir + "/").indexOf(home + "/") === 0;
	}

	/* ------------------------------------------------------------
	 * 1. General pane -> torrent overview.
	 * ---------------------------------------------------------- */
	var ov = null;              /* references to the widgets we update live */
	var lastDID = null;
	var SPARK_MAX = 30;         /* ~60s of samples at the 2.5s refresh */
	var sparkDown = [];
	var sparkUp = [];
	var RING_R = 38;            /* ring radius; circumference below */
	var RING_C = 2 * Math.PI * RING_R;

	function el(tag, cls, parent) {
		var e = document.createElement(tag);
		if (cls) e.className = cls;
		if (parent) parent.appendChild(e);
		return e;
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
		grad.setAttribute("x1", "0"); grad.setAttribute("y1", "0");
		grad.setAttribute("x2", "1"); grad.setAttribute("y2", "1");
		var s1 = document.createElementNS(NS, "stop");
		s1.setAttribute("offset", "0%"); s1.setAttribute("class", "kr-ring-s1");
		var s2 = document.createElementNS(NS, "stop");
		s2.setAttribute("offset", "100%"); s2.setAttribute("class", "kr-ring-s2");
		grad.appendChild(s1); grad.appendChild(s2); defs.appendChild(grad);
		svg.appendChild(defs);
		var track = document.createElementNS(NS, "circle");
		track.setAttribute("class", "kr-ring-track");
		track.setAttribute("cx", "44"); track.setAttribute("cy", "44");
		track.setAttribute("r", String(RING_R));
		svg.appendChild(track);
		var arc = document.createElementNS(NS, "circle");
		arc.setAttribute("class", "kr-ring-arc");
		arc.setAttribute("cx", "44"); arc.setAttribute("cy", "44");
		arc.setAttribute("r", String(RING_R));
		arc.setAttribute("stroke-dasharray", RING_C.toFixed(2));
		arc.setAttribute("stroke-dashoffset", RING_C.toFixed(2));
		arc.setAttribute("transform", "rotate(-90 44 44)");
		svg.appendChild(arc);
		var label = document.createElementNS(NS, "text");
		label.setAttribute("class", "kr-ring-label");
		label.setAttribute("x", "44"); label.setAttribute("y", "44");
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
			var x = (j * step).toFixed(1);
			var y = (h - (buf[j] / max) * (h - 2) - 1).toFixed(1);
			pts.push(x + "," + y);
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
		svg.appendChild(area); svg.appendChild(line);
		row.appendChild(svg);
		return { num: num, area: area, line: line };
	}

	function buildCard(parent, iconName, title) {
		var card = el("div", "kr-card", parent);
		var head = el("div", "kr-card-head", card);
		var ic = maskSpan(iconName);
		ic.className = "kr-icon kr-card-icon";
		head.appendChild(ic);
		var h = el("div", "kr-card-title", head);
		h.textContent = title;
		var body = el("div", "kr-card-body", card);
		return body;
	}

	function metaRow(parent, label) {
		var row = el("div", "kr-meta", parent);
		var l = el("div", "kr-meta-label", row);
		l.textContent = label;
		var v = el("div", "kr-meta-value", row);
		return { row: row, value: v };
	}

	/* A stacked mini-stat: an 11px uppercase label above a 16px value. */
	function miniStat(parent, label) {
		var cell = el("div", "kr-ministat", parent);
		var l = el("div", "kr-ministat-label", cell);
		l.textContent = label;
		var v = el("div", "kr-ministat-value", cell);
		v.textContent = "—";
		return v;
	}

	function buildGeneralOverview() {
		try {
			var layout = document.getElementById("mainlayout");
			var gcont = document.getElementById("gcont");
			if (!gcont || gcont.getAttribute("data-kr-built")) return;

			/* Keep the core detail spans alive + hidden so updateDetails still
			 * fills #dl/#ul/#ra/#et/... by id; the widgets read torrent data. */
			if (layout) layout.style.display = "none";

			var root = el("div", "kr-ov");

			/* ---- Hero row ---- */
			var hero = el("div", "kr-ov-hero", root);

			/* Composed overview card: ring on the left, torrent identity on
			 * the right (name, size + created, state pill). */
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
			var rLab = el("div", "kr-hero-label", ratioCell);
			rLab.textContent = t("kr_det_ratio", "Ratio");
			var rVal = el("div", "kr-ratio-value", ratioCell);
			rVal.textContent = "—";
			var rTrack = el("div", "kr-ratio-track", ratioCell);
			var rFill = el("div", "kr-ratio-fill", rTrack);
			el("div", "kr-ratio-tick", rTrack);
			var rSub = el("div", "kr-hero-sub", ratioCell);
			rSub.textContent = "—";

			var timeCell = el("div", "kr-hero-cell kr-hero-time", hero);
			var tStats = el("div", "kr-ministats", timeCell);
			var tEta = { value: miniStat(tStats, t("kr_det_eta", "ETA")) };
			var tEl = { value: miniStat(tStats, t("kr_det_elapsed", "Elapsed")) };
			var tRem = { value: miniStat(tStats, t("kr_det_remaining", "Remaining")) };

			/* ---- Cards ---- */
			var cards = el("div", "kr-ov-cards", root);

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

			var tracker = buildCard(cards, "tab-trackers", t("kr_tracker", "Tracker"));
			var trkUrlRow = el("div", "kr-meta kr-meta-wide", tracker);
			el("div", "kr-meta-label", trkUrlRow).textContent = t("kr_det_url", "URL");
			var trkUrlWrap = el("div", "kr-meta-value kr-trunc-wrap", trkUrlRow);
			var trkUrl = el("div", "kr-trunc", trkUrlWrap);
			trkUrl.textContent = "—";
			trkUrlWrap.appendChild(copyButton(function () { return spanText("tu"); }));
			var trkStatusRow = el("div", "kr-meta", tracker);
			el("div", "kr-meta-label", trkStatusRow).textContent = t("kr_det_status", "Status");
			var trkStatusVal = el("div", "kr-meta-value kr-status-cell", trkStatusRow);
			var trkStatusPill = el("span", "kr-status-pill", trkStatusVal);
			trkStatusPill.textContent = "—";
			var trkAnnounceMeta = metaRow(tracker, t("kr_det_next_announce", "Next announce"));

			var storage = buildCard(cards, "tab-filemanager", t("kr_det_storage", "Storage"));
			var pathRow = el("div", "kr-meta kr-meta-wide", storage);
			el("div", "kr-meta-label", pathRow).textContent = t("kr_det_save_path", "Save path");
			var pathWrap = el("div", "kr-meta-value kr-trunc-wrap", pathRow);
			var pathVal = el("div", "kr-trunc", pathWrap);
			pathVal.textContent = "—";
			pathWrap.appendChild(copyButton(function () { return spanText("bf"); }));
			var fmBtn = null;
			if (window.flm) {
				fmBtn = el("button", "kr-copy-btn kr-fm-open kr-icon-btn kr-icon-btn--md", pathWrap);
				fmBtn.type = "button";
				fmBtn.appendChild(maskSpan("tab-filemanager"));
				if (kr && kr.tooltip) kr.tooltip(fmBtn, t("kr_det_open_fm", "Open in File Manager"));
				fmBtn.addEventListener("click", function () {
					try {
						if (fmBtn.disabled) return;
						var dir = fmParentDir(spanText("bf"));
						if (!dir || !window.flm) return;
						/* showPath is the plugin's own entry point: it strips the
						 * absolute path to the jail, loads the listing and shows
						 * the File Manager tab, initialising its UI if needed. */
						if (typeof flm.showPath === "function") {
							flm.showPath(dir);
						} else if (flm.goToPath) {
							var rel = flm.stripJailPath ? flm.stripJailPath(dir) : dir;
							if (rel && rel.charAt(rel.length - 1) !== "/") rel += "/";
							if (window.theTabs) theTabs.show("flm-browser");
							flm.goToPath(rel);
						}
					} catch (e) {}
				});
			}
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
			hashWrap.appendChild(copyButton(function () { return spanText("hs"); }));
			var cmtRow = el("div", "kr-meta kr-meta-wide", storage);
			el("div", "kr-meta-label", cmtRow).textContent = t("kr_det_comment", "Comment");
			var cmtVal = el("div", "kr-meta-value kr-comment", cmtRow);
			cmtVal.textContent = "—";

			gcont.appendChild(root);
			gcont.setAttribute("data-kr-built", "1");

			ov = {
				ringArc: ring.arc, ringLabel: ring.label, statePill: statePill,
				nameEl: nameEl, metaLine: metaLine,
				spDownNum: spDown.num, spDownArea: spDown.area, spDownLine: spDown.line,
				spUpNum: spUp.num, spUpArea: spUp.area, spUpLine: spUp.line,
				rVal: rVal, rFill: rFill, rSub: rSub,
				tEta: tEta.value, tEl: tEl.value, tRem: tRem.value,
				seedVal: seedVal, seedFill: seedFill, peerVal: peerVal, peerFill: peerFill,
				wasted: wastedMeta.value,
				trkUrl: trkUrl, trkStatus: trkStatusPill, trkAnnounce: trkAnnounceMeta.value,
				pathVal: pathVal, diskVal: diskVal, diskFill: diskFill, diskTrack: diskTrack,
				hashVal: hashVal, cmtVal: cmtVal, fmBtn: fmBtn
			};
		} catch (e) { /* never break the bundle */ }
	}

	function stateTone(iconName) {
		var n = iconName || "";
		if (n.indexOf("Error") !== -1) return "error";
		if (n.indexOf("Checking") !== -1 || n.indexOf("Queued") !== -1) return "checking";
		if (n.indexOf("Paused") !== -1) return "paused";
		if (n.indexOf("Down") !== -1) return "downloading";
		if (n.indexOf("Up") !== -1 || n.indexOf("Completed") !== -1) return "seeding";
		if (n.indexOf("Incompleted") !== -1) return "stopped";
		return "stopped";
	}

	function renderGeneral() {
		try {
			if (!ov || !window.theWebUI) return;
			var dID = theWebUI.dID;
			if (!dID || !theWebUI.torrents || !theWebUI.torrents[dID]) return;
			var d = theWebUI.torrents[dID];

			if (dID !== lastDID) { sparkDown = []; sparkUp = []; lastDID = dID; }

			/* Completion ring */
			var pct = Math.max(0, Math.min(100, (d.done || 0) / 10));
			var off = RING_C * (1 - pct / 100);
			ov.ringArc.setAttribute("stroke-dashoffset", off.toFixed(2));
			ov.ringLabel.textContent = (pct >= 99.95 ? 100 : Math.round(pct * 10) / 10) + "%";

			/* State pill via the core status helper (localized + tone) */
			try {
				var si = theWebUI.getStatusIcon(d);
				ov.statePill.textContent = (si && si[1]) ? si[1] : "—";
				ov.statePill.setAttribute("data-tone", stateTone(si && si[0]));
			} catch (e) {}

			/* Torrent identity: name (middle-truncated) + size and created date */
			setMidTrunc(ov.nameEl, d.name || "", 0.7);
			var createdTxt = spanText("co");
			var sizeTxt = (typeof d.size === "number") ? fmtBytes(d.size) : "";
			var metaBits = [];
			if (sizeTxt) metaBits.push(sizeTxt);
			if (createdTxt) metaBits.push(createdTxt);
			setText(ov.metaLine, metaBits.join("  ·  "));

			/* Live speeds + 60s sparklines */
			ov.spDownNum.textContent = fmtSpeed(d.dl);
			ov.spUpNum.textContent = fmtSpeed(d.ul);
			sparkDown.push(Math.max(0, d.dl || 0));
			sparkUp.push(Math.max(0, d.ul || 0));
			if (sparkDown.length > SPARK_MAX) sparkDown.shift();
			if (sparkUp.length > SPARK_MAX) sparkUp.shift();
			var dPts = sparkPoints(sparkDown, 84, 26);
			var uPts = sparkPoints(sparkUp, 84, 26);
			ov.spDownLine.setAttribute("points", dPts);
			ov.spUpLine.setAttribute("points", uPts);
			ov.spDownArea.setAttribute("points", dPts ? ("0,26 " + dPts + " 84,26") : "");
			ov.spUpArea.setAttribute("points", uPts ? ("0,26 " + uPts + " 84,26") : "");

			/* Ratio gauge */
			var infinite = (d.ratio == -1);
			var ratio = infinite ? Infinity : (d.ratio || 0) / 1000;
			ov.rVal.textContent = infinite ? "∞" : (Math.round(ratio * 1000) / 1000).toFixed(3);
			var met = infinite || ratio >= 1;
			ov.rFill.style.setProperty("--kr-p", String((infinite ? 100 : Math.min(100, ratio * 100)) / 100));
			ov.rFill.setAttribute("data-met", met ? "1" : "0");
			ov.rVal.setAttribute("data-met", met ? "1" : "0");
			ov.rSub.textContent = t("kr_det_updown", "{up} up / {down} down")
				.replace("{up}", fmtBytes(d.uploaded)).replace("{down}", fmtBytes(d.downloaded));

			/* Time block: ETA + elapsed from core spans, remaining bytes computed */
			setText(ov.tEta, spanText("rm"));
			setText(ov.tEl, spanText("et"));
			var remBytes = (typeof d.size === "number" && typeof d.downloaded === "number")
				? Math.max(0, d.size - d.downloaded) : null;
			setText(ov.tRem, (d.done >= 1000) ? "0 B" : (remBytes != null ? fmtBytes(remBytes) : ""));

			/* Swarm */
			var sa = (d.seeds_actual != null) ? d.seeds_actual : 0;
			var sall = (d.seeds_all != null) ? d.seeds_all : 0;
			var pa = (d.peers_actual != null) ? d.peers_actual : 0;
			var pall = (d.peers_all != null) ? d.peers_all : 0;
			setText(ov.seedVal, sa + " / " + sall);
			setText(ov.peerVal, pa + " / " + pall);
			ov.seedFill.style.setProperty("--kr-p", String((sall > 0 ? Math.min(100, (sa / sall) * 100) : 0) / 100));
			ov.peerFill.style.setProperty("--kr-p", String((pall > 0 ? Math.min(100, (pa / pall) * 100) : 0) / 100));
			setText(ov.wasted, fmtBytes(d.skip_total || 0));

			/* Tracker */
			setMidTrunc(ov.trkUrl, spanText("tu"), 0.6);
			var tsTxt = spanText("ts");
			var tsTone = "ok", tsLabel = tsTxt || t("kr_det_tracker_ok", "OK");
			if (/error|fail|denied|unreach|not\s*reg|timeout|refus|invalid|unauth/i.test(tsTxt)) tsTone = "error";
			else if (/updat|announc|pend|connect|work|request/i.test(tsTxt)) tsTone = "updating";
			ov.trkStatus.textContent = tsLabel;
			ov.trkStatus.setAttribute("data-tone", tsTone);
			ov.trkStatus.classList.remove("kr-muted");
			var nextAnn = "";
			try {
				var trks = theWebUI.trackers && theWebUI.trackers[dID];
				var t0 = trks && (trks[0] || trks["0"]);
				if (t0 && typeof t0.interval === "number" && typeof t0.last === "number" && t0.last >= 0) {
					var nxt = Math.round(t0.interval - t0.last);
					nextAnn = nxt > 0 ? fmtTime(nxt) : t("kr_det_due_now", "due now");
				}
			} catch (e) {}
			setText(ov.trkAnnounce, nextAnn);

			/* Storage */
			setMidTrunc(ov.pathVal, spanText("bf"), 0.7);
			if (ov.fmBtn) {
				var saveDir = fmParentDir(spanText("bf"));
				var inside = fmInsideHome(saveDir);
				ov.fmBtn.disabled = !inside;
				if (kr && kr.tooltip) {
					kr.tooltip(ov.fmBtn, inside ? t("kr_det_open_fm", "Open in File Manager") : t("kr_det_outside_fm", "Outside your File Manager home"));
				}
			}
			/* Free disk: value plus a meter that mirrors the footer disk meter
			 * (same source, same threshold tint); hidden if that bar is absent. */
			setText(ov.diskVal, spanText("dsk"));
			try {
				var mv = document.getElementById("meter-disk-value");
				if (mv && mv.style.width) {
					var w = parseFloat(mv.style.width) || 0;
					ov.diskFill.style.setProperty("--kr-p", String(Math.max(0, Math.min(100, w)) / 100));
					var c = mv.style.backgroundColor || getComputedStyle(mv).backgroundColor;
					if (c) ov.diskFill.style.backgroundColor = c;
					ov.diskTrack.style.display = "";
				} else {
					ov.diskTrack.style.display = "none";
				}
			} catch (e) { ov.diskTrack.style.display = "none"; }
			setMidTrunc(ov.hashVal, (dID || "").substring(0, 40).toUpperCase(), 0.5);
			var cmtSrc = document.getElementById("cmt");
			var cmtTxt = cmtSrc ? (cmtSrc.textContent || "").trim() : "";
			if (cmtTxt) {
				ov.cmtVal.textContent = "";
				ov.cmtVal.classList.remove("kr-muted");
				var cl = cmtSrc.cloneNode(true);
				cl.removeAttribute("id");
				ov.cmtVal.appendChild(cl);
			} else {
				ov.cmtVal.textContent = t("kr_det_no_comment", "No comment");
				ov.cmtVal.classList.add("kr-muted");
			}
		} catch (e) { /* never break the bundle */ }
	}

	/* ------------------------------------------------------------
	 * 2. Empty state overlay, toggled from the selection handlers.
	 * ---------------------------------------------------------- */
	function installEmptyState() {
		try {
			var drawer = document.getElementById("tdetails");
			if (!drawer || drawer.getAttribute("data-kr-empty")) return;
			drawer.setAttribute("data-kr-empty", "1");
			drawerEl = drawer;

			if (window.theWebUI) {
				var showDetails = theWebUI.showDetails;
				if (typeof showDetails === "function") {
					theWebUI.showDetails = function (hash, noSwitch) {
						noSelection = !hash;
						refreshEmpty();
						return showDetails.call(this, hash, noSwitch);
					};
				}
				var clearDetails = theWebUI.clearDetails;
				if (typeof clearDetails === "function") {
					theWebUI.clearDetails = function () {
						noSelection = true;
						refreshEmpty();
						return clearDetails.apply(this, arguments);
					};
				}
				/* Drive the overview widgets after every core detail refresh. */
				var updateDetails = theWebUI.updateDetails;
				if (typeof updateDetails === "function") {
					theWebUI.updateDetails = function () {
						var r = updateDetails.apply(this, arguments);
						renderGeneral();
						return r;
					};
				}
				noSelection = !theWebUI.dID;
			}
			currentTab = resolveActiveTab();
			refreshEmpty();
			renderGeneral();
		} catch (e) { /* never break the bundle */ }
	}

	/* ------------------------------------------------------------
	 * 3. File-manager path bar: breadcrumb + icon tool group.
	 * ---------------------------------------------------------- */
	function enhanceFileManager(navpath) {
		try {
			if (!navpath || navpath.getAttribute("data-kr-crumbed")) return;
			navpath.setAttribute("data-kr-crumbed", "1");

			var group = navpath.closest(".input-group") || navpath.parentNode;
			if (!group) return;

			/* Tool group: existing refresh button + dir-up + mkdir. */
			var tools = document.createElement("div");
			tools.className = "kr-flm-tools";
			var refresh = document.getElementById("flm-nav-refresh");
			if (refresh) {
				refresh.classList.add("kr-icon-btn"); /* 32px square, handler kept */
				tools.appendChild(refresh); /* move -- click handler kept */
			}

			var upBtn = document.createElement("button");
			upBtn.type = "button";
			upBtn.className = "kr-flm-btn kr-icon-btn";
			upBtn.appendChild(maskSpan("fm-dir-up"));
			if (kr && kr.tooltip) kr.tooltip(upBtn, t("kr_det_parent_dir", "Parent directory"));
			upBtn.addEventListener("click", function () {
				if (!window.flm || !flm.goToPath) return;
				var cur = navpath.value || "/";
				var parent = cur.replace(/\/+$/, "").replace(/\/[^/]*$/, "") || "/";
				flm.goToPath(parent);
			});
			tools.appendChild(upBtn);

			var mkBtn = document.createElement("button");
			mkBtn.type = "button";
			mkBtn.className = "kr-flm-btn kr-icon-btn";
			mkBtn.appendChild(maskSpan("fm-mkdir"));
			if (kr && kr.tooltip) kr.tooltip(mkBtn, t("kr_det_new_folder", "New folder"));
			mkBtn.addEventListener("click", function () {
				try { window.flm && flm.ui.getDialogs().showDialog("mkdir"); } catch (e) {}
			});
			tools.appendChild(mkBtn);

			/* Breadcrumb replaces the stock <select> (kept, screen-reader only). */
			var crumbs = document.createElement("nav");
			crumbs.className = "kr-breadcrumb";
			crumbs.setAttribute("aria-label", t("kr_det_path", "Path"));
			navpath.classList.add("kr-sr");

			group.insertBefore(tools, group.firstChild);
			group.insertBefore(crumbs, navpath);

			var render = function () {
				try {
					var cur = navpath.value || "/";
					crumbs.textContent = "";
					var addCrumb = function (label, path, current) {
						var b = document.createElement("button");
						b.type = "button";
						b.className = "kr-crumb" + (current ? " kr-crumb-current" : "");
						b.textContent = label;
						if (!current) {
							b.addEventListener("click", function () {
								if (window.flm && flm.goToPath) flm.goToPath(path);
							});
						}
						crumbs.appendChild(b);
					};
					var addSep = function () {
						var s = document.createElement("span");
						s.className = "kr-crumb-sep";
						s.textContent = "/";
						crumbs.appendChild(s);
					};
					var parts = cur.split("/").filter(Boolean);
					addCrumb("/", "/", parts.length === 0);
					var acc = "";
					parts.forEach(function (p, i) {
						acc += "/" + p;
						addSep();
						addCrumb(p, acc, i === parts.length - 1);
					});
				} catch (e) {}
			};

			/* The stock updateNavbarPath rewrites the <select> options on every
			 * changeDir, so observing its children re-renders the breadcrumb
			 * without coupling to flm internals. */
			render();
			new MutationObserver(render).observe(navpath, { childList: true });

			/* The shared select enhances this history <select> into a trigger +
			 * popover. Collapse that trigger to a compact "Recent folders" clock
			 * button pinned at the toolbar's far right: the breadcrumb stays the
			 * single visible path, while the popover still lists the path history
			 * and drives the kept-wired <select>. The trigger may not exist yet
			 * when this runs, so wait for it. */
			var tagRecent = function () {
				var trig = group.querySelector(".kr-select-trigger");
				if (!trig) return false;
				trig.classList.add("kr-flm-recent");
				trig.removeAttribute("data-kr-grow");
				group.appendChild(trig);
				/* The value label is display:none, so give the combobox an
				 * explicit accessible name (kr.tooltip skips aria-label when
				 * textContent is non-empty). */
				trig.setAttribute("aria-label", t("kr_det_recent_folders", "Recent folders"));
				if (kr && kr.tooltip) kr.tooltip(trig, t("kr_det_recent_folders", "Recent folders"));
				return true;
			};
			if (!tagRecent()) {
				var recentMo = new MutationObserver(function () {
					if (tagRecent()) recentMo.disconnect();
				});
				recentMo.observe(group, { childList: true });
			}

			relocateConsole();
			scheduleFit();
		} catch (e) { /* never break the bundle */ }
	}

	/* ------------------------------------------------------------
	 * 4. Flot charts (Speed + Traffic) on variant chart tokens.
	 * ---------------------------------------------------------- */
	function cssvar(name) {
		try { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
		catch (e) { return ""; }
	}

	function hexToRgba(hex, a) {
		var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec((hex || "").trim());
		if (!m) return hex;
		return "rgba(" + parseInt(m[1], 16) + "," + parseInt(m[2], 16) + "," + parseInt(m[3], 16) + "," + a + ")";
	}

	function styleCharts() {
		try {
			if (!window.theWebUI) return;
			var rx = cssvar("--kr-speed-down");
			var tx = cssvar("--kr-speed-up");
			if (!rx && !tx) return;

			/* Speed tab -- filled areas (~30%) with a solid 2px edge. */
			var sg = theWebUI.speedGraph;
			if (sg && sg.down && sg.up) {
				sg.down.color = rx;
				sg.up.color = tx;
				sg.down.lines = { show: true, fill: 0.3, lineWidth: 2 };
				sg.up.lines = { show: true, fill: 0.3, lineWidth: 2 };
				if (sg.plot) try { sg.draw(true); } catch (e) {}
			}

			/* Traffic tab -- filled bars (~35%) with a solid 1px edge;
			 * the prior-period series run dimmer in the same hue. */
			var tg = theWebUI.trafGraph;
			if (tg && tg.down && tg.up) {
				tg.down.color = rx;
				tg.up.color = tx;
				if (tg.oldDown) tg.oldDown.color = hexToRgba(rx, 0.4);
				if (tg.oldUp) tg.oldUp.color = hexToRgba(tx, 0.4);
				[tg.down, tg.up, tg.oldDown, tg.oldUp].forEach(function (d) {
					if (d) d.bars = { show: true, fill: 0.35, lineWidth: 1 };
				});
				if (tg.plot) try { tg.draw(true); } catch (e) {}
			}
		} catch (e) { /* never break the bundle */ }
	}

	/* ------------------------------------------------------------
	 * 5. Traffic pane toolbar -- KPI chips, inline series toggles,
	 *    Clear as an icon-button. The stock flot legend is hidden by CSS;
	 *    the toggles drive the same checked-series mechanism it used.
	 * ---------------------------------------------------------- */
	var traf = null;
	var TRAF_SERIES = {
		down: ["trafic_downloaded", "trafic_downloaded_old"],
		up: ["trafic_uploaded", "trafic_uploaded_old"]
	};
	/* The Speed graph is an rGraph too, with its own two series labels. */
	var SPEED_SERIES = {
		down: ["speedgraph_dl"],
		up: ["speedgraph_ul"]
	};

	function sumSeries(g, keys) {
		var total = 0;
		keys.forEach(function (k) {
			var ds = g && g[k];
			if (ds && ds.data) ds.data.forEach(function (pt) {
				if (pt && pt[1] != null) {
					var n = Number(pt[1]);
					if (!isNaN(n)) total += n;
				}
			});
		});
		return total;
	}

	/* Drive the same checked-series mechanism the stock flot legend used, for
	 * any rGraph (Traffic or Speed); labels is the series-label list to flip. */
	function toggleSeries(labels, on) {
		try {
			/* rGraph is a global class binding (not a window property), so it
			 * is referenced directly; typeof guards against it being absent. */
			if (!labels || typeof rGraph === "undefined" || !rGraph.legendCheckboxChanged) return;
			labels.forEach(function (lbl) {
				rGraph.legendCheckboxChanged(lbl, { checked: on });
			});
		} catch (e) {}
	}

	/* A pill toggle for one graph series group: a colored dot + label that
	 * flips the series on/off. Shared by the Traffic and Speed toolbars. */
	function seriesChip(labels, dirClass, labelText) {
		var btn = document.createElement("button");
		btn.type = "button";
		btn.className = "kr-traf-toggle " + dirClass;
		btn.setAttribute("aria-pressed", "true");
		var dot = document.createElement("span");
		dot.className = "kr-traf-dot";
		var lab = document.createElement("span");
		lab.className = "kr-traf-toggle-lab";
		lab.textContent = labelText;
		btn.appendChild(dot);
		btn.appendChild(lab);
		btn.addEventListener("click", function () {
			var on = btn.getAttribute("aria-pressed") !== "true";
			btn.setAttribute("aria-pressed", on ? "true" : "false");
			toggleSeries(labels, on);
		});
		if (kr && kr.tooltip) kr.tooltip(btn, t("kr_det_toggle", "Toggle {name}").replace("{name}", labelText));
		return btn;
	}

	function buildTrafChrome(ctrl) {
		/* KPI strip + toggle group inserted into the one toolbar row so the
		 * plugin's graph-height math (#traf height minus #traf_graph_ctrl
		 * height) stays valid with no resize wrapping. */
		var kpi = document.createElement("div");
		kpi.className = "kr-traf-kpi";
		function chip(iconName, label, cls) {
			var c = document.createElement("div");
			c.className = "kr-kpi" + (cls ? " " + cls : "");
			var ic = maskSpan(iconName);
			ic.className = "kr-icon kr-kpi-icon";
			c.appendChild(ic);
			var t = document.createElement("div");
			t.className = "kr-kpi-text";
			var v = document.createElement("div");
			v.className = "kr-kpi-val";
			v.textContent = "—";
			var l = document.createElement("div");
			l.className = "kr-kpi-lab";
			l.textContent = label;
			t.appendChild(v); t.appendChild(l);
			c.appendChild(t);
			kpi.appendChild(c);
			return v;
		}
		var toggles = document.createElement("div");
		toggles.className = "kr-traf-toggles";
		var tgDown = seriesChip(TRAF_SERIES.down, "kr-dir-down", t("kr_det_downloaded", "Downloaded"));
		var tgUp = seriesChip(TRAF_SERIES.up, "kr-dir-up", t("kr_det_uploaded", "Uploaded"));
		toggles.appendChild(tgDown);
		toggles.appendChild(tgUp);

		traf = {
			kpiDown: chip("statusbar-download", t("kr_det_downloaded", "Downloaded"), "kr-dir-down"),
			kpiUp: chip("statusbar-upload", t("kr_det_uploaded", "Uploaded"), "kr-dir-up"),
			kpiRatio: chip("tab-traffic", t("kr_det_ratio", "Ratio"), "")
		};
		ctrl.insertBefore(kpi, ctrl.firstChild);
		/* Toggles sit just before the selects (which carry ms-auto). */
		var firstSelect = ctrl.querySelector("select");
		if (firstSelect) ctrl.insertBefore(toggles, firstSelect);
		else ctrl.appendChild(toggles);
	}

	function updateTrafKpi() {
		try {
			if (!traf || !window.theWebUI) return;
			var g = theWebUI.trafGraph;
			if (!g) return;
			var down = sumSeries(g, ["down", "oldDown"]);
			var up = sumSeries(g, ["up", "oldUp"]);
			traf.kpiDown.textContent = fmtBytes(down);
			traf.kpiUp.textContent = fmtBytes(up);
			traf.kpiRatio.textContent = down > 0 ? (Math.round((up / down) * 1000) / 1000).toFixed(3) : "—";
			var met = down > 0 && up / down >= 1;
			traf.kpiRatio.parentNode && traf.kpiRatio.parentNode.setAttribute("data-met", met ? "1" : "0");
		} catch (e) {}
	}

	function enhanceTrafToolbar() {
		try {
			var ctrl = document.getElementById("traf_graph_ctrl");
			if (!ctrl || ctrl.getAttribute("data-kr-tb")) return;
			var btn = ctrl.querySelector("button");
			if (btn) {
				btn.textContent = "";
				btn.className = "kr-flm-btn kr-traf-clear kr-icon-btn";
				btn.appendChild(maskSpan("log-clear"));
				if (kr && kr.tooltip) kr.tooltip(btn, t("kr_det_clear_stats", "Clear statistics"));
			}
			buildTrafChrome(ctrl);
			/* Keep Clear in the right-hand group next to the selects. */
			if (btn) ctrl.appendChild(btn);
			ctrl.setAttribute("data-kr-tb", "1");

			/* The plugin sizes the plot as #traf height minus the toolbar's
			 * CONTENT height, which ignores the toolbar's border/padding/margin
			 * and leaves no room for the x-axis labels (the bottom tick clips).
			 * Wrap resize to subtract the full toolbar box plus a label inset. */
			try {
				var tg = window.theWebUI && theWebUI.trafGraph;
				if (tg && tg.resize && !tg.__krResize) {
					tg.__krResize = true;
					var origResize = tg.resize.bind(tg);
					tg.resize = function (w, h) {
						try {
							var $traf = window.$ && $("#traf");
							var $ctrl = window.$ && $("#traf_graph_ctrl");
							if (!w && $traf) w = $traf.width();
							if (!h && $traf && $ctrl) {
								h = $traf.height() - ($ctrl.length ? $ctrl.outerHeight(true) : 0) - 22;
							}
						} catch (e) {}
						return origResize(w, h);
					};
				}
				if (tg && tg.resize) { tg.resize(); tg.draw && tg.draw(true); }
			} catch (e) {}

			/* Recompute the KPI chips after each data load. */
			if (window.theWebUI && typeof theWebUI.showTrafic === "function" && !theWebUI.showTrafic.__krWrapped) {
				var show = theWebUI.showTrafic;
				theWebUI.showTrafic = function () {
					var r = show.apply(this, arguments);
					updateTrafKpi();
					return r;
				};
				theWebUI.showTrafic.__krWrapped = true;
			}
			updateTrafKpi();
		} catch (e) { /* never break the bundle */ }
	}

	/* ------------------------------------------------------------
	 * 5b. Speed pane toolbar -- inline series toggles above the live plot,
	 *     the stock flot legend hidden by CSS. The plot stays bound to #Speed;
	 *     a sibling toolbar scoped to the Speed tab is added and the plot is
	 *     shrunk by the toolbar height so the x-axis labels stay visible.
	 * ---------------------------------------------------------- */
	function syncSpeedToolbar() {
		try {
			var bar = document.getElementById("kr-speed-toolbar");
			if (!bar) return;
			bar.style.display = (resolveActiveTab() === "Speed") ? "flex" : "none";
		} catch (e) {}
	}

	/* Wrap the graph's own resize (driven by the core from #tdcont size) so the
	 * plot fits the pane: recompute the height LIVE from #tdcont minus the
	 * toolbar box minus x-axis label room, rather than trusting the passed-in
	 * height (which is the full pane and goes stale once the toolbar is added). */
	function wrapSpeedResize() {
		try {
			var sg = window.theWebUI && theWebUI.speedGraph;
			if (!sg || !sg.resize || sg.__krResize) return;
			sg.__krResize = true;
			var orig = sg.resize.bind(sg);
			sg.resize = function (w, h) {
				try {
					var bar = document.getElementById("kr-speed-toolbar");
					var tdc = document.getElementById("tdcont");
					if (bar && bar.offsetParent !== null && tdc) {
						var tdcs = getComputedStyle(tdc);
						var padV = (parseFloat(tdcs.paddingTop) || 0) + (parseFloat(tdcs.paddingBottom) || 0);
						var mb = parseFloat(getComputedStyle(bar).marginBottom) || 0;
						if (!w) w = tdc.clientWidth - (parseFloat(tdcs.paddingLeft) || 0) - (parseFloat(tdcs.paddingRight) || 0);
						h = Math.max(1, tdc.clientHeight - padV - bar.offsetHeight - mb - 6);
					}
				} catch (e) {}
				return orig(w, h);
			};
		} catch (e) {}
	}

	/* Size the plot now and again on the next frame, once the toolbar is laid
	 * out and the pane has settled to its final height. */
	function resizeSpeed() {
		var go = function () {
			try {
				if (window.theWebUI && typeof theWebUI.resizeGraph === "function") theWebUI.resizeGraph();
				var sg = window.theWebUI && theWebUI.speedGraph;
				if (sg && sg.draw) sg.draw(true);
			} catch (e) {}
		};
		go();
		try { requestAnimationFrame(go); } catch (e) {}
	}

	function enhanceSpeedToolbar() {
		try {
			var speed = document.getElementById("Speed");
			if (!speed || speed.getAttribute("data-kr-tb")) return;
			var host = speed.parentNode;
			if (!host) return;
			var bar = document.createElement("div");
			bar.id = "kr-speed-toolbar";
			bar.className = "kr-speed-toolbar";
			var toggles = document.createElement("div");
			toggles.className = "kr-traf-toggles";
			toggles.appendChild(seriesChip(SPEED_SERIES.down, "kr-dir-down", t("kr_det_download", "Download")));
			toggles.appendChild(seriesChip(SPEED_SERIES.up, "kr-dir-up", t("kr_det_upload", "Upload")));
			bar.appendChild(toggles);
			host.insertBefore(bar, speed);
			speed.setAttribute("data-kr-tb", "1");
			wrapSpeedResize();
			syncSpeedToolbar();
			resizeSpeed();
		} catch (e) { /* never break the bundle */ }
	}

	function watchForFileManager() {
		try {
			var existing = document.getElementById("flm-navpath");
			if (existing) enhanceFileManager(existing);
			var host = document.getElementById("tdcont") || document.body;
			new MutationObserver(function () {
				var np = document.getElementById("flm-navpath");
				if (np && !np.getAttribute("data-kr-crumbed")) enhanceFileManager(np);
			}).observe(host, { childList: true, subtree: true });
		} catch (e) { /* never break the bundle */ }
	}

	/* ------------------------------------------------------------
	 * 6. Detail tab strip -- fit the 12 tabs to the available width:
	 *    labels when they fit, icon-only below that (the active tab
	 *    keeps its label + underline), and a "More" popover for any
	 *    that still will not fit. Never a horizontal scrollbar. The
	 *    File Manager console toggle is moved out of the strip into
	 *    the FM toolbar so it never competes for tab room.
	 * ---------------------------------------------------------- */
	var tabMore = null;
	var fitScheduled = false;

	function tabBar() { return document.getElementById("tabbar"); }

	/* The Log pane's core Clear button is a 32px pane-toolbar icon square; tag
	 * it onto the shared primitive (idempotent, handler untouched). */
	function tagClearLog() {
		try {
			var b = document.getElementById("clear_log");
			if (b) b.classList.add("kr-icon-btn");
		} catch (e) {}
	}

	function tabItems(bar) {
		var out = [];
		var kids = bar.children;
		for (var i = 0; i < kids.length; i++) {
			if (kids[i].tagName === "LI" && kids[i].id && kids[i].id.indexOf("tab_") === 0) out.push(kids[i]);
		}
		return out;
	}

	function setTabTip(li, on) {
		var a = li.querySelector("a.nav-link");
		if (!a) return;
		if (on && kr && kr.tooltip) kr.tooltip(a, (a.textContent || "").trim());
		else a.removeAttribute("data-kr-tip");
	}

	/* Move the FM console toggle (#fMan_showconsole, which core appends to
	 * #tabbar) into the FM toolbar, on the right before the Recent trigger. */
	function relocateConsole() {
		try {
			var btn = document.getElementById("fMan_showconsole");
			if (!btn) return;
			var np = document.getElementById("flm-navpath");
			var group = np && (np.closest(".input-group") || np.parentNode);
			if (!group) return;
			var wrap = btn.parentNode;
			var wrapped = wrap && wrap.classList && wrap.classList.contains("kr-flm-console-wrap");
			if (wrapped) {
				if (wrap.parentNode === group) return; /* already placed */
			} else {
				/* Wrap the core <input> so it can carry a leading glyph (an input
				 * cannot host a child or pseudo-element); the input and its handler
				 * are moved, never replaced. */
				btn.classList.add("kr-flm-console");
				if (kr && kr.tooltip) kr.tooltip(btn, (btn.value || t("kr_det_console", "Console")));
				wrap = document.createElement("span");
				wrap.className = "kr-flm-console-wrap";
				wrap.appendChild(maskSpan("fm-console"));
				wrap.appendChild(btn);
			}
			group.insertBefore(wrap, group.querySelector(".kr-flm-recent") || null);
		} catch (e) {}
	}

	function ensureMore(bar) {
		if (tabMore && tabMore.parentNode === bar) return tabMore;
		var li = document.createElement("li");
		li.className = "nav-item kr-tab-more-item";
		var btn = document.createElement("button");
		btn.type = "button";
		btn.className = "nav-link kr-tab-more";
		btn.setAttribute("aria-haspopup", "listbox");
		btn.setAttribute("aria-expanded", "false");
		btn.setAttribute("aria-label", t("kr_det_more_tabs", "More tabs"));
		var lbl = document.createElement("span");
		lbl.className = "kr-tab-more-label";
		lbl.textContent = t("kr_det_more", "More");
		var chev = document.createElement("span");
		chev.className = "kr-select-chevron";
		chev.setAttribute("aria-hidden", "true");
		btn.appendChild(lbl);
		btn.appendChild(chev);
		li.appendChild(btn);
		wireMore(btn);
		bar.appendChild(li);
		tabMore = li;
		return li;
	}

	function wireMore(btn) {
		var panel = null;
		function parked() {
			var bar = tabBar(), out = [];
			if (bar) tabItems(bar).forEach(function (li) { if (li.classList.contains("kr-tab-parked")) out.push(li); });
			return out;
		}
		function close(refocus) {
			if (!panel) return;
			document.removeEventListener("mousedown", onDown, true);
			window.removeEventListener("resize", onMove);
			window.removeEventListener("scroll", onMove, true);
			if (panel.parentNode) panel.parentNode.removeChild(panel);
			panel = null;
			btn.setAttribute("aria-expanded", "false");
			if (refocus) btn.focus();
		}
		function onDown(e) { if (btn.contains(e.target) || (panel && panel.contains(e.target))) return; close(false); }
		function onMove(e) {
			if (!panel) return;
			if (kr && kr.panelScrolledInside && kr.panelScrolledInside(e, panel)) return;
			place();
		}
		function place() {
			var r = btn.getBoundingClientRect();
			var vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight, pad = 8, gap = 4;
			panel.querySelector(".kr-select-list").style.maxHeight = Math.min(320, Math.floor(vh * 0.7), vh - r.bottom - pad) + "px";
			var pw = panel.offsetWidth;
			panel.style.top = Math.max(pad, r.bottom + gap) + "px";
			panel.style.left = Math.min(Math.max(pad, r.right - pw), Math.max(pad, vw - pw - pad)) + "px";
		}
		function open() {
			panel = document.createElement("div");
			panel.className = "kr-select-panel kr-tab-more-panel";
			panel.setAttribute("role", "presentation");
			panel.addEventListener("mousedown", function (e) { e.preventDefault(); });
			var list = document.createElement("div");
			list.className = "kr-select-list";
			list.setAttribute("role", "listbox");
			list.setAttribute("aria-label", t("kr_det_more_tabs", "More tabs"));
			parked().forEach(function (li) {
				var a = li.querySelector("a.nav-link");
				var row = document.createElement("button");
				row.type = "button";
				row.className = "kr-select-option kr-tab-more-opt";
				row.setAttribute("role", "option");
				var glyph = document.createElement("span");
				glyph.className = "kr-tab-more-glyph";
				glyph.setAttribute("aria-hidden", "true");
				if (a) {
					var m = getComputedStyle(a, "::before");
					glyph.style.webkitMaskImage = m.webkitMaskImage || m.maskImage;
					glyph.style.maskImage = m.maskImage || m.webkitMaskImage;
				}
				var lbl = document.createElement("span");
				lbl.className = "kr-select-option-label";
				lbl.textContent = (a ? a.textContent : "").trim();
				row.appendChild(glyph);
				row.appendChild(lbl);
				row.addEventListener("click", function (e) {
					e.preventDefault();
					try { if (window.theTabs) theTabs.show(li.id.slice(4)); } catch (ex) {}
					close(true);
				});
				list.appendChild(row);
			});
			panel.appendChild(list);
			document.body.appendChild(panel);
			btn.setAttribute("aria-expanded", "true");
			place();
			panel.classList.add("kr-open");
			document.addEventListener("mousedown", onDown, true);
			window.addEventListener("resize", onMove);
			window.addEventListener("scroll", onMove, true);
		}
		btn.addEventListener("click", function () { if (panel) close(true); else open(); });
		btn.addEventListener("keydown", function (e) {
			if (!panel && (e.key === "Enter" || e.key === " " || e.key === "Spacebar" || e.key === "ArrowDown")) { e.preventDefault(); open(); }
			else if (panel && e.key === "Escape") { e.preventDefault(); close(true); }
		});
	}

	function fitTabs() {
		try {
			var bar = tabBar();
			if (!bar) return;
			relocateConsole();
			var items = tabItems(bar);
			if (!items.length) return;
			/* Reset to the widest (labelled, nothing parked) state first. */
			items.forEach(function (li) { li.classList.remove("kr-tab-parked"); setTabTip(li, false); });
			bar.classList.remove("kr-tabs-icononly");
			if (tabMore) tabMore.style.display = "none";
			if (bar.scrollWidth <= bar.clientWidth + 1) return;
			/* Labels do not fit -- go icon-only, the active tab keeps its label. */
			bar.classList.add("kr-tabs-icononly");
			items.forEach(function (li) { if (!li.classList.contains("selected")) setTabTip(li, true); });
			if (bar.scrollWidth <= bar.clientWidth + 1) return;
			/* Still too wide -- park trailing non-active tabs into a More menu. */
			var more = ensureMore(bar);
			more.style.display = "";
			items = tabItems(bar);
			for (var i = items.length - 1; i >= 0 && bar.scrollWidth > bar.clientWidth + 1; i--) {
				if (!items[i].classList.contains("selected")) items[i].classList.add("kr-tab-parked");
			}
		} catch (e) { /* never break the bundle */ }
	}

	function scheduleFit() {
		if (fitScheduled) return;
		fitScheduled = true;
		var run = function () { fitScheduled = false; fitTabs(); };
		if (window.requestAnimationFrame) requestAnimationFrame(run);
		else setTimeout(run, 16);
	}

	function watchTabStrip() {
		try {
			fitTabs();
			window.addEventListener("resize", scheduleFit);
			var bar = tabBar();
			if (bar && window.ResizeObserver) new ResizeObserver(scheduleFit).observe(bar);
		} catch (e) { /* never break the bundle */ }
	}

	/* autodl-irssi log tab: regroup the stock buttons into a pane toolbar
	 * (actions | backup+restore) without replacing nodes or handlers. */
	function enhanceAutodlTab() {
		try {
			var tab = document.getElementById("autodl-irssi-tab");
			var bar = document.getElementById("autodl-log-buttons");
			if (!tab || !bar || bar.getAttribute("data-kr-autodl") === "1") return;
			bar.setAttribute("data-kr-autodl", "1");
			bar.classList.add("kr-pane-toolbar", "kr-autodl-toolbar");

			var actions = document.createElement("div");
			actions.className = "kr-autodl-actions";
			var config = document.createElement("div");
			config.className = "kr-autodl-config";

			var actionIds = {
				"autodl-log-clear-button": 1,
				"autodl-log-update-button": 1,
				"autodl-log-whatsnew-button": 1,
				"autodl-log-version-button": 1,
				"autodl-log-reload-trackers-button": 1,
				"autodl-log-reload-button": 1
			};
			var nodes = Array.prototype.slice.call(bar.childNodes);
			nodes.forEach(function (n) {
				if (n.nodeType !== 1) {
					if (n.parentNode === bar) bar.removeChild(n);
					return;
				}
				if (n.id === "autodl-restore" || n.id === "autodl-log-backup-button") config.appendChild(n);
				else if (actionIds[n.id] || (n.tagName === "INPUT" && n.classList.contains("Button"))) actions.appendChild(n);
				else config.appendChild(n);
			});
			if (actions.childNodes.length) bar.appendChild(actions);
			if (config.childNodes.length) bar.appendChild(config);
		} catch (e) { /* never break the bundle */ }
	}

	/* Re-apply chart/toolbar work when the relevant tab is shown, so a
	 * lazily-built graph or toolbar is caught the first time it appears. */
	function hookTabShow() {
		try {
			if (!window.theTabs || theTabs.__krWrapped) return;
			var show = theTabs.show;
			theTabs.show = function (id) {
				var r = show.apply(this, arguments);
				currentTab = id;
				refreshEmpty();
				if (id === "gcont") renderGeneral();
				if (id === "lcont") tagClearLog();
				if (id === "traf") { enhanceTrafToolbar(); styleCharts(); updateTrafKpi(); }
				if (id === "Speed") { enhanceSpeedToolbar(); styleCharts(); resizeSpeed(); }
				if (id === "autodl-irssi-tab") enhanceAutodlTab();
				syncSpeedToolbar();
				scheduleFit();
				return r;
			};
			theTabs.__krWrapped = true;
		} catch (e) { /* never break the bundle */ }
	}

	buildGeneralOverview();
	installEmptyState();
	watchForFileManager();
	enhanceTrafToolbar();
	enhanceSpeedToolbar();
	enhanceAutodlTab();
	styleCharts();
	hookTabShow();
	watchTabStrip();
	tagClearLog();
	if (kr && kr.onVariant) kr.onVariant(styleCharts);
	/* One delayed pass -- the traffic and speed graphs are built during
	 * lang-load, which may land just after this module runs. */
	setTimeout(function () {
		enhanceTrafToolbar();
		enhanceSpeedToolbar();
		enhanceAutodlTab();
		styleCharts();
		updateTrafKpi();
		scheduleFit();
	}, 1500);
})(window.kr);
