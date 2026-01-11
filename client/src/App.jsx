import { useState, useEffect } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
// import Sidebar from './components/Sidebar'
import Bookbar from './components/SideBook'
// import { userConfirmation } from './utilities'
import { Box } from '@chakra-ui/react'
import { Toaster, toaster } from "./components/ui/toaster"

function App() {
  const loaderUser = useLoaderData()
  const [user, setUser] = useState(loaderUser)

  useEffect(() => {
    setUser(loaderUser)
  }, [loaderUser])

  return (
    <Box minH="100vh" bg="bg.primary">
      <Toaster toaster={toaster}/>
      {/* <Sidebar user={user} setUser={setUser} /> */}
      <Bookbar user={user} setUser={setUser} />
      
      <Box>
        <Outlet context={{ user, setUser }} />
      </Box>
    </Box>
  )
}

export default App