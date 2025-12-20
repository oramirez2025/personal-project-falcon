import HeroImage from "../components/HeroImage";
import { useOutletContext } from "react-router-dom";

const HomePage = () => {
    const { user } = useOutletContext();
    console.log(user)   
    return(
    <>
    <HeroImage/>
    <h2>Falconforgefantasy</h2>
    {/* <div>{user.data}</div> */}
    </>    
    )
}

export default HomePage;