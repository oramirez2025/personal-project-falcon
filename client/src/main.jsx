import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './App.css'
import './index.css'
import router from './router.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
