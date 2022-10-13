#!/bin/sh

#esbuild lib/index.js \
#node_modules/blessed/lib/*.js \
#lib/force.js \
#--bundle --target=node14 --platform=node --minify \
#--main-fields=module,main \
#--outdir=build

webpack --config webpack.config.js  # Create build.js

rm dist/binaries/*
pkg build.js -o dist/binaries/how2 --targets=node14-linux,node14-macos,node14-macos-arm64 #,node16-win-x64
pkg build.js -o dist/binaries/how2 --targets=node14-win-x64

cd dist/binaries
tar cvzf how2-linux-x64.tar.gz    how2-linux-x64
tar cvzf how2-macos-x64.tar.gz    how2-macos-x64
tar cvzf how2-macos-arm64.tar.gz  how2-macos-arm64
zip -r how2-win.zip how2.exe

ls -lah .

# brew audit --strict --new-formula --online <formula>
