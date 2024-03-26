# Install the Adobe ZXP Command Line Tool (ZXPSignCmd) on Mac and Windows
echo "Downloading ZXPSignCmd"
Check if the user is on a Mac or Windows and download the appropriate version
if [ "$(uname)" == "Darwin" ]; then
    curl -L https://github.com/Adobe-CEP/CEP-Resources/blob/master/ZXPSignCMD/4.1.2/macOS/ZXPSignCmd-64bit.dmg?raw=true -o ZXPSignCmd.dmg
    hdiutil attach ZXPSignCmd.dmg
    cp -r /Volumes/ZXPSignCmd-64bit/ZXPSignCmd-64bit /usr/local/bin/ZXPSignCmd
    hdiutil detach /Volumes/ZXPSignCmd-64bit
    rm ZXPSignCmd.dmg
else
    # TODO: check if 32 or 64 bit and download the appropriate version
    curl -L https://github.com/Adobe-CEP/CEP-Resources/blob/master/ZXPSignCMD/4.1.103/win64/ZXPSignCmd.exe?raw=true -o ZXPSignCmd.exe
    mv ZXPSignCmd.exe /usr/local/bin/ZXPSignCmd
fi
chmod +x /usr/local/bin/ZXPSignCmd
echo "ZXPSignCmd installed"