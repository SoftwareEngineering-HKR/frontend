import { Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing.jsx"
import Authentication from "./pages/Authentication.jsx"
import Overview from "./pages/Overview.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/authentication" element={<Authentication />} />
      <Route path="/overview" element={<Overview />} />
    </Routes>
    
  )
}

export default App