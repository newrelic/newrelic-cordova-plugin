# Automated Release Workflow Setup Guide

This guide will help you set up the automated release and documentation workflows for the New Relic Cordova Plugin.

## Overview

Two GitHub Actions workflows have been created:

1. **`update-native-agents.yml`** - Automatically updates native agent versions
2. **`create-release.yml`** - Creates releases and updates documentation

## Complete Automation Flow

```
Weekly/Manual Trigger
        ↓
[update-native-agents.yml]
        ↓
PR created to develop branch
        ↓
Review & Merge to develop
        ↓
Merge develop → master
        ↓
[create-release.yml] Auto-triggers
        ↓
├── Create Git Tag (v7.0.10)
├── Create GitHub Release
└── Update Documentation
        ↓
    Checkout fork (ndesai-newrelic/docs-website)
        ↓
    Sync fork with upstream
        ↓
    Create release notes MDX file
        ↓
    Create branch & commit changes
        ↓
    Push to fork
        ↓
    PR to newrelic/docs-website
```

## Setup Instructions

### Step 1: Create Personal Access Token (PAT)

The workflows need a PAT to interact with the docs-website repository.

1. **Generate a new token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - **Name:** `Cordova Plugin Automation`
   - **Expiration:** Choose 90 days or longer
   - **Select scopes:**
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `write:packages` (Upload packages)
   - Click "Generate token"
   - **COPY THE TOKEN** - you won't see it again!

2. **Add token to repository secrets:**
   - Go to: https://github.com/newrelic/newrelic-cordova-plugin/settings/secrets/actions
   - Click "New repository secret"
   - **Name:** `DOCS_WORKFLOW_TOKEN`
   - **Value:** Paste your PAT
   - Click "Add secret"

### Step 2: Setup docs-website Fork

Since you don't have direct write access to `newrelic/docs-website`, you'll need to use a fork:

1. **Ensure fork exists:**
   - Fork already exists: `ndesai-newrelic/docs-website`
   - Make sure it has a `develop` branch

2. **Set repository variable (optional):**
   - If using a different fork, go to: https://github.com/newrelic/newrelic-cordova-plugin/settings/variables/actions
   - Click "New repository variable"
   - **Name:** `DOCS_FORK_REPO`
   - **Value:** `username/docs-website` (e.g., `ndesai-newrelic/docs-website`)
   - If not set, defaults to `ndesai-newrelic/docs-website`

3. **Verify PAT has access:**
   - The `DOCS_WORKFLOW_TOKEN` must have access to your fork
   - Should be able to push branches to the fork

### Step 3: Test the Workflows

#### Test Version Update Workflow

```bash
# From the repository root
gh workflow run update-native-agents.yml

# Or with specific versions
gh workflow run update-native-agents.yml \
  -f android_version=7.6.10 \
  -f ios_version=7.5.9
```

**Expected Result:**
- PR created to `develop` branch
- Files updated: `plugin.xml`, `package.json`, `CHANGELOG.md`
- Version incremented correctly

#### Test Release Workflow (Manual)

```bash
# Manually trigger the release workflow
gh workflow run create-release.yml

# Or specify a version
gh workflow run create-release.yml -f version=7.0.10
```

**Expected Result:**
- Git tag created: `v7.0.10`
- GitHub release published
- PR created to `newrelic/docs-website`
- MDX file created: `cordova-agent-710.mdx`

## Usage

### Normal Release Process

1. **Weekly automated check runs** (or trigger manually)
2. **Review and merge the update PR** from `develop`
3. **Merge `develop` → `master`**
4. **Release workflow auto-triggers**
   - Creates tag and release
   - Updates documentation
5. **Review docs PR** at https://github.com/newrelic/docs-website/pulls

### Manual Version Update

```bash
# Update to specific versions
gh workflow run update-native-agents.yml \
  -f android_version=7.7.0 \
  -f ios_version=7.6.0
```

### Manual Release

```bash
# Create release for current version in master
gh workflow run create-release.yml

# Create release for specific version
gh workflow run create-release.yml -f version=7.0.11
```

## File Locations and Formats

### Updated Files

#### `plugin.xml`
- Plugin version: `<plugin ... version="7.0.10">`
- PLUGIN_VERSION preference: `<preference name="PLUGIN_VERSION" default="7.0.10" />`
- Android version: `<preference name="ANDROID_AGENT_VER" default="7.6.10" />`
- iOS version: `<pod name="NewRelicAgent" spec="~>7.5.9" />`

#### `package.json`
```json
{
  "version": "7.0.10"
}
```

#### `CHANGELOG.md`
```markdown
# 7.0.10

- Native Android agent updated to version 7.6.10
- Native iOS agent updated to version 7.5.9
```

### Generated Documentation

#### Release Notes MDX (`cordova-agent-710.mdx`)
```mdx
---
subject: Cordova agent
releaseDate: '2025-11-04'
version: 7.0.10
downloadLink: 'https://github.com/newrelic/newrelic-cordova-plugin'
---

## Improvements

- Native Android agent updated to version 7.6.10.
- Native iOS agent updated to version 7.5.9.
```

## Troubleshooting

### Issue: "Resource not accessible by integration"

**Cause:** Missing or invalid `DOCS_WORKFLOW_TOKEN`

**Fix:**
1. Verify token exists in repository secrets
2. Check token hasn't expired
3. Ensure token has correct permissions

### Issue: PR creation to docs-website fails

**Cause:** Token doesn't have write access to newrelic/docs-website

**Fix:**
1. Verify the `DOCS_WORKFLOW_TOKEN` has write access to the docs-website repository
2. Ensure the token owner has permission to create branches in newrelic/docs-website
3. Check if the branch already exists in the repository

### Issue: Tag already exists

**Cause:** Release workflow ran multiple times for same version

**Fix:**
```bash
# Delete the tag and re-run
git tag -d v7.0.10
git push origin :refs/tags/v7.0.10

# Then manually trigger release workflow again
```

### Issue: Version increment is wrong

**Cause:** Version in `plugin.xml` not in X.Y.Z format

**Fix:** Ensure version follows semantic versioning: `7.0.9` not `7.0.9.0` or `v7.0.9`

### Issue: CHANGELOG.md not parsed correctly

**Cause:** Format doesn't match expected structure

**Fix:** Ensure CHANGELOG.md follows this format:
```markdown
# 7.0.10

- Native Android agent updated to version 7.6.10
- Native iOS agent updated to version 7.5.9


# 7.0.9

- Previous version notes
```

## Monitoring

### Check Workflow Status

```bash
# List recent workflow runs
gh run list --workflow=update-native-agents.yml
gh run list --workflow=create-release.yml

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log
```

### GitHub UI

- **Actions:** https://github.com/newrelic/newrelic-cordova-plugin/actions
- **Releases:** https://github.com/newrelic/newrelic-cordova-plugin/releases
- **Tags:** https://github.com/newrelic/newrelic-cordova-plugin/tags

## Security Notes

1. **Never commit PAT tokens** to the repository
2. **Rotate tokens regularly** (every 90 days recommended)
3. **Use minimum required permissions** for tokens
4. **Audit token usage** periodically in GitHub settings
5. **Revoke tokens immediately** if compromised

## Maintenance

### Update Workflow

To modify the workflows, edit:
- `.github/workflows/update-native-agents.yml`
- `.github/workflows/create-release.yml`

Test changes on a feature branch before merging to `develop` or `master`.

### Disable Workflows

To temporarily disable:
1. Go to repository Actions tab
2. Click on the workflow
3. Click "..." menu → "Disable workflow"

Or edit the workflow file and add:
```yaml
on:
  workflow_dispatch:  # Only manual trigger
```

## Changing the Fork

To switch to a different fork (e.g., organization fork or service account):

1. **Update repository variable:**
   - Go to: https://github.com/newrelic/newrelic-cordova-plugin/settings/variables/actions
   - Edit `DOCS_FORK_REPO` variable
   - Set to new fork: `org-name/docs-website`

2. **Update PAT if needed:**
   - If using a different account's fork, update `DOCS_WORKFLOW_TOKEN`
   - Ensure new PAT has access to the new fork

3. **No workflow changes needed:**
   - Workflow automatically uses the `DOCS_FORK_REPO` variable
   - Falls back to `ndesai-newrelic/docs-website` if not set

## Support

For issues or questions:
1. Check workflow run logs in GitHub Actions
2. Review this documentation
3. Check the main README: `.github/workflows/README.md`
4. Open an issue in the repository

## Summary

Once the `DOCS_WORKFLOW_TOKEN` is set up, the entire release process is automated:
1. Weekly checks for new agent versions
2. Auto-creation of update PRs
3. Auto-creation of releases on merge to master
4. Auto-creation of documentation PRs

Minimal manual intervention required - just review and approve PRs!