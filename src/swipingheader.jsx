import React, { useState } from 'react';
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

// Next.js static image imports are objects; Vite previously exposed these as strings.
const getImageSrc = (image) => (typeof image === 'string' ? image : image.src);

function Swipe() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  return (
    <section
      className="relative isolate mt-16 flex min-h-[650px] w-full items-center justify-center overflow-hidden bg-cover bg-center md:min-h-[700px]"
      style={{ backgroundImage: `url("${getImageSrc(images[activeSlideIndex])}")` }}
    >
      <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden="true" />

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-12 text-center">
        <div className="my-6 w-full">
          <h1 className="sea-waves-animation font-sans text-3xl font-bold text-white md:text-5xl">
            <span className="text-secondary">Seize </span>
            <span className="text-secondary">The </span>
            <span className="text-primary">Moment, </span>
            <span className="text-primary">Explore </span>
            <span className="text-fourth">Fearlessly</span>
          </h1>
          <div className="mt-2 flex w-full justify-center">
            <h3 className="text-lg text-white md:text-xl">- YoloTravellerAsia</h3>
          </div>
        </div>

        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          loop={images.length >= 4}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[EffectCoverflow, Navigation, Autoplay]}
          className="w-full max-w-6xl pb-8"
          onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="flex h-[190px] items-center justify-center sm:h-[240px] md:h-[320px]">
              <img
                src={getImageSrc(image)}
                alt={`Travel destination slide ${index + 1}`}
                className="h-full w-full rounded-2xl object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-b from-transparent to-black/70" />
    </section>
  );
}

export default Swipe;
