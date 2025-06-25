import type { SensorData, Alert } from "@/hooks/useFirebaseData"

export function exportToCSV(data: SensorData[], filename = "sensor-data.csv") {
  const headers = ["Timestamp", "Voltage (V)", "Current (A)", "Power (W)"]
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        new Date(row.timestamp).toISOString(),
        row.voltage.toFixed(2),
        row.current.toFixed(2),
        row.power.toFixed(2),
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportAlertsToPDF(alerts: Alert[], filename = "alerts-report.pdf") {
  // This would require a PDF library like jsPDF
  // For now, we'll export as text
  const content = alerts
    .map((alert) => `${new Date(alert.timestamp).toLocaleString()} - ${alert.type.toUpperCase()}: ${alert.message}`)
    .join("\n")

  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename.replace(".pdf", ".txt"))
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
