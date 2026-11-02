/**
 * @file Krate i18n lookup against theUILang.
 * @module kr.lib.i18n
 */
(function (root, factory) {
	"use strict";
	var api = factory();
	if (typeof module === "object" && module.exports) {
		module.exports = api;
	} else {
		root.kr = root.kr || {};
		root.kr.lib = root.kr.lib || {};
		root.kr.lib.i18n = api;
	}
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
	"use strict";

	/**
	 * @param {string} key
	 * @param {string} [fallback]
	 * @param {object} [lang] override catalog (tests)
	 * @returns {string}
	 */
	function t(key, fallback, lang) {
		var catalog = lang;
		if (catalog == null) {
			try {
				catalog = (typeof globalThis !== "undefined" && globalThis.theUILang) ||
					(typeof theUILang !== "undefined" ? theUILang : null);
			} catch (e) { catalog = null; }
		}
		if (catalog && catalog[key]) return catalog[key];
		return fallback != null ? fallback : "";
	}

	return { t: t };
});
