import { HistoryProvider } from "./Context/HistoryContext"
import { AppRoutes } from "./Routes"

function App() {

  return (
    <HistoryProvider>
      <AppRoutes />
    </HistoryProvider>
  )
}

export default App
