# Firebase Integration Guide

This document explains how Firebase Authentication and Firestore are integrated into the Wood Craft app.

## Overview

The app now uses Firebase for:
- User authentication (signup, login, logout)
- User data storage in Firestore
- Real-time data synchronization
- Secure user management

## Features

### Authentication
- **Signup**: Creates Firebase Auth user and Firestore document
- **Login**: Authenticates with Firebase and loads user data
- **Logout**: Signs out from Firebase
- **Password Reset**: Sends password reset email
- **Account Deletion**: Removes user from both Auth and Firestore

### User Data Management
- **Profile Information**: Full name, username, email, experience level
- **Progress Tracking**: Streaks, XP, level, completed skills/projects
- **Onboarding Data**: Goals, time commitment, motivation
- **Real-time Sync**: All progress updates sync to Firestore

## Database Structure

### Users Collection
```typescript
interface FirestoreUser {
  uid: string;                    // Firebase Auth UID
  email: string;                  // User's email
  fullName: string;               // Full name
  username: string;               // Unique username
  experience: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;              // ISO timestamp
  lastLoginAt: string;            // ISO timestamp
  currentStreak: number;          // Current daily streak
  longestStreak: number;          // Longest streak achieved
  totalXP: number;                // Total experience points
  level: number;                  // Current level
  totalProjects: number;          // Completed projects
  skillsCompleted: number;        // Completed skills
  completedSkills: string[];      // Array of skill IDs
  completedProjects: string[];    // Array of project IDs
  dailyGoals: {                   // Daily goal tracking
    practice: boolean;
    skill: boolean;
    project: boolean;
  };
  isOnboardingCompleted: boolean; // Onboarding status
  profileImageUrl?: string;       // Optional profile image
  timeCommitment?: string;        // Time commitment preference
  motivation?: string;            // User motivation
  goal?: string;                  // Primary goal
}
```

## Setup Requirements

### Firebase Configuration
1. Ensure `GoogleService-Info.plist` is in the iOS project
2. Firebase packages are installed (already done)
3. Firebase project is configured with Authentication and Firestore enabled

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Usage Examples

### Creating a User
```typescript
import { useAuthStore } from '@/stores';

const { signup } = useAuthStore();

const success = await signup({
  fullName: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  experience: 'beginner',
  timeCommitment: '1-2 hours per week',
  motivation: 'Build furniture for my home',
  goal: 'Learn basic woodworking skills'
}, 'password123');
```

### Updating User Progress
```typescript
import { firestoreService } from '@/services/firestoreService';

await firestoreService.updateUserProgress(userId, {
  currentStreak: 5,
  totalXP: 250,
  level: 2
});
```

### Getting User Data
```typescript
import { useAuthStore } from '@/stores';

const { user } = useAuthStore();
console.log(user?.currentStreak); // Current streak
console.log(user?.totalXP);       // Total XP
```

## Security Features

- **Authentication Required**: All Firestore operations require valid Firebase Auth
- **User Isolation**: Users can only access their own data
- **Input Validation**: All user inputs are validated before storage
- **Secure Storage**: Passwords are handled by Firebase Auth (never stored in Firestore)

## Error Handling

The app includes comprehensive error handling for:
- Network connectivity issues
- Authentication failures
- Firestore operation errors
- Invalid user input

## Performance Considerations

- **Real-time Updates**: Uses Firebase Auth state listeners for immediate updates
- **Efficient Queries**: Firestore queries are optimized for user-specific data
- **Offline Support**: Firebase provides offline data persistence
- **Caching**: User data is cached locally and synced when online

## Troubleshooting

### Common Issues

1. **User not found in Firestore**
   - Check if user creation completed successfully
   - Verify Firestore rules allow access

2. **Authentication state not persisting**
   - Ensure Firebase is properly initialized
   - Check network connectivity

3. **Data not syncing**
   - Verify user is authenticated
   - Check Firestore permissions
   - Review error logs for specific issues

### Debug Mode
Enable debug logging by checking console output for:
- Firebase initialization messages
- Authentication state changes
- Firestore operation results
- Error details

## Future Enhancements

- **Real-time Collaboration**: Multiple users working on projects
- **Social Features**: User profiles, following, sharing
- **Advanced Analytics**: Detailed progress tracking and insights
- **Push Notifications**: Reminders and achievements
- **Data Export**: User data backup and export functionality
