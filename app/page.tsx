"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  RefreshCw,
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
  LogOut,
  X,
  Info,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { useSensorData, useLoadControl, useAlerts } from "@/hooks/useFirebaseData"
import LoginForm from "@/components/LoginForm"

function Dashboard() {
  const { user, logout, isDemo } = useAuth()
  const { currentData, historicalData, loading } = useSensorData()
  const { loadState, updateLoadState } = useLoadControl()
  const { alerts, addAlert, acknowledgeAlert } = useAlerts()

  // Format data for charts
  const chartData = historicalData.map((data) => ({
    time: new Date(data.timestamp).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
    voltage: data.voltage,
    current: data.current,
    power: data.power,
  }))

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

  const handleExportData = () => {
    // Simple CSV export
    const csvContent = [
      "Timestamp,Voltage (V),Current (A),Power (W)",
      ...historicalData.map((row) =>
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
    link.setAttribute("download", `sensor-data-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Mode Alert */}
      {isDemo && (
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
      )}

      {/* Header / Navbar */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Smart Power Grid</h1>
              {isDemo && <Badge variant="secondary">Demo</Badge>}
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
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
              <p className="text-xs text-muted-foreground">{isDemo ? "Simulated data" : "Real-time measurement"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.current.toFixed(1)} A</div>
              <p className="text-xs text-muted-foreground">{isDemo ? "Simulated data" : "Live current flow"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Power</CardTitle>
              <Power className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(currentData.power)} W</div>
              <p className="text-xs text-muted-foreground">{isDemo ? "Calculated value" : "Total consumption"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              {currentData.voltage >= 180 && currentData.current <= 10 ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <Badge className={`${getStatusColor(currentData.voltage, currentData.current)} text-white`}>
                {currentData.voltage >= 180 && currentData.current <= 10 ? "✅ Normal" : "🔴 Alert"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">{isDemo ? "Demo mode" : "System health"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Card className="mb-6 md:mb-8">
          <CardHeader>
            <CardTitle>Real-time Monitoring {isDemo && "(Demo)"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Voltage vs Time</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={12} />
                    <YAxis domain={[150, 280]} fontSize={12} />
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
                    <YAxis domain={[0, 12]} fontSize={12} />
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
                    <YAxis domain={[0, 1200]} fontSize={12} />
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
                    <p className="text-sm text-muted-foreground">{isDemo ? "Demo control" : "Primary load control"}</p>
                  </div>
                </div>
                <Switch checked={loadState.load1} onCheckedChange={(checked) => updateLoadState({ load1: checked })} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lightbulb className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Load 2</p>
                    <p className="text-sm text-muted-foreground">
                      {isDemo ? "Demo control" : "Secondary load control"}
                    </p>
                  </div>
                </div>
                <Switch checked={loadState.load2} onCheckedChange={(checked) => updateLoadState({ load2: checked })} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Auto Mode</p>
                    <p className="text-sm text-muted-foreground">{isDemo ? "Demo setting" : "Auto-shut on overload"}</p>
                  </div>
                </div>
                <Switch
                  checked={loadState.autoMode}
                  onCheckedChange={(checked) => updateLoadState({ autoMode: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Logs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>{isDemo ? "Demo Alerts" : "Alerts & Logs"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {alerts.slice(0, 10).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)} relative`}>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium pr-8">{alert.message}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                        {!alert.acknowledged && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
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
              <p className="text-sm text-gray-600">
                © 2024 Smart Power Grid Dashboard - {isDemo ? "Demo Mode" : "Built with React & Firebase"}
              </p>
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

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return user ? <Dashboard /> : <LoginForm />
}

export default function Page() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
