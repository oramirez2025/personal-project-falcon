import FalconBanner from "../assets/Falcon2.mp4";

const HeroImage = () => {
  return (
    <header className="hero-wrapper">
      <div className="hero-inner">
        <video autoPlay muted loop>
          <source src={FalconBanner} alt="Falconforge Fantasy Banner" type="video/mp4" />
        </video> 
      </div>
    </header>
  );
};


export default HeroImage;
