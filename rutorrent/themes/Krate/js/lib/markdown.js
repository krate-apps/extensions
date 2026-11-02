/**
 * @file Safe markdown subset → DOM (What's New).
 * @module kr.lib.markdown
 *
 * Only textContent / createTextNode. Links become label text.
 */
(function (root, factory) {
	"use strict";
	var api = factory();
	if (typeof module === "object" && module.exports) {
		module.exports = api;
	} else {
		root.kr = root.kr || {};
		root.kr.lib = root.kr.lib || {};
		root.kr.lib.markdown = api;
	}
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
	"use strict";

	/**
	 * @param {ParentNode} parent
	 * @param {string} text
	 * @param {Document} [doc]
	 */
	function renderInline(parent, text, doc) {
		var d = doc || document;
		var s = String(text).replace(/\[([^\]]*)\]\(([^)]*)\)/g, "$1");
		var parts = s.split("`");
		var unterminated = parts.length % 2 === 0;
		for (var i = 0; i < parts.length; i++) {
			var inCode = (i % 2 === 1);
			if (inCode && unterminated && i === parts.length - 1) {
				parent.appendChild(d.createTextNode("`" + parts[i]));
			} else if (inCode) {
				var code = d.createElement("code");
				code.className = "kr-wn-code";
				code.textContent = parts[i];
				parent.appendChild(code);
			} else if (parts[i]) {
				parent.appendChild(d.createTextNode(parts[i]));
			}
		}
	}

	/**
	 * @param {ParentNode} container
	 * @param {string} text
	 * @param {Document} [doc]
	 */
	function renderMarkdown(container, text, doc) {
		var d = doc || document;
		var lines = String(text).replace(/\r\n?/g, "\n").split("\n");
		var list = null;
		var para = null;
		function closePara() {
			if (para) { container.appendChild(para); para = null; }
		}
		function closeList() { list = null; }
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i].replace(/\s+$/, "");
			if (!line) { closePara(); closeList(); continue; }
			var h = /^(#{1,6})\s+(.*)$/.exec(line);
			if (h) {
				closePara(); closeList();
				var deep = h[1].length >= 3;
				var hEl = d.createElement(deep ? "h4" : "h3");
				hEl.className = deep ? "kr-wn-sub" : "kr-wn-head";
				renderInline(hEl, h[2], d);
				container.appendChild(hEl);
				continue;
			}
			var b = /^\s*[-*]\s+(.*)$/.exec(line);
			if (b) {
				closePara();
				if (!list) {
					list = d.createElement("ul");
					list.className = "kr-wn-list";
					container.appendChild(list);
				}
				var li = d.createElement("li");
				renderInline(li, b[1], d);
				list.appendChild(li);
				continue;
			}
			closeList();
			if (!para) {
				para = d.createElement("p");
				para.className = "kr-wn-p";
			} else {
				para.appendChild(d.createTextNode(" "));
			}
			renderInline(para, line, d);
		}
		closePara();
		closeList();
	}

	return {
		renderInline: renderInline,
		renderMarkdown: renderMarkdown
	};
});
