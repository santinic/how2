#!/bin/sh

# Create build.js
webpack --config webpack.config.js  # Create build.js

# Cleanup 
rm dist/binaries/*
rm dist/release/*

# Build binaries
pkg dist/build.js -o dist/binaries/how2 --targets=node16-linux,node16-win-x64 #,node16-macos,node16-macos-arm64 #,node16-win-x64
#pkg dist/build.js -o dist/binaries/how2 --targets=node16-win-x64

# Make nodejs executable
echo "#!/usr/bin/env node\n" > dist/release/how2.js
cat dist/build.js >> dist/release/how2.js
chmod +x dist/release/how2.js

cd dist/binaries
ls -lah

# Sign Apple Silicon binary
#codesign -vvvvv -s MMJ44P3H29 how2-macos-arm64
#chmod +x how2-macos-arm64

# Compress
tar cvzf how2-linux-x64.tar.gz    how2-linux
#tar cvzf how2-macos-x64.tar.gz    how2-macos-x64
#tar cvzf how2-macos-arm64.tar.gz  how2-macos-arm64

zip -r how2-win.zip               how2-win.exe
mv *.tar.gz ../release
mv *.zip ../release

# Build .deb
cd ../deb
./build-deb.sh
mv how2.deb ../release

# Print hashes for brew
cd ../release
tar cvzf how2.js.tar.gz           how2.js
sha256sum how2.js.tar.gz
#sha256sum how2-macos-x64.tar.gz
#sha256sum how2-macos-arm64.tar.gz

ls -lah
open ../release

# brew audit --strict --new-formula --online <formula>
