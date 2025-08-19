# Apple Sign In Troubleshooting Guide

## Issue: Apple Sign In Modal Not Closing

If the Apple Sign In modal appears but doesn't close after entering credentials, follow these steps:

## 🚨 **CRITICAL FIXES APPLIED**

### 1. **Nonce Mismatch Error**
**Error**: `The nonce in ID Token does not match the SHA256 hash of the raw nonce`

**Solution**: ✅ **FIXED** - The code now properly handles nonce generation:
- Generates a raw nonce
- Creates SHA256 hash for Apple Sign In
- Uses raw nonce for Firebase credential
- This ensures proper security validation

### 2. **Undefined Field Value Error**
**Error**: `Unsupported field value: undefined`

**Solution**: ✅ **FIXED** - The code now properly handles optional fields:
- Only includes optional fields if they have values
- Prevents undefined values from being sent to Firestore
- Uses conditional spreading for optional fields
- Enhanced error logging for better debugging
- **NEW**: Added filtering for undefined values in update functions
- **NEW**: Added debugging logs to track data flow

### 3. **New User Signup Flow**
**Feature**: ✅ **IMPLEMENTED** - Beautiful signup modal for new Apple Sign In users:
- Shows elegant modal when user doesn't exist
- Explains benefits of completing profile
- Navigates to onboarding for profile completion
- Handles both completion and skip scenarios
- Seamless integration with existing onboarding flow
- **FIXED**: Async/await syntax errors in onboarding functions

### 4. **Document Not Found Error**
**Error**: `[firestore/not-found] Some requested document was not found`

**Solution**: ✅ **FIXED** - Enhanced error handling for missing user documents:
- Graceful fallback when daily login update fails
- Better error logging for debugging
- Continues authentication even if update fails
- Prevents app crashes from missing Firestore documents

### 5. **Incomplete Profile Error on Login Screen**
**Error**: "Your account profile is incomplete. Please contact support to restore your account."

**Solution**: ✅ **FIXED** - Improved error handling for incomplete profiles:
- Automatically signs out users with incomplete profiles
- Clears error state when navigating to login screen
- Added account recovery function for edge cases
- Better user experience without immediate error popups

### 6. **No Current User Error**
**Error**: `[auth/no-current-user] No user currently signed in`

**Solution**: ✅ **FIXED** - Improved error handling for expected scenarios:
- Don't show errors for expected "no current user" scenarios
- Filter out common auth errors from alert popups
- Better error categorization and handling
- Cleaner user experience without unnecessary error messages

### 7. **Username Uniqueness Validation**
**Feature**: ✅ **IMPLEMENTED** - Real-time username validation in onboarding:
- Debounced username availability checking (500ms delay)
- Real-time visual feedback (checking, available, error states)
- Prevents duplicate usernames in the system
- Enhanced user experience with immediate validation feedback
- Button disabled until username is valid and available

## 🔧 **Required Configurations**

### 1. **Firebase Console Setup**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `duo-for-woodworking`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Apple** provider
5. Configure with:
   - **Apple Team ID**: `43ZGN39D84`
   - **Bundle ID**: `com.wood.working`
   - **Service ID**: (optional, auto-generated)
6. Download updated `GoogleService-Info.plist`
7. Replace the file in your iOS project

### 2. **App Store Connect Setup**
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select your app: `duo-for-woodworking`
3. Go to **App Information** → **App Store** tab
4. Enable **Sign In with Apple** checkbox
5. Save changes

### 3. **Apple Developer Account**
1. Go to [Apple Developer](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Select **Identifiers** → **App IDs**
4. Find your app: `com.wood.working`
5. Ensure **Sign In with Apple** capability is enabled
6. If not, enable it and regenerate provisioning profiles

## 🧪 **Testing Requirements**

### Device Requirements
- ✅ **Physical iOS device** (NOT simulator)
- ✅ **iOS 13.0 or later**
- ✅ **Valid Apple ID signed in**
- ✅ **Face ID/Touch ID enabled** (recommended)

### Development Environment
- ✅ **Valid Apple Developer Account**
- ✅ **Proper provisioning profiles**
- ✅ **Latest Xcode version**
- ✅ **Clean build** (delete derived data)

## 🔍 **Debugging Steps**

### 1. **Check Console Logs**
Run the app and check Xcode console for these logs:
```
Apple Sign In successful, creating Firebase credential...
Firebase credential created, signing in...
Firebase sign in successful: [user-id]
```

### 2. **Common Error Codes**
- `ERR_CANCELED`: User cancelled the sign-in
- `ERR_INVALID_RESPONSE`: Apple Sign In failed
- `auth/account-exists-with-different-credential`: Email conflict
- `auth/invalid-credential`: Invalid Apple token

### 3. **Network Issues**
- Ensure stable internet connection
- Check if Firebase services are accessible
- Verify Apple's authentication servers are reachable

## 🛠 **Code Fixes Applied**

### Enhanced Error Handling
The code now properly handles:
- User cancellation (no error shown)
- Modal dismissal failures
- Network timeouts
- Invalid responses

### Better Debugging
Added console logs to track:
- Apple Sign In success
- Firebase credential creation
- Firebase authentication
- User profile creation

## 🚀 **Quick Fixes to Try**

### 1. **Clean and Rebuild**
```bash
# Clean the project
cd ios && rm -rf build && cd ..
npx expo run:ios --clear
```

### 2. **Reset Apple Sign In State**
```bash
# On device: Settings → Apple ID → Password & Security → Apps Using Apple ID
# Remove your app and try again
```

### 3. **Check Bundle ID Consistency**
Ensure these match exactly:
- `app.json`: `com.wood.working`
- `Info.plist`: `$(PRODUCT_BUNDLE_IDENTIFIER)`
- Firebase Console: `com.wood.working`
- Apple Developer: `com.wood.working`

### 4. **Verify Entitlements**
Check `ios/duoforwoodworking/duoforwoodworking.entitlements`:
```xml
<key>com.apple.developer.applesignin</key>
<array>
    <string>Default</string>
</array>
```

## 📱 **Testing Checklist**

- [ ] Testing on physical iOS device
- [ ] iOS 13+ installed
- [ ] Apple ID signed in on device
- [ ] Face ID/Touch ID working
- [ ] Internet connection stable
- [ ] Firebase Apple provider enabled
- [ ] App Store Connect Apple Sign In enabled
- [ ] Apple Developer capabilities enabled
- [ ] Clean build performed
- [ ] Console logs checked

## 🆘 **Still Having Issues?**

If the problem persists:

1. **Check Firebase Console** for authentication errors
2. **Verify Apple Developer Account** has proper permissions
3. **Test with a different Apple ID**
4. **Check if Apple Sign In works in other apps**
5. **Contact Apple Developer Support** if needed

## 📞 **Support Resources**

- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Firebase Apple Auth Guide](https://firebase.google.com/docs/auth/ios/apple)
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
