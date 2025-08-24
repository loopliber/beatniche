import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { useAutoDataCollector } from "@/hooks/useAutoDataCollector"

function App() {
  // Initialize auto data collection
  useAutoDataCollector();

  return (
    <>
      <Pages />
      <Toaster />
    </>
  )
}

export default App 