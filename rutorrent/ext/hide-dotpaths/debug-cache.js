/**
 * Debug Cache Module for hide-dotpaths Plugin
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
 * @author JMSolo
 * @version 2.5.210
 */

// Debug cache to prevent spam logging
const debugCache = {
  // Cache for last logged message
  lastMessage: "",

  // Cache for message counts
  messageCounts: {},

  // Timestamp for rate limiting
  lastLogTime: 0,

  // Minimum time between logs (ms)
  minLogInterval: 50,
};

// Self-contained debug logging function for debug-cache.js
function cacheDebugLog(messageKey, ...args) {
  // Get config from window object (set by conf.php)
  const config = window.hide_dotpaths_config || {};

  // Only log if debug mode is enabled
  if (typeof config.debugMode === "undefined" || !config.debugMode) {
    return;
  }

  // Get formatted message with fallback for when theUILang isn't loaded yet
  let message;
  if (typeof theUILang !== "undefined" && theUILang[messageKey]) {
    message = theUILang[messageKey];
  } else {
    // Fallback to a simple format when translations aren't available
    message = messageKey
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  const formattedMessage = args.length > 0 ? message + args.join("") : message;

  // Log with appropriate prefix
  console.debug("[hide-dotpaths-cache-debug]", formattedMessage);
}

// Smart debug logging function - simple debouncer
function smartDebugLog(messageKey, ...args) {
  // Check if config exists and debug mode is enabled
  if (typeof config === "undefined") return;

  // If debug mode isn't set yet, assume it's enabled for early logging
  if (typeof config.debugMode === "undefined" || config.debugMode) {
    const now = Date.now();
    const message = theUILang[messageKey] || messageKey;
    const formattedMessage =
      args.length > 0 ? message + args.join("") : message;

    // DEBUG: Show what's happening inside the cache function
    cacheDebugLog(
      "hide-dotpaths-debug-cache-processing",
      messageKey,
      " formatted: ",
      formattedMessage
    );

    // Rate limiting to prevent spam
    if (now - debugCache.lastLogTime < debugCache.minLogInterval) {
      cacheDebugLog("hide-dotpaths-debug-cache-rate-limited", messageKey);
      return;
    }

    // Always log important messages (filtered items, patch status, etc.)
    if (
      messageKey.includes("filtered-item") ||
      messageKey.includes("filtered-filemanager") ||
      messageKey.includes("patch-applied") ||
      messageKey.includes("checkbox-replaced") ||
      messageKey.includes("filtered-count")
    ) {
      console.debug("[hide-dotpaths]", formattedMessage);
      debugCache.lastLogTime = now;
      cacheDebugLog("hide-dotpaths-debug-cache-important-logged", messageKey);
      return;
    }

    // For repetitive function calls, only log if message is different
    if (formattedMessage !== debugCache.lastMessage) {
      console.debug("[hide-dotpaths]", formattedMessage);
      debugCache.lastMessage = formattedMessage;
      debugCache.lastLogTime = now;
      cacheDebugLog("hide-dotpaths-debug-cache-different-logged", messageKey);
    } else {
      cacheDebugLog("hide-dotpaths-debug-cache-duplicate-skipped", messageKey);
    }
  }
}

// Reset cache function for testing
function resetDebugCache() {
  debugCache.lastMessage = "";
  debugCache.messageCounts = {};
  debugCache.lastLogTime = 0;
}

// Export for use in main plugin
window.hideDotpathsDebugCache = {
  smartDebugLog,
  resetDebugCache,
  debugCache,
};
