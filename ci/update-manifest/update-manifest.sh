######### UPDATE MANIFEST VERSION ###
CI_PATH_TAG='./ci/tag-version/tag-version.sh'

MANIFEST_SRC='./ci/update-manifest/manifest.json';
MANIFEST_DIST='./dist/manifest.json';

TAG_VERSION=$(sh $CI_PATH_TAG 2>/dev/null);

cat $MANIFEST_SRC | \
    sed -e "s/VERSION_TAG/${TAG_VERSION}/g" > $MANIFEST_DIST
####################################

