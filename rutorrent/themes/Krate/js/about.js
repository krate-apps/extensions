/**
 * @file What's New dialog + Help footer (bundled changelogs, safe markdown).
 * @requires window.kr, window.kr.lib.markdown, theDialogManager, theUILang
 */
;(function (kr) {
	"use strict";
	if (!kr) return;
	if (window.krAboutInit) return;
	window.krAboutInit = true;

	const t = (key, fallback) =>
		(kr.lib && kr.lib.i18n ? kr.lib.i18n.t(key, fallback) :
			((window.theUILang && theUILang[key]) || fallback));

	const VERSION = kr.version || "";
	const md = (kr.lib && kr.lib.markdown) || null;

	const VER_RE = /^\d+\.\d+\.\d+$/;
	const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
	const FILE_RE = /^changelogs\/v\d+\.\d+\.\d+\.md$/;

	function validIndex(data) {
		if (!Array.isArray(data) || data.length > 200) return null;
		const out = [];
		for (let i = 0; i < data.length; i++) {
			const e = data[i];
			if (!e || typeof e !== "object") return null;
			if (typeof e.version !== "string" || !VER_RE.test(e.version)) return null;
			if (typeof e.date !== "string" || !DATE_RE.test(e.date)) return null;
			if (typeof e.file !== "string" || !FILE_RE.test(e.file)) return null;
			out.push({ version: e.version, date: e.date, file: e.file });
		}
		return out;
	}

	function renderMarkdown(container, text) {
		if (md && typeof md.renderMarkdown === "function") {
			md.renderMarkdown(container, text);
			return;
		}
		container.appendChild(document.createTextNode(String(text)));
	}

	/* ============================================================
	 * Fetch helpers.
	 * ============================================================ */
	const notesCache = {};

	function localUrl(path) { return kr.path + path + (VERSION ? "?kr=" + VERSION : ""); }

	/* Fetch text once and cache it; same-origin for the bundled files. */
	function fetchText(url, opts) {
		if (typeof fetch !== "function") return Promise.reject();
		if (notesCache[url] != null) return Promise.resolve(notesCache[url]);
		return fetch(url, opts).then(function (r) {
			if (!r.ok) throw 0;
			return r.text();
		}).then(function (txt) { notesCache[url] = txt; return txt; });
	}

	/* ============================================================
	 * What's new dialog -- built on the shared dialog chrome.
	 * ============================================================ */
	var wnBody = null;

	function ensureDialog() {
		var existing = document.getElementById("krWhatsNew");
		if (existing) {
			if (!wnBody) wnBody = existing.querySelector(".kr-wn-body");
			return true;
		}
		if (!window.theDialogManager || typeof theDialogManager.make !== "function") return false;
		wnBody = document.createElement("div");
		wnBody.className = "kr-wn-body";
		try {
			/* Non-modal, like the sibling Help/About info dialogs it is reached from.
			 * The core make() adds the close button in the header; dialogs.css styles
			 * it, and the window cap in about.css keeps the header on screen. */
			theDialogManager.make("krWhatsNew", t("kr_wn_title", "What's new in Krate"), wnBody);
		} catch (e) { return false; }
		installEsc();
		return true;
	}

	/* Escape closes the dialog when it is open (the non-modal core path does not
	 * bind it); installed once. */
	function installEsc() {
		if (window.krWnEsc) return;
		window.krWnEsc = true;
		document.addEventListener("keydown", function (e) {
			if (e.key !== "Escape" && e.keyCode !== 27) return;
			var dlg = document.getElementById("krWhatsNew");
			/* Hidden shows as display:none (set by the manager's hide); a fixed-
			 * positioned window has no offsetParent, so that cannot gate this. */
			if (!dlg || dlg.style.display === "none") return;
			try { theDialogManager.hide("krWhatsNew"); } catch (ex) { /* hide is best-effort */ }
		}, true);
	}

	/* Re-centre the window after its height changes. The body cap bounds the
	 * window to the viewport, but the host centres on the size at show() time,
	 * before the async notes fill; calling the host's own centre after each fill
	 * keeps the capped window centred without depending on a host ResizeObserver. */
	function recenter() {
		try {
			if (theDialogManager && typeof theDialogManager.center === "function" &&
				theDialogManager.visible && theDialogManager.visible.indexOf("krWhatsNew") >= 0) {
				theDialogManager.center("krWhatsNew");
			}
		} catch (e) { /* centre is best-effort */ }
	}

	/* Render the bundled changelogs newest first, same-origin from the theme
	 * path. On any failure show the empty state, never an error. */
	function renderLocalChangelogs(container) {
		fetchText(localUrl("changelogs/index.json"), { credentials: "same-origin" })
			.then(function (txt) {
				var idx = validIndex(JSON.parse(txt));
				if (!idx || !idx.length) throw 0;
				var chain = Promise.resolve();
				idx.forEach(function (entry) {
					chain = chain.then(function () {
						return fetchText(localUrl(entry.file), { credentials: "same-origin" })
							.then(function (md) {
								var sec = document.createElement("section");
								sec.className = "kr-wn-entry";
								renderMarkdown(sec, md);
								container.appendChild(sec);
								recenter();
							}).catch(function () { /* skip one unreadable file */ });
					});
				});
				return chain;
			})
			.catch(function () {
				if (container.childNodes.length) return;
				var empty = document.createElement("p");
				empty.className = "kr-wn-empty";
				empty.textContent = t("kr_wn_none", "No release notes yet.");
				container.appendChild(empty);
				recenter();
			});
	}

	function renderDialog() {
		if (!wnBody) return;
		wnBody.textContent = "";
		var local = document.createElement("div");
		local.className = "kr-wn-local";
		wnBody.appendChild(local);
		renderLocalChangelogs(local);
	}

	/* The one shared opener: the Help-dialog link and the palette both call it. */
	kr.openWhatsNew = function () {
		if (!ensureDialog()) return;
		if (!wnBody) wnBody = document.querySelector("#krWhatsNew .kr-wn-body");
		renderDialog();
		try { theDialogManager.show("krWhatsNew"); } catch (e) { /* show is best-effort */ }
		recenter();
	};

	/* ============================================================
	 * Help-dialog version line + What's new link.
	 * ============================================================ */
	function decorateHelp() {
		var dlg = document.getElementById("dlgHelp");
		if (!dlg) return false;
		if (dlg.getAttribute("data-kr-about") === "1") return true;
		dlg.setAttribute("data-kr-about", "1");
		var foot = document.createElement("div");
		foot.className = "kr-about-foot";
		var ver = document.createElement("span");
		ver.className = "kr-about-version";
		ver.textContent = t("kr_wn_version", "Krate v{version}").replace("{version}", VERSION);
		var link = document.createElement("a");
		link.href = "#";
		link.className = "kr-about-link";
		link.textContent = t("kr_wn_link", "What's new");
		link.addEventListener("click", function (e) {
			e.preventDefault();
			if (typeof kr.openWhatsNew === "function") kr.openWhatsNew();
		});
		foot.appendChild(ver);
		foot.appendChild(link);
		dlg.appendChild(foot);
		return true;
	}

	/* The Help dialog is built once by the core at startup; try now, and if it
	 * is not there yet watch the dialog container for it, then stop. */
	function decorateHelpWhenReady() {
		if (decorateHelp()) return;
		if (!window.MutationObserver) return;
		var host = document.getElementById("dialog-container") || document.body;
		if (!host) return;
		var obs = new MutationObserver(function () {
			if (decorateHelp()) obs.disconnect();
		});
		obs.observe(host, { childList: true, subtree: true });
	}

	decorateHelpWhenReady();
})(window.kr);
