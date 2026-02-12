# Security & Enhancement Updates

## Overview
This document describes the security enhancements, error handling improvements, and new features added to MockMate.

## 🔒 Security Enhancements

### 1. Environment Variables (.env)
All sensitive credentials are now stored in `.env` files and never hardcoded:

```env
# Judge0 API (for secure code execution)
VITE_JUDGE0_API_KEY=your_judge0_api_key
VITE_JUDGE0_API_HOST=judge029.p.rapidapi.com
VITE_JUDGE0_BASE_URL=https://judge029.p.rapidapi.com

# Gemini API Keys
VITE_GEMINI_API_KEY=your_gemini_key
VITE_GEMINI_CHATBOT_API_KEY=your_chatbot_key
VITE_GEMINI_STEVEN_API_KEY=your_steven_key

# Security Settings
VITE_MAX_CODE_LENGTH=50000
VITE_MAX_EXECUTION_TIME=10000
VITE_ENABLE_CODE_SANITIZATION=true
```

**Important:** Never commit `.env` files to version control!

### 2. Code Sanitization
Implemented comprehensive input sanitization to prevent:
- Code injection attacks
- Dangerous system calls
- Malicious file operations
- Excessive resource usage

**Location:** `src/utils/judge0Service.ts` - `sanitizeCode()` function

**Features:**
- Language-specific dangerous pattern detection
- Code length validation
- Null byte and control character removal
- Security warnings for suspicious patterns

### 3. API Key Management
**Before:** API keys hardcoded in source files ❌
**After:** API keys loaded from environment variables ✅

**Updated files:**
- `src/config/apiKeys.ts` - Centralized key management
- `functions/src/index.ts` - Removed hardcoded keys

### 4. Rate Limiting & Execution Limits
- **Max code length:** 50,000 characters
- **Execution timeout:** 10 seconds
- **Memory limit:** 256 MB
- **Rate limiting:** Configurable via API

## ⚡ Enhanced Features

### 1. Judge0 Integration
Real code execution for multiple languages using Judge0 API.

**File:** `src/utils/judge0Service.ts`

**Supported Languages:**
- JavaScript (Node.js)
- Python 3
- Java (OpenJDK 13)
- C++ (GCC 9.2.0)

**Features:**
- Real compilation and execution
- Proper error messages
- Execution time and memory tracking
- Async result polling

**Usage Example:**
```typescript
import { submitCodeExecution } from '@/utils/judge0Service';

const result = await submitCodeExecution(
  userCode,
  'python',
  testInput
);

if (result.success) {
  console.log('Output:', result.output);
  console.log('Time:', result.executionTime, 'ms');
} else {
  console.error('Error:', result.error);
}
```

### 2. AI-Powered Hints System
Intelligent hints and explanations using Gemini AI.

**File:** `src/utils/aiHintsService.ts`

**Features:**
- **Progressive Hints:** 3 levels (subtle → medium → direct)
- **Personalized Hints:** Based on user's current code
- **Solution Explanations:** Detailed breakdowns
- **Debugging Help:** AI-powered error diagnosis
- **Learning Paths:** Personalized recommendations

**Usage Example:**
```typescript
import { generateProgressiveHints, generatePersonalizedHint } from '@/utils/aiHintsService';

// Get progressive hints
const hints = await generateProgressiveHints(question, 'javascript');
console.log(hints[0].content); // Subtle hint

// Get personalized hint based on user code
const personalizedHint = await generatePersonalizedHint(
  question,
  userCode,
  'python',
  { passed: 2, total: 5 }
);
console.log(personalizedHint.guidance);
console.log(personalizedHint.nextSteps);
```

### 3. Robust Error Handling
Comprehensive error management with user-friendly messages.

**File:** `src/utils/errorHandling.ts`

**Error Types:**
- `CodeExecutionError` - Execution failures
- `ValidationError` - Input validation issues
- `APIError` - API communication problems

**Features:**
- User-friendly error messages
- Technical details for debugging
- Actionable suggestions
- Automatic retry with exponential backoff

**Usage Example:**
```typescript
import { parseExecutionError, logError, retryWithBackoff } from '@/utils/errorHandling';

try {
  const result = await executeCode(code);
} catch (error) {
  const parsed = parseExecutionError(error);
  
  console.log(parsed.title);        // "Execution Timeout"
  console.log(parsed.message);      // User-friendly message
  console.log(parsed.suggestions);  // ["Check for infinite loops", ...]
  
  // Log with context
  logError('Code Execution', error, { language, questionId });
}

// Retry with backoff
const result = await retryWithBackoff(
  async () => await submitToJudge0(code),
  3, // max retries
  1000 // base delay in ms
);
```

## 📝 Configuration Setup

### 1. Get Judge0 API Key
1. Visit [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Subscribe to a plan (free tier available)
3. Copy your API key
4. Add to `.env`:
   ```env
   VITE_JUDGE0_API_KEY=your_api_key_here
   VITE_JUDGE0_API_HOST=judge029.p.rapidapi.com
   ```

### 2. Configure Firebase Functions
For production deployment:

```bash
# Set Gemini API key
firebase functions:config:set gemini.apikey="YOUR_GEMINI_API_KEY"

# Set email credentials (for interview invitations)
firebase functions:config:set email.user="your_email@gmail.com"
firebase functions:config:set email.password="your_app_password"

# Deploy
firebase deploy --only functions
```

### 3. Local Development
Create `.env` file in project root with all required variables (see example above).

## 🧪 Testing

### Test Judge0 Connection
```typescript
import { testJudge0Connection } from '@/utils/judge0Service';

const isConnected = await testJudge0Connection();
console.log('Judge0 connected:', isConnected);
```

### Test AI Hints
```typescript
import { generateProgressiveHints } from '@/utils/aiHintsService';

const hints = await generateProgressiveHints(question, language);
hints.forEach((hint, i) => {
  console.log(`Level ${hint.level}:`, hint.content);
});
```

## 🔍 Security Checklist

- [x] All API keys moved to .env
- [x] .env files in .gitignore
- [x] Code sanitization implemented
- [x] Input validation added
- [x] Execution limits enforced
- [x] Error messages don't expose internals
- [x] API keys loaded from environment
- [x] Firebase functions use config

## 🚨 Important Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Rotate API keys regularly** - Good security practice
3. **Monitor usage** - Set up alerts for unusual activity
4. **Test in development** - Verify all features work before deploying
5. **Document changes** - Keep team informed of security updates

## 📊 Error Message Examples

### Before:
```
Error: Internal server error
```

### After:
```
Title: Execution Timeout
Message: Your code took too long to execute.
Suggestions:
- Check for infinite loops
- Optimize your algorithm
- Review time complexity
```

## 🎯 Next Steps

1. **Monitor Performance:** Track execution times and error rates
2. **User Feedback:** Collect feedback on hint quality
3. **Expand Languages:** Add more language support as needed
4. **Optimize Costs:** Monitor Judge0 API usage
5. **Security Audits:** Regular security reviews

## 📚 Additional Resources

- [Judge0 Documentation](https://ce.judge0.com/)
- [Gemini AI Documentation](https://ai.google.dev/docs)
- [Firebase Functions Config](https://firebase.google.com/docs/functions/config-env)
- [OWASP Security Guidelines](https://owasp.org/)

---

**Last Updated:** February 12, 2026
**Version:** 2.0.0
