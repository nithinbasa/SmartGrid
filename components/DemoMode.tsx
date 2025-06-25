"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Zap,
  Activity,
  Power,
  AlertTriangle,
  CheckCircle,
  User,
  Github,
  Lightbulb,
  Settings,
  Download,
  Info,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data generator for demo mode
const generateMockData = () => {
  const now = new Date()
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(now.getTime() - (19 - i) * 60000).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    voltage: 220 + Math.random() * 20 - 10,
    current: 2 + Math.random() * 1,
    power: 400 + Math.random() * 200,
  }))
}

const mockAlerts = [
  { id: 1, type: "info", message: "📊 Demo mode active - showing simulated data", time: "Now" },
  { id: 2, type: "success", message: "✅ System initialized in demo mode", time: "12:00 PM" },
  { id: 3, type: "warning", message: "⚠️ Configure Firebase for live data", time: "12:00 PM" },
]

export default function DemoMode() {
  const [currentData, setCurrentData] = useState({
    voltage: 230.5,
    current: 2.3,
    power: 530,
  })

  const [chartData, setChartData] = useState(generateMockData())
  const [load1Status, setLoad1Status] = useState(true)
  const [load2Status, setLoad2Status] = useState(false)
  const [autoMode, setAutoMode] = useState(true)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData({
        voltage: 220 + Math.random() * 20 - 10,
        current: 2 + Math.random() * 1,
        power: 400 + Math.random() * 200,
      })

      setChartData((prev) => {
        const newData = [...prev.slice(1)]
        const now = new Date()
        newData.push({
          time: now.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
          voltage: 220 + Math.random() * 20 - 10,
          current: 2 + Math.random() * 1,
          power: 400 + Math.random() * 200,
        })
        return newData
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (voltage: number, current: number) => {
    if (voltage < 180 || current > 10) return "bg-red-500"
    if (voltage > 250 || current > 8) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "error":
        return "border-red-200 bg-red-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Mode Alert */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Alert className="border-blue-200 bg-transparent">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> This dashboard is running with simulated data. Configure Firebase to connect
              live sensors.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Header / Navbar */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Smart Power Grid</h1>
              <Badge variant="secondary">Demo</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" disabled>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Demo User</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Live Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voltage</CardTitle>
              <Zap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.voltage.toFixed(1)} V</div>
              <p className="text-xs text-muted-foreground">Simulated data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.current.toFixed(1)} A</div>
              <p className="text-xs text-muted-foreground">Simulated data</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Power</CardTitle>
              <Power className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(currentData.power)} W</div>
              <p className="text-xs text-muted-foreground">Calculated value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <Badge className={`${getStatusColor(currentData.voltage, currentData.current)} text-white`}>
                ✅ Normal
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Demo mode</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Card className="mb-6 md:mb-8">
          <CardHeader>
            <CardTitle>Real-time Monitoring (Demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Voltage vs Time</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={12} />
                    <YAxis domain={[200, 250]} fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="voltage" stroke="#2563eb" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4">Current vs Time</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={12} />
                    <YAxis domain={[0, 4]} fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="current" stroke="#16a34a" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4">Power Consumption</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={12} />
                    <YAxis domain={[300, 700]} fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="power" stroke="#9333ea" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Load Control Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Load Control Panel</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Load 1</p>
                    <p className="text-sm text-muted-foreground">Demo control</p>
                  </div>
                </div>
                <Switch checked={load1Status} onCheckedChange={setLoad1Status} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lightbulb className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Load 2</p>
                    <p className="text-sm text-muted-foreground">Demo control</p>
                  </div>
                </div>
                <Switch checked={load2Status} onCheckedChange={setLoad2Status} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Auto Mode</p>
                    <p className="text-sm text-muted-foreground">Demo setting</p>
                  </div>
                </div>
                <Switch checked={autoMode} onCheckedChange={setAutoMode} />
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Demo Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 md:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-sm text-gray-600">© 2024 Smart Power Grid Dashboard - Demo Mode</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
              <span className="text-sm text-gray-500">v2.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
