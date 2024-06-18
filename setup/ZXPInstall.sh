# Install the Adobe ZXP Command Line Tool (ZXPSignCmd) on Mac and Windows
echo "Downloading ZXPSignCmd"
Check if the user is on a Mac or Windows and download the appropriate version
if [ "$(uname)" == "Darwin" ]; then
    curl -L https://github.com/Adobe-CEP/CEP-Resources/blob/master/ZXPSignCMD/4.1.2/macOS/ZXPSignCmd-64bit.dmg?raw=true -o ZXPSignCmd.dmg
    hdiutil attach ZXPSignCmd.dmg
    cp -r /Volumes/ZXPSignCmd-64bit/ZXPSignCmd-64bit /usr/local/bin/ZXPSignCmd
    hdiutil detach /Volumes/ZXPSignCmd-64bit
    rm ZXPSignCmd.dmg
    chmod +x /usr/local/bin/ZXPSignCmd
else
    # TODO: check if 32 or 64 bit and download the appropriate version
    # For now, just download the 64-bit version
    curl -L https://github.com/Adobe-CEP/CEP-Resources/blob/master/ZXPSignCMD/4.1.103/win64/ZXPSignCmd.exe?raw=true -o ZXPSignCmd.exe
    chmod +x ZXPSignCmd.exe
fi
# TODO: Add handling for Linux

echo "ZXPSignCmd installed"