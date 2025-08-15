# Firebase Setup for Wood Craft App

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `wood-craft-app` (or your preferred name)
4. Enable Google Analytics (recommended)
5. Choose analytics account or create new one
6. Click "Create project"

## 2. Add Android App

1. In Firebase console, click Android icon
2. Enter Android package name: `com.duoforwoodworking.duoforwoodworking`
3. Enter app nickname: `Wood Craft`
4. Click "Register app"
5. Download `google-services.json` file
6. Place it in `android/app/` directory

## 3. Add iOS App

1. In Firebase console, click iOS icon
2. Enter iOS bundle ID: `com.duoforwoodworking.duoforwoodworking`
3. Enter app nickname: `Wood Craft`
4. Click "Register app"
5. Download `GoogleService-Info.plist` file
6. Place it in `ios/duoforwoodworking/` directory

## 4. Enable Services

### Authentication
1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Enable Google (optional)
4. Enable Anonymous (for demo users)

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select location closest to your users
5. Click "Done"

### Storage
1. Go to Storage
2. Click "Get started"
3. Choose "Start in test mode"
4. Select location (same as Firestore)

### Analytics
1. Analytics is automatically enabled
2. No additional setup needed

## 5. Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /woodworking_questions/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /woodworking_responses/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow public read access to woodworking guides
    match /woodworking_guides/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /projects/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 6. Test the Setup

1. Run your app: `npm start`
2. Navigate to the Coach tab
3. Ask a woodworking question
4. Check Firebase console for new documents

## 7. Environment Variables (Optional)

Create `.env` file in root directory:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
```

## 8. Next Steps

- Set up user authentication flow
- Add project management features
- Implement image upload for projects
- Add push notifications
- Set up analytics events

## Troubleshooting

- **Build errors**: Make sure `google-services.json` and `GoogleService-Info.plist` are in correct locations
- **Permission denied**: Check Firestore security rules
- **Authentication issues**: Verify sign-in methods are enabled
- **Storage errors**: Check Storage security rules

## Support

- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Firebase Console Help](https://firebase.google.com/docs)
- [Firebase Community](https://firebase.google.com/community)
