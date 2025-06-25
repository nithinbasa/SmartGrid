import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  const requiredEnvVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ]

  return requiredEnvVars.every((varName) => process.env[varName])
}

// Validate database URL format
export const isValidDatabaseURL = (url: string) => {
  return url && url.match(/^https:\/\/.*\.firebaseio\.com\/?$/)
}

let app: any = null
let database: any = null
let auth: any = null

if (isFirebaseConfigured()) {
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!

  if (isValidDatabaseURL(databaseURL)) {
    try {
      app = initializeApp(firebaseConfig)
      database = getDatabase(app)
      auth = getAuth(app)
    } catch (error) {
      console.error("Firebase initialization error:", error)
    }
  } else {
    console.error("Invalid Firebase Database URL format:", databaseURL)
  }
}

export { database, auth }
export default app
