import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#689f38', // Green Shaded with Yellow
      light: '#8bc34a',
    },
    secondary: {
      main: '#ef6c00', // Reddish-Orange
    },
    background: {
      default: '#ffffff', // White
    },
    text: {
      primary: '#212121', // Dark Gray
    },
    info: {
      main: '#ffa726', // Amber
    },
    success: {
      main: '#4caf50', // Green
    },
    accent_orange: {
      main: '#ff5722',
      light: '#ffb74d',
    },
    accent_green: {
      main: '#76ff03'
    }
  },
});

export default theme;