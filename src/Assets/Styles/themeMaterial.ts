import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette:{
        primary: {
            main: "#E63946"
        },
        secondary:{
            main: "#1D3557"
        }
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: "#f3f4f6"
                },
                notchedOutline: {
                    border: "none",
                },
            }
        }
    },
    typography: {
        fontFamily: "Inter, sans-serif",
    },
})