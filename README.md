# Backend - Firebase Cloud Functions

Student-friendly serverless backend using Firebase Cloud Functions.

## 👉 **START HERE: [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

---

# Quick Overview

This backend provides API endpoints using Firebase Cloud Functions. You'll learn how to:

-   Set up Firebase Cloud Functions
-   Create serverless API endpoints
-   Connect your React frontend to backend functions
-   Handle server-side business logic
-   Interact with Firestore database

## 📚 What are Cloud Functions?

Firebase Cloud Functions are serverless functions that run in response to:

-   HTTPS requests (API endpoints)
-   Firebase Authentication events
-   Firestore database changes
-   Storage uploads
-   Scheduled tasks (cron jobs)

## 🎯 Planned Features

The backend will include:

1. **User Management API**

    - Get user profile
    - Update user information
    - Delete user account

2. **Data Processing**

    - Process and validate data
    - Perform server-side calculations
    - Generate reports

3. **Third-Party Integrations**

    - Call external APIs
    - Send emails
    - Process payments

4. **Security Rules**
    - Authentication verification
    - Authorization checks
    - Rate limiting

## 📖 Prerequisites for Backend Development

Before implementing Cloud Functions, you'll need:

-   Node.js installed
-   Firebase CLI installed
-   Basic understanding of Express.js (optional but helpful)
-   Completed frontend setup

## 🔧 Future Setup Steps

When ready to implement the backend:

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Cloud Functions

```bash
firebase init functions
```

### 4. Project Structure (Preview)

```
backend/
├── functions/
│   ├── index.js           # Main functions file
│   ├── package.json       # Backend dependencies
│   ├── .env              # Environment variables
│   └── src/
│       ├── api/          # API endpoints
│       ├── utils/        # Utility functions
│       └── middleware/   # Express middleware
├── firebase.json         # Firebase configuration
└── .firebaserc          # Firebase project settings
```

## 💡 Example Cloud Function (Preview)

Here's what a simple Cloud Function might look like:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// HTTP Cloud Function
exports.getUserProfile = functions.https.onRequest(async (req, res) => {
    try {
        // Verify authentication
        const token = req.headers.authorization?.split("Bearer ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // Get user data
        const userDoc = await admin
            .firestore()
            .collection("users")
            .doc(uid)
            .get();

        res.json({
            success: true,
            data: userDoc.data(),
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message,
        });
    }
});

// Firestore Trigger Function
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
    // Create user document in Firestore
    await admin
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set({
            email: user.email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
        });

    console.log("User document created:", user.uid);
});
```

## 🔗 Calling Cloud Functions from Frontend

From your React app, you'll call functions like this:

```javascript
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const getUserProfile = httpsCallable(functions, "getUserProfile");

// Call the function
const result = await getUserProfile();
console.log(result.data);
```

## 📚 Resources for Backend Development

-   [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
-   [Cloud Functions Samples](https://github.com/firebase/functions-samples)
-   [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
-   [Express.js Documentation](https://expressjs.com/)

## 🎓 Learning Path

1. ✅ Complete frontend setup
2. 📖 Learn about serverless architecture
3. 🔧 Install Firebase CLI
4. 🚀 Initialize Cloud Functions
5. 💻 Write your first function
6. 🔗 Connect frontend to backend
7. 🧪 Test and debug functions
8. 🌐 Deploy to production

## ⚡ Benefits of Cloud Functions

-   **Serverless**: No server management required
-   **Scalable**: Automatically scales with demand
-   **Cost-effective**: Pay only for what you use
-   **Secure**: Built-in authentication and authorization
-   **Fast**: Low latency globally distributed
-   **Integrated**: Works seamlessly with Firebase services

## 🎯 Next Steps

1. Focus on completing the frontend implementation
2. Test all frontend features thoroughly
3. Familiarize yourself with the Firebase Console
4. Read Cloud Functions documentation
5. Prepare for backend integration

Stay tuned for the backend implementation guide!

---

**Note**: This is a placeholder directory. The actual Cloud Functions implementation will be added in a future update with detailed setup instructions and example code.
