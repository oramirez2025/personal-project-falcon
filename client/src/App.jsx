import { useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet, useLoaderData } from 'react-router-dom'
import NavBar from './components/NavBar'
import { userConfirmation } from './utilities'


function App() {
  const [user, setUser] = useState(null);
  // for each rerender, confirm that the user is logged in 
  useEffect(() => {
    const restoreUser = async () => {
      const confirmedUser = await userConfirmation();
      setUser(confirmedUser);
    };
    restoreUser();
  }, []);
  return (
    <div className="page-bg">
      <NavBar user={user} setUser={setUser}/>

      <main className="content">
         <Outlet context={{ user, setUser }} />
      </main>
    </div>
  )
}



export default App