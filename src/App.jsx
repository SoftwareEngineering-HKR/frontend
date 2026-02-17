import { Routes, Route } from "react-router-dom"
import Authentication from "./pages/Authentication.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Authentication />} />
    </Routes>
  )
}

export default App
