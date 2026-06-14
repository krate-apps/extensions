/**
 * Advanced Debug Utilities for hide-dotpaths Plugin
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

// Advanced debug cache with intelligent deduplication
const AdvancedDebugCache = {
  // Message history with timestamps (max 100 entries)
  messageHistory: new Map(),
  maxHistorySize: 100,

  // Rate limiting per message type
  rateLimits: new Map(),
  defaultRateLimit: 2000, // 2 seconds default

  // Scoped debugging configuration
  scopes: new Set(["general", "filter", "patch", "cache", "performance"]),
  enabledScopes: new Set(["general"]),

  // Performance tracking
  stats: {
    totalCalls: 0,
    skippedDuplicates: 0,
    rateLimited: 0,
    scopeFiltered: 0,
    emitted: 0,
  },

  // Memory management
  lastCleanup: Date.now(),
  cleanupInterval: 30000, // 30 seconds

  // Configuration
  config: {
    enableInternalDebug: false, // Disable cache-internal debugging by default
    enableStats: true,
    enableScopedDebug: true,
    maxMessageAge: 60000, // 1 minute
    deduplicationWindow: 5000, // 5 seconds
  },
};

// Helper function to determine message scope
function getMessageScope(messageKey) {
  if (messageKey.includes("filter")) return "filter";
  if (messageKey.includes("patch")) return "patch";
  if (messageKey.includes("cache")) return "cache";
  if (messageKey.includes("performance") || messageKey.includes("instant"))
    return "performance";
  return "general";
}

// Helper function to check if message should be logged based on scope
function isScopeEnabled(scope) {
  return (
    AdvancedDebugCache.enabledScopes.has(scope) ||
    AdvancedDebugCache.enabledScopes.has("all")
  );
}

// Helper function to create message fingerprint
function createMessageFingerprint(messageKey, args) {
  const argsString = args.length > 0 ? JSON.stringify(args) : "";
  return `${messageKey}:${argsString}`;
}

// Helper function to check if message is important (always log)
function isImportantMessage(messageKey) {
  return (
    messageKey.includes("filtered-item") ||
    messageKey.includes("filtered-filemanager") ||
    messageKey.includes("patch-applied") ||
    messageKey.includes("checkbox-replaced") ||
    messageKey.includes("filtered-count") ||
    messageKey.includes("error") ||
    messageKey.includes("warning")
  );
}

// Self-contained debug logging function for debug-utils.js
function internalDebugLog(messageKey, ...args) {
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
  console.debug("[hide-dotpaths-cache]", formattedMessage);
}

// Memory cleanup function
function cleanupOldEntries() {
  const now = Date.now();
  const cutoff = now - AdvancedDebugCache.config.maxMessageAge;

  // Clean up old message history
  for (const [key, entry] of AdvancedDebugCache.messageHistory.entries()) {
    if (entry.timestamp < cutoff) {
      AdvancedDebugCache.messageHistory.delete(key);
    }
  }

  // Clean up old rate limits
  for (const [key, timestamp] of AdvancedDebugCache.rateLimits.entries()) {
    if (timestamp < cutoff) {
      AdvancedDebugCache.rateLimits.delete(key);
    }
  }

  AdvancedDebugCache.lastCleanup = now;

  if (AdvancedDebugCache.config.enableInternalDebug) {
    internalDebugLog(
      "hide-dotpaths-debug-cache-cleanup-completed",
      AdvancedDebugCache.messageHistory.size
    );
  }
}

// Helper function to check if message should be logged
function shouldLogMessage(config, messageKey) {
  if (typeof config === "undefined") {
    internalDebugLog("hide-dotpaths-debug-cache-config-undefined");
    return false;
  }
  if (typeof config.debugMode === "undefined" || !config.debugMode) {
    internalDebugLog("hide-dotpaths-debug-cache-debug-disabled");
    return false;
  }
  return true;
}

// Helper function to check rate limiting
function isRateLimited(fingerprint, isImportant) {
  if (isImportant) return false;

  const lastLogTime = AdvancedDebugCache.rateLimits.get(fingerprint) || 0;
  const rateLimit = AdvancedDebugCache.defaultRateLimit;
  const now = Date.now();

  if (now - lastLogTime < rateLimit) {
    AdvancedDebugCache.stats.rateLimited++;
    if (AdvancedDebugCache.config.enableInternalDebug) {
      internalDebugLog("hide-dotpaths-debug-cache-rate-limited", fingerprint);
    }
    return true;
  }
  return false;
}

// Helper function to check for duplicates
function isDuplicate(fingerprint, isImportant) {
  if (isImportant) return false;

  const historyEntry = AdvancedDebugCache.messageHistory.get(fingerprint);
  if (!historyEntry) return false;

  const now = Date.now();
  const timeSinceLastLog = now - historyEntry.timestamp;

  if (timeSinceLastLog < AdvancedDebugCache.config.deduplicationWindow) {
    AdvancedDebugCache.stats.skippedDuplicates++;
    if (AdvancedDebugCache.config.enableInternalDebug) {
      internalDebugLog(
        "hide-dotpaths-debug-cache-duplicate-skipped",
        fingerprint
      );
    }
    return true;
  }
  return false;
}

// Helper function to update cache and history
function updateCacheAndHistory(
  fingerprint,
  messageKey,
  formattedMessage,
  scope,
  isImportant
) {
  const now = Date.now();

  // Update history
  AdvancedDebugCache.messageHistory.set(fingerprint, {
    timestamp: now,
    messageKey: messageKey,
    formattedMessage: formattedMessage,
    scope: scope,
  });

  // Update rate limits for non-important messages
  if (!isImportant) {
    AdvancedDebugCache.rateLimits.set(fingerprint, now);
  }

  // Maintain history size limit
  if (
    AdvancedDebugCache.messageHistory.size > AdvancedDebugCache.maxHistorySize
  ) {
    const oldestKey = AdvancedDebugCache.messageHistory.keys().next().value;
    AdvancedDebugCache.messageHistory.delete(oldestKey);
  }
}

// Main advanced debug logging function
function advancedDebugLog(messageKey, ...args) {
  // Update stats
  AdvancedDebugCache.stats.totalCalls++;

  // Get config and check if we should log
  const config = window.hide_dotpaths_config || {};
  if (!shouldLogMessage(config, messageKey)) return;

  // Periodic cleanup
  const now = Date.now();
  if (
    now - AdvancedDebugCache.lastCleanup >
    AdvancedDebugCache.cleanupInterval
  ) {
    cleanupOldEntries();
  }

  // Determine message scope and check if enabled
  const scope = getMessageScope(messageKey);
  if (AdvancedDebugCache.config.enableScopedDebug && !isScopeEnabled(scope)) {
    AdvancedDebugCache.stats.scopeFiltered++;
    if (AdvancedDebugCache.config.enableInternalDebug) {
      internalDebugLog(
        "hide-dotpaths-debug-scope-filtered",
        messageKey,
        " scope: ",
        scope
      );
    }
    return;
  }

  // Create message fingerprint and check if important
  const fingerprint = createMessageFingerprint(messageKey, args);
  const isImportant = isImportantMessage(messageKey);

  // Check rate limiting and duplicates
  if (isRateLimited(fingerprint, isImportant)) return;
  if (isDuplicate(fingerprint, isImportant)) return;

  // Get formatted message and log it
  const message = theUILang[messageKey] || messageKey;
  const formattedMessage = args.length > 0 ? message + args.join("") : message;

  console.debug("[hide-dotpaths]", formattedMessage);
  AdvancedDebugCache.stats.emitted++;

  // Update cache and history
  updateCacheAndHistory(
    fingerprint,
    messageKey,
    formattedMessage,
    scope,
    isImportant
  );

  // Log internal debug info
  if (AdvancedDebugCache.config.enableInternalDebug) {
    internalDebugLog(
      "hide-dotpaths-debug-cache-emitted",
      messageKey,
      " scope: ",
      scope
    );
  }
}

// Configuration management functions
function setDebugScope(scopes) {
  if (typeof scopes === "string") {
    scopes = scopes.split(",").map((s) => s.trim());
  }

  AdvancedDebugCache.enabledScopes.clear();
  scopes.forEach((scope) => {
    if (AdvancedDebugCache.scopes.has(scope) || scope === "all") {
      AdvancedDebugCache.enabledScopes.add(scope);
    }
  });
}

function enableInternalDebug(enable = true) {
  AdvancedDebugCache.config.enableInternalDebug = enable;
}

function setRateLimit(limit) {
  AdvancedDebugCache.defaultRateLimit = limit;
}

function setDeduplicationWindow(window) {
  AdvancedDebugCache.config.deduplicationWindow = window;
}

// Stats and monitoring functions
function getDebugStats() {
  return {
    ...AdvancedDebugCache.stats,
    historySize: AdvancedDebugCache.messageHistory.size,
    rateLimitSize: AdvancedDebugCache.rateLimits.size,
    enabledScopes: Array.from(AdvancedDebugCache.enabledScopes),
    config: { ...AdvancedDebugCache.config },
  };
}

function resetDebugStats() {
  AdvancedDebugCache.stats = {
    totalCalls: 0,
    skippedDuplicates: 0,
    rateLimited: 0,
    scopeFiltered: 0,
    emitted: 0,
  };
}

function clearDebugCache() {
  AdvancedDebugCache.messageHistory.clear();
  AdvancedDebugCache.rateLimits.clear();
  resetDebugStats();
}

// Export for use in main plugin
window.hideDotpathsAdvancedDebug = {
  log: advancedDebugLog,
  setScope: setDebugScope,
  enableInternalDebug: enableInternalDebug,
  setRateLimit: setRateLimit,
  setDeduplicationWindow: setDeduplicationWindow,
  getStats: getDebugStats,
  resetStats: resetDebugStats,
  clearCache: clearDebugCache,
  cache: AdvancedDebugCache,
};
