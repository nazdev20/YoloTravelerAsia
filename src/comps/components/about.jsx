import React from 'react';

import { MdOutlineTravelExplore } from 'react-icons/md';
import BoraBora from '../../assets/borabora.jpg';
import BoraBora2 from '../../assets/borabora.jpg';
import Maldives from '../../assets/maldives.jpg';
import Maldives2 from '../../assets/maldives2.jpg';
import KeyWest from '../../assets/keywest.jpg';
import mayon from '../../assets/mayon.jpg';
import LU from '../../assets/LU.webp';
import Baguio from '../../assets/Baguio.jpg';

const Destinations = () => {
  return (
    <>
      <div className='max-w-[1240px] mx-auto py-16 px-4 text-center' data-aos="fade-up">
        <h1>Best-Inclusive Part of World</h1>
        <h3 className='py-4'>On the Asia's Best Countries</h3>
        <div className='grid grid-cols-1 md:grid-cols-5 py-4 gap-2 md:gap-4'>
          <a href="https://www.britannica.com/place/Mayon-Volcano" target="_blank" rel="noopener noreferrer" className='col-span-2 md:col-span-3 row-span-2'>
            <img className='w-full h-full object-cover' src={mayon} alt="Mayon" data-aos="fade-right" />
          </a>
          <a href="https://en.wikivoyage.org/wiki/Bora_Bora" target="_blank" rel="noopener noreferrer">
            <img className='w-full h-full object-cover' src={BoraBora2} alt="Bora Bora" data-aos="fade-up" />
          </a>
          <a href="https://guidetothephilippines.ph/articles/what-to-experience/baguio-city-tourist-spots" target="_blank" rel="noopener noreferrer">
            <img className='w-full h-full object-cover' src={Baguio} alt="Baguio" data-aos="fade-down" />
          </a>
          <a href="https://www.detourista.com/guide/la-union-best-places/" target="_blank" rel="noopener noreferrer">
            <img className='w-full h-full object-cover' src={LU} alt="LU" data-aos="fade-left" />
          </a>
          <a href="https://en.wikipedia.org/wiki/Boracay" target="_blank" rel="noopener noreferrer">
            <img className='w-full h-full object-cover' src={Maldives} alt="Maldives" data-aos="fade-right" />
          </a>
        </div>
      </div>

      <div className='max-w-[1240px] mx-auto flex items-center justify-center gap-4 px-4 py-16' data-aos="fade-up">
        <div className='lg:col-span-2 flex flex-col justify-evenly'>
          <div data-aos="fade-up">
            <h2>LUXURY INCLUDED VACATIONS FOR PEOPLE</h2>
            <p className='py-4'>
              At Yolo Traveler Asia, we specialize in curating unforgettable experiences across the most breathtaking destinations in Asia.
              Our bespoke travel services are designed to cater to the discerning traveler seeking the pinnacle of luxury, comfort,
              and adventure. From the serene beaches of Bali and the cultural wonders of Japan to the lush landscapes of Thailand and the vibrant cities of Vietnam,
              our curated itineraries promise a journey like no other.
            </p>
          </div>
          <div className='grid sm:grid-cols-2 gap-8 py-4' data-aos="fade-up">
            <div className='flex flex-col lg:flex-row items-center text-center' data-aos="fade-right">
              <button>
                <MdOutlineTravelExplore size={50} />
              </button>
              <div>
                <h3 className='py-2'>LEADING SERVICE</h3>
                <p className='py-1'>ALL-INCLUSIVE COMPANY FOR 20 YEARS IN-A-ROW</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default Destinations;
