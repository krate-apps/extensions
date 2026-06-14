# ruTorrent hide-dotpaths Plugin

<div align="center">

![hide-dotpaths Plugin](https://img.shields.io/badge/hide--dotpaths-Plugin-blue?style=for-the-badge&logo=github)
[![ruTorrent](https://img.shields.io/badge/ruTorrent-v5.2%2B-4dc187?style=for-the-badge&logo=serverless&logoColor=4dc187)](https://github.com/Novik/ruTorrent)
[![License](https://img.shields.io/badge/License-GPL%20v3-blue?style=for-the-badge)](https://github.com/QuickBox/rutorrent_hide-dotpaths/blob/main/LICENSE)

**Instantly hide dot-prefixed files and directories from all ruTorrent path dropdowns**

[![Install](https://img.shields.io/badge/Install-Now-success?style=for-the-badge&logo=download)](https://github.com/QuickBox/rutorrent_hide-dotpaths#-installation)
[![Documentation](https://img.shields.io/badge/Documentation-Read-blue?style=for-the-badge&logo=book)](https://github.com/QuickBox/rutorrent_hide-dotpaths#-table-of-contents)
[![Community](https://img.shields.io/badge/Community-Join-7289da?style=for-the-badge&logo=discord&logoColor=7289da)](https://discord.gg/mca7RSv5pa)

</div>

---

## 📋 Table of Contents

<details>
<summary><strong>🚀 Quick Start</strong></summary>

- [Overview](#overview)
- [Why This Exists](#why-this-exists)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)

</details>

<details>
<summary><strong>🔧 Advanced Usage</strong></summary>

- [Debug System](#debug-system)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

</details>

---

## 📖 Overview

> [!NOTE]
> **hide-dotpaths Plugin** instantly hides dot-prefixed files and directories from all ruTorrent path dropdowns and file browsers. It uses advanced DOM interception technology to remove dot-prefixed items before they become visible to users.

### 🎯 Key Benefits

- **🔍 Instant Filtering** - Items removed before they become visible
- **⚡ Real-time Interception** - Uses MutationObserver for immediate response
- **🛡️ Dual Protection** - Client-side filtering + server-side filemanager patch
- **🌍 Multi-Language** - Support for 7 languages
- **🔧 Configurable** - Flexible settings for different environments
- **📊 Advanced Debug** - Intelligent logging with deduplication

---

## 🎯 Why This Exists

> [!IMPORTANT]
> **Server Admin Problem**: ruTorrent users can see and navigate into hidden directories (`.config`, `.cache`, `.ssh`, etc.) that contain sensitive system files, configuration data, and application settings. This creates security risks and cluttered navigation.

### 🛡️ **The Problem**

**Server administrators face a real challenge**: When users browse directories in ruTorrent's file manager, they can see and access hidden dot-prefixed files and directories like:
- `.config/` - Application configuration files
- `.cache/` - System cache directories  
- `.ssh/` - SSH keys and configuration
- `.bashrc`, `.profile` - User shell configurations
- `.git/` - Git repositories
- `.htaccess` - Web server configuration
- `.env` - Environment variables and secrets

**This creates several issues:**
- **🔒 Security Risk**: Users can access sensitive system files
- **🗂️ Cluttered Navigation**: Hidden files pollute the browsing experience
- **❓ User Confusion**: Non-technical users see system files they shouldn't access
- **🛠️ Support Burden**: Admins deal with users accidentally modifying system files

> [!NOTE]
> **Important Clarification**: This plugin does **not** block legitimate access to hidden files. Users can still access their own hidden directories via CLI, SFTP, or other file access methods. This plugin simply reduces the **accidental exposure** and **clutter** in the ruTorrent web interface, providing a cleaner user experience while maintaining full file access capabilities.

### 💡 **The Solution**

**hide-dotpaths Plugin** provides a **server admin solution** that:

1. **🔍 Instantly Hides** dot-prefixed files and directories from all ruTorrent interfaces
2. **🛡️ Dual Protection** - Combines client-side filtering with server-side enforcement
3. **📊 Advanced Monitoring** - Detailed logging for server admins to audit what's being filtered
4. **🎯 Clean User Experience** - Users see only relevant files and directories
5. **🔧 Configurable** - Admins can fine-tune what gets hidden and what doesn't

### 👨‍💼 **For Server Administrators**

**This plugin is designed for server admins who want to:**
- **Protect sensitive system files** from accidental access via web interface
- **Clean up the user experience** by hiding irrelevant system files
- **Monitor filtering activity** with detailed debug logging
- **Maintain control** over what users can see and access in the web interface
- **Reduce support tickets** from users confused by system files

**The advanced debug system allows admins to:**
- **Review exactly what files/directories are being filtered**
- **Catch any errors in detail** should they occur
- **Monitor filtering performance** and effectiveness
- **Troubleshoot issues** with comprehensive logging
- **Audit security** by seeing what hidden files exist

### 🎯 **Use Cases**

- **🔒 Shared Hosting**: Reduce accidental exposure of system files in web interface
- **🏢 Enterprise Environments**: Protect sensitive configuration files from web access
- **👥 Multi-User Servers**: Clean up navigation for non-technical users
- **🛡️ Security-Conscious Admins**: Reduce margin for unintentional errors
- **📊 Monitoring**: Track what hidden files exist and are being filtered (Debug Logging)

---

## ✨ Features

### 🔍 Instant Filtering
- **Real-time Removal**: Dot-prefixed items removed immediately
- **Comprehensive Coverage**: All ruTorrent browse dialogs, dropdowns, and menus
- **Generic Filtering**: Works with any dot-prefixed path (`.anything`, `.whatever`, etc.)
- **Preserves Navigation**: Keeps `..` parent directory references intact

### 🛡️ Dual Protection Technology
- **Client-Side**: Advanced DOM interception using MutationObserver
- **Server-Side**: Programmatic override of filemanager settings
- **Runtime Enforcement**: Forces hidden files to stay hidden

### 🔧 Advanced Debug System
- **Intelligent Deduplication**: Prevents duplicate log entries
- **Scoped Debugging**: Enable specific scopes (general, filter, patch, cache, performance)
- **Rate Limiting**: Configurable rate limiting to prevent spam
- **Memory Management**: Automatic cleanup prevents memory leaks

---

## 🚀 Installation

### 📋 Prerequisites

> [!IMPORTANT]
> **Requirements:**
> - ✅ ruTorrent v5.2+ installed and configured
> - ✅ Modern web browser with ES6+ support
> - ✅ Access to ruTorrent plugins directory
> - ✅ Proper file permissions for web server

### ⚡ QuickBox Installation (Recommended)

```bash
# Clone to QuickBox ruTorrent plugins directory
git clone "https://github.com/QuickBox/rutorrent_hide-dotpaths.git" "/srv/rutorrent/plugins/hide-dotpaths"

# Set permissions
chown www-data:www-data -R "/srv/rutorrent/plugins/hide-dotpaths"
chmod 755 "/srv/rutorrent/plugins/hide-dotpaths/"
chmod 644 "/srv/rutorrent/plugins/hide-dotpaths/"*.js
chmod 644 "/srv/rutorrent/plugins/hide-dotpaths/"*.php
chmod 644 "/srv/rutorrent/plugins/hide-dotpaths/"*.info

# Restart services
sudo systemctl restart php8.1-fpm nginx
source /opt/quickbox/config/system/mflibs/quickbox >/dev/null 2>&1
read -d '' -ra users_all <<<"$(quickbox::database "SELECT username FROM user_information")"
for user in "${users_all[@]:-}"; do
  sudo systemctl restart rtorrent@"${user}"
done
```

### 🔧 Standard Installation

```bash
# Clone and copy to plugins directory
git clone https://github.com/QuickBox/rutorrent_hide-dotpaths.git
cp -r rutorrent_hide-dotpaths /path/to/rutorrent/plugins/hide-dotpaths

# Set permissions
chmod 755 /path/to/rutorrent/plugins/hide-dotpaths/
chmod 644 /path/to/rutorrent/plugins/hide-dotpaths/*.js
chmod 644 /path/to/rutorrent/plugins/hide-dotpaths/*.php
chmod 644 /path/to/rutorrent/plugins/hide-dotpaths/*.info
```

### 📦 Manual Installation

1. Download from [GitHub Releases](https://github.com/QuickBox/rutorrent_hide-dotpaths/releases)
2. Extract and copy to ruTorrent plugins directory
3. Set permissions as shown above

---

## ⚙️ Configuration

Edit `conf.php` to customize behavior:

```php
<?php
// Main settings
$hide_dotpaths = true;           // Enable/disable plugin
$filter_selects = true;          // Filter <select> dropdowns
$filter_modals = true;           // Filter modal file browsers
$filter_autocomplete = true;     // Filter autocomplete dropdowns
$filter_ajax = true;             // Filter AJAX responses
$filter_filemanager = true;      // Filter filemanager plugin table rows
$preserve_parent_dirs = true;    // Keep ".." parent directory references
$debug_mode = false;             // Enable debug logging
$apply_filemanager_patch = true; // Apply server-side filemanager patch

// Advanced debug settings
$debug_scopes = 'general,filter';   // Debug scopes: general,filter,patch,cache,performance,all
$debug_rate_limit = 2000;           // Rate limit in milliseconds
$debug_deduplication_window = 5000; // Deduplication window in milliseconds
$debug_enable_internal = false;     // Enable internal cache debugging
?>
```

### 📊 Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `$hide_dotpaths` | `true` | Main enable/disable switch |
| `$filter_selects` | `true` | Filter `<select>` dropdowns |
| `$filter_modals` | `true` | Filter modal file browsers |
| `$filter_autocomplete` | `true` | Filter autocomplete dropdowns |
| `$filter_ajax` | `true` | Filter AJAX responses |
| `$filter_filemanager` | `true` | Filter filemanager plugin table rows |
| `$preserve_parent_dirs` | `true` | Keep `..` parent directory references |
| `$debug_mode` | `false` | Enable debug logging |
| `$apply_filemanager_patch` | `true` | Apply server-side filemanager patch |
| `$debug_scopes` | `'general,filter'` | Comma-separated debug scopes |
| `$debug_rate_limit` | `2000` | Rate limit in milliseconds |
| `$debug_deduplication_window` | `5000` | Deduplication window in milliseconds |
| `$debug_enable_internal` | `false` | Enable internal cache debugging |

---

## 🔧 Debug System

### Debug Scopes
- `general`: Default scope for general messages
- `filter`: Filtering-related messages
- `patch`: Filemanager patch messages
- `cache`: Cache operation messages
- `performance`: Performance and timing messages
- `all`: Enable all scopes

### Usage Examples

```javascript
// Get debug statistics
const stats = window.getDebugStats();
console.log('Deduplication rate:', stats.skippedDuplicates / stats.totalCalls);

// Test the deduplication system
window.testAdvancedDebug();

// Clear debug cache manually
window.clearDebugCache();
```

### Advanced Configuration

```php
// Enable specific scopes
$debug_scopes = 'general,filter,performance';

// Set custom rate limit (2 seconds)
$debug_rate_limit = 2000;

// Set deduplication window (5 seconds)
$debug_deduplication_window = 5000;

// Enable internal cache debugging
$debug_enable_internal = true;
```



## 🧪 Testing

### Enable Debug Mode

```php
$debug_mode = true;
```

### Test Dual Protection

```javascript
// Test client-side filtering
testHideDotpaths();

// Check if filemanager patch is applied
console.log('Filemanager patch applied:', window.flm?.settings?.getSettingValue('showhidden') === false);
```

### Manual Testing

Open browser console and run:

```javascript
testHideDotpaths();
```

---

## 📋 Compatibility

- **ruTorrent v5.2+** - Full support with enhanced features (tested:confirmed)
- **All browsers** - Modern browser support (ES6+)
- **QuickBox Pro v3** - Full integration support
- **Filemanager Plugin** - Compatible with filemanager plugin

---

## 🛠️ Troubleshooting

### ❗ Common Problems

#### 🔌 Plugin Not Working
- **Problem**: Plugin doesn't filter dot-prefixed directories
- **Solution**: Check if plugin is enabled in ruTorrent Settings → Plugins
- **Check**: Verify file permissions and browser console for errors

#### 👁️ Still Seeing Dot-Prefixed Directories
- **Problem**: Dot-prefixed directories still visible after installation
- **Solution**: Refresh the page and clear browser cache
- **Check**: Verify configuration in `conf.php` and enable debug mode

#### ⚡ Performance Issues
- **Problem**: Plugin causes performance issues or slow loading
- **Solution**: Reduce cleanup frequency or disable unused filters
- **Check**: Monitor browser performance and check for conflicts

### 🔧 Debug Mode

```php
$debug_mode = true;
$debug_enable_internal = true;  // For detailed cache debugging
```

### 📊 Performance Optimization

```php
// Reduce debug output
$debug_rate_limit = 5000;           // 5 seconds between logs
$debug_deduplication_window = 10000; // 10 seconds deduplication

// Disable unused filters
$filter_ajax = false;               // If not using AJAX dropdowns
$filter_autocomplete = false;       // If not using autocomplete
```

---

## 🏗️ Architecture

```
Plugin Structure
├── init.js          # Main plugin logic (623 lines)
├── conf.php         # Configuration (58 lines)
├── debug-utils.js   # Advanced debug utilities (330 lines)
├── debug-cache.js   # Smart debug logging cache (119 lines)
├── plugin.info      # Plugin metadata
├── lang/            # Multi-language support (7 languages)
├── LICENSE          # GPL v3 license
└── README.md        # This documentation
```

### Key Components

- **MutationObserver** - Real-time element interception
- **Event Listeners** - Real-time DOM monitoring
- **Advanced Debug System** - Intelligent logging with deduplication
- **Configuration System** - Flexible settings management
- **Multi-Language Support** - Internationalization for 7 languages



## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

<div align="center">

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0.html)

[GNU General Public License v3.0](LICENSE)

</div>

This project is licensed under the GNU General Public License v3.0.

**Parent Software:**
- **ruTorrent** - Copyright (C) 2009 novik65@gmail.com
- **License**: GNU General Public License v3.0

---

## 🙏 Acknowledgments

<div align="center">

**Made with ❤️ by the QuickBox Team**

</div>

- **🏗️ QuickBox Team**: For the amazing QuickBox Pro v3 framework
- **🎭 ruTorrent Team**: For the excellent plugin system
- **👥 Community**: For feedback, testing, and contributions

---

## 🆘 Support

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289DA?style=for-the-badge&logo=discord&logoColor=7289DA)](https://discord.gg/mca7RSv5pa)
[![GitHub Issues](https://img.shields.io/badge/GitHub-Report%20Issues-181717?style=for-the-badge&logo=github)](https://github.com/QuickBox/rutorrent_hide-dotpaths/issues)
[![Documentation](https://img.shields.io/badge/Documentation-Read-blue?style=for-the-badge&logo=book)](https://github.com/QuickBox/rutorrent_hide-dotpaths#-table-of-contents)

</div>

- **💬 Community**: Join the [QuickBox Community](https://discord.gg/mca7RSv5pa)
- **🐛 Issues**: Report bugs on [GitHub Issues](https://github.com/QuickBox/rutorrent_hide-dotpaths/issues)
- **📖 Documentation**: This README and inline code comments

**Version:** 2.5.210

---

<div align="center">

[⬆️ Back to Top](#rutorrent-hide-dotpaths-plugin)

</div>
