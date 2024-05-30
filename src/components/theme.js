import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#689f38', // Green Shaded with Yellow
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
  },
});

export default theme;