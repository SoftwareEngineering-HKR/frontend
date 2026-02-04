// main app router
import { Routes, Route } from "react-router-dom"
import Authentication from "./pages/Authentication.jsx"

function App() {
  return (
    <Routes>
      {/* default route goes straight to authentication */}
      <Route path="/" element={<Authentication />} />
    </Routes>
  )
}

export default App
