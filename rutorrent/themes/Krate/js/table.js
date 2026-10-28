/**
 * @file Torrent table chrome hooks.
 * @requires window.kr, theWebUI, jQuery
 */
;(function (kr) {
	"use strict";
	void kr;

	function syncOne(mv) {
		try {
			var pct = parseFloat(mv.style.width);
			if (isNaN(pct)) return;
			if (pct < 0) pct = 0;
			if (pct > 100) pct = 100;
			var td = mv.closest ? mv.closest("td") : mv.parentNode;
			if (td && td.style) {
				if (!td.classList.contains("kr-meter-cell")) td.classList.add("kr-meter-cell");
				td.style.setProperty("--kr-p", pct / 100);
			}
		} catch (e) { /* never break the bundle */ }
	}

	function syncAll(root) {
		try {
			var mvs = (root || document).querySelectorAll(".meter-value");
			Array.prototype.forEach.call(mvs, syncOne);
		} catch (e) { /* never break the bundle */ }
	}

	/* Torrent-row Status cell -> a state pill. Mirror the core's Status_* class
	 * onto data-kr-state on col-1; css/table.css draws the pill. */
	var STATUS_STATE = {
		Status_Down: "downloading", Status_Up: "seeding", Status_Up_Down: "downloading",
		Status_Incompleted: "stopped", Status_Paused: "paused",
		Status_Error: "error", Status_Error_Up: "error", Status_Error_Down: "error",
		Status_Completed: "seeding", Status_Queued_Up: "queued", Status_Queued_Down: "queued",
		Status_Checking: "checking"
	};
	function rowState(tr) {
		var icon = tr.querySelector(".stable-icon");
		if (!icon) return "";
		for (var i = 0; i < icon.classList.length; i++) {
			var s = STATUS_STATE[icon.classList[i]];
			if (s) return s;
		}
		return "";
	}
	function tagStatusRow(tr) {
		if (!tr || tr.nodeType !== 1) return;
		var cell = tr.querySelector("td.stable-List-col-1");
		if (!cell) return;
		var s = rowState(tr);
		if (s) { if (cell.getAttribute("data-kr-state") !== s) cell.setAttribute("data-kr-state", s); }
		else if (cell.hasAttribute("data-kr-state")) cell.removeAttribute("data-kr-state");
	}
	function tagStatusAll(root) {
		try {
			var rows = root.querySelectorAll("tr");
			Array.prototype.forEach.call(rows, tagStatusRow);
		} catch (e) { /* never break the bundle */ }
	}

	function closestRow(node) {
		while (node && node.nodeType === 1) {
			if (node.tagName === "TR") return node;
			node = node.parentNode;
		}
		return null;
	}

	function watch(root, withStatus) {
		try {
			if (!root || root.getAttribute("data-kr-prog")) return;
			root.setAttribute("data-kr-prog", "1");
			syncAll(root);
			if (withStatus) tagStatusAll(root);

			var dirtyMeters = [];
			var dirtyRows = [];
			var needFull = false;
			var pending = false;

			function flush() {
				pending = false;
				if (needFull) {
					needFull = false;
					dirtyMeters.length = 0;
					dirtyRows.length = 0;
					syncAll(root);
					if (withStatus) tagStatusAll(root);
					return;
				}
				var i, seen;
				if (dirtyMeters.length) {
					seen = null;
					for (i = 0; i < dirtyMeters.length; i++) {
						var mv = dirtyMeters[i];
						if (!mv || !mv.isConnected) continue;
						if (seen) {
							if (seen.has(mv)) continue;
							seen.add(mv);
						} else if (dirtyMeters.length > 8) {
							seen = new Set();
							seen.add(mv);
						}
						syncOne(mv);
					}
					dirtyMeters.length = 0;
				}
				if (withStatus && dirtyRows.length) {
					seen = null;
					for (i = 0; i < dirtyRows.length; i++) {
						var tr = dirtyRows[i];
						if (!tr || !tr.isConnected) continue;
						if (seen) {
							if (seen.has(tr)) continue;
							seen.add(tr);
						} else if (dirtyRows.length > 8) {
							seen = new Set();
							seen.add(tr);
						}
						tagStatusRow(tr);
					}
					dirtyRows.length = 0;
				}
			}

			function schedule() {
				if (pending) return;
				pending = true;
				requestAnimationFrame(flush);
			}

			new MutationObserver(function (records) {
				for (var i = 0; i < records.length; i++) {
					var r = records[i];
					var t = r.target;
					if (r.type === "childList" && r.addedNodes && r.addedNodes.length) {
						needFull = true;
					} else if (t && t.classList && t.classList.contains("meter-value")) {
						dirtyMeters.push(t);
					} else if (withStatus && t && t.classList && t.classList.contains("stable-icon")) {
						var row = closestRow(t);
						if (row) dirtyRows.push(row);
					} else if (r.type === "attributes" && t && t.classList && t.classList.contains("meter-value")) {
						dirtyMeters.push(t);
					}
				}
				if (needFull || dirtyMeters.length || dirtyRows.length) schedule();
			}).observe(root, {
				subtree: true,
				childList: true,
				attributes: true,
				attributeFilter: withStatus ? ["style", "class"] : ["style"]
			});
		} catch (e) { /* never break the bundle */ }
	}

	/* Tag FileList / TrackerList / PluginList cells with data-kr-col (and
	 * priority / enabled / plugin status pills) so css/details.css can dress
	 * the inset card tables. */
	function tableIds(key) {
		try {
			var t = window.theWebUI && theWebUI.tables ? theWebUI.tables[key] : null;
			var obj = t && t.obj;
			return obj && obj.ids ? obj.ids : null;
		} catch (e) { return null; }
	}
	function tagDetailRow(tr, ids, prefix) {
		if (!tr || !ids) return;
		var cells = tr.children;
		for (var i = 0; i < cells.length; i++) {
			var td = cells[i];
			if (!td || td.tagName !== "TD") continue;
			var m = new RegExp("stable-" + prefix + "-col-(\\d+)").exec(td.className || "");
			if (!m) continue;
			var id = ids[parseInt(m[1], 10)];
			if (id == null) continue;
			if (td.getAttribute("data-kr-col") !== id) td.setAttribute("data-kr-col", id);
			if (id === "priority") {
				var ptxt = ((td.textContent || "").replace(/\s+/g, " ").trim());
				var prio = td.getAttribute("data-kr-prio");
				/* Core stores 0..3; display text varies by language — prefer a
				 * digit in the cell, else map common EN/FR labels. */
				var n = parseInt(ptxt, 10);
				if (isNaN(n)) {
					var low = ptxt.toLowerCase();
					if (/don.?t|ne pas|off|0/.test(low)) n = 0;
					else if (/low|basse|faible/.test(low)) n = 1;
					else if (/normal|moyenne|medium/.test(low)) n = 2;
					else if (/high|haute|élev/.test(low)) n = 3;
					else n = 2;
				}
				if (String(n) !== prio) td.setAttribute("data-kr-prio", String(n));
			} else if (id === "enabled" || id === "enable") {
				var et = ((td.textContent || "").replace(/\s+/g, " ").trim()).toLowerCase();
				var on = /^(1|yes|oui|true|on|✓|✔|enabled|activ)/.test(et) ? "1" : "0";
				if (td.getAttribute("data-kr-on") !== on) td.setAttribute("data-kr-on", on);
			} else if (id === "status") {
				var st = ((td.textContent || "").replace(/\s+/g, " ").trim()).toLowerCase();
				var tone = /disable|désactiv|inactiv|off|0/.test(st) ? "off" : "on";
				if (td.getAttribute("data-kr-plg") !== tone) td.setAttribute("data-kr-plg", tone);
			} else if (id === "launch") {
				var lt = ((td.textContent || "").replace(/\s+/g, " ").trim()).toLowerCase();
				var launch = /lock|verrouill|permanent|2/.test(lt) ? "locked"
					: /enable|activ|startup|démarr|1/.test(lt) ? "on" : "off";
				if (td.getAttribute("data-kr-launch") !== launch) td.setAttribute("data-kr-launch", launch);
			}
		}
	}
	function tagDetailAll(root, key, prefix) {
		try {
			var ids = tableIds(key);
			if (!ids || !root) return;
			var rows = root.querySelectorAll(".stable-body tbody:not(.stable-virtpad) tr");
			Array.prototype.forEach.call(rows, function (tr) { tagDetailRow(tr, ids, prefix); });
		} catch (e) { /* never break the bundle */ }
	}
	function watchDetail(root, key, prefix) {
		try {
			if (!root || root.getAttribute("data-kr-detail")) return;
			root.setAttribute("data-kr-detail", "1");
			tagDetailAll(root, key, prefix);
			var pending = false;
			function flush() {
				pending = false;
				tagDetailAll(root, key, prefix);
			}
			function schedule() {
				if (pending) return;
				pending = true;
				setTimeout(flush, 40);
			}
			new MutationObserver(schedule).observe(root, {
				subtree: true, childList: true, characterData: true,
				attributes: true, attributeFilter: ["class"]
			});
		} catch (e) { /* never break the bundle */ }
	}

	function init() {
		watch(document.getElementById("List"), true);
		watch(document.getElementById("FileList"));
		watchDetail(document.getElementById("FileList"), "fls", "FileList");
		watchDetail(document.getElementById("TrackerList"), "trk", "TrackerList");
		watchDetail(document.getElementById("PluginList"), "plg", "PluginList");
	}

	var WIDTH_FLOOR = { size: 84, status: 156, created: 180, dl: 88, ul: 88, eta: 72, addtime: 132 };
	var HST_WIDTH_FLOOR = { time: 132, created: 132, seedingtime: 132, addtime: 132, size: 84, label: 72 };
	function floorColumns(key, floors) {
		var t = window.theWebUI && theWebUI.tables ? theWebUI.tables[key] : null;
		var obj = t && t.obj;
		if (!obj || !obj.colsdata) return;
		var changed = false;
		obj.colsdata.forEach(function (c) {
			var floor = floors[c.id];
			if (floor && (parseInt(c.width, 10) || 0) < floor) { c.width = floor; changed = true; }
		});
		if (changed && typeof obj.resizeColumn === "function") obj.resizeColumn();
	}
	function enforceColumnWidths() {
		try { floorColumns("trt", WIDTH_FLOOR); } catch (e) { /* never break the bundle */ }
		try { floorColumns("hst", HST_WIDTH_FLOOR); } catch (e) { /* never break the bundle */ }
	}

	init();
	enforceColumnWidths();
	setTimeout(function () { init(); enforceColumnWidths(); }, 1200);
})(window.kr);
