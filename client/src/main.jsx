import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './App.css'
// import './index.css'
import router from './router.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider, createSystem } from "@chakra-ui/react";
import { theme } from './theme.js';

const system = createSystem(theme);


createRoot(document.getElementById('root')).render(
  <ChakraProvider value={system}>
    <RouterProvider router={router}/>
  </ChakraProvider>
);
