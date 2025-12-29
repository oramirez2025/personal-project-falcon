import HeroImage from "../components/HeroImage";
import { useOutletContext } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import Carousel from 'react-bootstrap/Carousel';
import CarouselImage from '../assets/Caro3Ad.png';

const HomePage = () => {   
    return(
    <>
        <HeroImage/>
        <h2>Welcome, Adventurer!</h2>
        <h5>Here be dragons, spells, and untold tales.</h5>
        <div className="d-flex flex-row gap-3 flex-wrap justify-content-center weathercolor">
            
        </div>
    </>    
    )
}


function CarouselArtwork() {
  return (
    <Carousel>
      <Carousel.Item interval={1000}>
        <CarouselImage text="First slide" />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={500}>
        <CarouselImage text="Second slide" />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <CarouselImage text="Third slide" />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default HomePage;