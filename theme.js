// app/theme.js
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',  // Set default mode to 'light' or 'dark'
  useSystemColorMode: false,  // If true, uses the system's theme preference
};

const theme = extendTheme({ config });

export default theme;
