# FoodLog

This is an overview instruction of the whole project, and you can also
refer to the detailed readme file of frontend, backend and AI model
respectively in each branch.

## Prerequisites

-   Node.js \>= 18
-   npm \>= 9 (or yarn)
-   A MongoDB connection string (for backend
-   Expo Go app on your phone (to run the mobile app)

## Frontend (React Native + Expo)

**Clone and switch to the frontend branch**

``` bash
git clone https://github.com/wf597/FoodLog.git
cd FoodLog
git checkout frontend
```

**Install dependencies**\
**Start the app**\
**Open on device**
- iOS: open Camera and scan the QR code
- Android: open Expo Go and scan the QR code

## Backend (Node.js + Express + MongoDB)

1.  If not already cloned:

``` bash
git clone https://github.com/wf597/FoodLog.git
cd FoodLog
```

2.  Switch to backend branch\
3.  Create `.env` and fill values (MongoDB URI, JWT secret, etc.)

``` bash
Copy-Item .env.example .env
```

4.  Install dependencies

``` bash
npm install
```

5.  Run the server

``` bash
npm run dev
```

6.  API docs (if Swagger is enabled)

```{=html}
<!-- -->
```
    http://localhost:<PORT>/api-docs

## AI Modules

1.  Ensure required deps

``` bash
npm install axios form-data
```

2.  In `.env`, enable mock AI for a quick demo

``` bash
# in .env
USE_MOCK_AI=true
```

3.  Use the existing endpoint (example)

```{=html}
<!-- -->
```
    POST /api/food/analyze with a form-data file field named image
