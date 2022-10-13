#!/bin/sh
# Creates homebrew package. cd in dist/brew to run it
# From: https://bharathvaj.me/blog/how-to-publish-your-nodejs-project-on-homebrew

#cd .. # dist
#tar -czf how2-macos-x64.tar.gz how2-macos-x64
#tar -czf how2-macos-arm64.tar.gz how2-macos-arm64
#hash=$(shasum -a 256 how2-macos-x64.tar.gz | cut -d" " -f 1)
#hash_arm64=$(shasum -a 256 how2-macos-arm64.tar.gz | cut -d" " -f 1)
#echo $hash
#echo $hash_arm64
#cd brew

URL='https://github.com/santinic/how2/releases/download/v3.0.0-beta/how2-macos-x64.tar.gz'
wget $URL
hash=$(shasum -a 256 how2-macos-x64.tar.gz | cut -d" " -f 1)
echo $hash

cat << EOF > Formula/How2.rb
class How2 < Formula
  desc "AI for your terminal"
  homepage "https://how2terminal.com"
  url "$URL" 
  sha256 "$hash"
  license "MIT"
  version "3.0.0"

  def install
    bin.install "how2"
  end
end
EOF
cat Formula/How2.rb
cp ../../README.md .

