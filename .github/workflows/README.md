# GitHub Actions Workflows

This directory contains automated workflows for the New Relic Cordova Plugin.

## Workflows

### 1. Update Native Agent Versions (`update-native-agents.yml`)

Automatically checks for and updates native Android and iOS agent versions.

**Triggers:**
- **Manual**: Via GitHub Actions UI
- **Scheduled**: Weekly on Mondays at 9:00 AM UTC
- **Self-test**: On changes to the workflow file

**What it does:**
1. Fetches latest Android agent version from Maven Central
2. Fetches latest iOS agent version from CocoaPods
3. Updates `plugin.xml` with new versions
4. Updates `package.json` version (auto-increments patch)
5. Updates `CHANGELOG.md` with release notes
6. Creates a PR to the `develop` branch

**Manual Usage:**
```bash
# Use latest versions
gh workflow run update-native-agents.yml

# Specify versions
gh workflow run update-native-agents.yml \
  -f android_version=7.6.10 \
  -f ios_version=7.5.9
```

### 2. Create Release and Update Documentation (`create-release.yml`)

Automatically creates a GitHub release and updates documentation when a version update PR is merged to master.

**Triggers:**
- **Automatic**: When a PR with "Update native agents" in the title is merged to `master`
- **Manual**: Via GitHub Actions UI

**What it does:**
1. Creates a Git tag (e.g., `v7.0.10`)
2. Creates a GitHub release with notes from CHANGELOG.md
3. Syncs the `ndesai-newrelic/docs-website` fork with upstream
4. Extracts release information from CHANGELOG.md
5. Creates a new release notes MDX file (e.g., `cordova-agent-710.mdx`)
6. Creates a PR to `newrelic/docs-website` with the new release notes

**Manual Usage:**
```bash
# Use version from plugin.xml
gh workflow run create-release.yml

# Specify a version
gh workflow run create-release.yml -f version=7.0.10
```

## Setup Requirements

### Required Secrets

For the release workflow to work properly, you need to set up a GitHub Personal Access Token (PAT):

1. **Create a Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a descriptive name: `Cordova Plugin Release Workflow`
   - Select the following scopes:
     - `repo` (Full control of private repositories)
     - `workflow` (Update GitHub Action workflows)
     - `write:packages` (Upload packages to GitHub Package Registry)
   - Set an appropriate expiration date
   - Click "Generate token" and copy the token

2. **Add the token as a repository secret:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `DOCS_WORKFLOW_TOKEN`
   - Value: Paste your PAT
   - Click "Add secret"

3. **Update the workflow:**
   - Replace `${{ secrets.GITHUB_TOKEN }}` with `${{ secrets.DOCS_WORKFLOW_TOKEN }}` in the checkout and gh CLI steps

**Why is this needed?**
- The default `GITHUB_TOKEN` doesn't have permission to create PRs in external repositories
- The PAT allows the workflow to:
  - Push to the forked docs-website repository
  - Create PRs in the upstream docs-website repository

### Alternative: GitHub App

Instead of a PAT, you can create a GitHub App with appropriate permissions:

1. Create a GitHub App with:
   - Repository permissions:
     - Contents: Read & Write
     - Pull requests: Read & Write
   - Install the app on both repositories

2. Use the app's authentication in the workflow

## Workflow Process

### Complete Release Process

1. **Automated Version Update** (Weekly or Manual)
   ```
   update-native-agents.yml runs
   → Creates PR to develop branch
   → PR reviewed and merged
   ```

2. **Merge to Master**
   ```
   PR from develop merged to master
   → create-release.yml triggers automatically
   ```

3. **Release Created**
   ```
   → Git tag created (v7.0.10)
   → GitHub release published
   → Release notes from CHANGELOG.md
   ```

4. **Documentation Updated**
   ```
   → docs-website fork synced
   → Release notes MDX file created
   → PR created to newrelic/docs-website
   → Ready for docs team review
   ```

## Troubleshooting

### Update Native Agents Workflow

**Issue**: Workflow doesn't detect new versions
- Check that the version APIs are accessible:
  - Android: https://repo1.maven.org/maven2/com/newrelic/agent/android/android-agent/maven-metadata.xml
  - iOS: https://trunk.cocoapods.org/api/v1/pods/NewRelicAgent

**Issue**: Version increment is wrong
- Verify the plugin.xml version is correctly formatted (X.Y.Z)
- Check the "Calculate new plugin version" step logs

### Create Release Workflow

**Issue**: PR creation fails
- Verify `DOCS_WORKFLOW_TOKEN` secret is set
- Check token has required permissions
- Verify fork repository exists: ndesai-newrelic/docs-website

**Issue**: MDX file format is incorrect
- Check CHANGELOG.md format matches expected structure
- Verify date format is YYYY-MM-DD

**Issue**: Tag already exists
- Check if release was already created
- Use manual trigger with a different version

## File Locations

- **Workflows**: `.github/workflows/`
- **Plugin Configuration**: `plugin.xml`
- **Package Version**: `package.json`
- **Changelog**: `CHANGELOG.md`
- **Docs Release Notes**: `docs-website/src/content/docs/release-notes/mobile-release-notes/cordova-release-notes/`

## Testing

To test workflows without affecting production:

1. Create a feature branch
2. Update workflow to target your test branch
3. Run workflow manually
4. Verify outputs and behavior
5. Restore production settings before merging