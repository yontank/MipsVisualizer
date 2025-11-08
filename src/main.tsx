import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { SimulationContextProvider } from "./context/SimulationContext"
import { MousePositionProvider } from "./context/MousePositionContext.tsx"
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SimulationContextProvider>
      <MousePositionProvider>
        <App />
      </MousePositionProvider>
    </SimulationContextProvider>
  </StrictMode>,
)
