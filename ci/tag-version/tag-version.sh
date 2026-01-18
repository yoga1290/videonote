REMOTE_ORIGIN="https://${GITHUB_REPOSITORY_OWNER}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

# Install git if not found:
git --version 2>/dev/null 1>/dev/null || apk add git

git remote set-url origin $REMOTE_ORIGIN;
git pull origin --tags 2>/dev/null 1>/dev/null;

YYYY=$(date +%Y)
TAG_COUNT=$(git tag -l | grep -o "${YYYY}" | wc -l)
TAG="${YYYY}.${TAG_COUNT}"
echo "$TAG"
