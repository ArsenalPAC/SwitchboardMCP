# Automated Release Process

This repository is configured to automatically publish to NPM when you create a new release on GitHub.

## Setup Instructions

### 1. Get NPM Token

1. Login to [npmjs.com](https://www.npmjs.com)
2. Go to your profile → Access Tokens
3. Click "Generate New Token"
4. Choose "Automation" (for CI/CD)
5. Copy the token (starts with `npm_`)

### 2. Add NPM Token to GitHub

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your NPM token
6. Click "Add secret"

## Release Process

### Option 1: Create a GitHub Release (Recommended)

1. Go to the [Releases page](../../releases)
2. Click "Create a new release"
3. Create a new tag with format `v1.0.5` (semantic versioning)
4. Fill in the release notes
5. Click "Publish release"

The workflow will automatically:
- Build the project
- Update package.json version
- Publish to NPM
- Create GitHub release with notes

### Option 2: Push a Version Tag

```bash
# Update version in package.json
npm version patch # or minor, major

# Push the tag
git push origin v1.0.5
```

### Option 3: Manual Workflow Dispatch

1. Go to Actions → Release workflow
2. Click "Run workflow"
3. Enter the version number (e.g., 1.0.5)
4. Click "Run workflow"

## Workflow Files

- `.github/workflows/ci.yml` - Runs tests on every push/PR
- `.github/workflows/publish.yml` - Simple publish on release
- `.github/workflows/release.yml` - Comprehensive release process

## Version Management

The workflows automatically sync versions between:
- Git tags (v1.0.5)
- package.json version
- NPM published version
- GitHub release version

## Troubleshooting

### NPM Publish Failed

1. Check that NPM_TOKEN is set correctly in GitHub secrets
2. Verify the token hasn't expired
3. Ensure the package name is available on NPM
4. Check for any unpublished dependencies

### Build Failed

1. Run `npm ci` and `npm run build` locally
2. Fix any TypeScript errors
3. Ensure all dependencies are properly declared

### Version Conflicts

- The workflow extracts version from git tags
- Format must be `v1.0.5` (with 'v' prefix)
- package.json is updated automatically 