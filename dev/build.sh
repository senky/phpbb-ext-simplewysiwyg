#!/bin/bash

# make sure we are in dev directory
cd "$(dirname "$0")"

# cleanup
echo "Preparing directory..."
rm -rf ckeditor senky simplewysiwyg.zip

# create temp dir
mkdir -p senky/simplewysiwyg

# copy ext files
echo "Copying files..."
cp -r ../styles senky/simplewysiwyg/styles
cp ../composer.json senky/simplewysiwyg/composer.json
cp ../license.txt senky/simplewysiwyg/license.txt
cp ../README.md senky/simplewysiwyg/README.md

# uncomment config and style
sed -i '' -e 's/\/\/ customConfig/customConfig/g' senky/simplewysiwyg/styles/all/template/js/simplewysiwyg.js
sed -i '' -e 's/\/\/ stylesSet/stylesSet/g' senky/simplewysiwyg/styles/all/template/js/simplewysiwyg.js

# make sure to include newest phpBB CKEditor
mkdir ckeditor
echo "Fetching newest CKEditor..."
git clone --quiet git@github.com:senky/ckeditor-dev.git ckeditor
echo "Building CKEditor..."
./ckeditor/dev/builder/build.sh
rm -rf senky/simplewysiwyg/styles/all/template/js/ckeditor
mkdir senky/simplewysiwyg/styles/all/template/js/ckeditor
cp -r ckeditor/dev/builder/release/ckeditor senky/simplewysiwyg/styles/all/template/js

# packing it all up
echo "Compressing extension..."
zip -rq -X simplewysiwyg.zip senky -x "*.DS_Store"

# cleanup
rm -rf ckeditor senky
