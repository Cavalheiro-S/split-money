import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AuthProvider } from "./Context/AuthContext"
import { RegisterProvider } from "./Context/RegisterContext"
import { AppRoutes } from "./Routes"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { ThemeProvider } from "@mui/material"
import { theme } from "./Assets/Styles/themeMaterial"

function App() {

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <RegisterProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </RegisterProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
