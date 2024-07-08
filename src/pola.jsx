import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of image URLs
  const images = [
    'https://via.placeholder.com/300x400?text=Image+1',
    'https://via.placeholder.com/300x400?text=Image+2',
    'https://via.placeholder.com/300x400?text=Image+3',
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setCurrentIndex(next),
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
        <button className="bg-gray-800 text-white p-2 rounded-md" onClick={() => setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)}>
          Prev
        </button>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        <button className="bg-gray-800 text-white p-2 rounded-md" onClick={() => setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
