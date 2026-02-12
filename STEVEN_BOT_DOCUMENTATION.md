# STEVEN AI Interview Bot - Complete Implementation Guide

## 🎯 Overview

STEVEN is a real-time AI Interview Bot system that provides an immersive, human-like interview experience using voice interaction, webcam monitoring, and adaptive question generation powered by Google's Gemini AI.

## 📋 System Architecture

### Core Components

1. **STEVEN Service** (`src/utils/stevenService.ts`)
   - Gemini AI integration with dedicated API key
   - Dynamic question generation based on candidate responses
   - Contextual conversation management
   - Performance evaluation and feedback generation

2. **Voice Service** (`src/utils/voiceService.ts`)
   - Web Speech API integration
   - Real-time speech recognition
   - Text-to-speech with  speed
   - Automatic silence detection

3. **Bot Interview Context** (`src/contexts/BotInterviewContext.tsx`)
   - State management for interview flow
   - Conversation history tracking
   - Performance metrics storage

4. **UI Components**
   - **PreInterviewFlow**: Candidate onboarding and rules
   - **StevenAvatar**: Animated AI avatar with wave visualization
   - **WebcamPanel**: Live video feed with mirror effect
   - **TranscriptionPanel**: Real-time conversation transcript
   - **BotInterview**: Main interview page with 3-column layout

## 🚀 Features Implemented

### ✅ Pre-Interview Flow
- Candidate name and role collection
- First-time experience detection
- Do's and Don'ts display
- Terms agreement checkbox
- Loading animation during initialization

### ✅ Real-Time Voice System
- **Speech Recognition**: Continuous listening with automatic restart
- **Speech Synthesis**: 1.5x speed for natural flow
- **Silence Detection**: 1.5-second pause to detect answer completion
- **Error Handling**: Automatic retry on recognition failures

### ✅ STEVEN's AI Brain
- **Adaptive Difficulty**: Questions adjust based on answer quality
- **Context Awareness**: Full conversation history analysis
- **Dynamic Question Count**: 4-6 questions based on performance
- **Follow-up Logic**: Probing questions on weak areas
- **Natural Language**: Human-like conversational responses

### ✅ 3-Column Layout
```
┌────────────────┬──────┬─────────────────┐
│                │      │   Webcam        │
│  STEVEN        │      │   (mirrored)    │
│  Avatar        │ Ctrl │─────────────────│
│  (Wave Anim)   │ Btns │   Transcription │
│                │      │   (toggleable)  │
└────────────────┴──────┴─────────────────┘
```

### ✅ Interview Flow States
1. **Pre-Interview**: Candidate info + rules
2. **Active**: Voice conversation with STEVEN
3. **Closing**: Final question from candidate
4. **Completed**: Feedback display + score

### ✅ Feedback System
- Overall score (0-100)
- Top 3 strengths
- Top 3 improvement areas
- Detailed constructive feedback
- Saved to Firebase for history

## 🔧 Technical Specifications

### API Configuration
```typescript
API Key: YOUR_GEMINI_API_KEY (set in .env)
Model: gemini-flash-latest
Temperature: 0.8
Max Tokens: 500
```

### Voice Settings
```typescript
Speech Rate: 1.5x
Language: en-US
Silence Timeout: 1500ms
Continuous Recognition: true
Interim Results: true
```

### Browser Requirements
- Chrome/Edge (recommended)
- Web Speech API support
- Microphone permission
- Camera permission

## 📁 File Structure

```
src/
├── pages/
│   └── BotInterview.tsx          # Main interview page
├── components/
│   ├── PreInterviewFlow.tsx       # Pre-interview UI
│   ├── StevenAvatar.tsx           # AI avatar animation
│   ├── WebcamPanel.tsx            # Webcam component
│   └── TranscriptionPanel.tsx     # Live transcription
├── contexts/
│   └── BotInterviewContext.tsx    # Interview state management
└── utils/
    ├── stevenService.ts           # Gemini AI integration
    └── voiceService.ts            # Web Speech API handler
```

## 🎮 User Journey

### Step 1: Pre-Interview
1. User navigates to `/bot-interview`
2. Enters name and position
3. Indicates if first-time AI interview
4. Reviews Do's and Don'ts
5. Agrees to terms
6. System initializes (camera + mic + AI)

### Step 2: Active Interview
1. STEVEN greets candidate by name
2. Asks "Tell me about yourself"
3. Listens to candidate's response
4. Analyzes answer quality internally
5. Generates next adaptive question
6. Repeats for 4-6 questions
7. Adjusts difficulty dynamically

### Step 3: Completion
1. STEVEN asks "Do you have questions?"
2. Candidate can ask closing question
3. System generates comprehensive feedback
4. Displays score + strengths + improvements
5. Saves interview to Practice Dashboard
6. Offers retry or return to dashboard

## 🎯 STEVEN's Behavior Rules

### Personality
- Professional and firm but polite
- Never repetitive (no "Good answer" loop)
- Context-aware across conversation
- Adaptive to candidate's level

### Question Strategy
```
IF answer_quality == "weak":
  ask_fewer_questions()
  probe_on_basics()
  
IF answer_quality == "strong":
  increase_difficulty()
  ask_technical_depth()
  
IF partial_knowledge_detected():
  ask("What is expected from you in this role?")
```

### Never Exposes
- Question count (1/5, 2/5, etc.)
- Scoring metrics during interview
- Internal performance tracking
- Evaluation criteria

## 🔐 Security & Privacy

### Practice Mode (Current Implementation)
- No tab monitoring
- No copy/paste restrictions
- Results saved to user's practice history
- Instant feedback visibility

### Future: Real Interview Mode
- Tab switching detection
- Copy/paste blocking
- Admin-only result access
- Secure link generation

## 🗄️ Firebase Integration

### Collection: `botInterviews`
```typescript
{
  userId: string,
  candidateName: string,
  role: string,
  conversationLog: Array<{
    speaker: 'steven' | 'candidate',
    text: string,
    timestamp: number
  }>,
  feedback: {
    overallScore: number,
    strengths: string[],
    improvements: string[],
    detailedFeedback: string
  },
  createdAt: Date
}
```

## 🎨 UI/UX Highlights

### Color Scheme
- STEVEN Avatar: Blue gradient (#3b82f6 → #1d4ed8)
- Speaking State: Green pulse
- Listening State: Blue pulse
- Idle State: Gray waves

### Animations
- Wave visualization during speaking
- Pulse effect during listening
- Smooth transitions between states
- Loading spinner during init

### Accessibility
- Clear status indicators
- Visual + audio feedback
- Toggleable transcription
- Error messages displayed prominently

## 🚀 Getting Started

### For Users
1. Navigate to Practice Dashboard
2. Click "Start Bot Interview" card
3. Follow pre-interview setup
4. Speak naturally with STEVEN
5. Review feedback after completion

### For Developers
1. All components are modular
2. STEVEN service is separate from other AI services
3. Voice service can be reused
4. State management via Context API
5. TypeScript types defined for all interfaces

## 🐛 Error Handling

### Microphone Issues
- Detects permission denial
- Shows clear error message
- Prompts user to enable access

### Speech Recognition Failures
- Auto-retry on "no-speech" error
- Silent fallback on continuous errors
- User can manually restart

### Network/AI Failures
- Retry logic for Gemini API calls
- Fallback feedback generation
- Error displayed but interview continues

## 📊 Performance Metrics

### Internal Tracking (Not Shown to User)
- Clarity score
- Confidence level
- Depth of answers
- Relevance to role
- Weak areas identified
- Strengths identified

## 🔄 State Machine

```
PRE_INTERVIEW → (user agrees) → ACTIVE
     ↑                            ↓
     |                    (4-6 questions)
     |                            ↓
COMPLETED ← (save results) ← CLOSING
```

## 🎓 Learning Recommendations

After interview completion:
- Feedback includes actionable items
- Suggestions for improvement
- Strengths to highlight in real interviews
- Practice dashboard shows history

## ✅ Testing Checklist

- [ ] Microphone permission requested
- [ ] Camera feed displays (mirrored)
- [ ] Speech recognition working
- [ ] Text-to-speech at 1.5x speed
- [ ] Silence detection (1.5s)
- [ ] Adaptive question generation
- [ ] Transcription toggleable
- [ ] Feedback displayed correctly
- [ ] Data saved to Firebase
- [ ] Navigation back to dashboard

## 🚦 Production Readiness

### Completed ✅
- Core interview flow
- Voice interaction
- Adaptive AI logic
- Feedback generation
- Firebase integration
- Practice mode UI
- Error handling
- TypeScript types
- Responsive layout

### Future Enhancements 🔮
- Real interview mode with monitoring
- Multi-language support
- Voice accent adaptation
- Video recording option
- Detailed analytics dashboard
- AI interviewer personality customization
- Mock interview templates per role

## 📞 Support

For technical issues:
1. Check browser compatibility (Chrome/Edge)
2. Verify microphone/camera permissions
3. Ensure stable internet connection
4. Clear browser cache if issues persist

---

**Built with**: React, TypeScript, Google Gemini AI, Web Speech API, Firebase, Tailwind CSS

**Status**: Production Ready for Practice Mode ✅
