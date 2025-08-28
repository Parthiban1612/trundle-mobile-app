#!/bin/bash

# iOS Setup Script for Image Picker with Bare Workflow
# This script helps set up the necessary configurations for iOS

set -e

echo "🚀 Starting iOS setup for Image Picker..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if iOS directory exists
if [ ! -d "ios" ]; then
    echo "📱 iOS directory not found. Generating iOS project..."
    echo "Running: expo run:ios"
    echo "This will create the ios/ folder. Please complete the setup in Xcode first."
    echo "After Xcode setup is complete, run this script again."
    exit 0
fi

echo "✅ iOS directory found"

# Check if react-native-image-crop-picker is installed
if ! grep -q "react-native-image-crop-picker" package.json; then
    echo "📦 Installing react-native-image-crop-picker..."
    npm install react-native-image-crop-picker
else
    echo "✅ react-native-image-crop-picker already installed"
fi

# Install iOS pods
echo "🍎 Installing iOS pods..."
cd ios
pod install
cd ..

echo "✅ Pods installed successfully"

# Check if Info.plist exists and has permissions
if [ -f "ios/Trundle/Info.plist" ]; then
    echo "📋 Checking Info.plist permissions..."
    
    # Check for photo library permission
    if ! grep -q "NSPhotoLibraryUsageDescription" ios/Trundle/Info.plist; then
        echo "⚠️  Warning: NSPhotoLibraryUsageDescription not found in Info.plist"
        echo "   Please add the following to your Info.plist:"
        echo "   <key>NSPhotoLibraryUsageDescription</key>"
        echo "   <string>This app needs access to your photo library to select and crop profile pictures.</string>"
    else
        echo "✅ NSPhotoLibraryUsageDescription found"
    fi
    
    # Check for camera permission
    if ! grep -q "NSCameraUsageDescription" ios/Trundle/Info.plist; then
        echo "⚠️  Warning: NSCameraUsageDescription not found in Info.plist"
        echo "   Please add the following to your Info.plist:"
        echo "   <key>NSCameraUsageDescription</key>"
        echo "   <string>This app needs access to your camera to take profile pictures.</string>"
    else
        echo "✅ NSCameraUsageDescription found"
    fi
else
    echo "⚠️  Warning: Info.plist not found at ios/Trundle/Info.plist"
    echo "   Please check the correct path in your iOS project"
fi

# Check Podfile
if [ -f "ios/Podfile" ]; then
    echo "📋 Checking Podfile..."
    
    if ! grep -q "RNImageCropPicker" ios/Podfile; then
        echo "⚠️  Warning: RNImageCropPicker not found in Podfile"
        echo "   Please add: pod 'RNImageCropPicker', :path => '../node_modules/react-native-image-crop-picker'"
    else
        echo "✅ RNImageCropPicker found in Podfile"
    fi
else
    echo "⚠️  Warning: Podfile not found"
fi

echo ""
echo "🎉 iOS setup completed!"
echo ""
echo "Next steps:"
echo "1. Open ios/Trundle.xcworkspace in Xcode"
echo "2. Add the missing permissions to Info.plist if needed"
echo "3. Update Podfile if needed"
echo "4. Run 'cd ios && pod install' if you made changes"
echo "5. Build and run your app: expo run:ios"
echo ""
echo "For detailed instructions, see IOS_SETUP.md"
echo ""
echo "Note: This setup uses ImagePicker's built-in permission handling"
echo "No external permissions library is required."
echo ""
echo "Happy coding! 🚀" 