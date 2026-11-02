/**
 * @file Sidebar rail collapse (state + persistence on window.kr.rail).
 * @requires window.kr, theWebUI, jQuery
 */
;(function (kr) {
	"use strict";
	if (!kr) return;
	if (window.krSidebarInit) return;
	window.krSidebarInit = true;

	const RAIL_SETTING = "webui.kr.rail";
	const COOKIE_DAYS = 365;
	const root = document.documentElement;

	const t = (key, fallback) =>
		(kr.lib && kr.lib.i18n ? kr.lib.i18n.t(key, fallback) :
			((window.theUILang && theUILang[key]) || fallback));

	/* Localized labels for the toggle; English defaults seed theUILang so a
	 * translation (loaded before the modules run) wins when present. */
	if (window.theUILang) {
		theUILang.kr_nav_collapse = theUILang.kr_nav_collapse || "Collapse sidebar";
		theUILang.kr_nav_expand = theUILang.kr_nav_expand || "Expand sidebar";
	}

	function sidebar() { return document.getElementById("offcanvas-sidepanel"); }

	/* Mirror the dashboard's cookie so the two shells share one choice:
	 * Path=/ makes it visible to the v4 dashboard on the same host. */
	function writeCookie(value) {
		document.cookie = "kr_sidebar=" + value + "; Path=/; Max-Age=" +
			(COOKIE_DAYS * 24 * 60 * 60) + "; SameSite=Lax";
	}
	function cookieCollapsed() {
		var m = document.cookie.match(/(?:^|;\s*)kr_sidebar=([^;]*)/);
		return m ? (m[1] === "collapsed") : null; /* null = unset */
	}

	/* ONE tooltip formatter for every category row, in both states: "Label ·
	 * count · size" (count/size dropped when the row has none). Collapsed rows
	 * hide their label so the tip is essential; expanded rows share the same
	 * form so it never diverges by run. The custom tooltip is body-level
	 * (position:fixed) so the rail never clips it. The observer below re-applies
	 * it on every count/size/text/selected/title change, so the core title the
	 * global migrator copies never leaves a divergent form behind. */
	function applyRowTips() {
		var sp = sidebar();
		if (!sp) return;
		var rail = !!collapsed;
		var rows = sp.querySelectorAll("panel-label");
		for (var i = 0; i < rows.length; i++) {
			var pl = rows[i];
			var text = (pl.getAttribute("text") || "").trim();
			if (!text) continue;
			var parts = [text];
			var count = pl.getAttribute("count");
			if (count != null && count !== "") parts.push(count);
			var size = (pl.getAttribute("size") || "").trim();
			if (size) parts.push(size);
			/* Rail mode: open the tip to the right of the collapsed rail so it
			 * never drops below the row and covers the next item. Expanded mode
			 * keeps the default placement; clear the side flag on the way back. */
			kr.tooltip(pl, parts.join(" · "), rail ? { side: "right" } : undefined);
			if (!rail) pl.removeAttribute("data-kr-tip-side");
		}
	}

	/* The canonical reflow: recompute the layout from hsplit/vsplit so the
	 * table + details drawer re-fit to the new main-column width and the
	 * dxSTable scroll area is corrected. */
	function reflow() {
		if (window.theWebUI && typeof theWebUI.resize === "function") {
			try { theWebUI.resize(); } catch (e) { /* layout not ready yet */ }
		}
	}

	function syncToggle(collapsed) {
		var tgl = document.querySelector(".kr-nav-toggle");
		if (!tgl) return;
		tgl.setAttribute("aria-expanded", collapsed ? "false" : "true");
		tgl.setAttribute("data-collapsed", collapsed ? "true" : "false");
		var lbl = collapsed ? t("kr_nav_expand", "Expand sidebar")
			: t("kr_nav_collapse", "Collapse sidebar");
		tgl.setAttribute("aria-label", lbl);
		kr.tooltip(tgl, lbl);
	}

	var collapsed = false;

	function apply(next, persist) {
		collapsed = !!next;
		if (collapsed) root.setAttribute("data-kr-rail", "1");
		else root.removeAttribute("data-kr-rail");
		syncToggle(collapsed);
		applyRowTips();
		reflow();
		if (persist) {
			writeCookie(collapsed ? "collapsed" : "expanded");
			if (window.theWebUI && theWebUI.settings) {
				theWebUI.settings[RAIL_SETTING] = collapsed ? 1 : 0;
				if (typeof theWebUI.save === "function") {
					try { theWebUI.save(); } catch (e) { /* settings save is best-effort */ }
				}
			}
		}
	}

	/* window.kr.rail -- the single source of truth; the top-bar toggle calls
	 * toggle(), lazily, so load order between the two modules never matters. */
	kr.rail = {
		isCollapsed: function () { return collapsed; },
		set: function (v) { apply(v, true); },
		toggle: function () { apply(!collapsed, true); }
	};

	/* Initial state follows the kr_sidebar cookie (same idea as the
	 * variant engine following HarmonyUI); when unset, the stored rail setting;
	 * else expanded. A no-persist apply so the first paint writes nothing back. */
	function initialCollapsed() {
		var c = cookieCollapsed();
		if (c !== null) return c;
		var s = (window.theWebUI && theWebUI.settings) ? theWebUI.settings[RAIL_SETTING] : undefined;
		return s === 1 || s === "1" || s === true;
	}
	apply(initialCollapsed(), false);

	/* Keep the row tooltips current and single-formatted as counts update and
	 * after the global migrator copies a core title (this observer is created
	 * after init's migrator, so its callback runs last and wins). */
	if (window.MutationObserver) {
		var sp = sidebar();
		if (sp) {
			new MutationObserver(applyRowTips).observe(sp, {
				subtree: true, attributes: true,
				attributeFilter: ["count", "text", "size", "selected", "title"]
			});
		}
	}
})(window.kr);
