import { AuthProvider } from "./Context/AuthContext"
import { RegisterProvider } from "./Context/RegisterContext"
import { AppRoutes } from "./Routes"

function App() {

  return (
    <RegisterProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </RegisterProvider>
  )
}

export default App
