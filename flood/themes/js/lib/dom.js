/**
 * @file Small DOM helpers for Krate modules.
 * @module kr.lib.dom
 */
(function (root, factory) {
	"use strict";
	var api = factory();
	if (typeof module === "object" && module.exports) {
		module.exports = api;
	} else {
		root.kr = root.kr || {};
		root.kr.lib = root.kr.lib || {};
		root.kr.lib.dom = api;
	}
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
	"use strict";

	/**
	 * @param {string} tag
	 * @param {string} [cls]
	 * @param {Document} [doc]
	 * @returns {Element}
	 */
	function el(tag, cls, doc) {
		var d = doc || (typeof document !== "undefined" ? document : null);
		if (!d) throw new Error("kr.lib.dom.el: no document");
		var e = d.createElement(tag);
		if (cls) e.className = cls;
		return e;
	}

	/**
	 * @param {string} sel
	 * @param {ParentNode} [root]
	 * @returns {Element|null}
	 */
	function qs(sel, root) {
		var r = root || (typeof document !== "undefined" ? document : null);
		return r && r.querySelector ? r.querySelector(sel) : null;
	}

	/**
	 * @param {string} sel
	 * @param {ParentNode} [root]
	 * @returns {Element[]}
	 */
	function qsa(sel, root) {
		var r = root || (typeof document !== "undefined" ? document : null);
		if (!r || !r.querySelectorAll) return [];
		return Array.from(r.querySelectorAll(sel));
	}

	return { el: el, qs: qs, qsa: qsa };
});
