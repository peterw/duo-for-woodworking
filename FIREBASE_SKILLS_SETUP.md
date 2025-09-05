# Firebase Skills Setup Guide

This document provides the Firebase data structure needed to make the SkillTree component dynamic and functional.

## Collections Structure

### 1. Skills Collection (`skills`)

Each skill document should have the following structure:

```json
{
  "title": "Safety Fundamentals",
  "description": "Essential safety practices for woodworking",
  "icon": "shield.fill",
  "color": "#FF6B35",
  "level": 1,
  "order": 1,
  "xpReward": 100,
  "prerequisites": [],
  "category": "safety",
  "microSteps": [
    {
      "id": "safety-ppe",
      "title": "PPE Requirements",
      "description": "Learn about personal protective equipment",
      "type": "lesson",
      "order": 1,
      "isCompleted": false,
      "xpReward": 20,
      "content": {
        "text": "Personal Protective Equipment (PPE) is essential for woodworking safety. Always wear safety glasses, hearing protection, and appropriate clothing.",
        "instructions": [
          "Inspect safety glasses for cracks or scratches",
          "Ensure hearing protection fits properly",
          "Wear close-fitting clothing to avoid entanglement",
          "Keep long hair tied back"
        ],
        "images": [],
        "videos": []
      }
    },
    {
      "id": "safety-quiz",
      "title": "Safety Knowledge Quiz",
      "description": "Test your safety knowledge",
      "type": "quiz",
      "order": 2,
      "isCompleted": false,
      "xpReward": 30,
      "content": {
        "text": "Answer these questions to test your safety knowledge.",
        "instructions": [],
        "images": [],
        "videos": []
      },
      "quiz": {
        "questions": [
          {
            "id": "q1",
            "question": "What is the most important safety equipment for woodworking?",
            "type": "multiple-choice",
            "options": [
              "Safety glasses",
              "Hearing protection",
              "Dust mask",
              "All of the above"
            ],
            "correctAnswer": "All of the above",
            "explanation": "All safety equipment is important, but safety glasses, hearing protection, and dust masks work together to protect you.",
            "points": 10
          },
          {
            "id": "q2",
            "question": "You should always wear loose clothing when woodworking.",
            "type": "true-false",
            "options": ["True", "False"],
            "correctAnswer": "False",
            "explanation": "Loose clothing can get caught in machinery. Always wear close-fitting clothing.",
            "points": 10
          }
        ],
        "passingScore": 70
      }
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. User Skill Progress Collection (`users/{userId}/skillProgress`)

This collection tracks each user's progress through skills:

```json
{
  "skillId": "safety-basics",
  "userId": "user123",
  "isCompleted": false,
  "progress": 50,
  "completedMicroSteps": ["safety-ppe"],
  "currentMicroStep": "safety-quiz",
  "crowns": 1,
  "xpEarned": 20,
  "lastAccessed": "2024-01-15T10:30:00.000Z",
  "completedAt": null,
  "quizAttempts": [
    {
      "id": "attempt_1642248600000",
      "microStepId": "safety-quiz",
      "score": 80,
      "totalQuestions": 2,
      "correctAnswers": 2,
      "completedAt": "2024-01-15T10:30:00.000Z",
      "answers": [
        {
          "questionId": "q1",
          "answer": "All of the above",
          "isCorrect": true
        },
        {
          "questionId": "q2",
          "answer": "False",
          "isCorrect": true
        }
      ]
    }
  ]
}
```

## Sample Skills Data

Here are some sample skills you can add to Firebase:

### 1. Safety Fundamentals (First Skill - Always Unlocked)
```json
{
  "title": "Safety Fundamentals",
  "description": "Essential safety practices for woodworking",
  "icon": "shield.fill",
  "color": "#FF6B35",
  "level": 1,
  "order": 1,
  "xpReward": 100,
  "prerequisites": [],
  "category": "safety",
  "microSteps": [
    {
      "id": "safety-ppe",
      "title": "PPE Requirements",
      "description": "Learn about personal protective equipment",
      "type": "lesson",
      "order": 1,
      "isCompleted": false,
      "xpReward": 20,
      "content": {
        "text": "Personal Protective Equipment (PPE) is essential for woodworking safety.",
        "instructions": [
          "Inspect safety glasses for cracks or scratches",
          "Ensure hearing protection fits properly",
          "Wear close-fitting clothing to avoid entanglement"
        ],
        "images": [],
        "videos": []
      }
    },
    {
      "id": "safety-quiz",
      "title": "Safety Knowledge Quiz",
      "description": "Test your safety knowledge",
      "type": "quiz",
      "order": 2,
      "isCompleted": false,
      "xpReward": 30,
      "content": {
        "text": "Answer these questions to test your safety knowledge."
      },
      "quiz": {
        "questions": [
          {
            "id": "q1",
            "question": "What is the most important safety equipment for woodworking?",
            "type": "multiple-choice",
            "options": ["Safety glasses", "Hearing protection", "Dust mask", "All of the above"],
            "correctAnswer": "All of the above",
            "explanation": "All safety equipment is important for comprehensive protection.",
            "points": 10
          }
        ],
        "passingScore": 70
      }
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Measuring & Marking (Unlocked after Safety Fundamentals)
```json
{
  "title": "Measuring & Marking",
  "description": "Precision measuring and layout techniques",
  "icon": "ruler.fill",
  "color": "#1CB0F6",
  "level": 1,
  "order": 2,
  "xpReward": 150,
  "prerequisites": ["safety-basics"],
  "category": "techniques",
  "microSteps": [
    {
      "id": "measuring-tape",
      "title": "Tape Measure Reading",
      "description": "Learn to read tape measures accurately",
      "type": "lesson",
      "order": 1,
      "isCompleted": false,
      "xpReward": 25,
      "content": {
        "text": "Tape measures are the foundation of accurate woodworking measurements.",
        "instructions": [
          "Identify the main scale markings",
          "Read fractional measurements",
          "Use the hook end properly",
          "Account for hook thickness"
        ],
        "images": [],
        "videos": []
      }
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Setup Instructions

1. **Create the Skills Collection:**
   - Go to your Firebase Console
   - Navigate to Firestore Database
   - Create a new collection called `skills`
   - Add the sample skill documents above

2. **Set up Firestore Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Skills collection - readable by all authenticated users
       match /skills/{skillId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.token.admin == true;
       }
       
       // User skill progress - readable/writable by the user
       match /users/{userId}/skillProgress/{progressId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

3. **Test the Implementation:**
   - Run your app
   - Log in with a user account
   - Navigate to the home screen
   - The SkillTree should now load dynamic data from Firebase
   - Try clicking on skills to start learning

## Features Implemented

✅ **Dynamic Skill Loading:** Skills are loaded from Firebase with real-time progress tracking
✅ **Progress Tracking:** User progress is saved and synced across devices
✅ **Quiz System:** Interactive quizzes with scoring and retry functionality
✅ **Skill Unlocking:** Skills unlock based on prerequisites
✅ **Crown System:** Duolingo-style crown progression (1-5 crowns)
✅ **XP Rewards:** Experience points for completing lessons and quizzes
✅ **Real-time Updates:** Progress updates immediately in the UI

## Troubleshooting

- **Skills not loading:** Check Firebase rules and ensure user is authenticated
- **Progress not saving:** Verify user has write permissions to their skillProgress collection
- **Quizzes not working:** Ensure quiz questions have proper structure and correctAnswer format
- **Skills not unlocking:** Check prerequisites array matches skill IDs exactly

The SkillTree is now fully dynamic and functional with Firebase integration!
