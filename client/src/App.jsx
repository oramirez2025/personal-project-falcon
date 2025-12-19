import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet, useLoaderData } from 'react-router-dom'
import Navbar from './components/Navbar'


function App() {
  const [user, setUser] = useState(useLoaderData());
  return (
    <div className="page-bg">
      <Navbar />

      <main className="content">
         <Outlet context={{ user, setUser }} />
      </main>
    </div>
  )
}



export default App