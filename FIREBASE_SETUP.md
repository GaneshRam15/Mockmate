# 🔥 Firebase Migration Setup Guide for MockMate

This document explains what has been automated and what you need to do manually to complete the Firebase migration.

---

## ✅ What Has Been Done Automatically

### 1. **Firebase SDK Installed**
- ✅ `firebase` package added to dependencies
- ✅ Firebase configuration files created

### 2. **Project Structure Created**
```
mockmate/
├── .env                          # Environment variables (YOU NEED TO UPDATE)
├── .env.example                  # Template for environment setup
├── firebase.json                 # Firebase project configuration
├── firestore.rules              # Database security rules
├── firestore.indexes.json       # Database indexes
├── storage.rules                # File storage security rules
├── src/
│   ├── lib/
│   │   ├── firebase.ts          # Firebase initialization
│   │   └── firebaseService.ts   # Database operations
│   ├── utils/
│   │   └── geminiServiceV2.ts   # Secure AI service (uses Cloud Functions)
│   └── contexts/
│       ├── AuthContext.tsx      # Migrated to Firebase Auth
│       └── InterviewContext.tsx # Migrated to Firestore
└── functions/                    # Cloud Functions (backend)
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    └── src/
        └── index.ts              # Cloud Functions code
```

### 3. **Security Implemented**
- ✅ API keys moved to environment variables
- ✅ Authentication migrated to Firebase Auth
- ✅ Database operations migrated to Firestore
- ✅ Security rules created for database and storage
- ✅ Cloud Functions created for secure AI operations

### 4. **Code Migrated**
- ✅ AuthContext now uses Firebase Authentication
- ✅ InterviewContext now saves to Firestore
- ✅ All localStorage operations replaced with Firestore
- ✅ Secure Cloud Functions for AI operations

---

## 🔧 What YOU Need to Do Manually

### Step 1: Create Firebase Project (15 minutes)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Click "Add project"

2. **Create Project**
   - Project name: `mockmate-interview` (or your choice)
   - Enable Google Analytics: Optional
   - Click "Create project"

3. **Add Web App**
   - Click the Web icon (`</>`) on the project overview
   - App nickname: `MockMate Web`
   - Check "Also set up Firebase Hosting"
   - Click "Register app"

4. **Copy Firebase Configuration**
   - You'll see a config object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

5. **Update Your `.env` File**
   - Open `.env` in your project root
   - Replace the placeholder values with your actual Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Step 2: Enable Firebase Services (10 minutes)

1. **Enable Authentication**
   - In Firebase Console, go to "Authentication"
   - Click "Get started"
   - Enable "Email/Password" sign-in method
   - Click "Save"

2. **Enable Firestore Database**
   - Go to "Firestore Database"
   - Click "Create database"
   - Start in **production mode** (we have security rules)
   - Choose location closest to you
   - Click "Enable"

3. **Enable Storage**
   - Go to "Storage"
   - Click "Get started"
   - Start in **production mode**
   - Click "Next" and "Done"

### Step 3: Install Firebase CLI (5 minutes)

```powershell
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init
```

**During `firebase init`, select:**
- ✅ Firestore
- ✅ Functions
- ✅ Hosting
- ✅ Storage
- Use existing project: Select your project
- For Firestore rules: Use existing file (firestore.rules)
- For Functions: Use existing directory (functions/)
- For Hosting: Public directory is `dist`
- Configure as single-page app: **Yes**
- Set up automatic builds: **No**

### Step 4: Set Up Cloud Functions (10 minutes)

```powershell
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Set environment variables for Cloud Functions
firebase functions:config:set gemini.apikey="YOUR_GEMINI_API_KEY_HERE"

# For email functionality (later)
firebase functions:config:set email.user="your_email@gmail.com"
firebase functions:config:set email.password="your_app_password"

# Go back to project root
cd ..
```

### Step 5: Deploy Security Rules (5 minutes)

```powershell
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

### Step 6: Create Admin Account (5 minutes)

1. **Register as Admin via Firebase Console**
   - Go to Authentication > Users
   - Click "Add user"
   - Email: `admin@mockmate.com`
   - Password: Set a strong password
   - Click "Add user"

2. **Mark User as Admin**
   - Go to Firestore Database
   - Click "+ Start collection"
   - Collection ID: `users`
   - Document ID: (copy the UID from Authentication)
   - Add fields:
     - `email`: `admin@mockmate.com`
     - `name`: `Admin User`
     - `isAdmin`: `true` (boolean)
     - `createdAt`: (current timestamp)
   - Click "Save"

### Step 7: Deploy Cloud Functions (5 minutes)

```powershell
# Build and deploy functions
firebase deploy --only functions
```

**⚠️ Note:** This may take 5-10 minutes for first deployment.

### Step 8: Test Locally First (10 minutes)

```powershell
# Start Firebase emulators (test locally before deploying)
firebase emulators:start

# In another terminal, start your app
npm run dev
```

Visit `http://localhost:5173` and test:
1. Sign up with a new account
2. Login
3. Start an interview
4. Check Firebase Emulator UI at `http://localhost:4000`

### Step 9: Build and Deploy (5 minutes)

```powershell
# Build your React app
npm run build

# Deploy everything to Firebase
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

---

## 🎯 Quick Start Commands

```powershell
# Development (local with emulators)
firebase emulators:start        # Terminal 1
npm run dev                     # Terminal 2

# Deploy to production
npm run build
firebase deploy

# Deploy only specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

---

## 📋 Configuration Checklist

Before launching, verify:

- [ ] `.env` file updated with Firebase config
- [ ] Firebase Authentication enabled
- [ ] Firestore Database created
- [ ] Storage enabled
- [ ] Firebase CLI installed and logged in
- [ ] Cloud Functions deployed
- [ ] Security rules deployed
- [ ] Admin account created in Firestore
- [ ] App tested locally with emulators
- [ ] App built and deployed to Firebase Hosting

---

## 🔒 Security Features Implemented

### Frontend Security:
✅ API keys in environment variables (not in code)
✅ Authentication required for all operations
✅ Role-based access (admin vs user)

### Backend Security:
✅ Cloud Functions validate authentication
✅ Firestore rules enforce data access
✅ Storage rules control file uploads
✅ Admin-only operations protected

### Data Security:
✅ All interviews linked to user IDs
✅ Users can only access their own data
✅ Admins can access all data
✅ Sensitive operations require authentication

---

## 🚨 Important Notes

### API Keys:
- The Gemini API key is still in `.env` temporarily
- Will move to Cloud Functions once deployed
- NEVER commit `.env` to Git

### Admin Access:
- Admin email is hardcoded: `admin@mockmate.com`
- Change this in `src/contexts/AuthContext.tsx` line 13
- Add your admin email to the `ADMIN_EMAILS` array

### Email Configuration:
- Email sending requires SMTP setup in Cloud Functions
- Gmail requires "App Password" (not regular password)
- Configure in Firebase Functions config or functions/.env

---

## 🐛 Troubleshooting

### "Firebase not initialized"
- Check `.env` file has correct values
- Restart dev server after changing `.env`

### "Permission denied" in Firestore
- Deploy security rules: `firebase deploy --only firestore:rules`
- Check user is authenticated

### Cloud Functions not working
- Check functions are deployed: `firebase deploy --only functions`
- Check logs: `firebase functions:log`
- Verify API keys are set: `firebase functions:config:get`

### Admin not working
- Verify user document in Firestore has `isAdmin: true`
- Check email matches `ADMIN_EMAILS` in AuthContext

---

## 📞 Next Steps

1. Complete all manual setup steps above
2. Test locally with Firebase emulators
3. Deploy to Firebase Hosting
4. Share the live URL with OpenAI Buildathon judges!

**Your production URL will be:**
`https://your-project-id.web.app`

---

## 🎉 What You've Achieved

✨ **Secure Authentication** - Real user accounts with Firebase Auth
✨ **Persistent Data** - All interviews saved to Firestore
✨ **Scalable Backend** - Cloud Functions handle AI operations
✨ **Production Ready** - Security rules protect your data
✨ **Professional Setup** - Enterprise-grade architecture
✨ **Buildathon Ready** - Impressive tech stack to showcase!

Good luck with your OpenAI Buildathon! 🚀
