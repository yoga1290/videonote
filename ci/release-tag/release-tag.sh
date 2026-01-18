CI_PATH_TAG='./ci/tag-version/tag-version.sh'

NEW_VERSION=$(bash $CI_PATH_TAG);
git tag $NEW_VERSION;
git push;