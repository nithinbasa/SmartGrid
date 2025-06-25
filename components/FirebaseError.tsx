"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Settings } from "lucide-react"

export default function FirebaseError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Firebase Configuration Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              Firebase environment variables are missing or invalid. Please configure your Firebase project.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">Required Environment Variables:</h3>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm space-y-1">
              <div>NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key</div>
              <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com</div>
              <div>NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/</div>
              <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id</div>
              <div>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com</div>
              <div>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789</div>
              <div>NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Setup Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Go to{" "}
                <a
                  href="https://console.firebase.google.com"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Firebase Console
                </a>
              </li>
              <li>Create a new project or select existing one</li>
              <li>Enable Realtime Database and Authentication</li>
              <li>Go to Project Settings → General → Your apps</li>
              <li>Copy the Firebase config values</li>
              <li>Add them to your environment variables</li>
              <li>Restart your development server</li>
            </ol>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Important:</strong> Make sure your Database URL ends with <code>.firebaseio.com/</code> and
              doesn't contain invalid characters like ".", "#", "$", "[", or "]" in the path.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
