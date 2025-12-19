import FalconBanner from "../assets/FalconBanner.jpeg";

const HeroImage = () => {
  return (
    <header className="hero-wrapper">
      <div className="hero-inner">
        <img src={FalconBanner} alt="Falconforge Fantasy Banner" />
      </div>
    </header>
  );
};

export default HeroImage;
