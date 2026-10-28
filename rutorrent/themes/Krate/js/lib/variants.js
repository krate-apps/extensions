/**
 * @file Krate variant helpers (pure).
 * @module kr.lib.variants
 */
(function (root, factory) {
	"use strict";
	var api = factory();
	if (typeof module === "object" && module.exports) {
		module.exports = api;
	} else {
		root.kr = root.kr || {};
		root.kr.lib = root.kr.lib || {};
		root.kr.lib.variants = api;
	}
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
	"use strict";

	/** @type {readonly string[]} */
	var VARIANTS = ["dark", "light"];

	/**
	 * @param {*} v
	 * @returns {"dark"|"light"|null}
	 */
	function normalizeVariant(v) {
		if (!v) return null;
		v = String(v).toLowerCase();
		/* Legacy Slate (removed) maps to Dark. */
		if (v === "slate") return "dark";
		return VARIANTS.indexOf(v) !== -1 ? v : null;
	}

	/**
	 * Resolve Auto from HarmonyUI / system signals (dark|light only).
	 *
	 * @param {object} [env]
	 * @param {string} [env.cookie] document.cookie
	 * @param {string|null} [env.localTheme] localStorage.theme
	 * @param {boolean} [env.prefersLight] prefers-color-scheme: light
	 * @returns {"dark"|"light"}
	 */
	function resolveAutoTheme(env) {
		env = env || {};
		var cookieStr = env.cookie;
		if (cookieStr == null && typeof document !== "undefined") {
			try { cookieStr = document.cookie; } catch (e) { cookieStr = ""; }
		}
		cookieStr = cookieStr || "";
		var m = cookieStr.match(/(?:^|;\s*)krate_theme=([^;]*)/);
		if (m) {
			var cookie = decodeURIComponent(m[1]).toLowerCase();
			if (cookie === "light" || cookie === "dark") return cookie;
		}

		var ls = env.localTheme;
		if (ls === undefined) {
			try {
				if (typeof localStorage !== "undefined") ls = localStorage.getItem("theme");
			} catch (e) { ls = null; }
		}
		if (ls) {
			ls = String(ls).toLowerCase();
			if (ls === "light" || ls === "winter") return "light";
			if (ls === "dark" || ls === "synthwave") return "dark";
		}

		var prefersLight = env.prefersLight;
		if (prefersLight === undefined) {
			try {
				prefersLight = !!(typeof matchMedia === "function" &&
					matchMedia("(prefers-color-scheme: light)").matches);
			} catch (e) { prefersLight = false; }
		}
		return prefersLight ? "light" : "dark";
	}

	return {
		VARIANTS: VARIANTS,
		normalizeVariant: normalizeVariant,
		resolveAutoTheme: resolveAutoTheme
	};
});
