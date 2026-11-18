# Curio

Curio is a small Angular app for discovering curious ideas, psychological effects, and paradoxes. Press **Spin topic** to cycle through the collection and land on a random topic. Each topic is shown in English, with Spanish and Portuguese translations; the spin includes simple sound effects.

The collection currently contains 100 topics and is maintained in [`src/app/data/topics.ts`](./src/app/data/topics.ts).

## Requirements

- Node.js compatible with Angular 21 (Node.js 20.19+ or 22.12+)
- npm
- For Android builds: Android Studio with the Android SDK, and a compatible Java JDK

## Run locally

Install dependencies and start the Angular development server:

```bash
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200). The server reloads when application files change.

## Build and test the web app

Create a production build:

```bash
npm run build
```

The web build is written to `dist/curio/browser`.

Run unit tests:

```bash
npm test
```

## Build an Android APK

The Android app is packaged with Capacitor. On Windows, open PowerShell in the project root and run:

```powershell
npm.cmd ci
npm.cmd run build
npx.cmd cap sync android
cd android
.\gradlew.bat assembleDebug
```

`cap sync` copies the latest web build into the Android project. Run it again after changing the web app before building a new APK.

The debug APK is created at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

This is a debug-signed APK for testing. For a store-ready release, open the `android` folder in Android Studio and use **Build > Generate Signed Bundle / APK** to create a signed release.

## Android project details

- Capacitor app ID: `com.nervy.curio`
- Android project: `android/`
- Gradle wrapper: `android/gradlew.bat` (Windows) or `android/gradlew` (macOS/Linux)
