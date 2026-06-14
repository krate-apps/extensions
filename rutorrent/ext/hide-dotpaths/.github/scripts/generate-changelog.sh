#!/bin/bash

# Generate changelog for hide-dotpaths plugin releases
# Usage: ./generate-changelog.sh <version> <previous_tag> <output_file>

# Don't exit on error, handle errors gracefully
set +e

VERSION="$1"
PREVIOUS_TAG="$2"
OUTPUT_FILE="$3"

if [[ -z "$VERSION" || -z "$PREVIOUS_TAG" || -z "$OUTPUT_FILE" ]]; then
  echo "Usage: $0 <version> <previous_tag> <output_file>"
  exit 1
fi

echo "Generating changelog for hide-dotpaths plugin v${VERSION} from ${PREVIOUS_TAG} to ${OUTPUT_FILE}"

# Create changelog content
cat >"$OUTPUT_FILE" <<EOF
# hide-dotpaths Plugin v${VERSION}

## 🚀 Release Notes

This release includes the hide-dotpaths plugin for ruTorrent with advanced filtering capabilities.

### 📦 Files Included
- \`README.md\` - Comprehensive documentation
- \`init.js\` - Main plugin logic
- \`conf.php\` - Configuration system
- \`debug-utils.js\` - Advanced debug utilities
- \`debug-cache.js\` - Smart debug logging cache
- \`plugin.info\` - Plugin metadata
- \`lang/\` - Multi-language support (7 languages)
- \`LICENSE\` - GPL v3 license

### 🔒 Security Features
- Dual protection: client-side filtering + server-side filemanager patch
- Advanced debug system with intelligent deduplication
- Configurable filtering options for different environments
- Multi-language support for international deployments

### 📋 Changes Since ${PREVIOUS_TAG}

EOF

# Function to get commits for a specific type (handles both formats)
get_commits_for_type() {
  local type="$1"
  local section_name="$2"
  local emoji="$3"

  # Use GIT_RANGE if available, otherwise fall back to PREVIOUS_TAG..HEAD
  local git_range="${GIT_RANGE:-${PREVIOUS_TAG}..HEAD}"
  
  # Get commits for both formats: "type(scope):" and "type:"
  local commits
  commits=$(git log --oneline "$git_range" --grep="^${type}(" --grep="^${type}:" 2>/dev/null | head -10)

  if [[ -n "$commits" ]]; then
    echo "📝 Found commits for ${type}, adding ${section_name} section"
    {
      echo "### ${emoji} ${section_name}"
      echo "$commits" | while read -r commit; do
        if [[ ${#commit} -gt 8 ]]; then
          echo "- \`${commit:0:7}\` ${commit:8}"
        else
          echo "- \`${commit:0:7}\` ${commit}"
        fi
      done
      echo ""
    } >>"$OUTPUT_FILE"
    return 0
  fi
  return 1
}

# Check if we have any commits since the previous tag
git_range="${GIT_RANGE:-${PREVIOUS_TAG}..HEAD}"

# Ensure we have all tags available
echo "Fetching all tags to ensure proper changelog generation..."
git fetch --tags --force

# Validate the git range
if [[ "$PREVIOUS_TAG" != "initial" ]]; then
  # Try to validate the tag exists
  if ! git rev-parse "$PREVIOUS_TAG" >/dev/null 2>&1; then
    echo "⚠️ Warning: Previous tag '$PREVIOUS_TAG' not found, trying alternative formats..."
    
    # Try with 'v' prefix if not present
    if [[ ! "$PREVIOUS_TAG" =~ ^v ]] && git rev-parse "v$PREVIOUS_TAG" >/dev/null 2>&1; then
      PREVIOUS_TAG="v$PREVIOUS_TAG"
      git_range="${PREVIOUS_TAG}..HEAD"
      echo "✅ Found tag with 'v' prefix: $PREVIOUS_TAG"
    # Try without 'v' prefix if present
    elif [[ "$PREVIOUS_TAG" =~ ^v ]] && git rev-parse "${PREVIOUS_TAG#v}" >/dev/null 2>&1; then
      PREVIOUS_TAG="${PREVIOUS_TAG#v}"
      git_range="${PREVIOUS_TAG}..HEAD"
      echo "✅ Found tag without 'v' prefix: $PREVIOUS_TAG"
    else
      echo "❌ Could not find tag '$PREVIOUS_TAG' in any format, using 'initial'"
      PREVIOUS_TAG="initial"
      git_range="HEAD"
    fi
  else
    echo "✅ Previous tag '$PREVIOUS_TAG' found and valid"
  fi
fi

echo "Using git range: $git_range"

if git log --oneline "$git_range" 2>/dev/null | head -1; then
  echo "✅ Found commits since ${PREVIOUS_TAG}, generating detailed changelog..."

  # Generate sections for different commit types (only if commits exist)
  # Handle both formats: "type(scope):" and "type:" in single calls
  echo "🔍 Processing commit types..."
  get_commits_for_type "feat" "New Features" "🆕" || true
  get_commits_for_type "feature" "New Features" "🆕" || true
  get_commits_for_type "new" "New Additions" "🆕" || true
  get_commits_for_type "enh" "Enhancements" "✨" || true
  get_commits_for_type "enhancement" "Enhancements" "✨" || true
  get_commits_for_type "fix" "Fixes" "🔧" || true
  get_commits_for_type "hotfix" "Critical Fixes" "♨️" || true
  get_commits_for_type "refactor" "Refactoring" "🔧" || true
  get_commits_for_type "docs" "Documentation" "📚" || true
  get_commits_for_type "documentation" "Documentation" "📚" || true
  get_commits_for_type "style" "Style Changes" "🎨" || true
  get_commits_for_type "test" "Tests" "🧪" || true
  get_commits_for_type "chore" "Maintenance" "🔧" || true
  get_commits_for_type "maintenance" "Maintenance" "🔧" || true
  get_commits_for_type "translation" "Translations" "🌍" || true
  get_commits_for_type "tweak" "Tweaks" "🧪" || true
  get_commits_for_type "plugin" "Plugin Features" "🔌" || true

  # Add a general changes section for any other commits
  {
    echo "### 📝 General Changes"
    git log --oneline "${PREVIOUS_TAG}..HEAD" --grep="^feat(" --grep="^feat:" --grep="^feature(" --grep="^feature:" --grep="^new(" --grep="^new:" --grep="^enh(" --grep="^enh:" --grep="^enhancement(" --grep="^enhancement:" --grep="^fix(" --grep="^fix:" --grep="^hotfix(" --grep="^hotfix:" --grep="^refactor(" --grep="^refactor:" --grep="^docs(" --grep="^docs:" --grep="^documentation(" --grep="^documentation:" --grep="^style(" --grep="^style:" --grep="^test(" --grep="^test:" --grep="^chore(" --grep="^chore:" --grep="^maintenance(" --grep="^maintenance:" --grep="^translation(" --grep="^translation:" --grep="^tweak(" --grep="^tweak:" --grep="^plugin(" --grep="^plugin:" --invert-grep 2>/dev/null | head -5 | while read -r commit; do
      if [[ ${#commit} -gt 8 ]]; then
        echo "- \`${commit:0:7}\` ${commit:8}"
      else
        echo "- \`${commit:0:7}\` ${commit}"
      fi
    done || echo "- Version bump to ${VERSION}"
    echo ""
  } >>"$OUTPUT_FILE"

else
  echo "⚠️ No commits found since ${PREVIOUS_TAG}, creating minimal changelog..."
  {
    echo "### 📝 General Changes"
    echo "- Version bump to ${VERSION}"
    echo "- Initial release of hide-dotpaths plugin"
    echo "- Advanced filtering system for ruTorrent"
    echo "- Multi-language support for 7 languages"
    echo ""
  } >>"$OUTPUT_FILE"
fi

# Add installation instructions
cat >>"$OUTPUT_FILE" <<EOF

## 📦 Installation

### QuickBox Installation (Recommended)
\`\`\`bash
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
read -d '' -ra users_all <<<"\$(quickbox::database "SELECT username FROM user_information")"
for user in "\${users_all[@]:-}"; do
  sudo systemctl restart rtorrent@"\${user}"
done
\`\`\`

### Standard Installation
\`\`\`bash
# Clone and copy to plugins directory
git clone https://github.com/QuickBox/rutorrent_hide-dotpaths.git
cp -r rutorrent_hide-dotpaths /path/to/rutorrent/plugins/hide-dotpaths

# Set permissions
chmod 755 /path/to/rutorrent/plugins/hide-dotpaths/
chmod 644 /path/to/rutorrent/plugins/hide-dotpaths/*.js
chmod 644 /path/to/rutorrent/plugins/hide-dotpaths/*.php
chmod 644 /path/to/rutorrent/plugins/hide-dotpaths/*.info
\`\`\`

## 🔧 Configuration

Edit \`conf.php\` to customize the plugin behavior:

\`\`\`php
<?php
// Main settings
\$hide_dotpaths = true;           // Enable/disable plugin
\$filter_selects = true;          // Filter <select> dropdowns
\$filter_modals = true;           // Filter modal file browsers
\$filter_autocomplete = true;     // Filter autocomplete dropdowns
\$filter_ajax = true;             // Filter AJAX responses
\$filter_filemanager = true;      // Filter filemanager plugin table rows
\$preserve_parent_dirs = true;    // Keep ".." parent directory references
\$debug_mode = false;             // Enable debug logging
\$apply_filemanager_patch = true; // Apply server-side filemanager patch

// Advanced debug settings
\$debug_scopes = 'general,filter';   // Debug scopes: general,filter,patch,cache,performance,all
\$debug_rate_limit = 2000;           // Rate limit in milliseconds
\$debug_deduplication_window = 5000; // Deduplication window in milliseconds
\$debug_enable_internal = false;     // Enable internal cache debugging
?>
\`\`\`

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Release Date**: $(date +%F)
**Version**: ${VERSION}
**Previous Version**: ${PREVIOUS_TAG}
EOF

echo "✅ Changelog generated successfully: $OUTPUT_FILE" 