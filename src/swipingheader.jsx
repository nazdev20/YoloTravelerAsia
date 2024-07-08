import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';

import slide_image_1 from './assets/pic1.jpg';
import slide_image_2 from './assets/pic2.jpg';
import slide_image_3 from './assets/pic3.jpg';
import slide_image_4 from './assets/pic4.png';
import slide_image_5 from './assets/pic5.jpg';
import slide_image_6 from './assets/pic6.jpg';

const images = [slide_image_1, slide_image_2, slide_image_3, slide_image_4, slide_image_5, slide_image_6];

function Swipe() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const swiperContainer = document.querySelector('.swiper-container');
      if (swiperContainer) {
        swiperContainer.style.height = `${windowHeight * 0.5}px`;
        swiperContainer.style.width = `${windowWidth * 0.8}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center  w-full h-[75%] bg-cover bg-center transition-all duration-500 ease-in-out  mt-16 "
      style={{ backgroundImage: `url(${images[activeSlideIndex]})` }}>

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <div className="text-center my-8 w-full px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white sea-waves-animation font-sans">
            <span className="text-secondary">Seize </span> 
            <span className="text-secondary">The </span> 
            <span className="text-primary">Moment, </span> 
            <span className="text-primary">Explore </span> 
            <span className="text-fourth">Fearlessly</span>
          </h1>
          
          <div className="flex justify-center mt-2 w-full">
            <h3 className="text-lg md:text-xl text-white">
              - YoloTravellerAsia
            </h3>
          </div>
        </div>

        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            clickable: true,
          }}
          autoplay={{
            delay: 2000, 
            disableOnInteraction: false,
          }}
          modules={[EffectCoverflow, Navigation, Autoplay]}
          className="swiper-container w-max-lg h-max mb-5"
          onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center md:w-[30rem] md:h-[20rem] ">
              <img
                src={image}
                alt={`slide_image_${index + 1}`}
                className="w-full h-full object-cover rounded-2xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute bottom-0 w-full h-[100px] bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
      </div>
    </div>
  );
}

export default Swipe;
