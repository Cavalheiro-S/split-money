import { AuthProvider } from "./Context/AuthContext"
import { RegisterProvider } from "./Context/RegisterContext"
import { AppRoutes } from "./Routes"

function App() {

  return (
    <AuthProvider>
      <RegisterProvider>
        <AppRoutes />
      </RegisterProvider>
    </AuthProvider>
  )
}

export default App
