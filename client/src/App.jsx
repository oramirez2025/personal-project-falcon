import { useState, useEffect } from 'react'
// import './index.css'
// import './App.css'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { userConfirmation } from './utilities'
import { Box } from '@chakra-ui/react'
import { Toaster, toaster } from "./components/ui/toaster"
function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const restoreUser = async () => {
      const confirmedUser = await userConfirmation()
      setUser(confirmedUser)
    }
    restoreUser()
  }, [])

  return (
    <Box minH="100vh" bg="#0c0a09">
      <Toaster toaster={toaster}/>
      <Sidebar user={user} setUser={setUser} />
      
      <Box>
        <Outlet context={{ user, setUser }} />
      </Box>
    </Box>
  )
}

export default App