# FoodLog - Frontend Application

## Tech Stack

- React Native 0.81.5
- Expo Router 6.0.14
- TypeScript 5.9.2
- Expo SDK ~54.0

## Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 or **yarn**: >= 1.22.0

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wf597/FoodLog.git
   cd FoodLog
   git checkout frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   Or if you prefer yarn:
   ```bash
   yarn install
   ```

## Running the Project

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Test on a physical device**
   
   After running the command, a QR code will be displayed in the terminal.
   
   - **Install Expo Go app** on your device:
     - iOS: Download from the [App Store](https://apps.apple.com/app/expo-go/id982107779)
     - Android: Download from [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   
   - **Scan the QR code**:
     - **iOS**: Open the Camera app and scan the QR code
     - **Android**: Open the Expo Go app and use the built-in scanner
   
   The app will automatically load on your device and connect to the development server.

## Project Structure

```
my-food-app/
├── app/                    # Page routes (Expo Router file-based routing)
│   ├── (tabs)/            # Bottom tab navigation screens
│   │   ├── home.tsx       # Home screen
│   │   ├── scan.tsx       # Food scanning screen
│   │   └── settings.tsx   # Settings screen
│   ├── (questionnaire)/   # User onboarding questionnaire flow
│   │   ├── goal.tsx       # Goal selection
│   │   ├── gender.tsx     # Gender selection
│   │   ├── birth-date.tsx # Birth date input
│   │   ├── height.tsx     # Height input
│   │   ├── current-weight.tsx
│   │   ├── goal-weight.tsx
│   │   └── activity-level.tsx
│   ├── index.tsx          # Onboarding/landing page
│   ├── signup.tsx         # Sign up page
│   ├── login.tsx          # Log in page
│   ├── MyProfileScreen.tsx
│   ├── MyGoalsScreen.tsx
│   ├── AddFoodScreen.tsx
│   └── ScanResultScreen.tsx
├── components/            # Reusable UI components
│   ├── PrimaryButton.tsx
│   ├── SocialLoginButton.tsx
│   ├── NavigationRow.tsx
│   ├── ScreenContainer.tsx
│   └── ...                # Other UI components
├── context/               # React Context for state management
│   └── QuestionnaireContext.tsx  # User questionnaire data
├── constants/             # Constants and configuration
│   └── Colors.ts
├── assets/                # Static assets
│   ├── images/            # Image files
│   └── fonts/             # Font files
├── app.json               # Expo configuration
└── package.json           # Dependencies and scripts
```

### Key Directories

- **`app/`**: Contains all screen components using Expo Router's file-based routing system
  - `(tabs)/`: Main application screens with bottom tab navigation
  - `(questionnaire)/`: User onboarding flow screens
- **`components/`**: Reusable UI components used throughout the app
- **`context/`**: React Context providers for global state management
- **`constants/`**: Shared constants like colors and configuration values
- **`assets/`**: Static resources including images and fonts

## Troubleshooting

### Clear cache and reinstall dependencies

```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### Reset Metro bundler cache

```bash
npx expo start --clear
```

