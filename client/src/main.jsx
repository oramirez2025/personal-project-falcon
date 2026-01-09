import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import './index.css'
import router from './router.jsx'
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider, createSystem } from "@chakra-ui/react";
import { theme } from './theme.js';

const system = createSystem(theme);

// StrictMode needed to prevent double animation triggers
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <RouterProvider router={router}/>
    </ChakraProvider>
  </StrictMode>
);
