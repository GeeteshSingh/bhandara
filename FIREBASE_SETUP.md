# How to Configure Firebase for Bhandara Finder

To make Authentication and Database features work, you need to provide your unique Firebase configuration keys. These keys should be stored in a `.env` file, which is kept private and not shared in git.

## Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the prompts to create a new project (name it "Bhandara Finder" or similar).
3. Disable Google Analytics for this project (optional, but simplifies things).

## Step 2: Register a Web App
1. In the project overview, click the **Web icon (`</>`)** to add a web app.
2. Give it a nickname (e.g., "Bhandara Web") and click **Register app**.
3. You will see a code block with `const firebaseConfig = { ... }`. **Keep this tab open** or copy these values.

## Step 3: Create the .env File
1. In the root directory of this project (where `package.json` is), create a new file named `.env`.
2. Copy the content below and paste it into `.env`.
3. Replace the `...` placeholders with the actual values from your Firebase Console.

```env
# .env file
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 4: Enable Authentication & Firestore
1. **Authentication**:
   - Go to **Build > Authentication** in the Firebase Console sidebar.
   - Click **Get Started**.
   - Select **Google** from the Sign-in method list.
   - Enable it and set the support email.
   - Click **Save**.

2. **Firestore Database**:
   - Go to **Build > Firestore Database**.
   - Click **Create Database**.
   - Choose a location (e.g., `asia-south1` for India or `us-central1`).
   - Start in **Test mode** (for now) so you can write data without complex rules immediately.

## Step 5: Restart the Server
After creating the `.env` file, you must restart your local server for the changes to take effect:
1. Press `Ctrl + C` in your terminal to stop the server.
2. Run `npm run dev` again.
