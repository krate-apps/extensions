<?php
/**
 * Configuration for hide-dotpaths plugin
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
 * @author JMSolo [QuickBox.io]
 * @version 2.5.210
 */

// Main enable/disable switch
$hide_dotpaths = true;

// Filtering options
$filter_selects = true;          // Filter <select> dropdowns
$filter_modals = true;           // Filter modal file browsers
$filter_autocomplete = true;     // Filter autocomplete dropdowns
$filter_ajax = true;             // Filter AJAX responses
$filter_filemanager = true;      // Filter filemanager plugin table rows
$preserve_parent_dirs = true;    // Keep ".." parent directory references
$debug_mode = true;              // Enable debug logging (set to true for troubleshooting)
$apply_filemanager_patch = true; // Apply server-side filemanager patch

// Advanced debug configuration
$debug_scopes = 'general,filter';   // Comma-separated scopes: general,filter,patch,cache,performance,all
$debug_rate_limit = 2000;           // Rate limit in milliseconds (default: 2000ms)
$debug_deduplication_window = 5000; // Deduplication window in milliseconds (default: 5000ms)
$debug_enable_internal = false;     // Enable internal cache debugging (set to true for troubleshooting)

// Output JavaScript configuration
echo "window.hide_dotpaths = " . ($hide_dotpaths ? "true" : "false") . ";\n";
echo "window.hide_dotpaths_config = {\n";
echo "    filterSelects: " . ($filter_selects ? "true" : "false") . ",\n";
echo "    filterModals: " . ($filter_modals ? "true" : "false") . ",\n";
echo "    filterAutocomplete: " . ($filter_autocomplete ? "true" : "false") . ",\n";
echo "    filterAjax: " . ($filter_ajax ? "true" : "false") . ",\n";
echo "    filterFilemanager: " . ($filter_filemanager ? "true" : "false") . ",\n";
echo "    preserveParentDirs: " . ($preserve_parent_dirs ? "true" : "false") . ",\n";
echo "    debugMode: " . ($debug_mode ? "true" : "false") . ",\n";
echo "    applyFilemanagerPatch: " . ($apply_filemanager_patch ? "true" : "false") . ",\n";
echo "    debugScopes: '" . $debug_scopes . "',\n";
echo "    debugRateLimit: " . $debug_rate_limit . ",\n";
echo "    debugDeduplicationWindow: " . $debug_deduplication_window . ",\n";
echo "    debugEnableInternal: " . ($debug_enable_internal ? "true" : "false") . "\n";
echo "};\n";
