#!/bin/bash

# Automated version update script for hide-dotpaths plugin
# Usage: ./scripts/update-version.sh <new_version>

set -e

NEW_VERSION="$1"

if [[ -z "$NEW_VERSION" ]]; then
  echo "Usage: $0 <new_version>"
  echo "Example: $0 2.5.0"
  exit 1
fi

# Validate version format
if [[ ! "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "❌ Invalid version format. Use semantic versioning (e.g., 2.5.0)"
  exit 1
fi

echo "🔄 Updating all version references to ${NEW_VERSION}"

# Files to update with their patterns
declare -A FILES_PATTERNS=(
  ["version.txt"]="^[0-9]+\.[0-9]+\.[0-9]+$"
  ["init.js"]="@version [0-9]+\.[0-9]+\.[0-9]+|plugin\.version = \"[0-9]+\.[0-9]+\.[0-9]+\""
  ["plugin.info"]="plugin\.version: [0-9]+\.[0-9]+\.[0-9]+"
  ["debug-utils.js"]="@version [0-9]+\.[0-9]+\.[0-9]+"
  ["debug-cache.js"]="@version [0-9]+\.[0-9]+\.[0-9]+"
  ["conf.php"]="@version [0-9]+\.[0-9]+\.[0-9]+"
  ["README.md"]="\*\*Version:\*\* [0-9]+\.[0-9]+\.[0-9]+"
)

# Update each file
for file in "${!FILES_PATTERNS[@]}"; do
  pattern="${FILES_PATTERNS[$file]}"
  
  if [[ -f "$file" ]]; then
    echo "📝 Updating $file..."
    
    case "$file" in
      "version.txt")
        echo "$NEW_VERSION" > "$file"
        ;;
      "init.js")
        # Update @version comment
        sed -i "s/@version [0-9]\+\.[0-9]\+\.[0-9]\+/@version $NEW_VERSION/" "$file"
        # Update plugin.version
        sed -i "s/plugin\.version = \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/plugin.version = \"$NEW_VERSION\"/" "$file"
        ;;
      "plugin.info")
        sed -i "s/plugin\.version: [0-9]\+\.[0-9]\+\.[0-9]\+/plugin.version: $NEW_VERSION/" "$file"
        ;;
      "debug-utils.js"|"debug-cache.js"|"conf.php")
        sed -i "s/@version [0-9]\+\.[0-9]\+\.[0-9]\+/@version $NEW_VERSION/" "$file"
        ;;
      "README.md")
        sed -i "s/\*\*Version:\*\* [0-9]\+\.[0-9]\+\.[0-9]\+/**Version:** $NEW_VERSION/" "$file"
        ;;
    esac
    
    echo "✅ Updated $file"
  else
    echo "⚠️ Warning: $file not found"
  fi
done

# Update release script example
if [[ -f "scripts/release.sh" ]]; then
  echo "📝 Updating release script example..."
  sed -i "s/echo \"Example: \$0 [0-9]\+\.[0-9]\+\.[0-9]\+\"/echo \"Example: \$0 $NEW_VERSION\"/" "scripts/release.sh"
  echo "✅ Updated scripts/release.sh"
fi

echo "🎉 Version update completed!"
echo "📋 Updated files:"
for file in "${!FILES_PATTERNS[@]}"; do
  if [[ -f "$file" ]]; then
    echo "  - $file"
  fi
done
echo "  - scripts/release.sh"

echo ""
echo "💡 Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Commit changes: git add . && git commit -m \"chore: bump version to $NEW_VERSION\""
echo "  3. Create release: ./scripts/release.sh $NEW_VERSION"

# Automatically commit and push the changes
echo "🔄 Committing version changes..."
git add .
git commit -m "chore: bump version to $NEW_VERSION"
git push origin main
echo "✅ Version changes committed and pushed automatically" 