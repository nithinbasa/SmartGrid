"use client"

import { useState, useEffect } from "react"
import { isFirebaseConfigured } from "@/lib/firebase"

export interface SensorData {
  voltage: number
  current: number
  power: number
  timestamp: number
}

export interface LoadState {
  load1: boolean
  load2: boolean
  autoMode: boolean
}

export interface Alert {
  id: string
  type: "success" | "warning" | "error" | "info"
  message: string
  timestamp: number
  acknowledged: boolean
}

// Mock data generator
const generateMockData = (): SensorData[] => {
  const now = Date.now()
  return Array.from({ length: 50 }, (_, i) => ({
    voltage: 220 + Math.random() * 20 - 10,
    current: 2 + Math.random() * 1,
    power: 400 + Math.random() * 200,
    timestamp: now - (49 - i) * 60000,
  }))
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "info",
    message: "📊 Demo mode active - showing simulated data",
    timestamp: Date.now(),
    acknowledged: false,
  },
  {
    id: "2",
    type: "success",
    message: "✅ System initialized successfully",
    timestamp: Date.now() - 300000,
    acknowledged: false,
  },
  {
    id: "3",
    type: "warning",
    message: "⚠️ Configure Firebase for live data",
    timestamp: Date.now() - 600000,
    acknowledged: false,
  },
]

// Hook for real-time sensor data
export function useSensorData() {
  const [currentData, setCurrentData] = useState<SensorData>({
    voltage: 230.5,
    current: 2.3,
    power: 530,
    timestamp: Date.now(),
  })
  const [historicalData, setHistoricalData] = useState<SensorData[]>(generateMockData())
  const [loading, setLoading] = useState(true)
  const isDemo = !isFirebaseConfigured()

  useEffect(() => {
    if (isDemo) {
      // Demo mode - simulate real-time updates
      setLoading(false)
      const interval = setInterval(() => {
        const newData: SensorData = {
          voltage: 220 + Math.random() * 20 - 10,
          current: 2 + Math.random() * 1,
          power: 400 + Math.random() * 200,
          timestamp: Date.now(),
        }
        setCurrentData(newData)

        setHistoricalData((prev) => {
          const updated = [...prev.slice(1), newData]
          return updated
        })
      }, 3000)

      return () => clearInterval(interval)
    } else {
      // Firebase mode
      try {
        const { database } = require("@/lib/firebase")
        const { ref, onValue } = require("firebase/database")

        if (database) {
          const currentDataRef = ref(database, "sensors/current")
          const unsubscribeCurrent = onValue(currentDataRef, (snapshot: any) => {
            const data = snapshot.val()
            if (data) {
              setCurrentData(data)
              setLoading(false)
            }
          })

          const historicalRef = ref(database, "sensors/historical")
          const unsubscribeHistorical = onValue(historicalRef, (snapshot: any) => {
            const data = snapshot.val()
            if (data) {
              const dataArray = Object.values(data) as SensorData[]
              setHistoricalData(dataArray.slice(-50))
            }
          })

          return () => {
            unsubscribeCurrent()
            unsubscribeHistorical()
          }
        }
      } catch (error) {
        console.error("Firebase data hook error:", error)
        setLoading(false)
      }
    }
  }, [isDemo])

  return { currentData, historicalData, loading }
}

// Hook for load control
export function useLoadControl() {
  const [loadState, setLoadState] = useState<LoadState>({
    load1: true,
    load2: false,
    autoMode: true,
  })
  const isDemo = !isFirebaseConfigured()

  useEffect(() => {
    if (!isDemo) {
      try {
        const { database } = require("@/lib/firebase")
        const { ref, onValue } = require("firebase/database")

        if (database) {
          const loadRef = ref(database, "controls/loads")
          const unsubscribe = onValue(loadRef, (snapshot: any) => {
            const data = snapshot.val()
            if (data) {
              setLoadState(data)
            }
          })

          return () => unsubscribe()
        }
      } catch (error) {
        console.error("Firebase load control error:", error)
      }
    }
  }, [isDemo])

  const updateLoadState = async (newState: Partial<LoadState>) => {
    const updatedState = { ...loadState, ...newState }
    setLoadState(updatedState)

    if (!isDemo) {
      try {
        const { database } = require("@/lib/firebase")
        const { ref, set, push, serverTimestamp } = require("firebase/database")

        if (database) {
          const loadRef = ref(database, "controls/loads")
          await set(loadRef, updatedState)

          const logRef = ref(database, "logs/controls")
          await push(logRef, {
            action: `Load control updated: ${JSON.stringify(newState)}`,
            timestamp: serverTimestamp(),
            type: "control",
          })
        }
      } catch (error) {
        console.error("Error updating load state:", error)
      }
    }
  }

  return { loadState, updateLoadState }
}

// Hook for alerts and monitoring
export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const isDemo = !isFirebaseConfigured()

  useEffect(() => {
    if (!isDemo) {
      try {
        const { database } = require("@/lib/firebase")
        const { ref, onValue } = require("firebase/database")

        if (database) {
          const alertsRef = ref(database, "alerts")
          const unsubscribe = onValue(alertsRef, (snapshot: any) => {
            const data = snapshot.val()
            if (data) {
              const alertsArray = Object.entries(data).map(([id, alert]) => ({
                id,
                ...(alert as Omit<Alert, "id">),
              }))
              setAlerts(alertsArray.sort((a, b) => b.timestamp - a.timestamp))
            }
          })

          return () => unsubscribe()
        }
      } catch (error) {
        console.error("Firebase alerts hook error:", error)
      }
    }
  }, [isDemo])

  const addAlert = async (alert: Omit<Alert, "id" | "timestamp" | "acknowledged">) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: Date.now(),
      acknowledged: false,
    }

    setAlerts((prev) => [newAlert, ...prev])

    if (!isDemo) {
      try {
        const { database } = require("@/lib/firebase")
        const { ref, push, serverTimestamp } = require("firebase/database")

        if (database) {
          const alertsRef = ref(database, "alerts")
          await push(alertsRef, {
            ...alert,
            timestamp: serverTimestamp(),
            acknowledged: false,
          })
        }
      } catch (error) {
        console.error("Error adding alert:", error)
      }
    }
  }

  const acknowledgeAlert = async (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))

    if (!isDemo) {
      try {
        const { database } = require("@/lib/firebase")
        const { ref, set } = require("firebase/database")

        if (database) {
          const alertRef = ref(database, `alerts/${alertId}/acknowledged`)
          await set(alertRef, true)
        }
      } catch (error) {
        console.error("Error acknowledging alert:", error)
      }
    }
  }

  return { alerts, addAlert, acknowledgeAlert }
}
