# Authentication System Implementation Plan

## 1. Overview
We will implement a secure and interactive authentication system using Google Firebase, integrated with the Eduverse "Ninja" theme. The system will feature a "Moving Ninja" mascot that guides users through the authentication flow.

## 2. Architecture & Tech Stack
- **Backend:** Firebase Authentication (Email/Password, Google Auth).
- **State Management:** Redux Toolkit (`userSlice`) to handle user sessions globally.
- **Frontend:** React with functional components and Hooks.
- **Styling:** CSS Modules / Vanilla CSS with Keyframe animations for the Ninja mascot.

## 3. Implementation Steps

### Phase 1: Setup (Current Step)
1.  Install Firebase SDK: `npm install firebase`
2.  Create `src/firebase.js` for configuration.
3.  Design the `NinjaMascot` animated component.
4.  Create a reusable `AuthLayout` to ensure visual consistency.

### Phase 2: State Management
1.  Update `src/State/slices/userSlice.js`:
    - Add `login`, `signup`, `logout` thunks.
    - specialized `adminLogin` action.
    - Handle `pending`, `fulfilled`, `rejected` states.

### Phase 3: Page Development
Develop the following pages in `src/Pages/Auth/`:
-   `LoginPage.jsx`: Entry point.
-   `SignupPage.jsx`: Registration with "Ninja Name" selection.
-   `ForgotPasswordPage.jsx` & `ResetPasswordPage.jsx`: Recovery flows.
-   `VerifyEmailPage.jsx`: Security verification.
-   `AdminLoginPage.jsx`: Hidden/Special route for admins.

### Phase 4: Integration
1.  Protect routes in `App.jsx` using a `ProtectedRoute` component.
2.  Connect styling (`Auth.css`) to `index.css` for theme continuity.

## 4. Usage
To use this system, you must populate the `src/firebase.js` file with your specific project credentials obtained from the Firebase Console.
