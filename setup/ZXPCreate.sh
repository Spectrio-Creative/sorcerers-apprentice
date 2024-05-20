
# This script is used to create a ZXP file from the dist folder and sign it with the sorcerers-apprentice.p12 certificate
# The certificate password is
echo "Signing ZXP"
script_dir="$(dirname "$0")"

# Get password from .env file
set -o allexport
source "$script_dir/../.env"
set +o allexport

# Check if the password is set and ask for it if it isn't
if [ -z "$CERTIFICATE_PASSWORD" ]; then
  echo "Please enter the password for the sorcerers-apprentice.p12 certificate"
  read -s CERTIFICATE_PASSWORD
  echo "CERTIFICATE_PASSWORD=$CERTIFICATE_PASSWORD" >> "$script_dir/../.env"
fi

# Set the COMMAND variable to the path of the ZXPSignCmd executable
if command -v ZXPSignCmd &> /dev/null; then
  COMMAND=ZXPSignCmd
elif command -v "$script_dir/../ZXPSignCmd" &> /dev/null; then
  COMMAND="$script_dir/../ZXPSignCmd"
else
# If the ZXPSignCmd executable is not found, ask the user if they want to install it
  echo "ZXPSignCmd not found. Do you want to install it? (y/n)"
  read INSTALL
  if [ $INSTALL = "y" ]; then
    bash "$script_dir/ZXPInstall.sh"
    COMMAND=ZXPSignCmd
    # If the ZXPSignCmd executable is still not found, exit the script
    if ! command -v ZXPSignCmd &> /dev/null; then
      echo "ZXPSignCmd not found, exiting"
      exit 1
    fi
  fi
fi

# Check that signing certificate is present
if [ ! -f "$script_dir/sorcerers-apprentice.p12" ]; then
  echo "sorcerers-apprentice.p12 not found, email Adam at adamh@spectrio.com to get a copy, exiting"
  exit 1
fi

# Remove the build directory if it exists
rm -rf "$script_dir/../build"

# Create the build directory if it doesn't exist
mkdir "$script_dir/../build"
ZXPSignCmd -sign "$script_dir/../dist" "$script_dir/../build/sorcerers-apprentice.zxp" "$script_dir/sorcerers-apprentice.p12" $CERTIFICATE_PASSWORD -tsa http://timestamp.digicert.com/

# Check if the signing was successful
if [ $? -eq 0 ]; then
  echo "ZXP signing successful"
else
  echo "ZXP signing failed"
fi