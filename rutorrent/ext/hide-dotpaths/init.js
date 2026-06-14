/**
 * ruTorrent hide-dotpaths Plugin
 * Copyright (C) 2025 JMSolo (QuickBox.io)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Hides dot-prefixed files and directories from all ruTorrent path dropdowns
 *
 * @author JMSolo
 * @version 2.5.210
 */

// Plugin initialization
plugin = new rPlugin("hide-dotpaths");

// Plugin metadata
plugin.author = "JMSolo";
plugin.descr =
  "Hide dot-prefixed files and directories from all ruTorrent path dropdowns";
plugin.version = "2.5.210";

// Simple configuration
let config = {
  filterSelects: true,
  filterModals: true,
  filterAutocomplete: true,
  filterAjax: true,
  filterFilemanager: true,
  preserveParentDirs: true,
  debugMode: false,
  applyFilemanagerPatch: true, // Option to apply server-side patch
};

// Advanced debug logging function with intelligent deduplication
function debugLog(messageKey, ...args) {
  // Check if config exists first
  if (typeof config === "undefined") return;

  // Use advanced debug system if available
  if (config.debugMode && window.hideDotpathsAdvancedDebug) {
    window.hideDotpathsAdvancedDebug.log(messageKey, ...args);
  } else if (config.debugMode && window.hideDotpathsDebugCache) {
    // Fallback to legacy cache system
    window.hideDotpathsDebugCache.smartDebugLog(messageKey, ...args);
  } else if (config.debugMode) {
    // Final fallback - use a simple logging mechanism
    const message = theUILang[messageKey] || messageKey;
    const formattedMessage =
      args.length > 0 ? message + args.join("") : message;

    // Use a simple logging function to avoid circular dependency
    if (typeof window.hideDotpathsSimpleLog === "undefined") {
      window.hideDotpathsSimpleLog = function (msg) {
        // Only log if debug mode is enabled and we haven't logged this recently
        const now = Date.now();
        if (
          !window.hideDotpathsSimpleLog.lastLog ||
          now - window.hideDotpathsSimpleLog.lastLog > 1000
        ) {
          console.debug("[hide-dotpaths]", msg);
          window.hideDotpathsSimpleLog.lastLog = now;
        }
      };
    }

    window.hideDotpathsSimpleLog(formattedMessage);
  }

  // No diagnostic logging here - it creates spam
}

// NEW: Apply filemanager patch programmatically
function applyFilemanagerPatch() {
  debugLog("hide-dotpaths-debug-applying-filemanager-patch");

  // Override filemanager settings to force hide hidden files
  if (window.flm?.settings) {
    window.flm.settings.getSettingValue = function (name) {
      if (name === "showhidden") {
        debugLog("hide-dotpaths-debug-patch-intercepting-showhidden");
        return false; // Force disable show hidden files
      }
      // Use the same logic as the actual patch
      return $type(theWebUI.settings["webui.flm.settings." + name])
        ? theWebUI.settings["webui.flm.settings." + name]
        : this.defaults[name];
    };

    debugLog("hide-dotpaths-debug-filemanager-patch-applied");
  }

  // Replace checkbox with hidden input
  setTimeout(() => {
    const showHiddenCheckbox = document.querySelector(
      "#flm-settings-opt-showhidden"
    );
    if (showHiddenCheckbox && showHiddenCheckbox.type === "checkbox") {
      // Create hidden input to replace checkbox
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "flm-settings-opt-showhidden";
      hiddenInput.id = "flm-settings-opt-showhidden";
      hiddenInput.value = "0";

      // Replace the checkbox with hidden input
      showHiddenCheckbox.parentNode.replaceChild(
        hiddenInput,
        showHiddenCheckbox
      );

      // Hide the label
      const label = document.querySelector(
        'label[for="flm-settings-opt-showhidden"]'
      );
      if (label) {
        label.style.display = "none";
      }
      debugLog("hide-dotpaths-debug-checkbox-replaced-with-hidden-input");
    }
  }, 100);
}

// Core filtering function
function filterDotItems() {
  let count = 0;

  // Target ALL elements that might contain dot-prefixed paths
  $(".rmenuitem, .browse-item, li, option").each(function () {
    const text = $(this).text().trim();
    if (!text) return;

    // Get the last part of the path
    const last = text.endsWith("/")
      ? text.slice(0, -1).split("/").pop()
      : text.split("/").pop();

    // Filter if it starts with dot (but keep parent directory "..")
    if (
      last?.startsWith(".") &&
      (config.preserveParentDirs ? last !== ".." : true)
    ) {
      $(this).remove();
      count++;
      debugLog(
        "hide-dotpaths-debug-filtered-item",
        text,
        " (last: ",
        last,
        ")"
      );
    }
  });

  // Filter filemanager plugin table rows (if enabled)
  if (config.filterFilemanager) {
    $('#flm-browser-table tbody tr[id^="_flm_."]').each(function () {
      const id = $(this).attr("id");
      if (id) {
        const name = id.replace("_flm_", "").replace("/", "");
        if (
          name.startsWith(".") &&
          (config.preserveParentDirs ? name !== ".." : true)
        ) {
          $(this).remove();
          count++;
          debugLog("hide-dotpaths-debug-filtered-filemanager", name);
        }
      }
    });
  }

  if (count > 0) {
    debugLog(
      "hide-dotpaths-debug-filtered-count",
      count,
      theUILang["hide-dotpaths-debug-dot-prefixed-items"]
    );
  }
  return count;
}

// Ultra-fast filtering for immediate response
function instantFilter() {
  $(".rmenuitem").each(function () {
    const text = $(this).text().trim();
    if (!text) return;

    const last = text.endsWith("/")
      ? text.slice(0, -1).split("/").pop()
      : text.split("/").pop();

    if (
      last?.startsWith(".") &&
      (config.preserveParentDirs ? last !== ".." : true)
    ) {
      $(this).remove(); // Remove immediately, no hide/show cycle
      debugLog("hide-dotpaths-debug-instant-filtered", text);
    } else {
      // Mark as filtered (visible) if it's not a dot-prefixed item
      $(this).addClass("filtered");
    }
  });

  // Instant filter filemanager rows (if enabled)
  if (config.filterFilemanager) {
    $('#flm-browser-table tbody tr[id^="_flm_."]').each(function () {
      const id = $(this).attr("id");
      if (id) {
        const name = id.replace("_flm_", "").replace("/", "");
        if (
          name.startsWith(".") &&
          (config.preserveParentDirs ? name !== ".." : true)
        ) {
          $(this).remove();
          debugLog("hide-dotpaths-debug-instant-filtered-filemanager", name);
        }
      }
    });
  }
}

// ULTRA-FAST MUTATION OBSERVER - Intercepts elements BEFORE they're visible
let observer = null;

// Helper function to check if element should be filtered
function shouldFilterElement(text) {
  if (!text) return false;
  const last = text.endsWith("/")
    ? text.slice(0, -1).split("/").pop()
    : text.split("/").pop();
  return (
    last?.startsWith(".") && (config.preserveParentDirs ? last !== ".." : true)
  );
}

// Ultra-fast filtering for immediate response
function filterRmenuitemElements(container) {
  $(container)
    .find(".rmenuitem")
    .each(function () {
      const text = $(this).text().trim();
      if (shouldFilterElement(text)) {
        $(this).remove();
        debugLog("hide-dotpaths-debug-filtered-item", text);
      }
    });
}

// Helper function to handle individual nodes with ULTRA-FAST response
function handleAddedNode(node) {
  if (node.nodeType !== 1) return; // Not an element node

  // Handle rmenuitem elements - INSTANT removal
  if (node.classList?.contains("rmenuitem")) {
    const text = node.textContent.trim();
    if (shouldFilterElement(text)) {
      node.remove(); // Remove immediately before it's visible
      debugLog("hide-dotpaths-debug-filtered-item", text);
    } else {
      // Ensure non-filtered items are immediately visible
      node.classList.add("filtered");
    }
    return;
  }

  // Handle filemanager table rows - INSTANT removal
  if (node.id?.startsWith("_flm_.")) {
    const name = node.id.replace("_flm_", "").replace("/", "");
    if (
      name.startsWith(".") &&
      (config.preserveParentDirs ? name !== ".." : true)
    ) {
      node.remove(); // Remove immediately before it's visible
      debugLog("hide-dotpaths-debug-filtered-filemanager", name);
    }
    return;
  }

  // Handle container elements with immediate filtering
  if (
    node.classList?.contains("browseFrame") ||
    node.classList?.contains("rmenuobj")
  ) {
    // Filter immediately, no delay
    filterRmenuitemElements(node);
  }
}

// Helper function to handle mutations with ULTRA-FAST response
function handleMutation(mutation) {
  if (mutation.type !== "childList") return;

  // Process each added node immediately
  mutation.addedNodes.forEach(handleAddedNode);
}

function setupMutationObserver() {
  observer = new MutationObserver(function (mutations) {
    mutations.forEach(handleMutation);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Event listeners with ULTRA-FAST response - catch them before they're visible
function handleRmenuitemInsertion() {
  // INSTANT removal for any new rmenuitem
  if ($(this).hasClass("rmenuitem")) {
    const text = $(this).text().trim();
    if (text && shouldFilterElement(text)) {
      $(this).remove(); // Remove immediately
      debugLog("hide-dotpaths-debug-event-filtered-rmenuitem", text);
      return; // Skip further processing
    } else if (text) {
      // Ensure non-filtered items (including ../) are immediately visible
      $(this).addClass("filtered");
      debugLog("hide-dotpaths-debug-event-visible-rmenuitem", text);
    }
  }

  // Handle filemanager table rows (if enabled) - INSTANT removal
  if (config.filterFilemanager && $(this).attr("id")?.startsWith("_flm_")) {
    const id = $(this).attr("id");
    const name = id.replace("_flm_", "").replace("/", "");
    if (
      name.startsWith(".") &&
      (config.preserveParentDirs ? name !== ".." : true)
    ) {
      $(this).remove(); // Remove immediately
      debugLog("hide-dotpaths-debug-event-filtered-filemanager", name);
      return; // Skip further processing
    }
  }
}

function handleSubtreeModification() {
  // Ultra-fast filtering with immediate response
  instantFilter();

  // Also ensure all visible rmenuitem elements have the filtered class
  $(".rmenuitem:not(.filtered)").each(function () {
    const text = $(this).text().trim();
    if (text && !shouldFilterElement(text)) {
      $(this).addClass("filtered");
      debugLog("hide-dotpaths-debug-subtree-visible-rmenuitem", text);
    }
  });
}

$(document).on(
  "DOMNodeInserted",
  ".rmenuitem, .browseFrame, dialog, #flm-browser-table tbody tr",
  handleRmenuitemInsertion
);
$(document).on(
  "DOMSubtreeModified",
  ".rmenuobj, .browseFrame, #flm-browser-table",
  handleSubtreeModification
);

// Periodic cleanup to catch any that slip through (less frequent to reduce spam)
setInterval(filterDotItems, 1000); // Every 1 second

// Plugin initialization
plugin.init = function () {
  debugLog("hide-dotpaths-debug-plugin-init");
  try {
    plugin.loadLang();

    // Add CSS to hide dot-prefixed elements immediately
    const style = document.createElement("style");
    style.textContent = `
            /* Hide dot-prefixed elements immediately */
            .rmenuitem { display: none; }
            .rmenuitem.filtered { display: block; }
            tr[id^="_flm_."] { display: none !important; }
        `;
    document.head.appendChild(style);

    // Immediately make ../ elements visible
    $(".rmenuitem").each(function () {
      const text = $(this).text().trim();
      if (text === "../" || text === "..") {
        $(this).addClass("filtered");
        debugLog("hide-dotpaths-debug-force-visible-parent", text);
      } else if (text && !shouldFilterElement(text)) {
        // Also make non-dot-prefixed items visible
        $(this).addClass("filtered");
        debugLog("hide-dotpaths-debug-force-visible-item", text);
      }
    });

    // Set up a more aggressive observer for ../ elements
    const parentObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1 && node.classList?.contains("rmenuitem")) {
            const text = node.textContent.trim();
            if (text === "../" || text === "..") {
              node.classList.add("filtered");
              debugLog("hide-dotpaths-debug-observer-visible-parent", text);
            } else if (text && !shouldFilterElement(text)) {
              // Also make non-dot-prefixed items visible
              node.classList.add("filtered");
              debugLog("hide-dotpaths-debug-observer-visible-item", text);
            }
          }
        });
      });
    });

    parentObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Override jQuery's append/appendTo to process elements immediately
    const originalAppend = $.fn.append;
    $.fn.append = function () {
      const result = originalAppend.apply(this, arguments);
      // Process any rmenuitem elements immediately
      $(this)
        .find(".rmenuitem")
        .each(function () {
          const text = $(this).text().trim();
          if (
            text === "../" ||
            text === ".." ||
            (text && !shouldFilterElement(text))
          ) {
            $(this).addClass("filtered");
          }
        });
      return result;
    };

    // Also run a continuous check every 10ms to ensure elements are visible (ultra-fast)
    setInterval(function () {
      $(".rmenuitem:not(.filtered)").each(function () {
        const text = $(this).text().trim();
        if (text === "../" || text === "..") {
          $(this).addClass("filtered");
          debugLog("hide-dotpaths-debug-interval-visible-parent", text);
        } else if (text && !shouldFilterElement(text)) {
          // Also make non-dot-prefixed items visible
          $(this).addClass("filtered");
          debugLog("hide-dotpaths-debug-interval-visible-item", text);
        }
      });
    }, 10);

    // Load advanced debug utilities first (always load it)
    $.getScript("plugins/hide-dotpaths/debug-utils.js", function () {
      debugLog("hide-dotpaths-debug-advanced-utilities-loaded");

      // Load legacy debug cache as fallback
      $.getScript("plugins/hide-dotpaths/debug-cache.js", function () {
        debugLog("hide-dotpaths-debug-legacy-cache-loaded");

        // Load configuration
        debugLog("hide-dotpaths-debug-loading-config");
        $.getScript("plugins/hide-dotpaths/conf.php", function () {
          debugLog("hide-dotpaths-debug-config-loaded", window.hide_dotpaths);

          if (window.hide_dotpaths !== true) {
            debugLog("hide-dotpaths-debug-plugin-disabled");
            return;
          }

          // Update config with loaded values
          if (window.hide_dotpaths_config) {
            config = { ...config, ...window.hide_dotpaths_config };

            // Make config available globally for debug system
            window.hide_dotpaths_config = config;

            debugLog("hide-dotpaths-debug-config-updated", config.debugMode);

            // Configure advanced debug system
            configureAdvancedDebug();
          }

          // Apply filemanager patch if enabled
          if (config.applyFilemanagerPatch) {
            applyFilemanagerPatch();
          }

          // Start filtering
          instantFilter();
          setTimeout(filterDotItems, 5);
          plugin.markLoaded();
        });
      });
    });
  } catch (error) {
    debugLog("hide-dotpaths-debug-plugin-error", error.message);
  }
};

// Fallback initialization
setTimeout(function () {
  if (plugin.enabled && !plugin.allStuffLoaded) {
    debugLog("hide-dotpaths-debug-fallback-init");
    plugin.init();
  }
}, 1000);

// Manual test function (kept for debugging if needed)
window.testHideDotpaths = function () {
  debugLog("hide-dotpaths-debug-manual-test-called");
  const count = filterDotItems();
  debugLog(
    "hide-dotpaths-debug-manual-test-completed",
    count,
    theUILang["hide-dotpaths-debug-items"]
  );
  return count;
};

// Advanced debug test functions
window.testAdvancedDebug = function () {
  if (!window.hideDotpathsAdvancedDebug) {
    debugLog("hide-dotpaths-debug-advanced-system-unavailable");
    return;
  }

  // Test deduplication
  debugLog("hide-dotpaths-debug-testing-deduplication");
  for (let i = 0; i < 5; i++) {
    debugLog("hide-dotpaths-debug-test-duplicate", "iteration", i);
  }

  // Test rate limiting
  debugLog("hide-dotpaths-debug-testing-rate-limiting");
  for (let i = 0; i < 3; i++) {
    debugLog("hide-dotpaths-debug-test-rate-limit", "test", i);
  }

  // Show stats
  const stats = window.hideDotpathsAdvancedDebug.getStats();
  debugLog("hide-dotpaths-debug-stats-display", stats);

  return stats;
};

window.getDebugStats = function () {
  if (window.hideDotpathsAdvancedDebug) {
    return window.hideDotpathsAdvancedDebug.getStats();
  }
  return null;
};

window.clearDebugCache = function () {
  if (window.hideDotpathsAdvancedDebug) {
    window.hideDotpathsAdvancedDebug.clearCache();
    debugLog("hide-dotpaths-debug-cache-cleared");
  }
};

// Configure advanced debug system
function configureAdvancedDebug() {
  if (window.hideDotpathsAdvancedDebug) {
    debugLog("hide-dotpaths-debug-configuring-advanced-system");

    // Set debug scopes
    if (config.debugScopes) {
      window.hideDotpathsAdvancedDebug.setScope(config.debugScopes);
      debugLog("hide-dotpaths-debug-scopes-set", config.debugScopes);
    }

    // Set rate limit
    if (config.debugRateLimit) {
      window.hideDotpathsAdvancedDebug.setRateLimit(config.debugRateLimit);
      debugLog("hide-dotpaths-debug-rate-limit-set", config.debugRateLimit);
    }

    // Set deduplication window
    if (config.debugDeduplicationWindow) {
      window.hideDotpathsAdvancedDebug.setDeduplicationWindow(
        config.debugDeduplicationWindow
      );
      debugLog(
        "hide-dotpaths-debug-deduplication-window-set",
        config.debugDeduplicationWindow
      );
    }

    // Enable internal debugging if configured
    if (config.debugEnableInternal) {
      window.hideDotpathsAdvancedDebug.enableInternalDebug(true);
      debugLog("hide-dotpaths-debug-internal-debugging-enabled");
    }

    debugLog("hide-dotpaths-debug-advanced-config-applied");

    // Test the debug system immediately
    debugLog("hide-dotpaths-debug-testing-system");
    debugLog(
      "hide-dotpaths-debug-config-available",
      !!window.hide_dotpaths_config
    );
    debugLog(
      "hide-dotpaths-debug-test-configuration",
      "config loaded successfully"
    );

    // Show initial stats
    const stats = window.hideDotpathsAdvancedDebug.getStats();
    debugLog("hide-dotpaths-debug-initial-stats", stats);
  } else {
    debugLog("hide-dotpaths-debug-advanced-system-unavailable-fallback");
  }
}

// Simple test function for immediate testing
window.testDebugSystem = function () {
  debugLog("hide-dotpaths-debug-testing-system");

  // Test basic debug logging
  debugLog("hide-dotpaths-debug-test-configuration", "manual test");

  // Test advanced system if available
  if (window.hideDotpathsAdvancedDebug) {
    const stats = window.hideDotpathsAdvancedDebug.getStats();
    debugLog("hide-dotpaths-debug-stats-display", stats);

    // Test deduplication
    for (let i = 0; i < 3; i++) {
      debugLog("hide-dotpaths-debug-test-duplicate", "test", i);
    }
  } else {
    debugLog("hide-dotpaths-debug-advanced-system-unavailable");
  }
};
