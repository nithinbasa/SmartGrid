"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { isFirebaseConfigured } from "@/lib/firebase"

// Mock user type for demo mode
interface MockUser {
  email: string
  uid: string
}

interface AuthContextType {
  user: MockUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo] = useState(!isFirebaseConfigured())

  useEffect(() => {
    if (isDemo) {
      // In demo mode, automatically "login" the user
      setUser({ email: "demo@example.com", uid: "demo-user" })
      setLoading(false)
    } else {
      // Try to use Firebase Auth
      try {
        const { auth } = require("@/lib/firebase")
        const { onAuthStateChanged } = require("firebase/auth")

        if (auth) {
          const unsubscribe = onAuthStateChanged(auth, (firebaseUser: any) => {
            if (firebaseUser) {
              setUser({ email: firebaseUser.email, uid: firebaseUser.uid })
            } else {
              setUser(null)
            }
            setLoading(false)
          })
          return () => unsubscribe()
        }
      } catch (error) {
        console.error("Firebase Auth error:", error)
        // Fallback to demo mode
        setUser({ email: "demo@example.com", uid: "demo-user" })
        setLoading(false)
      }
    }
  }, [isDemo])

  const login = async (email: string, password: string) => {
    if (isDemo) {
      // Demo login
      setUser({ email, uid: "demo-user" })
      return
    }

    try {
      const { auth } = require("@/lib/firebase")
      const { signInWithEmailAndPassword } = require("firebase/auth")
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    if (isDemo) {
      // Demo register
      setUser({ email, uid: "demo-user" })
      return
    }

    try {
      const { auth } = require("@/lib/firebase")
      const { createUserWithEmailAndPassword } = require("firebase/auth")
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    if (isDemo) {
      setUser(null)
      return
    }

    try {
      const { auth } = require("@/lib/firebase")
      const { signOut } = require("firebase/auth")
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isDemo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
