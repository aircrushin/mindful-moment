# Mindful Moment

## Inspiration

In today's fast-paced world, stress and anxiety have become constant companions for millions of people. We noticed that while there are many meditation apps available, most are either too expensive, overloaded with features, or don't provide a seamless cross-platform experience. We wanted to create something **simple, accessible, and genuinely helpful**—a digital sanctuary that fits in your pocket.

Mindful Moment was born from the belief that everyone deserves access to tools that promote mental well-being. Whether you're a busy professional looking for a 1-minute focus boost, a student dealing with exam anxiety, or someone seeking better sleep, we wanted to build an app that meets you where you are.

## What it does

Mindful Moment is a **full-stack meditation and mindfulness application** designed to help users reduce stress, improve focus, and cultivate a daily meditation practice:

### Core Features

🧘 **Curated Meditation Library**
- 8 carefully crafted meditation sessions covering categories like Sleep, Focus, Stress Relief, Anxiety, and Morning routines
- Sessions range from 1-minute quick resets to 5-minute deep dives
- Each meditation includes calming piano music and soothing guidance

🎵 **Immersive Audio Experience**
- Built-in audio player with real-time progress tracking
- Soothing piano and lofi music from Bensound
- Playback controls with seek functionality
- Session completion tracking

📊 **Progress & Streaks**
- Track your meditation streaks and total minutes
- View weekly and all-time statistics
- Record session ratings and personal notes
- Gamified experience to encourage daily practice

🔐 **Secure User Authentication**
- JWT-based authentication with secure token storage
- User registration and login with form validation
- Automatic login persistence across app restarts
- Protected user data and progress history

🎨 **Beautiful, Calming UI**
- Emerald/Sky color palette designed for relaxation
- Smooth animations and transitions
- Responsive design that works on mobile and web
- Dark/Light theme support

## How we built it

### Tech Stack

**Frontend:**
- **Expo 54** + **React Native** for cross-platform development
- **Redux Toolkit** for state management
- **Expo Router** for navigation
- **Expo AV** for audio playback
- **expo-image** for optimized image loading
- **expo-secure-store** for token storage

**Backend:**
- **Express.js** with TypeScript
- **Supabase** (PostgreSQL) for database
- **JWT** for authentication
- **bcryptjs** for password hashing

**Design:**
- Custom theme system with Emerald/Sky palette
- Component-based architecture
- Responsive layouts with SafeArea support

### Architecture Highlights

```
Frontend (React Native)
├── Redux Store
│   ├── Auth Slice (login/register/token management)
│   ├── Meditation Slice (library, current session)
│   └── Progress Slice (streaks, history, stats)
├── Screens
│   ├── Auth (Login/Register)
│   ├── Home (Featured meditations)
│   ├── Library (Browse all)
│   ├── Player (Audio playback)
│   └── Profile (User stats)
└── API Client
    └── RESTful API calls to Express backend

Backend (Express + Supabase)
├── /api/v1/auth
│   ├── POST /register
│   ├── POST /login
│   └── GET /me
├── /api/v1/meditations
│   ├── GET / (list all)
│   ├── GET /:id (single)
│   └── POST /:id/play
└── /api/v1/progress
    ├── GET / (user progress)
    ├── POST / (record session)
    └── GET /stats
```

### Key Technical Decisions

1. **Supabase over raw PostgreSQL**: Chose Supabase for its excellent TypeScript support, real-time capabilities, and built-in authentication helpers.

2. **Redux Toolkit for state management**: Implemented a centralized store for auth, meditations, and progress to ensure consistent state across the app.

3. **Position polling for audio progress**: Since `onPlaybackStatusUpdate` can be unreliable on web, we implemented a 250ms polling mechanism that provides smooth progress updates.

4. **Secure token storage**: Used `expo-secure-store` instead of AsyncStorage for JWT tokens to enhance security.

## Challenges we ran into

### 1. Audio Loading on Web
**Challenge:** The initial audio URLs returned 404 errors, and the `expo-av` library had inconsistent behavior between mobile and web platforms.

**Solution:** We switched to reliable CDN sources (Bensound for music, SoundHelix initially) and implemented a polling-based progress tracking system with proper loading states.

### 2. Database Connection Issues
**Challenge:** The initial direct `pg` connection approach failed in production.

**Solution:** Migrated to Supabase SDK which provided better connection handling, automatic retries, and improved TypeScript support.

### 3. Progress Bar Not Updating
**Challenge:** The progress bar remained at 0% because `onPlaybackStatusUpdate` callback wasn't firing consistently on web.

**Solution:** Implemented an active polling mechanism (250ms interval) that fetches the current position during playback, ensuring smooth progress updates across all platforms.

### 4. Missing Images
**Challenge:** Some Unsplash image URLs returned 404 errors, causing broken images in the UI.

**Solution:** Audited all image URLs and replaced broken ones with verified working alternatives from Unsplash.

### 5. TypeScript Strict Mode
**Challenge:** Initial builds failed due to strict TypeScript configuration with `verbatimModuleSyntax`.

**Solution:** Refactored imports to use proper type imports and adjusted the auth middleware to work with Express's Request type extension.

## Accomplishments that we're proud of

### 🎯 Complete Full-Stack Implementation
Built a production-ready application with both frontend and backend, featuring authentication, database operations, and audio playback—all working seamlessly together.

### 🎨 Thoughtful UX Design
Created a calming, intuitive interface with:
- Smooth animations and transitions
- Loading states for all async operations
- Form validation with clear error messages
- Responsive design that works on multiple screen sizes

### 🔊 Audio Experience
Implemented a robust audio player with:
- Real-time progress tracking
- Play/pause/seek functionality
- Position polling for web compatibility
- Session completion detection

### 📱 Cross-Platform Compatibility
The app works on:
- iOS (via Expo)
- Android (via Expo)
- Web browsers

### 🛡️ Security Best Practices
- Password hashing with bcrypt
- JWT tokens with secure storage
- Protected API endpoints
- Form input validation

## What we learned

### Technical Learnings

1. **Expo AV nuances**: Learned that audio playback behavior differs significantly between mobile and web, requiring platform-specific handling and polling mechanisms.

2. **Supabase integration**: Gained deep understanding of Supabase's TypeScript SDK, connection pooling, and how to structure database queries for optimal performance.

3. **Redux Toolkit patterns**: Mastered modern Redux patterns including `createAsyncThunk`, proper error handling, and state normalization.

4. **React Native styling**: Learned techniques for creating responsive, theme-aware components that work across different screen sizes.

### Development Process

1. **Importance of testing URLs**: We learned to always verify external resource URLs (images, audio) before deploying, as they can become unavailable.

2. **TypeScript strict mode**: Understanding how to properly work with strict TypeScript configurations and type declarations.

3. **State management**: The value of centralized state for complex features like authentication and audio playback.

## What's next for Mindful Moment

### 🚀 Immediate Improvements
- **Offline support**: Cache meditation audio for offline listening
- **Push notifications**: Daily reminders for meditation practice
- **Breathing exercises**: Add guided breathing visualizations
- **Dark mode polish**: Refine the dark theme experience

### 📈 Feature Expansion
- **Custom playlists**: Allow users to create personal meditation collections
- **Sleep stories**: Add narrated sleep stories for bedtime
- **Mood tracking**: Pre/post meditation mood check-ins with analytics
- **Social features**: Share streaks and achievements with friends

### 🎵 Content Growth
- Expand to 50+ meditation sessions
- Add nature sounds and ambient backgrounds
- Collaborate with meditation instructors for exclusive content
- Multiple language support

### 🔧 Technical Enhancements
- Implement background audio playback
- Add audio download for offline use
- Optimize bundle size for faster loading
- Add end-to-end testing with Detox

---

**Mindful Moment** is more than just an app—it's a commitment to mental wellness. We hope this project inspires others to prioritize self-care and mindfulness in their daily lives.

*Built with 💚 using Expo, React Native, Express, and Supabase.*
