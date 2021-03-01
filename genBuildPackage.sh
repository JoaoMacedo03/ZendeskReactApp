#!/bin/sh

mkdir build/assets
mv build/static/css/*.css build/assets
mv build/static/js/*.js build/assets
mv build/static/media/* build/assets
rm -rf build/static
mv build/* build/assets
cp -r zendesk-mock/assets/* build/assets
rm build/assets/iframe.html
rm build/assets/favicon.ico
cp -r zendesk-mock/translations build
cp zendesk-mock/manifest.json build
sed -i 's/http\:\/\/localhost\:[0-9]\+/assets\/index.html/g' build/manifest.json
sed -i 's/.\/static\/[^\/]\+\///g' build/assets/asset-manifest.json
sed -i 's/.\/static\/[^\/]\+\///g' build/assets/index.html
sed -i 's/.\/static\/[^\/]\+\///g' build/assets/precache-manifest.*
sed -i 's/url.\//url(/g' build/assets/main.*.chunk.css

cd  build
zat package