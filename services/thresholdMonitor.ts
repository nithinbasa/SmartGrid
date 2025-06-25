import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import type { SensorData } from "@/hooks/useFirebaseData"

interface ThresholdConfig {
  voltage: { min: number; max: number }
  current: { min: number; max: number }
  power: { min: number; max: number }
}

const DEFAULT_THRESHOLDS: ThresholdConfig = {
  voltage: { min: 180, max: 250 },
  current: { min: 0, max: 10 },
  power: { min: 0, max: 1000 },
}

export class ThresholdMonitor {
  private thresholds: ThresholdConfig = DEFAULT_THRESHOLDS
  private lastAlertTime: { [key: string]: number } = {}
  private alertCooldown = 30000 // 30 seconds between similar alerts

  constructor(private addAlert: (alert: any) => void) {
    this.startMonitoring()
  }

  private startMonitoring() {
    const sensorRef = ref(database, "sensors/current")
    onValue(sensorRef, (snapshot) => {
      const data: SensorData = snapshot.val()
      if (data) {
        this.checkThresholds(data)
      }
    })
  }

  private checkThresholds(data: SensorData) {
    const now = Date.now()

    // Check voltage thresholds
    if (data.voltage < this.thresholds.voltage.min) {
      this.triggerAlert("voltage_low", `🔴 Low voltage detected: ${data.voltage.toFixed(1)}V`, "error", now)
    } else if (data.voltage > this.thresholds.voltage.max) {
      this.triggerAlert("voltage_high", `⚠️ High voltage detected: ${data.voltage.toFixed(1)}V`, "warning", now)
    }

    // Check current thresholds
    if (data.current > this.thresholds.current.max) {
      this.triggerAlert("current_high", `🔴 Overcurrent detected: ${data.current.toFixed(1)}A`, "error", now)
    }

    // Check power thresholds
    if (data.power > this.thresholds.power.max) {
      this.triggerAlert("power_high", `⚠️ High power consumption: ${data.power.toFixed(0)}W`, "warning", now)
    }

    // Check for normal conditions
    if (
      data.voltage >= this.thresholds.voltage.min &&
      data.voltage <= this.thresholds.voltage.max &&
      data.current <= this.thresholds.current.max &&
      data.power <= this.thresholds.power.max
    ) {
      this.triggerAlert("system_normal", "✅ All parameters within normal range", "success", now)
    }
  }

  private triggerAlert(
    type: string,
    message: string,
    alertType: "success" | "warning" | "error" | "info",
    timestamp: number,
  ) {
    const lastAlert = this.lastAlertTime[type]
    if (!lastAlert || timestamp - lastAlert > this.alertCooldown) {
      this.addAlert({
        type: alertType,
        message,
      })
      this.lastAlertTime[type] = timestamp
    }
  }
}
