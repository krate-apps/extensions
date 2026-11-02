/**
 * @file Status bar chrome.
 * @requires window.kr, theWebUI
 */
;(function (kr) {
	"use strict";
	void kr;

	if (window.krStatusBackfill) return;
	window.krStatusBackfill = true;

	/* The core blanks the rate cell at zero. Watch each cell on EVERY write: when
	 * the core writes a value, remember it; when the core writes an empty string,
	 * restore the last non-empty value so the chip is never blank. The observer
	 * runs before paint, so the blank is never visible, and restoring a value
	 * does not loop (the restored value is not empty). */
	var lastRate = { stup_speed: "0 B/s", stdown_speed: "0 B/s" };
	["stup_speed", "stdown_speed"].forEach(function (id) {
		var el = document.getElementById(id);
		if (!el) return;
		if (el.textContent.trim()) lastRate[id] = el.textContent;
		else el.textContent = lastRate[id];
		new MutationObserver(function () {
			var text = el.textContent;
			if (text.trim()) lastRate[id] = text;
			else el.textContent = lastRate[id];
		}).observe(el, { childList: true, characterData: true, subtree: true });
	});
})(window.kr);
