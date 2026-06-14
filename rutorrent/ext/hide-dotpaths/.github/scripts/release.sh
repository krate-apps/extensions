#!/bin/bash

# Manual release script for hide-dotpaths plugin
# Usage: ./scripts/release.sh <version>

set -e

VERSION="$1"

if [[ -z "$VERSION" ]]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 2.5.0"
  exit 1
fi

# Validate version format
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "❌ Invalid version format. Use semantic versioning (e.g., 2.5.0)"
  exit 1
fi

echo "🚀 Creating release for hide-dotpaths plugin v${VERSION}"

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "⚠️ Warning: You're not on the main branch (currently on $CURRENT_BRANCH)"
  read -p "Continue anyway? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Release cancelled"
    exit 1
  fi
fi

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ You have uncommitted changes. Please commit or stash them first."
  git status --short
  exit 1
fi

# Update version.txt
echo "📝 Updating version.txt to ${VERSION}"
echo "$VERSION" > version.txt

# Commit version update
git add version.txt
git commit -m "chore: bump version to ${VERSION}"

# Create and push tag
echo "🏷️ Creating tag v${VERSION}"
git tag -a "v${VERSION}" -m "Release v${VERSION}"

echo "📤 Pushing changes and tag..."
git push origin main
git push origin "v${VERSION}"

echo "✅ Release v${VERSION} created successfully!"
echo "📋 Release URL: https://github.com/QuickBox/rutorrent_hide-dotpaths/releases/tag/v${VERSION}"
echo "🔄 GitHub Actions will automatically create the release with changelog" 