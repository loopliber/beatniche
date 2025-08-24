import './App.css'
import Pages from "@/pages/index.jsx"
import { useAutoDataCollector } from "@/hooks/useAutoDataCollector"

function App() {
  // Initialize auto data collection
  useAutoDataCollector();

  return (
    <>
      <Pages />
    </>
  )
}

export default App 