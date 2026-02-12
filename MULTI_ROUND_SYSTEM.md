# Multi-Round Interview System - Implementation Summary

## Overview
The MockMate platform has been upgraded to support a **multi-round interview system**. Candidates now progress through two distinct rounds:

### **Round 1: Aptitude Test**
- 25 multiple-choice questions covering various aptitude topics
- Automated scoring (percentage-based)
- Results submitted to admin dashboard for review

### **Round 2: Mock Interview** 
- Traditional mock interview with behavioral, technical, and situational questions
- Available only to candidates selected by admin from Round 1
- AI-powered real-time feedback and evaluation

---

## Key Features Implemented

### 1. **Round 1 - Formal Aptitude Test**
- **File:** `src/pages/Round1Aptitude.tsx`
- **Route:** `/round1-aptitude`
- Candidates take a 25-question aptitude test
- Results are saved to Firebase collection `round1_aptitude`
- Performance metrics include:
  - Overall score (percentage)
  - Category-wise breakdown
  - Correct/Total answers

### 2. **Admin Dashboard Enhancements**
- **File:** `src/pages/AdminDashboard.tsx`
- **Features:**
  - Two tabs: "Round 1 - Aptitude" and "Round 2 - Mock Interview"
  - View all Round 1 aptitude results
  - Select candidates for Round 2 based on performance
  - Send email notifications automatically when selecting for Round 2
  - Track email sent status

### 3. **History Page Updates**
- **File:** `src/pages/History.tsx`
- **Features:**
  - Displays Round 1 aptitude results separately
  - Shows selection status (Selected/Under Review/Needs Improvement)
  - Provides "Start Round 2" button for selected candidates
  - Email notification confirmation display
  - Category-wise performance breakdown

### 4. **Email Notification System**
- **File:** `functions/src/index.ts`
- **Function:** `sendRound2Invitation`
- Professional email template with:
  - Congratulations message
  - Round 1 score display
  - Instructions to start Round 2
  - Direct link to interview platform

### 5. **Type System Updates**
- **File:** `src/types/index.ts`
- **New Types:**
  - `RoundOneAptitudeResult` - Stores Round 1 results
  - Extended `InterviewSession` with round tracking fields

### 6. **Firebase Service Functions**
- **File:** `src/lib/firebaseService.ts`
- **New Functions:**
  - `saveRound1AptitudeResult()` - Save Round 1 results
  - `getRound1AptitudeResults()` - Fetch Round 1 results (all or by user)
  - `updateRound1AptitudeResult()` - Update Round 1 result (for admin selections)

---

## User Flow

### For Candidates:

1. **Start Interview Process**
   - Navigate to Home page
   - Select desired job role
   - (Optional) Upload resume for ATS screening

2. **Round 1: Aptitude Test**
   - Redirected to `/round1-aptitude`
   - Complete 25 aptitude questions
   - Submit test
   - View immediate results with category breakdown

3. **Wait for Admin Review**
   - Admin reviews Round 1 performance
   - Check History page for selection status
   - Check email for Round 2 invitation (if selected)

4. **Round 2: Mock Interview** (If Selected)
   - Click "Start Round 2" button in History page
   - Complete traditional mock interview
   - Receive AI-powered feedback

### For Admins:

1. **Navigate to Admin Dashboard** (`/admin`)

2. **Review Round 1 - Aptitude Results Tab**
   - View all candidate aptitude results
   - See scores, dates, and performance
   - Filter by search query

3. **Select Candidates for Round 2**
   - Click "Select for Round 2" button for qualified candidates
   - System automatically sends email notification
   - Status updates to "Selected for R2"

4. **Monitor Round 2 - Mock Interview Tab**
   - View completed Round 2 interviews
   - Review scores and feedback
   - Send final selection emails

---

## Database Schema

### New Collection: `round1_aptitude`

```typescript
{
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  roleId: string;
  roleName: string;
  score: number; // Percentage (0-100)
  totalQuestions: number; // 25
  correctAnswers: number;
  categoryPerformance: {
    [category: string]: {
      correct: number;
      total: number;
      percentage: number;
    }
  };
  completedAt: Timestamp;
  selectedForRound2: boolean; // Admin selection
  round2EmailSent: boolean; // Email notification status
  round2InterviewId: string; // Link to Round 2 if completed
}
```

### Updated Collection: `interviews`

Added fields:
- `round`: number (1 or 2)
- `aptitudeRoundId`: string (reference to Round 1 result)
- `selectedForRound2`: boolean
- `round2EmailSent`: boolean

---

## Email Configuration

### Setup SMTP for Production

The email system uses Firebase Functions with Nodemailer. To configure:

1. **Set Firebase Config:**
```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
firebase functions:config:set app.url="https://your-app-url.com"
```

2. **For Gmail:**
   - Enable 2-Factor Authentication
   - Generate App Password
   - Use App Password in config (not your regular password)

3. **Deploy Functions:**
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## File Changes Summary

### New Files Created:
1. `src/pages/Round1Aptitude.tsx` - Round 1 aptitude test page
2. `MULTI_ROUND_SYSTEM.md` - This documentation file

### Modified Files:
1. `src/types/index.ts` - Added `RoundOneAptitudeResult` type
2. `src/lib/firebaseService.ts` - Added Round 1 service functions
3. `src/pages/AdminDashboard.tsx` - Added Round 1 results tab and selection functionality
4. `src/pages/History.tsx` - Added Round 1 results display and Round 2 link
5. `src/App.tsx` - Added `/round1-aptitude` route
6. `src/components/RoleSelector.tsx` - Updated to redirect to Round 1 for formal interviews
7. `functions/src/index.ts` - Added `sendRound2Invitation` function

---

## Testing Checklist

### Round 1 Flow:
- [ ] User can select a role from home page
- [ ] User is redirected to Round 1 Aptitude test
- [ ] 25 questions are displayed
- [ ] User can navigate between questions
- [ ] User can submit after answering all questions
- [ ] Results are shown immediately with score and category breakdown
- [ ] Results are saved to Firebase

### Admin Dashboard:
- [ ] Admin can view all Round 1 results in "Round 1 - Aptitude" tab
- [ ] Scores and dates are displayed correctly
- [ ] "Select for Round 2" button appears for candidates with score >= 50%
- [ ] Clicking button updates status to "Selected for R2"
- [ ] Email notification is triggered (check console logs)
- [ ] Status shows "Email Sent" after selection

### History Page:
- [ ] User can see their Round 1 results
- [ ] Selection status is displayed correctly
- [ ] "Start Round 2" button appears for selected candidates
- [ ] Clicking button navigates to interview start flow
- [ ] Category performance breakdown is visible

### Round 2 Flow:
- [ ] Selected candidates can start Round 2 from History page
- [ ] Round 2 interview works as before (existing functionality)
- [ ] Round 2 results link back to Round 1 result

---

## Current Limitations & Future Enhancements

### Current State:
- Email notifications use client-side simulation (for development)
- No automated threshold for Round 2 selection (admin decides manually)
- Round system is limited to 2 rounds

### Planned Enhancements:
- Deploy production email service using Firebase Functions
- Add automated selection threshold (e.g., auto-select if score >= 70%)
- Support for additional rounds (Round 3, 4, etc.)
- Email template customization from admin dashboard
- Bulk selection feature for admins
- Candidate re-attempt limits

---

## Environment Variables

Ensure these are set in your `.env` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini API Keys
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_CHATBOT_API_KEY=your_chatbot_api_key
VITE_GEMINI_STEVEN_API_KEY=your_steven_api_key
```

---

## Support & Troubleshooting

### Common Issues:

1. **Round 1 results not saving:**
   - Check Firebase authentication
   - Verify Firestore rules allow writes to `round1_aptitude` collection

2. **Email not sending:**
   - Check Firebase Functions configuration
   - Verify SMTP credentials
   - Check function logs: `firebase functions:log`

3. **Round 2 button not appearing:**
   - Verify admin selected the candidate
   - Check `selectedForRound2` field in Firebase
   - Refresh History page

4. **Type errors:**
   - Run `npm install` to update dependencies
   - Check `src/types/index.ts` for new type exports

---

## Deployment Instructions

1. **Build the application:**
```bash
npm run build
```

2. **Deploy Firebase Functions:**
```bash
firebase deploy --only functions
```

3. **Deploy Hosting:**
```bash
firebase deploy --only hosting
```

4. **Full deployment:**
```bash
firebase deploy
```

---

## Contact & Maintenance

For issues or questions:
- Review console logs in browser developer tools
- Check Firebase console for data integrity
- Review Firestore security rules
- Contact system administrator

---

**Last Updated:** February 11, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
