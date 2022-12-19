import { AuthProvider } from "./Context/AuthContext"
import { HistoryProvider } from "./Context/HistoryContext"
import { AppRoutes } from "./Routes"

function App() {

  return (
    <AuthProvider>
      <HistoryProvider>
        <AppRoutes />
      </HistoryProvider>
    </AuthProvider>
  )
}

export default App
