# Backend Setup Guide - Cloud Functions

Welcome to Week 4.2! This guide will help you set up and deploy Firebase Cloud Functions.

---

## 🎯 What You'll Build

A backend API with Cloud Functions that:
- ✅ Handles user login
- ✅ Returns user profile data
- ✅ Validates requests
- ✅ Responds with standardized format

---

## 📋 Prerequisites

- Node.js v20+ installed
- Firebase CLI installed
- Firebase project created (from Week 4.1)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Install Firebase CLI (if not installed)

```bash
npm install -g firebase-tools
```

### 3. Login to Firebase

```bash
firebase login
```

### 4. Initialize Firebase (if not done)

```bash
firebase init functions

# Select:
# - Use an existing project
# - Choose your Firebase project
# - JavaScript
# - No (don't overwrite existing files)
# - Yes (install dependencies)
```

---

## 📁 Project Structure

```
backend/
├── index.js                  # Main entry point (exports all functions)
├── package.json              # Dependencies
├── firebase.json             # Firebase configuration
│
├── exports/                  # Cloud Functions (one file per function)
│   ├── login.js             # Login function (STUDENT TODO)
│   └── getUserProfile.js    # Get profile function (STUDENT TODO)
│
├── helper/                   # Helper functions
│   ├── validator.js         # Validation helpers
│   └── response.js          # Response formatters
│
└── service/                  # Services initialization
    └── firebase.js          # Firebase Admin SDK
```

---

## ✏️ Student Tasks

### Task 1: Understand the Login Function

Open `exports/login.js` and review the code. You'll see three TODO sections:

#### TODO #1: Validate Required Fields ✅
Already implemented as an example! Study how it works.

#### TODO #2: Implement Authentication Logic
Currently uses mock users. You can:
- Add more mock users for testing
- Later: Connect to Firestore database
- Later: Use Firebase Authentication

#### TODO #3: Generate Authentication Token
Currently uses a simple mock token. You can:
- Keep it simple for now
- Later: Implement JWT tokens

### Task 2: Test the Function Locally

```bash
# Start Firebase emulators
npm run serve
```

Visit: http://localhost:4000 (Firebase Emulator UI)

### Task 3: Test with cURL

```bash
# Test login
curl -X POST http://localhost:5001/YOUR-PROJECT-ID/us-central1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student","password":"wekruit2024"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "3",
      "username": "student",
      "email": "student@wekruit.com"
    },
    "token": "mock-token-3-1234567890"
  }
}
```

### Task 4: Deploy to Firebase

```bash
npm run deploy
```

This deploys all functions to Firebase Cloud Functions.

### Task 5: Get Your Function URL

After deployment, you'll see URLs like:
```
✔  functions[login(us-central1)]: Successful create operation.
Function URL (login): https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/login
```

**Copy this URL!** You'll need it for frontend integration.

---

## 🔗 Connect to Frontend

### Step 1: Copy Function URL

From the deployment output, copy your `login` function URL.

### Step 2: Update Frontend

Open `frontend/src/api/cloudFunctions.js` and replace:

```javascript
const CLOUD_FUNCTION_URL = "YOUR_CLOUD_FUNCTION_URL_HERE";
```

With your actual URL:

```javascript
const CLOUD_FUNCTION_URL = "https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/login";
```

### Step 3: Test Integration

1. Start frontend: `cd ../frontend && npm run dev`
2. Try logging in with username: `student`, password: `wekruit2024`
3. Check console - should see "CLOUD FUNCTION MODE"!

---

## 🧪 Testing

### Mock Users Available

| Username | Password | Email |
|----------|----------|-------|
| john | password123 | john@example.com |
| jane | secret456 | jane@example.com |
| student | wekruit2024 | student@wekruit.com |

### Test Different Scenarios

1. **Valid login**: Use credentials above
2. **Invalid username**: Try `unknownuser`
3. **Invalid password**: Try wrong password
4. **Missing fields**: Don't send username or password

---

## 🎓 Optional Challenges

### Challenge 1: Add More Users
Add your own mock users to the `mockUsers` object in `login.js`.

### Challenge 2: Implement Signup
Create a new Cloud Function `exports/signup.js` that:
- Accepts username, email, password
- Validates inputs
- Creates new user
- Returns success

### Challenge 3: Real Database
Connect to Firestore:
```javascript
const { db } = require("../service/firebase");

const userDoc = await db.collection("users").doc(userId).get();
const userData = userDoc.data();
```

### Challenge 4: JWT Tokens
Install and use `jsonwebtoken`:
```bash
npm install jsonwebtoken
```

```javascript
const jwt = require("jsonwebtoken");
const token = jwt.sign({ userId: user.id }, "your-secret-key", { expiresIn: "24h" });
```

---

## 🐛 Troubleshooting

### "Error: Failed to deploy functions"
- Check Node.js version: `node --version` (should be v20+)
- Make sure you're logged in: `firebase login`
- Check project: `firebase projects:list`

### "CORS error in frontend"
- CORS headers are already set in the functions
- Make sure you deployed after making changes

### "Function not found"
- Check `index.js` exports the function
- Check function name matches in `index.js` and `exports/`

### "Emulator won't start"
- Check if ports 5001 and 4000 are available
- Kill any existing Firebase processes

---

## 📖 Resources

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

## ✅ Completion Checklist

- [ ] Installed dependencies
- [ ] Tested function locally with emulator
- [ ] Understood the login logic
- [ ] Deployed to Firebase successfully
- [ ] Got Cloud Function URL
- [ ] Updated frontend with URL
- [ ] Tested full-stack integration
- [ ] Saw "CLOUD FUNCTION MODE" in console
- [ ] Dashboard shows purple badge

---

Congratulations! You've built a full-stack application! 🎉

