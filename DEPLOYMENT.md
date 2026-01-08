# How to Deploy Bhandara Finder to Vercel

Vercel is an excellent choice for hosting this project for free. Since this is a Vite app, Vercel will handle the build automatically.

## Prerequisites
- A [GitHub](https://github.com/) account.
- A [Vercel](https://vercel.com/) account (you can sign up with GitHub).
- Your project code pushed to a GitHub repository.

## Step 1: Push Code to GitHub
If you haven't already, initialize a git repo and push your code:
1. Initialize git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub.
3. Link and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/bhandara-finder.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Import into Vercel
1. Log in to your Vercel Dashboard.
2. Click **Add New...** > **Project**.
3. Select your `bhandara-finder` repository and click **Import**.

## Step 3: Configure Environment Variables (Crucial!)
Vercel needs to know your Firebase keys.
1. On the "Configure Project" screen, look for the **Environment Variables** section.
2. Expand it.
3. Add each variable from your local `.env` file one by one:
   - `VITE_FIREBASE_API_KEY`: (value)
   - `VITE_FIREBASE_AUTH_DOMAIN`: (value)
   - `VITE_FIREBASE_PROJECT_ID`: (value)
   - `VITE_FIREBASE_STORAGE_BUCKET`: (value)
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: (value)
   - `VITE_FIREBASE_APP_ID`: (value)

   *Tip: You can copy the entire content of your `.env` file and paste it into the first input box; Vercel often auto-parses it.*

## Step 4: Deploy
1. Click **Deploy**.
2. Vercel will build the project (it runs `npm run build`).
3. Once finished, you will get a live URL (e.g., `https://bhandara-finder.vercel.app`).

## Troubleshooting
- **White Screen / 404s**: If the app loads but map/data is missing, check the browser console. It usually means Environment Variables are missing or incorrect.
- **Firebase Auth Domains**: You may need to add your Vercel domain (e.g., `bhandara-finder.vercel.app`) to the **Authorized Domains** list in the Firebase Console (Authentication > Settings > Authorized Domains).

## Alternative: Firebase Hosting
Since you use Firebase, you can also host there:
1. Run `npm install -g firebase-tools`
2. `firebase login`
3. `firebase init hosting` (Choose "Configure as a single-page app", set public directory to `dist`)
4. `npm run build`
5. `firebase deploy`
