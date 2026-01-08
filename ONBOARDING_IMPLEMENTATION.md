# Onboarding Flow Implementation

## Overview
A multi-step onboarding flow that guides new users through personalization questions immediately after signup, then redirects them to their first image generation.

## Routes

### Main Routes
- **`/onboarding`** - Main onboarding flow page (protected, requires authentication)
  - Located at: `src/app/(dashboard)/onboarding/page.tsx`
  - Uses dashboard layout (no sidebar/header)

### Redirect Flow
1. **After Signup**: User is redirected to `/onboarding`
2. **After OAuth Login**: User is redirected to `/onboarding` (if not subscription required)
3. **After Completion**: User is auto-redirected to `/image-generation/generate`

## Components Structure

```
src/components/pages/onboarding/
├── onboarding-flow.tsx          # Main flow controller
├── onboarding-guard.tsx         # Guard component to check completion status
├── request.ts                   # API request function
└── steps/
    ├── welcome-step.tsx         # Step 1: Welcome screen
    ├── user-type-step.tsx       # Step 2: Who are you creating for?
    ├── content-type-step.tsx   # Step 3: What are you creating today?
    ├── release-frequency-step.tsx # Step 4: How often do you release?
    ├── priority-step.tsx        # Step 5: What matters most to you?
    └── completion-step.tsx      # Step 6: Completion screen
```

## Data Structure

### Onboarding Schema (`src/schemas/onboarding-schema.ts`)

```typescript
{
  userType: "myself" | "multiple-artists" | "team",
  contentType: "album-cover" | "promo-social" | "playlist-banner" | "press-kit",
  releaseFrequency: "occasionally" | "monthly" | "weekly" | "getting-started",
  priority: "speed" | "consistency" | "quality" | "simplicity"
}
```

### API Endpoints

**POST** `/api/onboarding` - Save/Update onboarding data

**Request Body:**
```json
{
  "userType": "myself",
  "contentType": "album-cover",
  "releaseFrequency": "monthly",
  "priority": "quality"
}
```

**Response (200 OK):**
```json
{
  "message": "Onboarding data saved successfully",
  "data": {
    "id": 1,
    "userId": 123,
    "userType": "myself",
    "contentType": "album-cover",
    "releaseFrequency": "monthly",
    "priority": "quality",
    "createdAt": "2024-01-08T18:20:27.000Z",
    "updatedAt": "2024-01-08T18:20:27.000Z"
  }
}
```

**GET** `/api/onboarding` - Get onboarding data

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "userId": 123,
    "userType": "myself",
    "contentType": "album-cover",
    "releaseFrequency": "monthly",
    "priority": "quality",
    "createdAt": "2024-01-08T18:20:27.000Z",
    "updatedAt": "2024-01-08T18:20:27.000Z"
  }
}
```

**DELETE** `/api/onboarding` - Delete onboarding data

**Response (200 OK):**
```json
{
  "message": "Onboarding data deleted successfully"
}
```

**Note:** All endpoints require Bearer token authentication.

## Flow Steps

### Step 1: Welcome
- Logo display
- Title: "Let's Get Started"
- Subtitle: "Answer a few quick questions so we can tailor Edit Deck Pro to your workflow"
- CTA: "Start" button

### Step 2: User Type
- Question: "Who are you creating for?"
- Helper text: "This helps us personalize your experience"
- Options:
  - Myself (Independent Artist)
  - Multiple Artists (Manager / Label)
  - Team / Studio / Agency

### Step 3: Content Type
- Question: "What are you creating today?"
- Helper text: "Select the type of visual you need right now"
- Options:
  - Album or Single Cover
  - Promo / Social Media Graphic
  - Playlist / Banner Artwork
  - Press Kit / Branding Assets

### Step 4: Release Frequency
- Question: "How often do you release?"
- Helper text: "This helps us understand your workflow pace"
- Options:
  - Occasionally
  - Monthly
  - Weekly or high-volume
  - Just getting started

### Step 5: Priority
- Question: "What matters most to you?"
- Helper text: "Your top priority when creating visuals"
- Options:
  - Speed
  - Consistency
  - Quality
  - Simplicity

### Step 6: Completion
- Success icon
- Title: "You're All Set" (with music note icons)
- Description: "Let's create your first cover and get your release moving."
- Feature highlights:
  - AI-Powered
  - Streaming-Ready
  - Instant Export
- Auto-redirects to `/image-generation/generate` after 1.5 seconds

## Implementation Details

### Onboarding Guard
- Checks if user has completed onboarding
- Redirects to `/onboarding` if not completed
- Located in: `src/components/pages/onboarding/onboarding-guard.tsx`
- Integrated into: `src/app/(dashboard)/(pages)/layout.tsx`

### Authentication Flow
- Signup redirects to `/onboarding` (updated in `signup-form.tsx`)
- OAuth callback redirects to `/onboarding` (updated in `oauth/callback/page.tsx`)

### UI/UX Features
- Dark theme consistent with Edit Deck Pro branding
- Material Symbols icons via `GIcon` component
- Responsive design (mobile-friendly)
- Loading states during submission
- Error handling with toast notifications
- Back navigation on all steps (except welcome)
- Radio button selection UI
- Smooth transitions between steps

## Backend Requirements

1. **Create endpoint**: `POST /api/user/onboarding`
   - Accepts onboarding data
   - Saves to user profile
   - Sets `onboardingCompleted: true`

2. **Update user model**: Add onboarding fields
   - `onboardingCompleted: boolean`
   - `onboarding: { userType, contentType, releaseFrequency, priority }`

3. **Optional**: `GET /api/user/onboarding/status`
   - Returns `{ onboardingCompleted: boolean }`

## Testing Checklist

- [ ] New user signup redirects to onboarding
- [ ] OAuth login redirects to onboarding (if applicable)
- [ ] All 6 steps render correctly
- [ ] Data is saved to backend
- [ ] Auto-redirect to image generation works
- [ ] Onboarding guard prevents access to dashboard if not completed
- [ ] Back button works on all steps
- [ ] Mobile responsive design works
- [ ] Error handling works (network errors, etc.)
