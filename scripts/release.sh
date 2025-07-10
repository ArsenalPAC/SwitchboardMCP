#!/bin/bash

# Release helper script for Switchboard MCP Server

set -e

echo "🚀 Release Helper for Switchboard MCP Server"
echo "==========================================="

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: You must be on the main branch to release"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check for uncommitted changes
if ! git diff --quiet || ! git diff --staged --quiet; then
    echo "❌ Error: You have uncommitted changes"
    echo "Please commit or stash your changes before releasing"
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Determine version bump type
echo ""
echo "What type of release is this?"
echo "1) patch (bug fixes) - e.g., 1.0.4 → 1.0.5"
echo "2) minor (new features) - e.g., 1.0.4 → 1.1.0"
echo "3) major (breaking changes) - e.g., 1.0.4 → 2.0.0"
echo ""
read -p "Enter your choice (1/2/3): " CHOICE

case $CHOICE in
    1) VERSION_TYPE="patch";;
    2) VERSION_TYPE="minor";;
    3) VERSION_TYPE="major";;
    *) echo "❌ Invalid choice"; exit 1;;
esac

# Build and test
echo ""
echo "🔨 Building project..."
npm run build

echo "🧪 Running tests..."
npm test --if-present

# Update version
echo ""
echo "📝 Updating version..."
NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
echo "New version: $NEW_VERSION"

# Commit version change
git add package.json package-lock.json
git commit -m "chore: release $NEW_VERSION"

# Create and push tag
git tag $NEW_VERSION
echo ""
echo "🏷️  Created tag: $NEW_VERSION"

# Push changes
echo ""
echo "📤 Pushing to GitHub..."
git push origin main
git push origin $NEW_VERSION

echo ""
echo "✅ Release $NEW_VERSION has been pushed!"
echo ""
echo "GitHub Actions will now:"
echo "  - Build and test the project"
echo "  - Publish to NPM"
echo "  - Create a GitHub release"
echo ""
echo "Monitor progress at: https://github.com/ArsenalPAC/SwitchboardMCP/actions" 