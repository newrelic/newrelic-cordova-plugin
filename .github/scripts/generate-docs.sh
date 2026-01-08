#!/bin/bash

# --- 1. REQUIRE VERSION ---
if [ -z "$PASSED_VERSION" ]; then
    echo "::error::PASSED_VERSION missing"
    exit 1
fi

VERSION=$PASSED_VERSION

# --- 2. PARSE CHANGELOG.MD ---
# 1. Finds the header matching your version
# 2. Collects everything until it hits the NEXT header (starting with #)
# 3. Stops correctly even if there are multiple newlines
RELEASE_NOTES=$(awk "/^# ${VERSION}/{flag=1;next} /^# /{flag=0} flag" CHANGELOG.md)

# Clean up: Remove empty lines and format bullets
# We use 'sed' to ensure every line starting with '-' becomes '* '
IMPROVEMENTS=$(echo "$RELEASE_NOTES" | grep "^-" | sed 's/^- /* /')

# --- 3. CREATE THE MDX ---
RELEASE_DATE=$(date +%Y-%m-%d)
FINAL_DOWNLOAD_URL="${DOWNLOAD_LINK:-${REPO_URL}/releases/tag/v${VERSION}}"

cat > "release-notes.mdx" << EOF
---
subject: ${AGENT_TITLE}
releaseDate: '${RELEASE_DATE}'
version: ${VERSION}
downloadLink: '${FINAL_DOWNLOAD_URL}'
---

## Improvements

${IMPROVEMENTS}
EOF

# --- 4. EXPORT CONTRACT ---
echo "FINAL_VERSION=$VERSION" > release_info.env

echo "✅ Generated release-notes.mdx for version $VERSION"