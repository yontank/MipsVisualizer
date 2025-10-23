import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { SimulationContextProvider } from "./context/SimulationContext"
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SimulationContextProvider>
      <App />
    </SimulationContextProvider>
  </StrictMode>,
)
